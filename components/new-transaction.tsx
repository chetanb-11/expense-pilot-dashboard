"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus } from "lucide-react"

interface TransactionData {
  type: "expense" | "income"
  amount: number
  category: string
  date: string
  description: string
}

export default function NewTransaction() {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Food & Dining",
    "Housing",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Travel",
    "Education",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !date) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    const transactionData: TransactionData = {
      type: transactionType,
      amount: Number.parseFloat(amount),
      category,
      date,
      description,
    }

    try {
      const response = await fetch("http://localhost:8080/api/trasaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        // Reset form
        setAmount("")
        setCategory("")
        setDate("")
        setDescription("")
        alert("Transaction added successfully!")
      } else {
        throw new Error("Failed to add transaction")
      }
    } catch (error) {
      console.error("Error adding transaction:", error)
      alert("Failed to add transaction. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setAmount("")
    setCategory("")
    setDate("")
    setDescription("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Add Transaction</CardTitle>
          <p className="text-gray-600">Enter the details for your new transaction.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Type</label>
              <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTransactionType("expense")}
                  className={`py-3 px-4 text-sm font-medium transition-colors ${
                    transactionType === "expense" ? "bg-blue-600 text-white" : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("income")}
                  className={`py-3 px-4 text-sm font-medium transition-colors ${
                    transactionType === "income" ? "bg-blue-600 text-white" : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 pr-12 bg-white text-gray-900"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">USD</span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-white text-gray-900">
                  <SelectValue placeholder="Food & Dining" />
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pr-10 bg-white text-gray-900"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <Textarea
                placeholder="Add a note (e.g., Dinner with colleagues)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none bg-white text-gray-900"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
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
