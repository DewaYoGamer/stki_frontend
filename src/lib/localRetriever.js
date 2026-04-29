import { SAMPLE_CHUNKS } from '../data/sampleChunks'

const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'pada', 'untuk', 'dengan', 'atau',
  'adalah', 'dalam', 'sebagaimana', 'dimaksud', 'ayat', 'huruf', 'pasal',
  'bab', 'ini', 'itu', 'atas', 'oleh', 'karena', 'agar', 'sebagai',
  'terhadap', 'serta', 'suatu', 'bagi', 'dapat', 'tidak', 'lebih'
])

const OCR_NOISE_TOKENS = new Set(['x', 't', 's', 'a', 'e', 'b'])
const BM25_K1 = 1.5
const BM25_B = 0.75

export const QUICK_QUERIES = [
  'bagaimana cara setup backend api',
  'apa beda bm25 dan semantic retrieval',
  'kapan pakai hybrid retrieval',
  'cara upload pdf dokumentasi',
  'bagaimana konfigurasi openai key'
]

const CONCEPTS = {
  retrieval: ['retrieval', 'bm25', 'semantic', 'hybrid', 'ranking', 'score'],
  backend: ['backend', 'endpoint', 'api', 'url', 'integrasi', 'service'],
  upload: ['upload', 'pdf', 'dokumen', 'multipart', 'berkas', 'file'],
  llm: ['llm', 'ollama', 'openai', 'provider', 'jawaban', 'prompt'],
  keamanan: ['api key', 'token', 'aman', 'browser', 'server', 'valid'],
  mode: ['demo', 'lokal', 'mode', 'konfigurasi', 'pengujian', 'simulasi']
}

function cleanTextForSearch(text) {
  if (typeof text !== 'string') {
    return ''
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  const cleaned = cleanTextForSearch(text)
  if (!cleaned) {
    return []
  }

  return cleaned
    .split(' ')
    .filter((token) => token && !STOPWORDS.has(token) && !OCR_NOISE_TOKENS.has(token))
}

function buildCorpus(chunks) {
  return chunks.map((chunk) => {
    const combined = [chunk.bab, chunk.pasal, chunk.ayat, chunk.text].join(' ')
    return {
      ...chunk,
      combined,
      tokens: tokenize(combined)
    }
  })
}

const CORPUS = buildCorpus(SAMPLE_CHUNKS)

const AVERAGE_DOC_LENGTH =
  CORPUS.reduce((sum, row) => sum + row.tokens.length, 0) / Math.max(1, CORPUS.length)

const DOCUMENT_FREQUENCY = (() => {
  const freq = new Map()

  for (const row of CORPUS) {
    const seen = new Set(row.tokens)
    for (const token of seen) {
      freq.set(token, (freq.get(token) ?? 0) + 1)
    }
  }

  return freq
})()

function bm25Score(queryTokens, docTokens) {
  if (!queryTokens.length || !docTokens.length) {
    return 0
  }

  const tf = new Map()
  for (const token of docTokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1)
  }

  let score = 0
  for (const token of queryTokens) {
    const termFrequency = tf.get(token) ?? 0
    if (termFrequency === 0) {
      continue
    }

    const documentFrequency = DOCUMENT_FREQUENCY.get(token) ?? 0
    const idf = Math.log(1 + (CORPUS.length - documentFrequency + 0.5) / (documentFrequency + 0.5))

    const numerator = termFrequency * (BM25_K1 + 1)
    const denominator = termFrequency + BM25_K1 * (1 - BM25_B + BM25_B * (docTokens.length / AVERAGE_DOC_LENGTH))

    score += idf * (numerator / denominator)
  }

  return score
}

function jaccardSimilarity(a, b) {
  if (!a.length || !b.length) {
    return 0
  }

  const aSet = new Set(a)
  const bSet = new Set(b)

  let intersection = 0
  for (const token of aSet) {
    if (bSet.has(token)) {
      intersection += 1
    }
  }

  const union = aSet.size + bSet.size - intersection
  return union === 0 ? 0 : intersection / union
}

function conceptVector(text) {
  const cleaned = cleanTextForSearch(text)

  return Object.values(CONCEPTS).map((keywords) => {
    let count = 0
    for (const keyword of keywords) {
      if (cleaned.includes(keyword)) {
        count += 1
      }
    }
    return count
  })
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length || a.length === 0) {
    return 0
  }

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function semanticScore(query, row) {
  const queryTokens = tokenize(query)
  const docTokens = row.tokens

  const lexicalSignal = jaccardSimilarity(queryTokens, docTokens)
  const conceptSignal = cosineSimilarity(conceptVector(query), conceptVector(row.combined))

  const cleanedQuery = cleanTextForSearch(query)
  const phraseBonus = cleanedQuery && cleanTextForSearch(row.combined).includes(cleanedQuery) ? 0.18 : 0

  return Math.min(1, lexicalSignal * 0.45 + conceptSignal * 0.55 + phraseBonus)
}

