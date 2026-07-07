import { useState } from 'react'
import { SEARCH_OPTIONS } from '../lib/utils'

const inp = [
  'w-full rounded-xl border text-sm py-2.5 px-3.5 outline-none transition-all',
  'border-black/[0.10] bg-black/[0.04] text-black/80 placeholder-black/30',
  'focus:border-[#0e7a64]/50 focus:bg-black/[0.06] focus:shadow-[0_0_0_3px_rgba(14,122,100,0.08)]',
  'dark:border-white/10 dark:bg-white/[0.06] dark:text-white/85 dark:placeholder-white/25',
  'dark:focus:border-[#0e7a64]/50 dark:focus:bg-white/[0.09] dark:focus:shadow-[0_0_0_3px_rgba(14,122,100,0.08)]',
].join(' ')

function Tag({ children }) {
  return (
    <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-black/28 dark:text-white/25 mb-3 mt-0">
      {children}
    </p>
  )
}

function Lbl({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-[0.76rem] font-semibold text-black/50 dark:text-white/50 mb-1.5">
      {children}
    </label>
  )
}

function Sep() {
  return <div className="border-t border-black/[0.07] dark:border-white/[0.07] my-5" />
}

/* ── Document status banner ── */
function DocumentStatus({ docStatus, selectedPdf, uploadMessage, documentName }) {
  const isSuccess = uploadMessage && !uploadMessage.startsWith('Upload gagal')

  // Backend already has documents loaded (from previous session or startup)
  if (docStatus.loaded && docStatus.chunksCount > 0) {
    return (
      <div className="rounded-xl border border-[#0e7a64]/20 dark:border-[#0e7a64]/25 bg-[#0e7a64]/[0.06] dark:bg-[#0e7a64]/[0.08] p-3 mb-1">
        <div className="flex items-center gap-2 mb-1.5">
          <svg className="w-4 h-4 text-[#0e7a64] dark:text-[#4ecba5] shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <span className="text-[0.72rem] font-bold text-[#0e7a64] dark:text-[#4ecba5]">Dokumen Aktif</span>
        </div>
        <div className="max-h-24 overflow-y-auto pl-6 pr-1 custom-scrollbar">
          <p className="text-[0.7rem] font-semibold text-black/60 dark:text-white/55 m-0 leading-relaxed break-all">
            {documentName || (selectedPdf ? selectedPdf.name : 'Dokumen')}
          </p>
        </div>
        <p className="text-[0.6rem] text-black/30 dark:text-white/22 m-0 mt-1.5 pl-6">
          {docStatus.chunksCount} chunks terindex
        </p>
      </div>
    )
  }

  // Checking status
  if (docStatus.checking) {
    return (
      <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02] p-3 mb-1">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-black/10 dark:border-white/10 border-t-black/40 dark:border-t-white/40 animate-spin shrink-0" />
          <span className="text-[0.68rem] font-semibold text-black/35 dark:text-white/30">
            Mengecek status dokumen...
          </span>
        </div>
      </div>
    )
  }

  // No documents loaded
  return (
    <div className="rounded-xl border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20 p-3 mb-1">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span className="text-[0.72rem] font-bold text-red-600 dark:text-red-400">Belum Ada Dokumen</span>
      </div>
      <p className="text-[0.62rem] text-red-500/70 dark:text-red-400/60 m-0 pl-6 leading-relaxed">
        Upload file PDF terlebih dahulu agar sistem dapat melakukan pencarian dan menjawab pertanyaan Anda.
      </p>
    </div>
  )
}

