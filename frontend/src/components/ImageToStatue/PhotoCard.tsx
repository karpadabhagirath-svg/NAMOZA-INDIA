/**
 * A stylised "photograph" placeholder — a generic portrait silhouette inside a
 * premium photo card. Swap this out for a real customer photo whenever one is
 * available; nothing else in the section depends on it being an SVG.
 */
export default function PhotoCard() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-soft sm:max-w-[300px]">
      <svg viewBox="0 0 320 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="itsPhotoBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2E36" />
            <stop offset="100%" stopColor="#15171B" />
          </linearGradient>
          <linearGradient id="itsPhotoSubject" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DDC79B" />
            <stop offset="100%" stopColor="#8E703F" />
          </linearGradient>
          <radialGradient id="itsPhotoVignette" cx="50%" cy="38%" r="70%">
            <stop offset="55%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
        </defs>

        <rect width="320" height="400" fill="url(#itsPhotoBg)" />

        {/* Generic portrait silhouette — head and shoulders */}
        <path
          d="M160 332 C 92 332 74 292 74 248 C 74 202 88 172 118 155 C 99 137 91 114 100 91 C 111 62 139 44 160 44 C 181 44 209 62 220 91 C 229 114 221 137 202 155 C 232 172 246 202 246 248 C 246 292 228 332 160 332 Z"
          fill="url(#itsPhotoSubject)"
          opacity={0.92}
        />

        <rect width="320" height="400" fill="url(#itsPhotoVignette)" />
      </svg>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}

