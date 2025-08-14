"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Users, Receipt, Wallet } from "lucide-react"

interface DashboardProps {
  onBack: () => void
  onNavigate: (screen: string) => void
}

export default function Dashboard({ onBack, onNavigate }: DashboardProps) {
  // Mock data for demonstration
  const currentBalance = 2450
  const weeklyBudgets = [
    { name: "Food", spent: 320, limit: 500, color: "bg-green-500" },
    { name: "Travel", spent: 180, limit: 300, color: "bg-blue-500" },
    { name: "Entertainment", spent: 90, limit: 200, color: "bg-purple-500" },
    { name: "Shopping", spent: 45, limit: 150, color: "bg-orange-500" },
  ]

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold gradient-text">Dashboard</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-green-500/20 to-green-400/20 border-green-500/30 mb-6">
        <CardContent className="p-6 text-center">
          <p className="text-gray-300 text-sm mb-2">Current Balance</p>
          <p className="text-3xl font-bold gradient-text">₹{currentBalance.toLocaleString()}</p>
          <p className="text-green-400 text-sm mt-2">+₹150 this week</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate("split")}
            className="bg-card hover:bg-card/80 border border-green-500/30 text-white h-16 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-sm">Split Bill</span>
          </Button>

          <Button
            onClick={() => onNavigate("pockets")}
            className="bg-card hover:bg-card/80 border border-green-500/30 text-white h-16 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Wallet className="w-5 h-5 text-green-400" />
            <span className="text-sm">Manage Pockets</span>
          </Button>

          <Button
            onClick={() => onNavigate("transactions")}
            className="bg-card hover:bg-card/80 border border-green-500/30 text-white h-16 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Receipt className="w-5 h-5 text-green-400" />
            <span className="text-sm">Transactions</span>
          </Button>

          <Button
            className="bg-card hover:bg-card/80 border border-green-500/30 text-white h-16 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Plus className="w-5 h-5 text-green-400" />
            <span className="text-sm">Add Money</span>
          </Button>
        </div>
      </div>

      {/* Weekly Pocket Budgets */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">This Week's Pockets</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("pockets")}
            className="text-green-400 hover:text-green-300"
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {weeklyBudgets.map((budget, index) => {
            const percentage = getProgressPercentage(budget.spent, budget.limit)
            const remaining = budget.limit - budget.spent

            return (
              <Card key={index} className="bg-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`}></div>
                      <span className="font-medium text-white">{budget.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      ₹{budget.spent} / ₹{budget.limit}
                    </span>
                  </div>

                  <Progress value={percentage} className="h-2 mb-2" />

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">₹{remaining} remaining</span>
                    <span
                      className={`${percentage >= 90 ? "text-red-400" : percentage >= 75 ? "text-yellow-400" : "text-green-400"}`}
                    >
                      {percentage.toFixed(0)}% used
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("transactions")}
            className="text-green-400 hover:text-green-300"
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Dinner split with friends</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <span className="text-sm text-red-400">-₹120</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Receipt className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Metro recharge</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
            <span className="text-sm text-red-400">-₹50</span>
          </div>
        </div>
      </div>
    </div>
  )
}
