import { useState, useEffect } from 'react'
import { runBackendRagAnswer, runBackendSearch, uploadPdfToBackend, checkBackendHealth, fetchSuggestions } from './lib/ragApi'
import { ChatArea } from './components/ChatArea'
import { SettingsSidebar } from './components/SettingsSidebar'
import { SplashScreen } from './components/SplashScreen'
import './App.css'

function App() {
  /* Theme — light by default, persisted to localStorage */
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('taxguide-theme')
    const dark = saved === 'dark'
    if (dark) document.documentElement.classList.add('dark')
    return dark
  })

  function toggleTheme() {
    const html = document.documentElement
    const next = !isDark
    localStorage.setItem('taxguide-theme', next ? 'dark' : 'light')

    if (!document.startViewTransition) {
      html.classList.add('theme-transitioning')
      html.classList.toggle('dark', next)
      setIsDark(next)
      setTimeout(() => html.classList.remove('theme-transitioning'), 500)
      return
    }

    document.startViewTransition(() => {
      html.classList.toggle('dark', next)
      setIsDark(next)
    })
  }

  /* Settings */
  const backendUrl = import.meta.env.VITE_API_BASE_URL || ''
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [searchMode, setSearchMode] = useState('hybrid')
  const [topK, setTopK] = useState(5)
  const [openAiKey, setOpenAiKey] = useState('')

  /* Document status from backend */
  const [docStatus, setDocStatus] = useState({
    loaded: false,
    chunksCount: 0,
    checking: true,
  })

  /* Dynamic suggestions from uploaded document */
  const [suggestedQuestions, setSuggestedQuestions] = useState([])
  const [documentName, setDocumentName] = useState('')

  /* Chat */
  const [chatHistory, setChatHistory] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [splash, setSplash] = useState(true)

  const llmMode = searchMode === 'llm-ollama' || searchMode === 'llm-openai'
  const provider = searchMode === 'llm-openai' ? 'openai' : 'ollama'

  /* Check backend health on mount to detect if documents are already loaded */
  useEffect(() => {
    async function checkStatus() {
      const health = await checkBackendHealth(backendUrl)
      if (health) {
        setDocStatus({
          loaded: health.index_loaded,
          chunksCount: health.chunks_count,
          checking: false,
        })
        if (health.document_name) {
          setDocumentName(health.document_name)
        }

        // If documents are already loaded, fetch suggestions
        if (health.index_loaded) {
          const suggestionsData = await fetchSuggestions(backendUrl)
          if (suggestionsData && suggestionsData.suggested_questions.length > 0) {
            setSuggestedQuestions(suggestionsData.suggested_questions)
            if (suggestionsData.document_name) {
              setDocumentName(suggestionsData.document_name)
            }
          }
        }
      } else {
        setDocStatus((prev) => ({ ...prev, checking: false }))
      }
    }
    checkStatus()
  }, [backendUrl])

  async function handleFileSelect(file) {
    if (!file) return
    setSelectedPdf(file)
    setUploading(true)
    setUploadMessage('')
    try {
      const res = await uploadPdfToBackend({ baseUrl: backendUrl, file })
      setUploadMessage(res.message)

      // Save dynamic suggestions from upload response
      if (res.suggested_questions && res.suggested_questions.length > 0) {
        setSuggestedQuestions(res.suggested_questions)
      }
      if (res.document_name) {
        setDocumentName(res.document_name)
      }

      // Refresh document status after upload
      const health = await checkBackendHealth(backendUrl)
      if (health) {
        setDocStatus({
          loaded: health.index_loaded,
          chunksCount: health.chunks_count,
          checking: false,
        })
      }

      // Clear chat history when new document is uploaded
      setChatHistory([])
    } catch (err) {
      setUploadMessage('Upload gagal: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery || loading) return

    const messageId = Date.now()
    const currentMode = searchMode
    const isLlm = llmMode
    const prov = provider

    setChatHistory((prev) => [
      ...prev,
      { id: messageId, query: trimmedQuery, mode: currentMode, llmMode: isLlm, provider: prov, status: 'loading' },
    ])
    setQuery('')
    setLoading(true)

    try {
      if (isLlm) {
        const payload = await runBackendRagAnswer({
          baseUrl: backendUrl,
          query: trimmedQuery,
          provider: prov,
          topK: Math.max(1, topK),
          apiKey: openAiKey.trim(),
        })
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, status: 'done', answer: payload.answer, references: payload.references }
              : m,
          ),
        )
      } else {
        const results = await runBackendSearch({
          baseUrl: backendUrl,
          query: trimmedQuery,
          mode: currentMode,
          topK: Math.max(1, topK),
        })
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, status: 'done', results } : m,
          ),
        )
      }
    } catch (err) {
      setChatHistory((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: 'error', error: err.message } : m,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-dvh overflow-hidden">
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <SettingsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedPdf={selectedPdf}
        uploading={uploading}
        uploadMessage={uploadMessage}
        onFileSelect={handleFileSelect}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        openAiKey={openAiKey}
        setOpenAiKey={setOpenAiKey}
        topK={topK}
        setTopK={setTopK}
        loading={loading}
        docStatus={docStatus}
      />
      <ChatArea
        chatHistory={chatHistory}
        query={query}
        setQuery={setQuery}
        loading={loading}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        llmMode={llmMode}
        onSubmit={handleSearch}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        splashDone={!splash}
        suggestedQuestions={suggestedQuestions}
        documentName={documentName}
        docStatus={docStatus}
      />
    </div>
  )
}

export default App

