import { Info } from "lucide-react"

const PromoCard = ({
  logo,
  title,
  description,
  cashback,
  buttonText,
  sponsored
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-50 rounded-lg">
          {logo}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-base mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mb-2">{description}</p>
          )}
          {cashback && (
            <p className="text-sm text-blue-600 font-medium mb-3">{cashback}</p>
          )}
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
            {buttonText}
          </button>
          {sponsored && (
            <p className="text-xs text-gray-400 mt-2">Sponsorisée</p>
          )}
        </div>
      </div>
    </div>
  )
}

const promos = [
  {
    id: 1,
    logo: <div className="text-gray-400 font-serif text-2xl">SB</div>,
    title: "-12$ on your first order",
    description: null,
    cashback: "+ 3,8% of cashback",
    buttonText: "Show code",
    sponsored: true
  },
  {
    id: 2,
    logo: (
      <div className="font-bold text-blue-600">
        <div className="text-xs">CRAZY</div>
        <div className="text-xs">FACTORY</div>
      </div>
    ),
    title: "-10% on everything",
    description: null,
    cashback: null,
    buttonText: "Show code",
    sponsored: true
  },
  {
    id: 3,
    logo: <div className="font-bold text-gray-900 text-lg">horze</div>,
    title: "Up to -15% on orders over $100",
    description: null,
    cashback: null,
    buttonText: "Show code",
    sponsored: true
  },
  {
    id: 4,
    logo: (
      <div className="font-serif text-gray-900 text-2xl italic">Kiehl's</div>
    ),
    title: "Welcome Offer ☆ -15% on your 1st order",
    description: null,
    cashback: null,
    buttonText: "Show code",
    sponsored: true
  }
]



export default function Selections() {

  return (
    <div className="flex-1 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Today's selections
          </h1>
          <button className="text-gray-400 hover:text-gray-600">
            <div className="flex items-center gap-1 text-sm">
              <span>Ranking</span>
              <Info size={16} />
            </div>
          </button>
        </div>

        <div className="space-y-4">
          {promos.map((promo) => (
            <PromoCard key={promo.id} {...promo} />
          ))}
        </div>
      </div>
    </div>
  )
}
