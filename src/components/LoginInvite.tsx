import secureLoginGif from "data-base64:../../assets/login.svg"
import React from "react"
import { Lock, Sparkles, TrendingUp } from "lucide-react"

import { Button } from "./ui/button"

type Props = {}

const handleLogin = () => {
  const width = 500
  const height = 650

  const loginUrl = chrome.runtime.getURL("tabs/login.html")

  const left = Math.round((screen.width - width) / 2)
  const top = Math.round((screen.height - height) / 2)

  chrome.windows.create({
    url: loginUrl,
    type: "popup",
    width: width,
    height: height,
    left: left,
    top: top
  })
}

export default function LoginInvite({}: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg h-full flex flex-col justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
        {/* Icon/Image Container */}
        {/* <div className="relative w-full flex justify-center mb-2">
          <div className="absolute inset-0 bg-purple-200 blur-3xl opacity-30 rounded-full"></div>
          <img 
            src={secureLoginGif} 
            className="w-40 h-40 object-contain relative z-10 drop-shadow-lg" 
            alt="Secure login"
          />
        </div> */}

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Connectez-vous pour débloquer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              toutes les fonctionnalités
            </span>
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            Profitez d'une expérience complète avec des économies automatiques, 
            un suivi personnalisé et bien plus encore.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 w-full mt-2">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">Économies auto</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-purple-100">
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">Suivi en temps réel</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-purple-100">
            <Lock className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">100% sécurisé</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col w-full gap-3 mt-4">
          <Button
            variant="default"
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 text-sm font-semibold rounded-lg w-full hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
            onClick={handleLogin}>
            Se connecter maintenant
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 px-6 py-3 text-sm font-medium rounded-lg w-full hover:bg-purple-50 hover:text-purple-600 transition-all duration-300">
            Pas maintenant
          </Button>
        </div>

        {/* Trust Badge */}
        <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Vos données sont protégées et sécurisées
        </p>
      </div>
    </div>
  )
}