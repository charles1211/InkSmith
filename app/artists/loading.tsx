export default function ArtistsLoading() {
  return (
    <div className="min-h-screen bg-ink-950 text-white">

      {/* Header skeleton */}
      <div className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-16 bg-ink-accent/30" />
            <div className="h-3 w-32 bg-white/[0.06] rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-10">
            <div className="space-y-4">
              <div className="h-20 w-64 bg-white/[0.06] rounded-lg animate-pulse" />
              <div className="h-20 w-80 bg-ink-accent/10 rounded-lg animate-pulse" />
            </div>
            <div className="xl:max-w-sm space-y-3">
              <div className="h-4 w-full bg-white/[0.05] rounded-full animate-pulse" />
              <div className="h-4 w-5/6 bg-white/[0.05] rounded-full animate-pulse" />
              <div className="h-4 w-4/6 bg-white/[0.05] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Artist card skeletons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40 space-y-48">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex flex-col lg:flex-row gap-16 xl:gap-24 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Image skeleton */}
            <div className="w-full lg:w-5/12">
              <div className="relative aspect-[3/4] bg-ink-900/60 border border-white/[0.04] overflow-hidden">
                <div className="w-full h-full animate-pulse" style={{ background: 'linear-gradient(160deg,#1c1c1c,#141414)' }} />
                {/* Shimmer sweep */}
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent)' }}
                />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="w-full lg:w-7/12 lg:pt-12 xl:pt-20 space-y-8">
              {/* Specialty tags */}
              <div className="flex items-center gap-3">
                <div className="h-3 w-6 bg-white/[0.04] rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-ink-accent/10 border border-ink-accent/20 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-ink-accent/10 border border-ink-accent/20 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-ink-accent/10 border border-ink-accent/20 rounded-full animate-pulse" />
              </div>

              {/* Name */}
              <div className="space-y-3">
                <div className="h-14 w-3/4 bg-white/[0.07] rounded-lg animate-pulse" />
              </div>

              {/* Divider */}
              <div className="h-px bg-ink-accent/20" />

              {/* Highlights */}
              <div className="space-y-4">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-2 bg-ink-accent/30 rounded-full animate-pulse shrink-0" />
                    <div className="h-4 bg-white/[0.05] rounded-full animate-pulse" style={{ width: `${75 - j * 10}%` }} />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-5 pt-4">
                <div className="h-12 w-40 bg-ink-accent/20 animate-pulse" />
                <div className="h-12 w-28 bg-white/[0.04] border border-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
