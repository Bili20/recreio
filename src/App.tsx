import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <h1 className="text-5xl font-bold tracking-tight">
        React + Vite + TS + <span className="text-sky-400">Tailwind</span>
      </h1>
      <p className="text-slate-400">Edite <code className="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">src/App.tsx</code> e salve para testar o HMR</p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-lg bg-sky-500 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-sky-400 active:scale-95"
      >
        Contagem: {count}
      </button>
    </main>
  )
}

export default App
