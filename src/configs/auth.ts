export const AUTH_CONFIG = {
  google: {
    client_id: process.env.PLASMO_PUBLICSUPABASE_AUTH_GOOGLE_CLIENT_ID!,
    scopes: ["openid", "email", "profile"]
  },
  apple: {
    client_id: "com.yourapp.service",
    scopes: ["name", "email"]
  }
}

export default AUTH_CONFIG