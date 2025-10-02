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
import {
  Search,
  Trash2,
  Plus,
  Edit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  type: "Income" | "Expense"
  amount: number
}

const categoryColors: Record<string, string> = {
  Food: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Income: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Housing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Entertainment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Transportation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Utilities: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Healthcare: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Shopping: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Education: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

type SortField = "date" | "amount" | "description"
type SortOrder = "asc" | "desc" | null

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    type: "Expense" as "Income" | "Expense",
    amount: "",
    date: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchTransactions()
  }, [typeFilter, categoryFilter, startDate, endDate, searchTerm, sortField, sortOrder, currentPage, itemsPerPage])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (searchTerm) params.append("description", searchTerm)
      if (sortField) params.append("sortField", sortField)
      if (sortOrder) params.append("sortOrder", sortOrder)

      const token = authService.getToken()
      console.log("[DEBUG] Token used for fetch:", token)
      const url = `${API_URL}/api/expenses?${params.toString()}`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      } else {
        console.error("Failed to fetch transactions")
        setTransactions([])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = transactions.slice(startIndex, endIndex)

  // Fix: Define sortedTransactions for UI usage
  const sortedTransactions = paginatedTransactions

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "desc") {
        setSortOrder("asc")
      } else if (sortOrder === "asc") {
        setSortOrder(null)
        setSortField("date")
      }
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || !sortOrder) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 text-blue-600" />
    )
  }

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return amount >= 0 ? `+₹${formatted}` : `-₹${formatted}`
  }

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return
    }

    try {
      setIsDeleting(id)
      const token = authService.getToken()
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTransactions(transactions.filter((t) => t.id !== id))
      } else {
        throw new Error("Failed to delete transaction")
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      alert("Failed to delete transaction. Please try again.")
    } finally {
      setIsDeleting(null)
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
      setIsUpdating(true)
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

      const token = authService.getToken()
      const response = await fetch(`${API_URL}/api/expenses/${editingTransaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransaction),
      })

      if (response.ok) {
        const savedTransaction = await response.json()
        setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? savedTransaction : t)))
        setIsEditDialogOpen(false)
        setEditingTransaction(null)
      } else {
        throw new Error("Failed to update transaction")
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
      alert("Failed to update transaction. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStartDate("")
    setEndDate("")
    setCategoryFilter("all")
    setTypeFilter("all")
    setSortField("date")
    setSortOrder("desc")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedTransactions.length)} of {sortedTransactions.length}{" "}
            transactions
          </p>
        </div>
        <Link href="/transactions/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
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
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-date" className="text-sm text-muted-foreground mb-1">
                  From Date
                </Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-sm text-muted-foreground mb-1">
                  To Date
                </Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap bg-transparent">
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Date
                    {getSortIcon("date")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("description")}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Description
                    {getSortIcon("description")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center ml-auto hover:text-foreground transition-colors"
                  >
                    Amount
                    {getSortIcon("amount")}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={categoryColors[transaction.category] || categoryColors.Other}>
                      {transaction.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.type}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
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
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        disabled={isDeleting === transaction.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={isDeleting === transaction.id}
                      >
                        {isDeleting === transaction.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {transactions.length === 0 ? "No transactions found" : "No transactions match your filters"}
            </div>
            {transactions.length > 0 && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            )}
          </div>
        )}

        {sortedTransactions.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
              <Label htmlFor="edit-type" className="text-sm font-medium text-foreground">
                Type
              </Label>
              <div className="flex mt-1">
                <Button
                  type="button"
                  variant={editForm.type === "Expense" ? "default" : "outline"}
                  className={`flex-1 mr-1 ${
                    editForm.type === "Expense"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setEditForm({ ...editForm, type: "Expense" })}
                  disabled={isUpdating}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={editForm.type === "Income" ? "default" : "outline"}
                  className={`flex-1 ml-1 ${
                    editForm.type === "Income"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setEditForm({ ...editForm, type: "Income" })}
                  disabled={isUpdating}
                >
                  Income
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-amount" className="text-sm font-medium text-foreground">
                Amount
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="pl-8 pr-12"
                  placeholder="0.00"
                  disabled={isUpdating}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">INR</span>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium text-foreground">
                Category
              </Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                disabled={isUpdating}
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
              <Label htmlFor="edit-date" className="text-sm font-medium text-foreground">
                Date
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="mt-1"
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Add a note (e.g., Dinner with colleagues)"
                className="mt-1"
                rows={3}
                disabled={isUpdating}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={updateTransaction}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Transaction"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
