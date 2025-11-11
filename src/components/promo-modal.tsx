"use client"

interface PromoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PromoModal({ isOpen, onClose }: PromoModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div className="pointer-events-auto bg-white rounded-3xl max-w-md w-full shadow-2xl transform transition-all">
          <div className="relative bg-gradient-to-br from-emerald-50 to-white p-8 rounded-t-3xl">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Trouvé !
            </h2>
            <p className="text-lg text-gray-600">
              Vous économisez <span className="text-emerald-600 font-bold text-xl">30$</span>
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Prix d'origine</span>
                <span className="font-semibold text-gray-900">100$</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Code promo</span>
                <span className="font-semibold text-emerald-600">-30$</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-gray-900 font-medium">Total panier</span>
                <span className="font-bold text-xl text-gray-900">70$</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900 text-sm">Bonus exclusif</p>
                  <p className="text-sm text-emerald-700">Jusqu'à 15% de cashback chez DemoStore</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-blue-200 mb-2">Code promo :</p>
                <div className="bg-white rounded-xl px-6 py-3 inline-block">
                  <p className="text-2xl font-mono font-bold text-blue-900 tracking-wider">IGRAAL30</p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg">
                Appliquer le code
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 leading-relaxed">
              Faire des économies n'a jamais été aussi simple avec iGraal.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}