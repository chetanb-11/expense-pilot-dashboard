"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, ChevronDown, Trash2, Plus, Edit } from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    type: "Expense" as "Income" | "Expense",
    amount: "",
    date: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [typeFilter, categoryFilter])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== "all") {
        params.append("type", typeFilter)
      }
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter)
      }

      const url = `http://localhost:8080/api/expenses${params.toString() ? `?${params.toString()}` : ""}`
      // const url = `https://expensepilot.onrender.com/api/expenses${params.toString() ? `?${params.toString()}` : ""}`
      const response = await fetch(url)

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

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/expense/${id}`, {
      // const response = await fetch(`https://expensepilot.onrender.com/api/expense/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTransactions(transactions.filter((t) => t.id !== id))
        alert("Transaction deleted successfully!")
      } else {
        throw new Error("Failed to delete transaction")
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      alert("Failed to delete transaction. Please try again.")
    }
  }

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setEditForm({
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      amount: Math.abs(transaction.amount).toString(),
      date: transaction.date,
    })
    setIsEditDialogOpen(true)
  }

  const updateTransaction = async () => {
    if (!editingTransaction) return

    try {
      const updatedTransaction = {
        id: editingTransaction.id,
        description: editForm.description,
        category: editForm.category,
        type: editForm.type,
        amount:
          editForm.type === "Expense"
            ? -Math.abs(Number.parseFloat(editForm.amount))
            : Math.abs(Number.parseFloat(editForm.amount)),
        date: editForm.date,
      }

      const response = await fetch(`http://localhost:8080/api/expense/${editingTransaction.id}`, {
      // const response = await fetch(`https://expensepilot.onrender.com/api/expense/${editingTransaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      })

      if (response.ok) {
        const savedTransaction = await response.json()
        setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? savedTransaction : t)))
        setIsEditDialogOpen(false)
        setEditingTransaction(null)
        alert("Transaction updated successfully!")
      } else {
        throw new Error("Failed to update transaction")
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
      alert("Failed to update transaction. Please try again.")
    }
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <Link href="/transactions/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </Link>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(transaction)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-type" className="text-sm font-medium text-gray-900">
                Type
              </Label>
              <div className="flex mt-1">
                <Button
                  type="button"
                  variant={editForm.type === "Expense" ? "default" : "outline"}
                  className={`flex-1 mr-1 ${
                    editForm.type === "Expense"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setEditForm({ ...editForm, type: "Expense" })}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={editForm.type === "Income" ? "default" : "outline"}
                  className={`flex-1 ml-1 ${
                    editForm.type === "Income"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setEditForm({ ...editForm, type: "Income" })}
                >
                  Income
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-amount" className="text-sm font-medium text-gray-900">
                Amount
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="pl-8 pr-12"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">USD</span>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium text-gray-900">
                Category
              </Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food & Dining</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-date" className="text-sm font-medium text-gray-900">
                Date
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-900">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Add a note (e.g., Dinner with colleagues)"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={updateTransaction}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
