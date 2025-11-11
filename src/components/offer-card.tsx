interface OfferCardProps {
  logo?: string
  offer: string
  description: string
  expires: string
  image: string
}

export default function OfferCard({ logo, offer, description, expires, image }: OfferCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative h-40 bg-gray-100">
        <img src={image || "/placeholder.svg"} alt={offer} className="w-full h-full object-cover" />
      </div>

      {logo && (
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="font-bold text-xs text-gray-700">{logo}</p>
        </div>
      )}

      <div className="px-4 py-3">
        <p className="font-bold text-sm text-orange-600">{offer}</p>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-2">{expires}</p>
      </div>
    </div>
  )
}
