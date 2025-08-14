"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Users, Receipt, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import { useState } from "react"

interface TransactionFeedProps {
  onBack: () => void
}

interface Transaction {
  id: string
  type: "split" | "payment" | "savings" | "expense" | "income"
  title: string
  description: string
  amount: number
  date: Date
  status: "completed" | "pending" | "failed"
  category?: string
  participants?: string[]
  icon: string
  color: string
}

type FilterType = "all" | "split" | "payment" | "savings" | "expense" | "income"
type SortType = "date" | "amount"

export default function TransactionFeed({ onBack }: TransactionFeedProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [sortType, setSortType] = useState<SortType>("date")
  const [showFilters, setShowFilters] = useState(false)

  // Mock transaction data
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "split",
      title: "Dinner at Pizza Hut",
      description: "Split with 3 friends",
      amount: -120,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "completed",
      category: "Food",
      participants: ["You", "Rahul", "Priya", "Amit"],
      icon: "🍕",
      color: "bg-orange-500",
    },
    {
      id: "2",
      type: "payment",
      title: "Received from Rahul",
      description: "Pizza split payment",
      amount: 120,
      date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: "completed",
      icon: "💰",
      color: "bg-green-500",
    },
    {
      id: "3",
      type: "expense",
      title: "Metro recharge",
      description: "Travel card top-up",
      amount: -50,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      status: "completed",
      category: "Travel",
      icon: "🚇",
      color: "bg-blue-500",
    },
    {
      id: "4",
      type: "savings",
      title: "Auto-save",
      description: "Weekly micro-savings",
      amount: -25,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      status: "completed",
      icon: "🐷",
      color: "bg-pink-500",
    },
    {
      id: "5",
      type: "split",
      title: "Movie tickets",
      description: "Split with 2 friends",
      amount: -200,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "pending",
      category: "Entertainment",
      participants: ["You", "Sarah", "Mike"],
      icon: "🎬",
      color: "bg-purple-500",
    },
    {
      id: "6",
      type: "income",
      title: "Freelance payment",
      description: "Website design project",
      amount: 2500,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "completed",
      icon: "💻",
      color: "bg-indigo-500",
    },
    {
      id: "7",
      type: "expense",
      title: "Coffee & snacks",
      description: "Study session fuel",
      amount: -85,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "completed",
      category: "Food",
      icon: "☕",
      color: "bg-amber-500",
    },
    {
      id: "8",
      type: "split",
      title: "Uber ride",
      description: "Split with roommate",
      amount: -75,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      status: "completed",
      category: "Travel",
      participants: ["You", "Alex"],
      icon: "🚗",
      color: "bg-gray-500",
    },
  ])

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />
      default:
        return null
    }
  }

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filterType !== "all" && transaction.type !== filterType) return false
      if (searchQuery && !transaction.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortType === "date") {
        return b.date.getTime() - a.date.getTime()
      }
      return Math.abs(b.amount) - Math.abs(a.amount)
    })

  const filterOptions = [
    { value: "all", label: "All", icon: "📊" },
    { value: "split", label: "Splits", icon: "👥" },
    { value: "payment", label: "Payments", icon: "💰" },
    { value: "savings", label: "Savings", icon: "🐷" },
    { value: "expense", label: "Expenses", icon: "💸" },
    { value: "income", label: "Income", icon: "💵" },
  ]

  const totalIncome = transactions
    .filter((t) => t.amount > 0 && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.amount < 0 && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold gradient-text">Transactions</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-400 hover:text-white"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownLeft className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Income</span>
            </div>
            <p className="text-xl font-bold text-green-400">₹{totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-300">Expenses</span>
            </div>
            <p className="text-xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="bg-gray-900 border-gray-700 text-white pl-10"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="bg-card border-gray-800 mb-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Filter Type */}
              <div>
                <p className="text-sm text-gray-300 mb-2">Filter by type:</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterType(option.value as FilterType)}
                      className={`border-gray-700 text-xs ${
                        filterType === option.value
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <span className="mr-1">{option.icon}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-sm text-gray-300 mb-2">Sort by:</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortType("date")}
                    className={`border-gray-700 text-xs ${
                      sortType === "date"
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Date
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortType("amount")}
                    className={`border-gray-700 text-xs ${
                      sortType === "amount"
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Amount
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="bg-card border-gray-800">
            <CardContent className="p-8 text-center">
              <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No transactions found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="bg-card border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 ${transaction.color}/20 rounded-full flex items-center justify-center`}>
                      <span className="text-lg">{transaction.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white truncate">{transaction.title}</h3>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{transaction.description}</p>

                      {transaction.participants && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {transaction.participants.slice(0, 2).join(", ")}
                            {transaction.participants.length > 2 && ` +${transaction.participants.length - 2} more`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-3">
                    <p
                      className={`font-semibold ${
                        transaction.amount > 0 ? "text-green-400" : "text-red-400"
                      } ${transaction.status !== "completed" ? "opacity-60" : ""}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-xs text-gray-500">{getTimeAgo(transaction.date)}</p>
                      <span className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status === "completed" ? "✓" : transaction.status === "pending" ? "⏳" : "✗"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
            Load More Transactions
          </Button>
        </div>
      )}
    </div>
  )
}
