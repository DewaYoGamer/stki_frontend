import { scoreToPercent } from '../lib/utils'

function scoreTheme(pct) {
  if (pct >= 75) return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', dot: 'bg-emerald-500' }
  if (pct >= 50) return { badge: 'bg-sky-50 text-sky-700 border-sky-200',           bar: 'bg-sky-500',     dot: 'bg-sky-500' }
  if (pct >= 25) return { badge: 'bg-orange-50 text-orange-700 border-orange-200',  bar: 'bg-orange-400',  dot: 'bg-orange-400' }
  return            { badge: 'bg-gray-50 text-gray-500 border-gray-200',            bar: 'bg-gray-400',    dot: 'bg-gray-400' }
}

/* ── States ── */

function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-[3px] border-[rgba(14,122,100,0.1)] border-t-[#0e7a64] border-r-[rgba(14,122,100,0.35)] animate-spin" />
        <div className="absolute inset-[5px] rounded-full bg-gradient-to-br from-[rgba(14,122,100,0.06)] to-transparent" />
      </div>
      <div className="text-center">
        <p className="font-bold text-[#111e1a] mb-1 mt-0">{message || 'Sedang memproses...'}</p>
        <p className="text-[0.78rem] text-[#3d4f4a]/50 m-0">Harap tunggu sebentar</p>
      </div>
      <div className="w-full grid gap-3">
        {[1, 0.65, 0.4].map((op, i) => (
          <div key={i} className="h-20 rounded-xl bg-[rgba(20,37,32,0.04)] animate-pulse" style={{ opacity: op }} />
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(14,122,100,0.07)] border border-[rgba(14,122,100,0.1)] flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-[#0e7a64]/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
      </div>
      <p className="font-semibold text-[#111e1a] mb-1.5 mt-0">Belum ada hasil</p>
      <p className="text-[0.8rem] text-[#3d4f4a]/50 m-0 max-w-[28ch] leading-relaxed">
        Isi query lalu klik tombol pencarian untuk melihat hasil retrieval.
      </p>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="flex items-start gap-3 mb-5 border border-red-200 bg-red-50 text-red-800 p-4 rounded-xl">
      <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="font-bold text-[0.83rem] mb-0.5 mt-0">Terjadi kesalahan</p>
        <p className="text-[0.8rem] m-0 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

function LlmAnswerCard({ answerText, provider }) {
  return (
    <div className="mb-5 rounded-2xl border border-[rgba(14,122,100,0.14)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-[rgba(14,122,100,0.05)] border-b border-[rgba(14,122,100,0.1)]">
        <div className="w-7 h-7 rounded-lg bg-[rgba(14,122,100,0.12)] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-[#0e7a64]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.651.651 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.232 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-[0.82rem] font-bold text-[#0e7a64]">Jawaban LLM</span>
        <span className="ml-auto text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#3d4f4a]/40 bg-[rgba(20,37,32,0.05)] border border-[rgba(20,37,32,0.08)] px-2.5 py-1 rounded-lg">
          {provider}
        </span>
      </div>
      <div className="px-5 py-5">
        {answerText ? (
          <p className="m-0 text-[0.9rem] text-[#111e1a] leading-[1.75] whitespace-pre-line">{answerText}</p>
        ) : (
          <p className="m-0 text-[0.88rem] text-[#3d4f4a]/40 italic">Belum ada jawaban. Jalankan query terlebih dahulu.</p>
        )}
      </div>
    </div>
  )
}

function StatsBar({ count, topRow }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="rounded-xl bg-[rgba(14,122,100,0.06)] border border-[rgba(14,122,100,0.1)] px-4 py-3.5">
        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[#0e7a64]/55 mb-1.5 mt-0">
          Hasil Ditemukan
        </p>
        <p className="text-[2rem] font-bold text-[#111e1a] m-0 leading-none tabular-nums">{count}</p>
      </div>
      <div className="rounded-xl bg-[rgba(5,109,143,0.06)] border border-[rgba(5,109,143,0.1)] px-4 py-3.5">
        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[#056d8f]/55 mb-1.5 mt-0">
          Top Pasal
        </p>
        <p className="text-[0.88rem] font-bold text-[#111e1a] m-0 leading-tight truncate">
          {topRow ? topRow.pasal : '—'}
        </p>
        {topRow && (
          <p className="text-[0.7rem] text-[#3d4f4a]/45 m-0 mt-0.5 font-medium truncate">{topRow.ayat}</p>
        )}
      </div>
    </div>
  )
}

function ResultCard({ row, index }) {
  const pct = scoreToPercent(row)
  const theme = scoreTheme(pct)

  return (
    <article className="group border border-[rgba(20,37,32,0.07)] rounded-2xl bg-white p-5 hover:border-[rgba(14,122,100,0.2)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[rgba(14,122,100,0.08)] text-[#0e7a64] text-[0.68rem] font-extrabold tabular-nums border border-[rgba(14,122,100,0.1)]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="m-0 text-[0.92rem] font-bold text-[#111e1a] truncate">{row.pasal}</h3>
            <p className="m-0 text-[0.75rem] text-[#3d4f4a]/55 font-medium truncate">{row.ayat}</p>
          </div>
        </div>
        <span className={`shrink-0 text-[0.7rem] font-extrabold px-2.5 py-1 rounded-full border ${theme.badge}`}>
          {pct}%
        </span>
      </div>

      {/* Chapter / location */}
      <p className="text-[0.72rem] font-bold text-[#0e7a64] mb-2.5 mt-0 uppercase tracking-wide">{row.bab}</p>

      {/* Snippet */}
      <p className="text-[0.85rem] text-[#3d4f4a] leading-[1.7] mb-4 mt-0 line-clamp-3">{row.text}</p>

      {/* Score bar */}
      <div className="h-1 rounded-full bg-[rgba(20,37,32,0.07)] overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${theme.bar} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Metric pills */}
      {(row.bm25_score_norm > 0 || row.semantic_score_norm > 0) && (
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] font-semibold text-[#3d4f4a]/50 bg-[rgba(20,37,32,0.04)] border border-[rgba(20,37,32,0.06)] rounded-lg px-2.5 py-1 tabular-nums">
            BM25 · {row.bm25_score_norm.toFixed(2)}
          </span>
          <span className="text-[0.65rem] font-semibold text-[#3d4f4a]/50 bg-[rgba(20,37,32,0.04)] border border-[rgba(20,37,32,0.06)] rounded-lg px-2.5 py-1 tabular-nums">
            Semantic · {row.semantic_score_norm.toFixed(2)}
          </span>
        </div>
      )}
    </article>
  )
}

/* ── Main ── */

export function ResultsPanel({
  engineNote, errorMessage, loading, loadingMessage,
  llmMode, provider, answerText, visibleRows, topRow,
}) {
  const hasResults = visibleRows.length > 0

  const status = loading
    ? { dot: 'bg-amber-400 animate-pulse', pill: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Memproses' }
    : errorMessage
      ? { dot: 'bg-red-500', pill: 'bg-red-50 border-red-200 text-red-600', label: 'Error' }
      : hasResults || answerText
        ? { dot: 'bg-emerald-500', pill: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Selesai' }
        : { dot: 'bg-[#3d4f4a]/25', pill: 'bg-[rgba(20,37,32,0.04)] border-[rgba(20,37,32,0.1)] text-[#3d4f4a]/50', label: 'Menunggu' }

  return (
    <section className="bg-white border border-[rgba(20,37,32,0.07)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-[rise_0.55s_ease_both] [animation-delay:0.2s]">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <h2 className="m-0 text-[#111e1a]">Output</h2>
        <div className={`flex items-center gap-2 text-[0.7rem] font-bold rounded-full px-3 py-1.5 border ${status.pill}`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
          {status.label}
        </div>
      </div>
      <p className="text-[0.76rem] text-[#3d4f4a]/50 mb-5 mt-0 leading-relaxed">{engineNote}</p>

      {errorMessage && <ErrorBanner message={errorMessage} />}

      {loading ? (
        <LoadingState message={loadingMessage} />
      ) : (
        <>
          {llmMode && <LlmAnswerCard answerText={answerText} provider={provider} />}

          {hasResults && <StatsBar count={visibleRows.length} topRow={topRow} />}

          {hasResults ? (
            <div className="grid gap-3">
              {visibleRows.map((row, i) => (
                <ResultCard key={row.chunk_id} row={row} index={i} />
              ))}
            </div>
          ) : (
            !answerText && <EmptyState />
          )}
        </>
      )}
    </section>
  )
}
