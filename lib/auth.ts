export interface User {
  id: number
  username: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const authService = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Registration failed")
    }

    return response.json()
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Login failed")
    }

    return response.json()
  },

  setToken(token: string) {
    localStorage.setItem("auth_token", token)
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  },

  removeToken() {
    localStorage.removeItem("auth_token")
  },

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user))
  },

  getUser(): User | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  removeUser() {
    localStorage.removeItem("user")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  logout() {
    this.removeToken()
    this.removeUser()
  },
}
