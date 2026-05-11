import { SEARCH_OPTIONS } from '../lib/utils'
import { QUICK_QUERIES } from '../lib/localRetriever'

const inputCls =
  'w-full rounded-xl border border-[rgba(20,37,32,0.14)] bg-[#f9f9f8] text-[#111e1a] text-sm py-2.5 px-3.5 outline-none transition-all focus:border-[#0e7a64] focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,122,100,0.1)] disabled:opacity-40 disabled:cursor-not-allowed'

function Divider() {
  return <div className="border-t border-[rgba(20,37,32,0.07)] my-5" />
}

function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.78rem] font-bold mb-1.5 text-[#111e1a]"
    >
      {children}
    </label>
  )
}

function SectionTag({ children }) {
  return (
    <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#3d4f4a]/40 mb-3.5 mt-0">
      {children}
    </p>
  )
}

function UploadArea({ selectedPdf, onChange }) {
  return (
    <div className="relative">
      <input
        id="pdf-file"
        type="file"
        accept="application/pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onChange}
      />
      <div
        className={`rounded-xl border-2 border-dashed py-5 px-4 text-center transition-all ${
          selectedPdf
            ? 'border-[#0e7a64]/40 bg-[rgba(14,122,100,0.04)]'
            : 'border-[rgba(20,37,32,0.12)] hover:border-[#0e7a64]/30 hover:bg-[rgba(14,122,100,0.02)]'
        }`}
      >
        <div className="w-9 h-9 rounded-xl bg-[rgba(14,122,100,0.08)] flex items-center justify-center mx-auto mb-2.5">
          <svg className="w-5 h-5 text-[#0e7a64]/60" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.25 7a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v2.25H12a.75.75 0 010 1.5H10.5V13a.75.75 0 01-1.5 0v-2.25H7.5a.75.75 0 010-1.5H9.25V7zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd" />
          </svg>
        </div>
        {selectedPdf ? (
          <>
            <p className="text-[0.78rem] font-semibold text-[#0e7a64] mb-0.5">{selectedPdf.name}</p>
            <p className="text-[0.68rem] text-[#3d4f4a]/45 m-0">Klik untuk ganti file</p>
          </>
        ) : (
          <>
            <p className="text-[0.78rem] font-semibold text-[#3d4f4a] mb-0.5">Pilih file PDF</p>
            <p className="text-[0.68rem] text-[#3d4f4a]/45 m-0">Klik area ini untuk upload</p>
          </>
        )}
      </div>
    </div>
  )
}

export function ControlsPanel({
  backendUrl, setBackendUrl,
  selectedPdf, setSelectedPdf,
  uploadMessage,
  searchMode, setSearchMode,
  query, setQuery,
  topK, setTopK,
  openAiKey, setOpenAiKey,
  loading, llmMode,
  onUpload, onSubmit,
}) {
  return (
    <section className="bg-white border border-[rgba(20,37,32,0.07)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-[rise_0.55s_ease_both] [animation-delay:0.12s]">

      <h2 className="mt-0 mb-5 text-[#111e1a]">Kontrol Pencarian</h2>

      {/* ── Backend ── */}
      <SectionTag>Konfigurasi Backend</SectionTag>

      <div className="mb-4">
        <Label htmlFor="backend-url">URL Backend</Label>
        <input
          id="backend-url"
          className={inputCls}
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          placeholder="http://127.0.0.1:8000"
        />
      </div>

      <div className="mb-3">
        <Label>Dokumen PDF</Label>
        <UploadArea
          selectedPdf={selectedPdf}
          onChange={(e) => setSelectedPdf(e.target.files?.[0] ?? null)}
        />
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-[0.82rem] font-bold border border-[rgba(14,122,100,0.2)] bg-[rgba(14,122,100,0.06)] text-[#0e7a64] hover:bg-[rgba(14,122,100,0.12)] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={loading}
        onClick={onUpload}
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1V14A1.5 1.5 0 002.5 15.5h15A1.5 1.5 0 0019 14V8.5z" clipRule="evenodd" />
        </svg>
        Upload ke Backend
      </button>

      {uploadMessage && (
        <div className="mt-3 flex items-start gap-2.5 text-[0.78rem] font-semibold text-[#1a8f64] bg-[rgba(26,143,100,0.07)] border border-[rgba(26,143,100,0.16)] rounded-xl px-3.5 py-2.5">
          <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <span>{uploadMessage}</span>
        </div>
      )}

      <Divider />

      {/* ── Search settings ── */}
      <form onSubmit={onSubmit}>
        <SectionTag>Pengaturan Pencarian</SectionTag>

        <div className="mb-4">
          <Label htmlFor="search-mode">Mode Pencarian</Label>
          <select
            id="search-mode"
            className={inputCls}
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
          >
            {SEARCH_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        {searchMode === 'llm-openai' && (
          <div className="mb-4">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <input
              id="openai-key"
              type="password"
              className={inputCls}
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
        )}

        {/* Top-K */}
        <div className="mb-0">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="top-k">Top-K Hasil</Label>
            <span className="text-[0.75rem] font-extrabold text-[#0e7a64] bg-[rgba(14,122,100,0.09)] border border-[rgba(14,122,100,0.16)] px-2.5 py-0.5 rounded-lg tabular-nums">
              {topK}
            </span>
          </div>
          <input
            id="top-k"
            type="range"
            min="1" max="10"
            className="w-full h-1 rounded-full cursor-pointer accent-[#0e7a64]"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value) || 1)}
          />
          <div className="flex justify-between text-[0.62rem] text-[#3d4f4a]/35 mt-1 font-semibold select-none">
            <span>1</span><span>5</span><span>10</span>
          </div>
        </div>

        <Divider />

        {/* ── Query ── */}
        <SectionTag>Query</SectionTag>

        <textarea
          id="query-input"
          rows="4"
          className={`${inputCls} resize-none mb-3`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Contoh: bagaimana cara setup mode backend?"
        />

        {/* Quick chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {QUICK_QUERIES.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setQuery(item)}
              className="border border-[rgba(5,109,143,0.2)] bg-[rgba(5,109,143,0.06)] text-[#04526b] hover:bg-[rgba(5,109,143,0.12)] rounded-full py-1 px-3 text-[0.68rem] font-semibold cursor-pointer transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-5 font-bold text-[0.88rem] text-white bg-[#0e7a64] shadow-[0_2px_8px_rgba(14,122,100,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#0c6b58] hover:shadow-[0_4px_16px_rgba(14,122,100,0.4)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
              Memproses...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              {llmMode ? 'Retrieval + Jawab LLM' : 'Jalankan Retrieval'}
            </>
          )}
        </button>
      </form>
    </section>
  )
}