function normalizeScores(scores) {
  if (!scores.length) {
    return scores
  }

  const min = Math.min(...scores)
  const max = Math.max(...scores)

  if (min === max) {
    return scores.map(() => 1)
  }

  return scores.map((value) => (value - min) / (max - min))
}

function applyRuleBoost(query, rows) {
  const lowered = query.toLowerCase()
  const bagianMatch = lowered.match(/bagian\s+(\d+)/i)
  const docMatch = lowered.match(/dokumen\s+([a-z]+)/i)

  for (const row of rows) {
    if (bagianMatch && row.pasal.toLowerCase() === `bagian ${bagianMatch[1]}`) {
      row.bm25 += 3
    }

    if (docMatch && row.bab.toLowerCase().includes(docMatch[1])) {
      row.bm25 += 1.8
    }

    if (cleanTextForSearch(row.text).includes(cleanTextForSearch(query))) {
      row.bm25 += 1.2
    }
  }

  return rows
}

export function runLocalSearch({ query, mode = 'hybrid', topK = 5 }) {
  const queryTokens = tokenize(query)

  const scored = CORPUS.map((row) => ({
    ...row,
    bm25: bm25Score(queryTokens, row.tokens),
    semantic: semanticScore(query, row)
  }))

  applyRuleBoost(query, scored)

  const bm25Norm = normalizeScores(scored.map((item) => item.bm25))
  const semNorm = normalizeScores(scored.map((item) => item.semantic))

  const withFinal = scored.map((item, index) => ({
    ...item,
    bm25Norm: bm25Norm[index],
    semanticNorm: semNorm[index],
    finalScore: bm25Norm[index] * 0.6 + semNorm[index] * 0.4
  }))

  let sorted = withFinal
  if (mode === 'bm25') {
    sorted = [...withFinal].sort((a, b) => b.bm25 - a.bm25)
  } else if (mode === 'semantic') {
    sorted = [...withFinal].sort((a, b) => b.semantic - a.semantic)
  } else {
    sorted = [...withFinal].sort((a, b) => b.finalScore - a.finalScore)
  }

  return sorted.slice(0, topK).map((item) => ({
    chunk_id: item.chunk_id,
    bab: item.bab,
    pasal: item.pasal,
    ayat: item.ayat,
    text: item.text,
    score: mode === 'bm25' ? item.bm25 : item.semantic,
    bm25_score_norm: item.bm25Norm,
    semantic_score_norm: item.semanticNorm,
    final_score: item.finalScore
  }))
}

function inferTopic(query, references) {
  const lowered = query.toLowerCase()

  if (lowered.includes('bm25') || lowered.includes('semantic') || lowered.includes('hybrid')) {
    return 'Strategi Retrieval'
  }

  if (lowered.includes('backend') || lowered.includes('endpoint') || lowered.includes('api')) {
    return 'Integrasi Backend'
  }

  if (lowered.includes('upload') || lowered.includes('pdf') || lowered.includes('dokumen')) {
    return 'Alur Upload Dokumen'
  }

  if (lowered.includes('openai') || lowered.includes('ollama') || lowered.includes('llm')) {
    return 'Konfigurasi Provider LLM'
  }

  if (references.length > 0) {
    return `Ringkasan ${references[0].pasal}`
  }

  return 'Belum Teridentifikasi'
}

export function runLocalRagAnswer({ query, provider = 'ollama', topK = 3 }) {
  const references = runLocalSearch({ query, mode: 'hybrid', topK })

  if (references.length === 0) {
    return {
      answer: [
        'Topik:',
        '- Belum teridentifikasi',
        '',
        'Kesimpulan:',
        '- Belum dapat disimpulkan',
        '',
        'Referensi utama:',
        '- Belum dapat disimpulkan dari referensi demo yang tersedia.',
        '',
        'Penjelasan:',
        '- Demo lokal tidak menemukan chunk relevan untuk query ini.'
      ].join('\n'),
      references
    }
  }

  const topic = inferTopic(query, references)
  const primary = references[0]
  const isFeatureQuestion = /retrieval|bm25|semantic|hybrid|backend|upload|openai|ollama|llm|api/i.test(query)
  const conclusion = isFeatureQuestion ? 'Bisa dijelaskan dari referensi' : 'Belum dapat disimpulkan'

  const answer = [
    'Topik:',
    `- ${topic}`,
    '',
    'Kesimpulan:',
    `- ${conclusion}`,
    '',
    'Referensi utama:',
    `- ${primary.pasal} ${primary.ayat}`,
    '',
    'Penjelasan:',
    `- Berdasarkan referensi utama, ${primary.text}`,
    '- Gunakan referensi lain pada hasil retrieval jika memerlukan keputusan implementasi yang lebih detail.',
    '',
    'Catatan model:',
    `- Jawaban ini disimulasikan di frontend (${provider.toUpperCase()}) agar aplikasi tetap dapat diuji tanpa backend.`
  ].join('\n')

  return {
    answer,
    references
  }
}
