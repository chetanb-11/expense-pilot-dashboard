"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Building2, TrendingUp, TrendingDown, PiggyBank, Plus, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { authService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  type: "Income" | "Expense"
  amount: number
}

interface CategoryData {
  name: string
  amount: number
  percentage: number
}

interface DashboardData {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  recentTransactions: Transaction[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalIncome: 12500,
    totalExpenses: 7200,
    netSavings: 5300,
    recentTransactions: [],
  })
  const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
    if (!currentUser) {
      router.push("/login")
      return
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = authService.getToken()
      console.log("[DEBUG] Dashboard token:", token)
      if (!token) {
        router.push("/login")
        return
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 401) {
        authService.removeToken()
        router.push("/login")
        return
      }
      if (response.ok) {
        const transactions: Transaction[] = await response.json()

        const income = transactions.filter((t) => t.type === "Income").reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const expenses = transactions
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const expenseTransactions = transactions.filter((t) => t.type === "Expense")
        const categoryTotals: { [key: string]: number } = {}

        expenseTransactions.forEach((transaction) => {
          const category = transaction.category
          categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.amount)
        })

        const totalExpenseAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

        const categoriesData: CategoryData[] = Object.entries(categoryTotals)
          .map(([name, amount]) => ({
            name,
            amount,
            percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0,
          }))
          .sort((a, b) => b.amount - a.amount)

        setExpenseCategories(categoriesData)

        setDashboardData({
          totalIncome: income,
          totalExpenses: expenses,
          netSavings: income - expenses,
          recentTransactions: transactions.slice(0, 5),
        })
      } else {
        console.error("API not available, using fallback data")
        setDashboardData({
          totalIncome: 12500,
          totalExpenses: 7200,
          netSavings: 5300,
          recentTransactions: [],
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setDashboardData({
        totalIncome: 12500,
        totalExpenses: 7200,
        netSavings: 5300,
        recentTransactions: [],
      })
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

  const handleLogout = () => {
    authService.logout()
    router.push("/login")
  }

  const incomeVsExpenseData = [
    { name: "Income", value: dashboardData.totalIncome, fill: "#10b981" },
    { name: "Expenses", value: dashboardData.totalExpenses, fill: "#ef4444" },
  ]

  const pieChartData = expenseCategories.map((cat, index) => ({
    name: cat.name,
    value: cat.amount,
    fill: COLORS[index % COLORS.length],
  }))

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
              <a href="#" className="text-blue-600 font-medium">
                Dashboard
              </a>
              <Link href="/transactions" className="text-muted-foreground hover:text-foreground">
                Transactions
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Reports
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Budget
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/professional-woman-avatar.png" />
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "JD"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          {/* Page Title */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your financial activity</p>
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
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-muted-foreground font-medium">Total Income</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  ₹{loading ? "..." : formatAmount(dashboardData.totalIncome)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-muted-foreground font-medium">Total Expenses</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  ₹{loading ? "..." : formatAmount(dashboardData.totalExpenses)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-muted-foreground font-medium">Net Savings</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  ₹{loading ? "..." : formatAmount(dashboardData.netSavings)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income vs Expenses Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Income vs. Expenses</CardTitle>
                <p className="text-sm text-muted-foreground">This Month</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground">Loading chart...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incomeVsExpenseData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => `₹${formatAmount(value)}`}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Expense Categories Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Expense Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">By Category</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground">Loading chart...</div>
                  </div>
                ) : expenseCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => `₹${formatAmount(value)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground">No expense data available</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Category Details</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed breakdown of expenses</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-muted-foreground">Loading categories...</div>
                ) : expenseCategories.length > 0 ? (
                  expenseCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-foreground min-w-0 flex-shrink-0">
                          {category.name}
                        </span>
                        <div className="flex-1 mx-4">
                          <div className="bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(category.percentage, 100)}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground min-w-0 flex-shrink-0">
                          {category.percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm font-medium text-foreground min-w-0 flex-shrink-0">
                          ₹{formatAmount(category.amount)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">No expense categories found</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Recent Transactions</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Your latest financial activities</p>
              </div>
              <div className="flex gap-2">
                <Link href="/transactions">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
                <Link href="/transactions/new">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Transaction
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">DATE</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">DESCRIPTION</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CATEGORY</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">AMOUNT</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          Loading transactions...
                        </td>
                      </tr>
                    ) : dashboardData.recentTransactions.length > 0 ? (
                      dashboardData.recentTransactions.map((transaction: Transaction) => (
                        <tr key={transaction.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-foreground">{transaction.description}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.category === "Food"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                  : transaction.category === "Housing"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : transaction.category === "Transportation"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                      : transaction.category === "Entertainment"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : transaction.category === "Income"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                          : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {transaction.category}
                            </span>
                          </td>
                          <td
                            className={`py-3 px-4 font-medium ${
                              transaction.type === "Income"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {transaction.type === "Income" ? "+" : "-"}₹{formatAmount(Math.abs(transaction.amount))}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === "Income"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {transaction.type === "Income" ? "Credit" : "Debit"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No recent transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
