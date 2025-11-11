import React from 'react';

// Reusable Site Card Component
const SiteCard = ({ 
  logo, 
  siteName, 
  cashbackRate, 
  description, 
  expiryTime, 
  isSponsored, 
  isBoostOfDay, 
  image 
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
      {/* Image Section */}
      <div className="relative h-36 bg-gray-900">
        <img 
          src={image} 
          alt={siteName}
          className="w-full h-full object-cover"
        />
        {isBoostOfDay && (
          <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <span>⚡</span>
            <span>BOOST DU JOUR</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="flex-shrink-0 w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={logo} 
              alt={`${siteName} logo`}
              className="w-8 h-8 object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base">{siteName}</h3>
              <div className="flex items-center gap-1 text-orange-500 flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span className="font-bold text-lg">{cashbackRate}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span>Expire dans {expiryTime}</span>
              </div>
              {isSponsored && (
                <>
                  <span>•</span>
                  <span>Sponsorisée</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const sites = [
    {
      id: 1,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sephora_logo.svg/320px-Sephora_logo.svg.png',
      siteName: 'SEPHORA',
      cashbackRate: '20% of cashback',
      description: 'au lieu de 1,75% pendant 24h',
      expiryTime: '04:25:57',
      isSponsored: true,
      isBoostOfDay: true,
      image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80'
    },
    {
      id: 2,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/320px-Adidas_Logo.svg.png',
      siteName: 'Adidas',
      cashbackRate: '15% de cashback',
      description: 'au lieu de 4% pendant 24h',
      expiryTime: '06:15:32',
      isSponsored: false,
      isBoostOfDay: false,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80'
    },
    {
      id: 3,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/320px-Logo_NIKE.svg.png',
      siteName: 'Nike',
      cashbackRate: '12% de cashback',
      description: 'au lieu de 3% pendant 48h',
      expiryTime: '1j 02:30:15',
      isSponsored: true,
      isBoostOfDay: false,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    },
    {
      id: 4,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/320px-H%26M-Logo.svg.png',
      siteName: 'H&M',
      cashbackRate: '10% de cashback',
      description: 'au lieu de 2,5% pendant 24h',
      expiryTime: '08:45:20',
      isSponsored: false,
      isBoostOfDay: false,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'
    },
    {
      id: 5,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/320px-Zara_Logo.svg.png',
      siteName: 'ZARA',
      cashbackRate: '8% de cashback',
      description: 'au lieu de 2% pendant 12h',
      expiryTime: '03:20:45',
      isSponsored: false,
      isBoostOfDay: false,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
    }
  ];

const CashbackApp = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-secondary px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-lg font-normal mb-1">Hello Emmanuel,</h1>
            <h2 className="text-white text-2xl font-bold">Today's Selection</h2>
          </div>
          <button className="text-white flex items-center gap-1 text-sm font-medium">
            Ranking
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Sites List */}
      <div className="px-4 pb-6 mt-[-20px] max-w-2xl mx-auto">
        {sites.map(site => (
          <SiteCard key={site.id} {...site} />
        ))}
      </div>
    </div>
  );
};

export default CashbackApp;