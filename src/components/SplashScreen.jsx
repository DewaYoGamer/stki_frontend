import { useEffect, useState } from 'react'

export function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2000)
    const t2 = setTimeout(() => onDone(), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center px-4
        bg-[#f5f5f7] dark:bg-[#111111]
        transition-opacity duration-500
        ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{
        backgroundImage: 'radial-gradient(circle, var(--dot, rgba(0,0,0,0.055)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="flex flex-col items-center gap-6">

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-3xl bg-[#0e7a64]/10 dark:bg-[#0e7a64]/15 border border-[#0e7a64]/20 dark:border-[#0e7a64]/25 flex items-center justify-center shadow-[0_8px_40px_rgba(14,122,100,0.18)] dark:shadow-[0_8px_40px_rgba(14,122,100,0.14)]"
          style={{ animation: 'splashIcon 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <svg className="w-9 h-9 text-[#0e7a64] dark:text-[#4ecba5]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Text */}
        <div
          className="text-center"
          style={{ animation: 'rise 0.55s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}
        >
          <h1 className="text-[2rem] font-bold text-black/85 dark:text-white/90 tracking-tight m-0 leading-none">
            TaxGuide
          </h1>
          <p className="text-black/38 dark:text-white/28 text-[0.82rem] mt-2 m-0 tracking-wide">
            Informasi Perpajakan UMKM
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="w-28 h-0.5 rounded-full bg-black/8 dark:bg-white/[0.07] overflow-hidden"
          style={{ animation: 'fadeIn 0.3s ease 0.5s both' }}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-[#0e7a64] to-[#4ecba5]"
            style={{ animation: 'splashBar 1.6s cubic-bezier(0.4,0,0.2,1) 0.5s both' }}
          />
        </div>

      </div>
    </div>
  )
}