/* ── Informational card for API key section ── */
function ApiKeyInfoCard() {
  return (
    <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02] p-3 mb-3">
      <div className="flex items-start gap-2 mb-2">
        <svg className="w-3.5 h-3.5 text-[#0e7a64] dark:text-[#4ecba5] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        <p className="text-[0.7rem] font-bold text-black/60 dark:text-white/55 m-0">
          Cara Menggunakan API Key
        </p>
      </div>
      <ul className="text-[0.65rem] text-black/45 dark:text-white/35 m-0 pl-5 space-y-1.5 leading-relaxed">
        <li>
          <span className="font-semibold text-black/55 dark:text-white/45">Sudah ada di server?</span>
          {' '}Kosongkan field ini. Backend sudah dikonfigurasi oleh admin.
        </li>
        <li>
          <span className="font-semibold text-black/55 dark:text-white/45">Punya key sendiri?</span>
          {' '}Isi di bawah untuk mengganti key default server.
        </li>
        <li>
          <span className="font-semibold text-black/55 dark:text-white/45">Belum punya?</span>
          {' '}Daftar di{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0e7a64] dark:text-[#4ecba5] underline underline-offset-2 hover:text-[#0c6b58] dark:hover:text-[#7be0c0] transition-colors"
          >
            platform.openai.com
          </a>
        </li>
      </ul>
    </div>
  )
}

/* ── API Key status indicator ── */
function ApiKeyStatus({ apiKey }) {
  if (apiKey.trim()) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <span className="text-[0.62rem] font-semibold text-emerald-600 dark:text-emerald-400">
          API key kustom aktif — akan mengganti key server
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <svg className="w-3 h-3 text-black/25 dark:text-white/20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
      <span className="text-[0.62rem] font-medium text-black/30 dark:text-white/22">
        Menggunakan key dari konfigurasi server
      </span>
    </div>
  )
}

