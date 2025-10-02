"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Building2, LogOut } from "lucide-react"
import NewTransaction from "@/components/new-transaction"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { ThemeToggle } from "@/components/theme-toggle"
import { authService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NewTransactionPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push("/login")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-foreground">ExpensePilot</span>
            </div>

            <nav className="flex items-center gap-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/transactions" className="text-blue-600 font-medium">
                Transactions
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Reports
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Budget
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="/professional-woman-avatar.png" />
                    <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "JD"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <NewTransaction />
        </main>
      </div>
    </ProtectedRoute>
  )
}
