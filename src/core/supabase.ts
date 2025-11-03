import { createClient } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"

import AUTH_CONFIG from "~configs/auth"
import { resizeAuthWindowOnCreated } from "~lib/utils"

const storage = new Storage({
  area: "local"
})

export type authError = {
  success: boolean,
  data?: {},
  error?: {}
}

export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL!,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
)

export const handleGoogleLogin = (cb: (result: authError)=> void) => {
  const url = new URL("https://accounts.google.com/o/oauth2/auth")
  // console.log(AUTH_CONFIG.google.client_id)

  // url.searchParams.set("client_id", AUTH_CONFIG.google.client_id)
  url.searchParams.set("client_id", "952218987959-g461t7p98j9q3sv4jsh5o9bob197arvb.apps.googleusercontent.com")
  url.searchParams.set("response_type", "id_token")
  url.searchParams.set("access_type", "offline")
  url.searchParams.set(
    "redirect_uri",
    `https://${chrome.runtime.id}.chromiumapp.org`
  )
  // url.searchParams.set("scope", AUTH_CONFIG.google.scopes.join(" "))
  url.searchParams.set("scope", ["openid", "email", "profile"].join(" "))

  resizeAuthWindowOnCreated(550, 600)

  chrome.identity.launchWebAuthFlow(
    {
      url: url.href,
      interactive: true
    },
    async (redirectedTo) => {
      if (chrome.runtime.lastError) {
        // auth was not successful
        cb({success: false})
      } else {
        // auth was successful, extract the ID token from the redirectedTo URL
        console.log(redirectedTo)
        const url = new URL(redirectedTo)
        const params = new URLSearchParams(url.hash.replace(/^#/, ''))
        console.log(params, url)

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: params.get("id_token")
        })
        console.log(data, error)
        cb({success: true, data: data, error: error})
      }
    }
  )
}

// export const handleGoogleLogin = (cb: (result: authError) => void) => {
//   // Ask Supabase to start its Google OAuth flow
//   const { data, error } = supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: chrome.identity.getRedirectURL(), // Extension redirect
//     },
//   });

//   if (error || !data?.url) {
//     console.error("Failed to start Supabase OAuth flow:", error);
//     cb({ success: false, error });
//     return;
//   }

//   // Open the Supabase OAuth URL in Chrome’s WebAuthFlow
//   resizeAuthWindowOnCreated(550, 600);
//   chrome.identity.launchWebAuthFlow(
//     {
//       url: data.url,
//       interactive: true,
//     },
//     async (redirectedTo) => {
//       if (chrome.runtime.lastError) {
//         console.error("OAuth failed:", chrome.runtime.lastError);
//         cb({ success: false, error: chrome.runtime.lastError });
//         return;
//       }

//       // The user will be redirected back to your redirect URL,
//       // and Supabase will automatically set the session via its redirect handler.
//       console.log("Redirected to:", redirectedTo);

//       // Retrieve the new session from Supabase
//       const { data: session, error: sessionError } =
//         await supabase.auth.getSession();

//       cb({
//         success: !sessionError,
//         data: session,
//         error: sessionError,
//       });
//     }
//   );
// };


export const handleAppleLogin = () => {
  const url = new URL("https://appleid.apple.com/auth/authorize")

  url.searchParams.set("client_id", AUTH_CONFIG.apple.client_id)
  url.searchParams.set("response_type", "code id_token")
  url.searchParams.set("response_mode", "form_post")
  url.searchParams.set(
    "redirect_uri",
    `https://${chrome.runtime.id}.chromiumapp.org`
  )
  url.searchParams.set("scope", AUTH_CONFIG.apple.scopes.join(" "))

  resizeAuthWindowOnCreated(550, 600)

  chrome.identity.launchWebAuthFlow(
    {
      url: url.href,
      interactive: true
    },
    async (redirectedTo) => {
      if (chrome.runtime.lastError) {
        console.error("Auth error:", chrome.runtime.lastError)
        return
      }

      const url = new URL(redirectedTo)
      const params = new URLSearchParams(url.hash.substring(1))

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: params.get("id_token")
      })
    }
  )
}

export type PasswordLogin = {
  email: string
  password: string
}

export const handleLoginWithPassword = async (inputs: PasswordLogin) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: inputs["email"],
    password: inputs["password"]
  })
  return { data, error }
}

export const handleRegisterWithPassword = async (inputs: PasswordLogin) => {
  const { data, error } = await supabase.auth.signUp({
    email: inputs["email"],
    password: inputs["password"]
  })
  return { data, error }
}

export const isAuthenticated = async () => {
  const {data: { session }} = await supabase.auth.getSession()
  console.log(session)
  return !!session
}

export const getCurrentUser = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  console.log(user)
  return user
}

export const signOut = async () => {
  await supabase.auth.signOut()
  await storage.clear() // Clear all stored data
}