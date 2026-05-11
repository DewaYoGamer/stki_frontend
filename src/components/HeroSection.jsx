const FEATURES = [
  {
    label: 'BM25',
    desc: 'Keyword Retrieval',
    iconCls: 'text-emerald-300',
    bg: 'bg-white/[0.08]',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Semantic',
    desc: 'Vector Embedding',
    iconCls: 'text-sky-300',
    bg: 'bg-white/[0.08]',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.897l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
      </svg>
    ),
  },
  {
    label: 'Hybrid',
    desc: 'BM25 + Semantic',
    iconCls: 'text-white/70',
    bg: 'bg-white/[0.08]',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5z" />
      </svg>
    ),
  },
  {
    label: 'LLM Q&A',
    desc: 'AI-Powered Answers',
    iconCls: 'text-orange-300',
    bg: 'bg-white/[0.08]',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.651.651 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.232 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function HeroSection() {
  return (
    <header className="hero-panel relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111e1a] via-[#162820] to-[#0d3d52] animate-[rise_0.55s_ease_both] [animation-delay:0.04s]">
      <div className="relative z-10 px-8 py-10 lg:flex items-center gap-12">

        {/* ── Left: text ── */}
        <div className="flex-1 min-w-0">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[0.65rem] font-extrabold tracking-[0.16em] uppercase text-white/70">
              Retrieval App
            </span>
          </div>

          <h1 className="mt-0 mb-4 text-white max-w-[18ch]" style={{ letterSpacing: '-0.03em' }}>
            Dashboard Retrieval &amp; RAG App
          </h1>

          <p className="m-0 max-w-[54ch] text-white/55 text-[0.95rem] leading-[1.7]">
            Uji berbagai metode pencarian dokumen — keyword, semantic, hybrid, hingga
            tanya-jawab cerdas berbasis LLM menggunakan dokumen Anda sendiri.
          </p>
        </div>

        {/* ── Right: feature cards ── */}
        <div className="grid grid-cols-2 gap-2.5 shrink-0 mt-8 lg:mt-0 w-full lg:w-auto">
          {FEATURES.map(({ label, desc, icon, iconCls, bg }) => (
            <div
              key={label}
              className={`${bg} border border-white/10 rounded-xl px-4 py-3.5 backdrop-blur-sm`}
            >
              <span className={`${iconCls} mb-2 block`}>{icon}</span>
              <p className="text-[0.82rem] font-bold text-white mb-0.5 mt-0">{label}</p>
              <p className="text-[0.7rem] text-white/45 m-0 font-medium">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </header>
  )
}
