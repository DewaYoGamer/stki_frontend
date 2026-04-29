import { useMemo, useState } from 'react'
import { QUICK_QUERIES, runLocalRagAnswer, runLocalSearch } from './lib/localRetriever'
import {
  runBackendRagAnswer,
  runBackendSearch,
  uploadPdfToBackend,
} from './lib/ragApi'
import './App.css'

const SEARCH_OPTIONS = [
  { value: 'bm25', label: 'BM25 Retrieval' },
  { value: 'semantic', label: 'Semantic Retrieval' },
  { value: 'hybrid', label: 'Hybrid Retrieval' },
  { value: 'llm-ollama', label: 'Tanya LLM (Ollama)' },
  { value: 'llm-openai', label: 'Tanya LLM (OpenAI)' },
]

function scoreToPercent(item) {
  const raw = Number(item?.final_score ?? item?.score ?? 0)
  if (!Number.isFinite(raw) || raw <= 0) {
    return 0
  }

  if (raw <= 1) {
    return Math.min(100, Math.round(raw * 100))
  }

  return Math.round((1 - 1 / (1 + raw)) * 100)
}

function formatModeLabel(mode) {
  const found = SEARCH_OPTIONS.find((item) => item.value === mode)
  return found ? found.label : mode
}

function App() {
  const [sourceMode, setSourceMode] = useState('demo')
  const [backendUrl, setBackendUrl] = useState('http://127.0.0.1:8000')
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [uploadMessage, setUploadMessage] = useState('')

  const [searchMode, setSearchMode] = useState('hybrid')
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState(5)
  const [openAiKey, setOpenAiKey] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [engineNote, setEngineNote] = useState('Belum ada proses pencarian.')

  const [results, setResults] = useState([])
  const [answerText, setAnswerText] = useState('')
  const [references, setReferences] = useState([])

  const llmMode = searchMode === 'llm-ollama' || searchMode === 'llm-openai'
  const provider = searchMode === 'llm-openai' ? 'openai' : 'ollama'

  const visibleRows = useMemo(() => {
    if (llmMode) {
      return references
    }
    return results
  }, [llmMode, references, results])

  const topRow = visibleRows.length > 0 ? visibleRows[0] : null

  async function handleUploadDocument() {
    if (sourceMode === 'demo') {
      setUploadMessage('Mode demo tidak membutuhkan upload dokumen.')
      return
    }

    if (!selectedPdf) {
      setUploadMessage('Pilih file PDF terlebih dulu.')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const response = await uploadPdfToBackend({
        baseUrl: backendUrl,
        file: selectedPdf,
      })

      setUploadMessage(response.message)
    } catch (error) {
      setUploadMessage('')
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()

    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setErrorMessage('Query wajib diisi.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setResults([])
    setReferences([])
    setAnswerText('')

    try {
      if (sourceMode === 'demo') {
        if (llmMode) {
          const rag = runLocalRagAnswer({
            query: trimmedQuery,
            provider,
            topK: Math.max(1, topK),
          })

          setAnswerText(rag.answer)
          setReferences(rag.references)
          setEngineNote(`Menjalankan simulasi ${provider.toUpperCase()} + retrieval hybrid di frontend.`)
        } else {
          const localResults = runLocalSearch({
            query: trimmedQuery,
            mode: searchMode,
            topK: Math.max(1, topK),
          })

          setResults(localResults)
          setEngineNote(`Menjalankan ${formatModeLabel(searchMode)} di demo lokal.`)
        }
      } else if (llmMode) {
        if (provider === 'openai' && !openAiKey.trim()) {
          throw new Error('API key OpenAI wajib diisi untuk mode backend OpenAI.')
        }

        const ragPayload = await runBackendRagAnswer({
          baseUrl: backendUrl,
          query: trimmedQuery,
          provider,
          topK: Math.max(1, topK),
          apiKey: openAiKey.trim(),
        })

        setAnswerText(ragPayload.answer)
        setReferences(ragPayload.references)
        setEngineNote(`Menjalankan RAG ${provider.toUpperCase()} melalui backend.`)
      } else {
        const backendResults = await runBackendSearch({
          baseUrl: backendUrl,
          query: trimmedQuery,
          mode: searchMode,
          topK: Math.max(1, topK),
        })

        setResults(backendResults)
        setEngineNote(`Mengambil hasil ${formatModeLabel(searchMode)} dari backend API.`)
      }
    } catch (error) {
      setErrorMessage(error.message)
      setEngineNote('Pencarian gagal dijalankan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="panel hero-panel stagger-1">
        <p className="kicker">RETRIEVAL APP</p>
        <h1>Dashboard Retrieval dan RAG App</h1>
        <p>
          Gunakan dashboard ini untuk menguji BM25, semantic retrieval, hybrid retrieval,
          dan mode tanya LLM berdasarkan konteks dokumentasi aplikasi.
        </p>
      </header>

      <main className="workspace-grid">
        <section className="panel controls-panel stagger-2">
          <h2>Kontrol Pencarian</h2>

          <div className="field-block">
            <label className="field-label">Sumber data</label>
            <div className="segment-control">
              <button
                type="button"
                className={sourceMode === 'demo' ? 'active' : ''}
                onClick={() => setSourceMode('demo')}
              >
                Demo Lokal
              </button>
              <button
                type="button"
                className={sourceMode === 'backend' ? 'active' : ''}
                onClick={() => setSourceMode('backend')}
              >
                Backend API
              </button>
            </div>
          </div>

          <div className="field-block">
            <label className="field-label" htmlFor="backend-url">
              URL Backend
            </label>
            <input
              id="backend-url"
              value={backendUrl}
              onChange={(event) => setBackendUrl(event.target.value)}
              placeholder="http://127.0.0.1:8000"
              disabled={sourceMode === 'demo'}
            />
          </div>

          <div className="field-block">
            <label className="field-label" htmlFor="pdf-file">
              Upload PDF Dokumentasi
            </label>
            <input
              id="pdf-file"
              type="file"
              accept="application/pdf"
              disabled={sourceMode === 'demo'}
              onChange={(event) => setSelectedPdf(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className="secondary-btn"
              disabled={sourceMode === 'demo' || loading}
              onClick={handleUploadDocument}
            >
              Upload Dokumen
            </button>
            {selectedPdf && <p className="tiny-note">File dipilih: {selectedPdf.name}</p>}
            {uploadMessage && <p className="success-note">{uploadMessage}</p>}
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <div className="field-block">
              <label className="field-label" htmlFor="search-mode">
                Mode pencarian
              </label>
              <select
                id="search-mode"
                value={searchMode}
                onChange={(event) => setSearchMode(event.target.value)}
              >
                {SEARCH_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {searchMode === 'llm-openai' && (
              <div className="field-block">
                <label className="field-label" htmlFor="openai-key">
                  OpenAI API Key
                </label>
                <input
                  id="openai-key"
                  type="password"
                  value={openAiKey}
                  onChange={(event) => setOpenAiKey(event.target.value)}
                  placeholder="sk-..."
                />
              </div>
            )}

            <div className="field-block">
              <label className="field-label" htmlFor="top-k">
                Top-K Hasil
              </label>
              <input
                id="top-k"
                type="number"
                min="1"
                max="10"
                value={topK}
                onChange={(event) => setTopK(Number(event.target.value) || 1)}
              />
            </div>

            <div className="field-block">
              <label className="field-label" htmlFor="query-input">
                Query
              </label>
              <textarea
                id="query-input"
                rows="4"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Contoh: bagaimana cara setup mode backend?"
              />
            </div>

            <div className="query-chips">
              {QUICK_QUERIES.map((item) => (
                <button type="button" key={item} onClick={() => setQuery(item)}>
                  {item}
                </button>
              ))}
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading
                ? 'Memproses...'
                : llmMode
                  ? 'Jalankan Retrieval + Jawab LLM'
                  : 'Jalankan Retrieval'}
            </button>
          </form>
        </section>

        <section className="panel result-panel stagger-3">
          <h2>Output</h2>
          <p className="engine-note">{engineNote}</p>

          {errorMessage && <div className="error-box">{errorMessage}</div>}

          {llmMode && (
            <article className="answer-card">
              <h3>Jawaban LLM</h3>
              <p className="answer-text">{answerText || 'Belum ada jawaban.'}</p>
            </article>
          )}

          <article className="summary-card">
            <p>
              Total referensi tampil: <strong>{visibleRows.length}</strong>
            </p>
            <p>
              Top result:{' '}
              <strong>
                {topRow ? `${topRow.pasal} ${topRow.ayat}` : 'Belum tersedia'}
              </strong>
            </p>
          </article>

          <div className="result-list">
            {visibleRows.length === 0 && (
              <div className="empty-state">
                Jalankan query untuk melihat daftar chunk yang relevan.
              </div>
            )}

            {visibleRows.map((row) => (
              <article key={row.chunk_id} className="result-item">
                <header>
                  <h3>
                    {row.pasal} <span>{row.ayat}</span>
                  </h3>
                  <p>{scoreToPercent(row)}%</p>
                </header>
                <p className="location">{row.bab}</p>
                <p className="snippet">{row.text}</p>
                <div className="score-meter" aria-hidden="true">
                  <span style={{ width: `${scoreToPercent(row)}%` }} />
                </div>

                {(row.bm25_score_norm > 0 || row.semantic_score_norm > 0) && (
                  <p className="small-metric">
                    BM25 {row.bm25_score_norm.toFixed(2)} | Semantic{' '}
                    {row.semantic_score_norm.toFixed(2)}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