export function SettingsSidebar({
  open, onClose,
  selectedPdf,
  uploading,
  uploadMessage,
  onFileSelect,
  onResetDocuments,
  searchMode, setSearchMode,
  openAiKey, setOpenAiKey,
  topK, setTopK,
  loading,
  docStatus,
  documentName,
}) {
  const [dragging, setDragging] = useState(false)

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type === 'application/pdf') onFileSelect(file)
  }

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
    e.target.value = ''
  }

  const isUploadSuccess = uploadMessage && !uploadMessage.startsWith('Upload gagal')
  const showApiKeySection = searchMode === 'llm-openai'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-[calc(100vw-40px)] max-w-68 h-dvh
          border-r border-black/[0.08] dark:border-white/[0.07]
          bg-white dark:bg-[#161616]
          flex flex-col overflow-hidden
          shadow-[4px_0_32px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.4)]
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-black/[0.07] dark:border-white/[0.07] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0e7a64]/15 dark:bg-[#0e7a64]/25 border border-[#0e7a64]/25 dark:border-[#0e7a64]/30 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#0e7a64] dark:text-[#4ecba5]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-black/85 dark:text-white/90 font-bold text-[0.85rem] m-0 leading-none">TaxGuide</p>
              <p className="text-black/35 dark:text-white/30 text-[0.65rem] m-0 mt-0.5 font-medium">Perpajakan UMKM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.07] text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Scrollable settings */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          <Tag>Dokumen</Tag>

          {/* Document status banner */}
          <DocumentStatus docStatus={docStatus} selectedPdf={selectedPdf} uploadMessage={uploadMessage} documentName={documentName} />

          {/* Reset Dokumen Button */}
          {docStatus.loaded && (
            <button
              onClick={onResetDocuments}
              disabled={uploading || loading}
              className="mt-2 w-full py-2.5 px-3 border border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.08] active:bg-red-500/[0.12] text-red-600 dark:text-red-400 font-semibold text-[0.72rem] rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_12px_rgba(239,68,68,0.1)] active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.74-2.533l.842-10.518.149.022a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 3.75A1.25 1.25 0 019.25 2.5h1.5A1.25 1.25 0 0112 3.75v.293H8v-.293zM9.03 8.22a.75.75 0 00-1.06 1.06L9.44 10.75l-1.47 1.47a.75.75 0 101.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 101.06-1.06L11.56 10.75l1.47-1.47a.75.75 0 00-1.06-1.06L10.5 9.69 9.03 8.22z" clipRule="evenodd" />
              </svg>
              Reset Dokumen
            </button>
          )}

          {/* Drop zone */}
          <div className="mb-1 mt-3">
            <Lbl>{docStatus.loaded ? 'Upload Dokumen Baru' : 'Upload Dokumen PDF'}</Lbl>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                uploading
                  ? 'border-[#0e7a64]/35 bg-[#0e7a64]/[0.05] cursor-wait'
                  : dragging
                  ? 'border-[#0e7a64]/50 bg-[#0e7a64]/[0.07] scale-[1.01] shadow-[0_0_20px_rgba(14,122,100,0.12)]'
                  : selectedPdf
                  ? 'border-[#0e7a64]/25 bg-[#0e7a64]/[0.04] hover:border-[#0e7a64]/45 cursor-pointer'
                  : 'border-black/[0.10] dark:border-white/10 hover:border-black/[0.20] dark:hover:border-white/20 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer'
              }`}
            >
              {!uploading && (
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleChange}
                />
              )}

              <div className="py-5 px-3 text-center">
                {uploading ? (
                  <>
                    <div className="flex items-center justify-center mb-2.5">
                      <span className="w-6 h-6 rounded-full border-2 border-[#0e7a64]/25 border-t-[#0e7a64] dark:border-t-[#4ecba5] animate-spin block" />
                    </div>
                    <p className="text-[0.75rem] font-bold text-[#0e7a64] dark:text-[#4ecba5]/80 mb-0.5">
                      Sedang membaca dokumen...
                    </p>
                    <p className="text-[0.65rem] text-black/30 dark:text-white/25 m-0 truncate px-2">
                      {selectedPdf?.name}
                    </p>
                  </>
                ) : dragging ? (
                  <>
                    <svg className="w-6 h-6 text-[#0e7a64]/60 dark:text-[#4ecba5]/70 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[0.75rem] font-bold text-[#0e7a64] dark:text-[#4ecba5]/80 m-0">
                      Lepaskan untuk upload
                    </p>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-black/22 dark:text-white/20 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[0.72rem] font-semibold text-black/35 dark:text-white/35 mb-0">Klik atau drop PDF di sini</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {uploadMessage && !uploading && (
            <div className={`mt-2.5 flex items-start gap-2 text-[0.72rem] font-semibold rounded-xl px-3 py-2.5 ${
              isUploadSuccess
                ? 'text-[#0e7a64] dark:text-[#4ecba5] bg-[#0e7a64]/8 dark:bg-[#0e7a64]/10 border border-[#0e7a64]/18 dark:border-[#0e7a64]/20'
                : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30'
            }`}>
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                {isUploadSuccess
                  ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                }
              </svg>
              <span>{uploadMessage}</span>
            </div>
          )}

          <Sep />

          <Tag>Pengaturan Pencarian</Tag>

          <div className="mb-3.5">
            <Lbl htmlFor="s-mode">Mode Pencarian</Lbl>
            <select
              id="s-mode"
              className={inp}
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
            >
              {SEARCH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: '#fff', color: '#1a1a1a' }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── OpenAI API Key Section ── */}
          {showApiKeySection && (
            <div className="mb-3.5">
              <Lbl htmlFor="s-key">OpenAI API Key</Lbl>
              <ApiKeyInfoCard />
              <input
                id="s-key"
                type="password"
                className={inp}
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="Opsional — kosongkan jika server sudah dikonfigurasi"
              />
              <ApiKeyStatus apiKey={openAiKey} />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <Lbl htmlFor="s-topk">Top-K Hasil</Lbl>
              <span className="text-[0.72rem] font-extrabold text-[#0e7a64] dark:text-[#4ecba5] bg-[#0e7a64]/10 dark:bg-[#0e7a64]/15 border border-[#0e7a64]/18 dark:border-[#0e7a64]/20 px-2 py-0.5 rounded-lg tabular-nums">
                {topK}
              </span>
            </div>
            <input
              id="s-topk"
              type="range"
              min="1" max="10"
              className="w-full h-1 rounded-full cursor-pointer accent-[#0e7a64]"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value) || 1)}
            />
            <div className="flex justify-between text-[0.6rem] text-black/22 dark:text-white/20 mt-1 font-semibold select-none">
              <span>1</span><span>5</span><span>10</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-black/[0.07] dark:border-white/[0.07] shrink-0">
          <p className="text-[0.62rem] text-black/22 dark:text-white/20 text-center m-0 font-medium">
            TaxGuide · Informasi Perpajakan UMKM
          </p>
        </div>
      </aside>
    </>
  )
}
