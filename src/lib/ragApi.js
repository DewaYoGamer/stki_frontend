const SEARCH_ENDPOINTS = ['/api/search', '/search', '/api/retrieve']
const LLM_ENDPOINTS = ['/api/ask', '/ask', '/api/rag']
const UPLOAD_ENDPOINTS = ['/api/upload', '/upload', '/api/documents']

function normalizeBaseUrl(baseUrl) {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

async function safeJson(response) {
  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

async function requestWithFallback(baseUrl, endpoints, config) {
  const errors = []

  for (const endpoint of endpoints) {
    const url = `${normalizeBaseUrl(baseUrl)}${endpoint}`

    try {
      const response = await fetch(url, config)
      const data = await safeJson(response)

      if (!response.ok) {
        const detail = data?.message || data?.error || response.statusText
        throw new Error(`${response.status} ${detail}`)
      }

      return data
    } catch (error) {
      errors.push(`${endpoint}: ${error.message}`)
    }
  }

  throw new Error(`Tidak bisa terhubung ke backend. Detail: ${errors.join(' | ')}`)
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value
  }

  return []
}

function normalizeResultRows(payload) {
  const rows =
    asArray(payload).length > 0
      ? asArray(payload)
      : asArray(payload?.results).length > 0
        ? asArray(payload?.results)
        : asArray(payload?.data).length > 0
          ? asArray(payload?.data)
          : asArray(payload?.items).length > 0
            ? asArray(payload?.items)
            : asArray(payload?.context)

  return rows.map((row, index) => ({
    chunk_id: row.chunk_id || row.chunkId || `chunk_${index + 1}`,
    bab: row.bab || row.chapter || '-',
    pasal: row.pasal || row.article || '-',
    ayat: row.ayat || row.verse || '-',
    text: row.text || row.content || '-',
    score: Number(row.score ?? row.similarity ?? 0),
    bm25_score_norm: Number(row.bm25_score_norm ?? row.bm25ScoreNorm ?? 0),
    semantic_score_norm: Number(row.semantic_score_norm ?? row.semanticScoreNorm ?? 0),
    final_score: Number(row.final_score ?? row.finalScore ?? row.score ?? 0)
  }))
}

export async function uploadPdfToBackend({ baseUrl, file }) {
  const formData = new FormData()
  formData.append('file', file)

  const payload = await requestWithFallback(baseUrl, UPLOAD_ENDPOINTS, {
    method: 'POST',
    body: formData
  })

  return {
    message: payload?.message || payload?.status || 'Dokumen berhasil diupload ke backend.',
    detail: payload
  }
}

export async function runBackendSearch({ baseUrl, query, mode, topK }) {
  const payload = await requestWithFallback(baseUrl, SEARCH_ENDPOINTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      mode,
      top_k: topK
    })
  })

  return normalizeResultRows(payload)
}

export async function runBackendRagAnswer({ baseUrl, query, provider, topK, apiKey }) {
  const payload = await requestWithFallback(baseUrl, LLM_ENDPOINTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      provider,
      top_k: topK,
      api_key: apiKey || ''
    })
  })

  const references = normalizeResultRows(payload?.references || payload?.context || payload?.results || payload)

  return {
    answer: payload?.answer || payload?.response || payload?.output || 'Backend tidak mengirim teks jawaban.',
    references
  }
}
