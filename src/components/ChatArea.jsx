import { useEffect, useRef, useState } from 'react'
import { SEARCH_OPTIONS, scoreToPercent } from '../lib/utils'

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

const RECOMMENDATIONS = [
  {
    q: 'Berapa tarif PPh final untuk UMKM dan bagaimana cara menghitungnya?',
    topic: 'PPh Final',
    icon: <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />,
  },
  {
    q: 'Apa syarat dan cara mendaftarkan diri sebagai PKP untuk UMKM?',
    topic: 'PKP',
    icon: <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />,
  },
  {
    q: 'Apa saja insentif dan fasilitas pajak yang bisa dimanfaatkan UMKM?',
    topic: 'Insentif',
    icon: <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />,
  },
  {
    q: 'Bagaimana tata cara pelaporan SPT Tahunan bagi UMKM perseorangan?',
    topic: 'Pelaporan SPT',
    icon: <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />,
  },
  {
    q: 'Berapa batas omzet UMKM yang dikenai pajak dan yang mendapat pembebasan?',
    topic: 'Omzet & Batas',
    icon: <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3 1 1 0 102 0 1 1 0 011-1 1 1 0 110 2 1 1 0 00-1 1v1a1 1 0 102 0v-.268A3 3 0 0011 4zm-1 9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />,
  },
  {
    q: 'Apa perbedaan UMKM berbadan hukum dan tidak berbadan hukum dalam kewajiban pajak?',
    topic: 'Badan Usaha',
    icon: <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />,
  },
]

const SUBTITLE = 'Temukan informasi perpajakan UMKM secara akurat — dari aturan PKP, PPh final, hingga insentif pajak untuk usaha Anda.'

function TypewriterText({ text, startDelay = 0, speed = 35, ready = true }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!ready) return
    let i = 0
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)
    return () => { clearTimeout(start); clearInterval(interval) }
  }, [text, startDelay, speed, ready])

  return (
    <>
      {displayed}
      {!done && (
        <span
          className="inline-block w-px h-[0.8em] bg-current align-middle ml-px opacity-70"
          style={{ animation: 'typingCursor 0.7s step-end infinite' }}
        />
      )}
    </>
  )
}

