"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

interface TransactionData {
  type: "Expense" | "Income"
  amount: number
  category: string
  date: string
  description: string
}

export default function NewTransaction() {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState<"Expense" | "Income">("Expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const expenseCategories = [
    "Food & Dining",
    "Housing",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Travel",
    "Education",
  ]

  const incomeCategories = ["Salary", "Business", "Investment", "Gift", "Other Income"]

  const categories = transactionType === "Expense" ? expenseCategories : incomeCategories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !date) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    const transactionData: TransactionData = {
      type: transactionType,
      amount: transactionType === "Expense" ? -Number.parseFloat(amount) : Number.parseFloat(amount),
      category,
      date,
      description,
    }

    try {
      const token = authService.getToken()
      console.log('Token used for Authorization:', token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      })
      console.log('Add expense response status:', response.status)
      let responseBody = null
      try { responseBody = await response.json() } catch {}
      console.log('Add expense response body:', responseBody)
      if (response.ok) {
        setAmount("")
        setCategory("")
        setDate("")
        setDescription("")
        alert("Transaction added successfully!")
        router.push("/transactions")
      } else {
        alert(`Failed to add transaction: ${responseBody?.message || response.statusText}`)
      }
    } catch (error) {
      alert("Error adding transaction. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/transactions")
  }

  const handleTypeChange = (type: "Expense" | "Income") => {
    setTransactionType(type)
    setCategory("")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Add Transaction</CardTitle>
          <p className="text-muted-foreground">Enter the details for your new transaction.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Type</label>
              <div className="grid grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleTypeChange("Expense")}
                  className={`py-3 px-4 text-sm font-medium transition-colors ${
                    transactionType === "Expense" ? "bg-blue-600 text-white" : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("Income")}
                  className={`py-3 px-4 text-sm font-medium transition-colors ${
                    transactionType === "Income" ? "bg-blue-600 text-white" : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 pr-12 bg-card text-foreground"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  INR
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-card text-foreground">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pr-10 bg-card text-foreground"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Textarea
                placeholder="Add a note (e.g., Dinner with colleagues)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none bg-card text-foreground"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-card text-foreground border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? "Adding..." : "Add Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
