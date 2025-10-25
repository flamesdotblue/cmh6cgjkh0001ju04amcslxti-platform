import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative h-[60vh] w-full">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vi0ijCQQJTRFc8LA/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white pointer-events-none" />
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-emerald-600">Trade Smarter. Reflect Better.</h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-700">A focused forex trading journal to capture entries, exits, risk, and insights—visualized into actionable performance analytics.</p>
        </div>
      </div>
    </section>
  );
}
