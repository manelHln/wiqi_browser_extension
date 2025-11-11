import type { User } from "@supabase/supabase-js"
import { signOut as handleLogout, supabase } from "~core/supabase"

type Props = {
  user: User
}

export default function ProfilePage({ user }: Props) {
  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold">Mon Profil</h2>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-sm mb-2">Email</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-sm mb-2">Niveau de fidélité</h3>
          <p className="text-sm font-semibold text-orange-600">Bronze</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-sm mb-2">Paramètres</h3>
          <button className="text-sm text-blue-600 hover:underline">Modifier mes préférences</button>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition mt-6" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </div>
  )
}
