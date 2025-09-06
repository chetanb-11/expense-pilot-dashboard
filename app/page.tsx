"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Building2, TrendingUp, TrendingDown, PiggyBank, Plus } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  type: "Income" | "Expense"
  amount: number
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 12500,
    totalExpenses: 7200,
    netSavings: 5300,
    recentTransactions: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/expenses")
      if (response.ok) {
        const transactions: Transaction[] = await response.json()

        const income = transactions.filter((t) => t.type === "Income").reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const expenses = transactions
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        setDashboardData({
          totalIncome: income,
          totalExpenses: expenses,
          netSavings: income - expenses,
          recentTransactions: transactions.slice(0, 5),
        })
      } else {
        console.log("API not available, using fallback data")
        // Keep the default fallback data
      }
    } catch (error) {
      console.log("API connection failed, using fallback data:", error)
      // Keep the default fallback data
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">ExpensePilot</span>
          </div>

          <nav className="flex items-center gap-8">
            <a href="#" className="text-blue-600 font-medium">
              Dashboard
            </a>
            <Link href="/transactions" className="text-gray-500 hover:text-gray-700">
              Transactions
            </Link>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Reports
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Budget
            </a>
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

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of your financial activity</p>
          </div>
          <Link href="/transactions/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-gray-600 font-medium">Total Income</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${loading ? "..." : formatAmount(dashboardData.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-gray-600 font-medium">Total Expenses</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${loading ? "..." : formatAmount(dashboardData.totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <PiggyBank className="h-5 w-5 text-blue-500" />
                <span className="text-gray-600 font-medium">Net Savings</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${loading ? "..." : formatAmount(dashboardData.netSavings)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Income vs. Expenses</CardTitle>
              <p className="text-sm text-gray-500">This Month</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-8 h-48">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-green-500 w-16 h-32 rounded-t"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-red-500 w-16 h-24 rounded-t"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Expense Categories</CardTitle>
              <p className="text-sm text-gray-500">This Month</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Housing</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Food</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transportation</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Entertainment</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Utilities</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Transactions</CardTitle>
            <Link href="/transactions/new">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">DATE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">DESCRIPTION</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">CATEGORY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">AMOUNT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">TYPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">2024-03-15</td>
                    <td className="py-3 px-4 text-gray-900">Salary Payment</td>
                    <td className="py-3 px-4 text-gray-600">Income</td>
                    <td className="py-3 px-4 text-green-600 font-medium">+$5,000.00</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Credit
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
