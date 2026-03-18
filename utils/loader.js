export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 px-8 py-10 rounded-2xl bg-white/5 border border-white/10 shadow-2xl min-w-[280px] backdrop-blur-sm">
        {/* Modern dual-ring spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-white/20" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-white border-r-white/60 animate-spin" />
          <div className="absolute inset-2 w-12 h-12 rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-400/60 animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />
        </div>
        {/* Animated text */}
        <p className="text-white font-medium text-base tracking-wide animate-pulse">
          {text}
        </p>
        {/* Shimmer progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="loader-shimmer h-full w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}
