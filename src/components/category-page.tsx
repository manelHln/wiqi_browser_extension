export default function CategoryPage() {
  const categories = [
    { name: "Top merchants", icon: "🛍️", color: "bg-orange-100" },
    { name: "High-Tech & Household Appliances", icon: "🎮", color: "bg-pink-100" },
    { name: "Travel & Rentals", icon: "✈️", color: "bg-blue-100" },
    { name: "Fashion", icon: "👜", color: "bg-yellow-100" },
    { name: "Subscriptions", icon: "📱", color: "bg-purple-100" },
    { name: "Home & Garden", icon: "🛋️", color: "bg-green-100" },
    { name: "Health & Beauty", icon: "💄", color: "bg-pink-100" },
    { name: "Finance & Insurance", icon: "🐷", color: "bg-yellow-100" },
    { name: "Sports", icon: "🏀", color: "bg-orange-100" },
  ]

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 mb-4">
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

      <h2 className="text-xl font-bold mb-6">Parcourir</h2>

      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`${cat.color} rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:opacity-80 transition`}
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <p className="text-xs font-semibold text-center text-gray-800">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
