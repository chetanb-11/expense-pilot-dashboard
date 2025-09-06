"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronDown } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  type: "Income" | "Expense"
  amount: number
}

const categoryColors: Record<string, string> = {
  Food: "bg-red-100 text-red-800",
  Income: "bg-green-100 text-green-800",
  Housing: "bg-red-100 text-red-800",
  Entertainment: "bg-yellow-100 text-yellow-800",
  Transportation: "bg-blue-100 text-blue-800",
  Utilities: "bg-purple-100 text-purple-800",
  Healthcare: "bg-pink-100 text-pink-800",
  Shopping: "bg-orange-100 text-orange-800",
  Education: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
}

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/api/expenses")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      } else {
        console.error("Failed to fetch transactions")
        setTransactions([
          {
            id: "1",
            date: "Mar 15, 2024",
            description: "Grocery Shopping",
            category: "Food",
            type: "Expense",
            amount: -75.5,
          },
          {
            id: "2",
            date: "Mar 14, 2024",
            description: "Salary Deposit",
            category: "Income",
            type: "Income",
            amount: 3500.0,
          },
          {
            id: "3",
            date: "Mar 12, 2024",
            description: "Rent Payment",
            category: "Housing",
            type: "Expense",
            amount: -1500.0,
          },
          {
            id: "4",
            date: "Mar 10, 2024",
            description: "Dinner with Friends",
            category: "Entertainment",
            type: "Expense",
            amount: -60.0,
          },
          {
            id: "5",
            date: "Mar 8, 2024",
            description: "Freelance Project",
            category: "Income",
            type: "Income",
            amount: 500.0,
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date" />
                <ChevronDown className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
                <ChevronDown className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
                <ChevronDown className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={categoryColors[transaction.category] || categoryColors.Other}>
                      {transaction.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatAmount(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No transactions found</div>
          </div>
        )}
      </Card>
    </div>
  )
}
