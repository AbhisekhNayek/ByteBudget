"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Edit, Trash2, Wallet, TrendingUp, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface PocketBudgetsProps {
  onBack: () => void
}

interface Pocket {
  id: string
  name: string
  spent: number
  limit: number
  color: string
  icon: string
}

type View = "list" | "create" | "edit"

export default function PocketBudgets({ onBack }: PocketBudgetsProps) {
  const [currentView, setCurrentView] = useState<View>("list")
  const [editingPocket, setEditingPocket] = useState<Pocket | null>(null)

  // Mock data for demonstration
  const [pockets, setPockets] = useState<Pocket[]>([
    { id: "1", name: "Food", spent: 320, limit: 500, color: "bg-green-500", icon: "🍕" },
    { id: "2", name: "Travel", spent: 180, limit: 300, color: "bg-blue-500", icon: "🚌" },
    { id: "3", name: "Entertainment", spent: 90, limit: 200, color: "bg-purple-500", icon: "🎬" },
    { id: "4", name: "Shopping", spent: 45, limit: 150, color: "bg-orange-500", icon: "🛍️" },
  ])

  const [newPocket, setNewPocket] = useState({
    name: "",
    limit: "",
    color: "bg-green-500",
    icon: "💰",
  })

  const predefinedPockets = [
    { name: "Food", icon: "🍕", color: "bg-green-500" },
    { name: "Travel", icon: "🚌", color: "bg-blue-500" },
    { name: "Entertainment", icon: "🎬", color: "bg-purple-500" },
    { name: "Shopping", icon: "🛍️", color: "bg-orange-500" },
    { name: "Books", icon: "📚", color: "bg-indigo-500" },
    { name: "Coffee", icon: "☕", color: "bg-amber-500" },
    { name: "Gym", icon: "💪", color: "bg-red-500" },
    { name: "Miscellaneous", icon: "💰", color: "bg-gray-500" },
  ]

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="w-4 h-4 text-red-400" />
    if (percentage >= 75) return <TrendingUp className="w-4 h-4 text-yellow-400" />
    return <TrendingUp className="w-4 h-4 text-green-400" />
  }

  const handleCreatePocket = () => {
    if (newPocket.name.trim() && newPocket.limit) {
      const pocket: Pocket = {
        id: Date.now().toString(),
        name: newPocket.name.trim(),
        spent: 0,
        limit: Number.parseFloat(newPocket.limit),
        color: newPocket.color,
        icon: newPocket.icon,
      }
      setPockets([...pockets, pocket])
      setNewPocket({ name: "", limit: "", color: "bg-green-500", icon: "💰" })
      setCurrentView("list")
    }
  }

  const handleEditPocket = (pocket: Pocket) => {
    setEditingPocket(pocket)
    setNewPocket({
      name: pocket.name,
      limit: pocket.limit.toString(),
      color: pocket.color,
      icon: pocket.icon,
    })
    setCurrentView("edit")
  }

  const handleUpdatePocket = () => {
    if (editingPocket && newPocket.name.trim() && newPocket.limit) {
      setPockets(
        pockets.map((p) =>
          p.id === editingPocket.id
            ? {
                ...p,
                name: newPocket.name.trim(),
                limit: Number.parseFloat(newPocket.limit),
                color: newPocket.color,
                icon: newPocket.icon,
              }
            : p,
        ),
      )
      setEditingPocket(null)
      setNewPocket({ name: "", limit: "", color: "bg-green-500", icon: "💰" })
      setCurrentView("list")
    }
  }

  const handleDeletePocket = (id: string) => {
    setPockets(pockets.filter((p) => p.id !== id))
  }

  const selectPredefinedPocket = (predefined: (typeof predefinedPockets)[0]) => {
    setNewPocket({
      ...newPocket,
      name: predefined.name,
      color: predefined.color,
      icon: predefined.icon,
    })
  }

  const totalSpent = pockets.reduce((sum, pocket) => sum + pocket.spent, 0)
  const totalBudget = pockets.reduce((sum, pocket) => sum + pocket.limit, 0)

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold gradient-text">Pocket Budgets</h1>
        {currentView === "list" && (
          <Button
            size="sm"
            onClick={() => setCurrentView("create")}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
        {currentView !== "list" && <div className="w-16"></div>}
      </div>

      {/* List View */}
      {currentView === "list" && (
        <>
          {/* Overview Card */}
          <Card className="bg-gradient-to-r from-green-500/20 to-green-400/20 border-green-500/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Weekly Overview</h3>
                    <p className="text-sm text-gray-300">Total across all pockets</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300">Spent</p>
                  <p className="text-2xl font-bold text-white">₹{totalSpent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Budget</p>
                  <p className="text-2xl font-bold text-green-400">₹{totalBudget}</p>
                </div>
              </div>

              <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="h-2 mt-4" />
              <p className="text-xs text-gray-400 mt-2">₹{totalBudget - totalSpent} remaining this week</p>
            </CardContent>
          </Card>

          {/* Pockets List */}
          <div className="space-y-4">
            {pockets.map((pocket) => {
              const percentage = getProgressPercentage(pocket.spent, pocket.limit)
              const remaining = pocket.limit - pocket.spent

              return (
                <Card key={pocket.id} className="bg-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${pocket.color}/20 rounded-full flex items-center justify-center`}>
                          <span className="text-lg">{pocket.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{pocket.name}</h3>
                          <p className="text-sm text-gray-400">
                            ₹{pocket.spent} / ₹{pocket.limit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(percentage)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPocket(pocket)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Progress value={percentage} className="h-2 mb-2" />

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">₹{remaining} remaining</span>
                      <span
                        className={`${
                          percentage >= 90 ? "text-red-400" : percentage >= 75 ? "text-yellow-400" : "text-green-400"
                        }`}
                      >
                        {percentage.toFixed(0)}% used
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {pockets.length === 0 && (
              <Card className="bg-card border-gray-800">
                <CardContent className="p-8 text-center">
                  <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No pockets yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Create your first pocket to start budgeting</p>
                  <Button
                    onClick={() => setCurrentView("create")}
                    className="bg-green-500 hover:bg-green-600 text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pocket
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Create/Edit View */}
      {(currentView === "create" || currentView === "edit") && (
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Plus className="w-5 h-5 text-green-400" />
              {currentView === "create" ? "Create New Pocket" : "Edit Pocket"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Select */}
            {currentView === "create" && (
              <div>
                <Label className="text-gray-300 mb-3 block">Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {predefinedPockets.map((predefined, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => selectPredefinedPocket(predefined)}
                      className={`h-16 flex flex-col items-center justify-center gap-1 border-gray-700 hover:bg-gray-800 ${
                        newPocket.name === predefined.name ? "border-green-500 bg-green-500/10" : ""
                      }`}
                    >
                      <span className="text-lg">{predefined.icon}</span>
                      <span className="text-xs">{predefined.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Name */}
            <div>
              <Label htmlFor="pocketName" className="text-gray-300">
                Pocket Name
              </Label>
              <Input
                id="pocketName"
                value={newPocket.name}
                onChange={(e) => setNewPocket({ ...newPocket, name: e.target.value })}
                placeholder="e.g., Food, Travel, Entertainment"
                className="bg-gray-900 border-gray-700 text-white mt-2"
              />
            </div>

            {/* Weekly Limit */}
            <div>
              <Label htmlFor="weeklyLimit" className="text-gray-300">
                Weekly Limit
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <Input
                  id="weeklyLimit"
                  type="number"
                  value={newPocket.limit}
                  onChange={(e) => setNewPocket({ ...newPocket, limit: e.target.value })}
                  placeholder="500"
                  className="bg-gray-900 border-gray-700 text-white pl-8"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Set a realistic weekly spending limit for this category</p>
            </div>

            {/* Color Selection */}
            <div>
              <Label className="text-gray-300 mb-3 block">Color</Label>
              <div className="flex gap-2">
                {[
                  "bg-green-500",
                  "bg-blue-500",
                  "bg-purple-500",
                  "bg-orange-500",
                  "bg-red-500",
                  "bg-indigo-500",
                  "bg-amber-500",
                  "bg-gray-500",
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewPocket({ ...newPocket, color })}
                    className={`w-8 h-8 rounded-full ${color} ${
                      newPocket.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            {newPocket.name && newPocket.limit && (
              <div className="p-4 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${newPocket.color}/20 rounded-full flex items-center justify-center`}>
                    <span className="text-lg">{newPocket.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{newPocket.name}</h3>
                    <p className="text-sm text-gray-400">₹0 / ₹{newPocket.limit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentView("list")
                  setEditingPocket(null)
                  setNewPocket({ name: "", limit: "", color: "bg-green-500", icon: "💰" })
                }}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>

              {currentView === "edit" && (
                <Button
                  variant="outline"
                  onClick={() => editingPocket && handleDeletePocket(editingPocket.id)}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <Button
                onClick={currentView === "create" ? handleCreatePocket : handleUpdatePocket}
                disabled={!newPocket.name.trim() || !newPocket.limit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black disabled:opacity-50"
              >
                {currentView === "create" ? "Create Pocket" : "Update Pocket"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