function scoreStyle(pct) {
  if (pct >= 75) return { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-700/40', bar: 'bg-emerald-500' }
  if (pct >= 50) return { badge: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-700/40', bar: 'bg-sky-500' }
  if (pct >= 25) return { badge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-700/40', bar: 'bg-orange-500' }
  return { badge: 'bg-black/5 text-black/40 border-black/10 dark:bg-white/5 dark:text-white/35 dark:border-white/10', bar: 'bg-black/20 dark:bg-white/25' }
}

function MiniResultCard({ row, index }) {
  const pct = scoreToPercent(row)
  const { badge, bar } = scoreStyle(pct)
  return (
    <div
      className="border border-black/[0.07] dark:border-white/[0.07] rounded-xl bg-white dark:bg-white/[0.02] p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300 group shadow-sm dark:shadow-none"
      style={{ animation: `rise 0.45s ${EASING} ${index * 0.06}s both` }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg bg-[#0e7a64]/15 dark:bg-[#0e7a64]/20 text-[#0e7a64] dark:text-[#4ecba5] text-[0.6rem] font-extrabold tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="text-[0.82rem] font-bold text-black/80 dark:text-white/85 truncate m-0">{row.pasal}</p>
            <p className="text-[0.7rem] text-black/35 dark:text-white/35 truncate m-0">{row.ayat}</p>
          </div>
        </div>
        <span className={`shrink-0 text-[0.62rem] font-extrabold px-2 py-0.5 rounded-full border ${badge}`}>
          {pct}%
        </span>
      </div>
      {row.bab && (
        <p className="text-[0.65rem] font-bold text-[#0e7a64]/70 dark:text-[#4ecba5]/60 mb-2 mt-0 uppercase tracking-wider">{row.bab}</p>
      )}
      <p className="text-[0.8rem] text-black/50 dark:text-white/50 leading-relaxed m-0 line-clamp-2 group-hover:text-black/65 dark:group-hover:text-white/65 transition-colors duration-300">{row.text}</p>
      <div className="mt-3 h-0.5 rounded-full bg-black/[0.07] dark:bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      {(row.bm25_score_norm > 0 || row.semantic_score_norm > 0) && (
        <div className="flex gap-1.5 mt-2">
          <span className="text-[0.62rem] text-black/30 dark:text-white/25 bg-black/[0.04] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.05] rounded-lg px-2 py-0.5 tabular-nums">
            BM25 · {row.bm25_score_norm.toFixed(2)}
          </span>
          <span className="text-[0.62rem] text-black/30 dark:text-white/25 bg-black/[0.04] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.05] rounded-lg px-2 py-0.5 tabular-nums">
            Sem · {row.semantic_score_norm.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex gap-1.5 py-3 px-1">
      {[0, 160, 320].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-[#0e7a64]/50 dark:bg-[#4ecba5]/50"
          style={{ animation: `typingBounce 1.2s ease-in-out ${delay}ms infinite` }}
        />
      ))}
    </div>
  )
}

function AssistantResponse({ message }) {
  if (message.status === 'loading') return <TypingDots />

  if (message.status === 'error') {
    return (
      <div className="border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20 rounded-xl px-4 py-3" style={{ animation: `scaleIn 0.3s ${EASING} both` }}>
        <p className="text-red-600 dark:text-red-400 font-bold text-[0.82rem] mb-0.5 mt-0">Terjadi kesalahan</p>
        <p className="text-red-500/80 dark:text-red-400/60 text-[0.8rem] m-0 leading-relaxed">{message.error}</p>
      </div>
    )
  }

  if (message.llmMode) {
    return (
      <div className="space-y-4" style={{ animation: `fadeIn 0.4s ${EASING} both` }}>
        <p className="text-black/75 dark:text-white/78 text-[0.88rem] leading-[1.82] m-0 whitespace-pre-line">
          {message.answer || <span className="text-black/25 dark:text-white/25 italic">Tidak ada jawaban dari model.</span>}
        </p>
        {message.references?.length > 0 && (
          <div>
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-black/25 dark:text-white/20 mb-3">
              Referensi · {message.references.length}
            </p>
            <div className="space-y-2">
              {message.references.map((row, i) => (
                <MiniResultCard key={row.chunk_id} row={row} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const rows = message.results ?? []
  return (
    <div style={{ animation: `fadeIn 0.4s ${EASING} both` }}>
      <p className="text-[0.72rem] font-semibold text-black/30 dark:text-white/25 mb-3">
        {rows.length > 0 ? `${rows.length} hasil ditemukan` : 'Tidak ada hasil ditemukan.'}
      </p>
      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <MiniResultCard key={row.chunk_id} row={row} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function ChatExchange({ message }) {
  const modeLabel = SEARCH_OPTIONS.find((o) => o.value === message.mode)?.label ?? message.mode
  return (
    <div className="space-y-5" style={{ animation: `rise 0.5s ${EASING} both` }}>
      {/* User bubble */}
      <div className="flex justify-end">
        <div className="max-w-[92%] sm:max-w-[80%] bg-[#e8f5f1] dark:bg-[#172820] border border-[#0e7a64]/20 dark:border-[#0e7a64]/20 rounded-2xl rounded-tr-sm px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm dark:shadow-none">
          <p className="text-black/80 dark:text-white/85 text-[0.88rem] leading-relaxed m-0">{message.query}</p>
          <p className="text-[#0e7a64]/50 dark:text-[#4ecba5]/40 text-[0.62rem] font-semibold mt-1.5 mb-0 uppercase tracking-wide">
            {modeLabel}
          </p>
        </div>
      </div>

      {/* Assistant bubble */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#191919] border border-black/[0.09] dark:border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 shadow-sm dark:shadow-none">
          <svg className="w-4 h-4 text-[#0e7a64] dark:text-[#4ecba5]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.651.651 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.232 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <AssistantResponse message={message} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onSuggest, ready }) {
  return (
    <div className="flex flex-col items-center px-4 pt-7 pb-6 text-center sm:min-h-full sm:justify-center sm:px-6 sm:py-14">

      <div
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#0e7a64]/10 dark:bg-[#0e7a64]/12 border border-[#0e7a64]/20 dark:border-[#0e7a64]/22 flex items-center justify-center mb-3 sm:mb-5 shadow-[0_4px_16px_rgba(14,122,100,0.15)] dark:shadow-[0_4px_16px_rgba(14,122,100,0.1)]"
        style={{ animation: `splashIcon 0.7s cubic-bezier(0.34,1.56,0.64,1) both` }}
      >
        <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#0e7a64] dark:text-[#4ecba5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
      </div>

      <div style={{ animation: `rise 0.55s ${EASING} 0.15s both` }}>
        <h1 className="text-black/85 dark:text-white/90 text-[1.35rem] sm:text-[1.75rem] font-bold mb-1.5 mt-0 tracking-tight">
          TaxGuide
        </h1>
        <p className="text-black/42 dark:text-white/30 text-[0.78rem] sm:text-[0.87rem] leading-[1.7] mb-5 sm:mb-10 max-w-[34ch] sm:max-w-[42ch] m-0">
          <TypewriterText text={SUBTITLE} startDelay={400} speed={28} ready={ready} />
        </p>
      </div>

      <div className="w-full max-w-2xl text-left" style={{ animation: `fadeIn 0.5s ${EASING} 0.25s both` }}>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-3 h-3 text-[#0e7a64]/50 dark:text-[#4ecba5]/40" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
          </svg>
          <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-black/28 dark:text-white/20">
            Rekomendasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {RECOMMENDATIONS.map((rec, i) => (
            <button
              key={rec.q}
              onClick={() => onSuggest(rec.q)}
              style={{ animation: `rise 0.5s ${EASING} ${0.28 + i * 0.07}s both` }}
              className={`group flex flex-col text-left
                gap-2 p-3 sm:gap-3 sm:p-4
                rounded-xl sm:rounded-2xl
                border border-black/[0.07] dark:border-white/[0.06]
                bg-white dark:bg-white/[0.015]
                hover:bg-[#0e7a64]/[0.05] dark:hover:bg-[#0e7a64]/[0.07]
                hover:border-[#0e7a64]/25 dark:hover:border-[#0e7a64]/25
                hover:shadow-[0_4px_20px_rgba(14,122,100,0.1)] dark:hover:shadow-[0_4px_24px_rgba(14,122,100,0.12)]
                shadow-sm dark:shadow-none
                transition-all duration-300 ease-out
                ${i >= 3 ? 'hidden sm:flex' : 'flex'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#0e7a64]/10 dark:bg-[#0e7a64]/10 border border-[#0e7a64]/15 dark:border-[#0e7a64]/12 flex items-center justify-center shrink-0 group-hover:bg-[#0e7a64]/18 dark:group-hover:bg-[#0e7a64]/22 group-hover:border-[#0e7a64]/28 dark:group-hover:border-[#0e7a64]/30 transition-all duration-300">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0e7a64]/65 dark:text-[#4ecba5]/55 group-hover:text-[#0e7a64] dark:group-hover:text-[#4ecba5] transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                    {rec.icon}
                  </svg>
                </div>
                <span className="text-[0.55rem] sm:text-[0.58rem] font-extrabold uppercase tracking-wider text-black/28 dark:text-white/18 group-hover:text-[#0e7a64]/70 dark:group-hover:text-[#4ecba5]/55 px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.05] group-hover:bg-[#0e7a64]/10 dark:group-hover:bg-[#0e7a64]/10 group-hover:border-[#0e7a64]/20 dark:group-hover:border-[#0e7a64]/18 transition-all duration-300 shrink-0">
                  {rec.topic}
                </span>
              </div>

              <p className="text-black/52 dark:text-white/45 text-[0.78rem] sm:text-[0.82rem] font-medium leading-snug group-hover:text-black/78 dark:group-hover:text-white/78 transition-colors duration-300 m-0 flex-1">
                {rec.q}
              </p>

              <div className="hidden sm:flex justify-end">
                <svg className="w-3.5 h-3.5 text-black/15 dark:text-white/12 group-hover:text-[#0e7a64]/50 dark:group-hover:text-[#4ecba5]/45 group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatArea({ chatHistory, query, setQuery, loading, searchMode, onSubmit, onToggleSidebar, isDark, onToggleTheme, splashDone }) {
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (chatHistory.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  function handleSuggest(q) {
    setQuery(q)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const modeLabel = SEARCH_OPTIONS.find((o) => o.value === searchMode)?.label ?? searchMode

  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden">

      {/* Top bar */}
      <div className="h-12 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-black/[0.06] dark:border-white/[0.05] bg-white/75 dark:bg-[#0f0f0f]/70 backdrop-blur-xl transition-colors duration-300">

        {/* Settings toggle */}
        <button
          onClick={onToggleSidebar}
          title="Pengaturan"
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/[0.06] dark:hover:bg-white/[0.07] text-black/30 dark:text-white/25 hover:text-black/65 dark:hover:text-white/65 transition-all duration-200 active:scale-90"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>

        <span className="text-[0.6rem] font-extrabold tracking-[0.22em] text-black/20 dark:text-white/18 uppercase select-none">
          TaxGuide
        </span>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/[0.06] dark:hover:bg-white/[0.07] text-black/30 dark:text-white/25 hover:text-black/65 dark:hover:text-white/65 transition-all duration-200 active:scale-90"
        >
          {isDark ? (
            /* Sun icon */
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            /* Moon icon */
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {chatHistory.length === 0 ? (
          <EmptyState onSuggest={handleSuggest} ready={splashDone} />
        ) : (
          <div className="max-w-3xl mx-auto w-full px-3 py-5 sm:px-6 sm:py-8 space-y-8 sm:space-y-10">
            {chatHistory.map((msg) => (
              <ChatExchange key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none h-5 -mt-5 shrink-0 bg-gradient-to-t from-[#f5f5f7] dark:from-[#111111] to-transparent transition-colors duration-300" />

      {/* Input bar */}
      <div className="px-3 pb-3 pt-1 sm:px-6 sm:pb-6 shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={onSubmit}>
            <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-2xl bg-white dark:bg-[#171717] p-3 sm:p-4 shadow-sm dark:shadow-none
              focus-within:border-[#0e7a64]/40 dark:focus-within:border-[#0e7a64]/45
              focus-within:shadow-[0_0_0_3px_rgba(14,122,100,0.08),0_4px_24px_rgba(0,0,0,0.06)] dark:focus-within:shadow-[0_0_0_3px_rgba(14,122,100,0.08),0_4px_24px_rgba(0,0,0,0.25)]
              transition-all duration-300">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan informasi perpajakan UMKM…"
                rows={2}
                className="w-full bg-transparent text-black/78 dark:text-white/80 resize-none outline-none placeholder-black/22 dark:placeholder-white/18 text-[0.88rem] leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-semibold text-black/38 dark:text-white/25 bg-black/[0.05] dark:bg-white/[0.04] border border-black/[0.07] dark:border-white/[0.07] px-2.5 py-1 rounded-lg">
                    {modeLabel}
                  </span>
                  <span className="text-[0.6rem] text-black/22 dark:text-white/15 hidden sm:block">
                    Shift+Enter untuk baris baru
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#0e7a64] hover:bg-[#0c6b58] active:scale-90 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(14,122,100,0.3)]"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}
