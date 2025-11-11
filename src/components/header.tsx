export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">demostore</h1>
          <div className="text-right text-sm">
            <div className="font-bold">11$</div>
            <div className="text-xs text-gray-600">Mes gains</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input type="text" placeholder="Recherche" className="bg-transparent flex-1 text-sm outline-none" />
        </div>
      </div>

      <nav className="flex gap-4 px-4 py-2 overflow-x-auto border-b border-gray-200">
        {["Soldes", "Mode", "Maison", "Beauté", "Sport", "Loisirs"].map((cat) => (
          <button
            key={cat}
            className="px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap hover:text-gray-900"
          >
            {cat}
          </button>
        ))}
      </nav>
    </header>
  )
}
