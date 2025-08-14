"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Dashboard from "@/components/dashboard"
import SplitFlow from "@/components/split-flow"
import PocketBudgets from "@/components/pocket-budgets"
import TransactionFeed from "@/components/transaction-feed"

type Screen = "landing" | "dashboard" | "split" | "pockets" | "transactions"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [isStarting, setIsStarting] = useState(false)

  const handleGetStarted = () => {
    setIsStarting(true)
    setTimeout(() => {
      setCurrentScreen("dashboard")
      setIsStarting(false)
    }, 1000)
  }

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen)
  }

  const handleBack = () => {
    setCurrentScreen("dashboard")
  }

  const handleBackToLanding = () => {
    setCurrentScreen("landing")
  }

  if (currentScreen === "dashboard") {
    return <Dashboard onBack={handleBackToLanding} onNavigate={handleNavigate} />
  }

  if (currentScreen === "split") {
    return <SplitFlow onBack={handleBack} />
  }

  if (currentScreen === "pockets") {
    return <PocketBudgets onBack={handleBack} />
  }

  if (currentScreen === "transactions") {
    return <TransactionFeed onBack={handleBack} />
  }

  // Landing Screen
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
      {/* Logo Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2">
            ByteBudget
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-300 mx-auto rounded-full"></div>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          Smart money management for students. Split bills, track spending, save smarter.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-400 text-xl">💰</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Smart Splits</h3>
          <p className="text-gray-500 text-sm">Split bills instantly with friends</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-400 text-xl">📊</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Pocket Budgets</h3>
          <p className="text-gray-500 text-sm">Set weekly spending limits</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-400 text-xl">⚡</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Quick Payments</h3>
          <p className="text-gray-500 text-sm">UPI & WhatsApp integration</p>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleGetStarted}
        disabled={isStarting}
        className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-semibold px-8 py-3 rounded-full text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
      >
        {isStarting ? "Starting..." : "Get Started"}
      </Button>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 text-sm">Made for students, by students 🎓</p>
      </div>
    </div>
  )
}
