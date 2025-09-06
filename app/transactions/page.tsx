import { TransactionsList } from "@/components/transactions-list"
import Link from "next/link"
import { Building2, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">ExpensePilot</span>
          </div>

          <nav className="flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-blue-600 font-medium">
              Transactions
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Reports
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Budget
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/professional-woman-avatar.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <TransactionsList />
      </main>
    </div>
  )
}
