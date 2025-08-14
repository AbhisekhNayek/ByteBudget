"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, X, Users, Calculator, Share2, MessageCircle } from "lucide-react"
import { useState } from "react"

interface SplitFlowProps {
  onBack: () => void
}

interface Member {
  id: string
  name: string
  phone?: string
}

type Step = "group" | "members" | "amount" | "summary" | "share"

export default function SplitFlow({ onBack }: SplitFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>("group")
  const [groupName, setGroupName] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [newMemberName, setNewMemberName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [description, setDescription] = useState("")

  const addMember = () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
      }
      setMembers([...members, newMember])
      setNewMemberName("")
    }
  }

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  const calculatePerPerson = () => {
    const amount = Number.parseFloat(totalAmount)
    const totalPeople = members.length + 1 // +1 for the user
    return totalPeople > 0 ? (amount / totalPeople).toFixed(2) : "0.00"
  }

  const handleNext = () => {
    switch (currentStep) {
      case "group":
        if (groupName.trim()) setCurrentStep("members")
        break
      case "members":
        if (members.length > 0) setCurrentStep("amount")
        break
      case "amount":
        if (totalAmount && description) setCurrentStep("summary")
        break
      case "summary":
        setCurrentStep("share")
        break
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "group":
        return groupName.trim().length > 0
      case "members":
        return members.length > 0
      case "amount":
        return totalAmount && description && Number.parseFloat(totalAmount) > 0
      case "summary":
        return true
      default:
        return false
    }
  }

  const renderStepIndicator = () => {
    const steps = ["group", "members", "amount", "summary", "share"]
    const currentIndex = steps.indexOf(currentStep)

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                index <= currentIndex ? "bg-green-500 text-black" : "bg-gray-700 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${index < currentIndex ? "bg-green-500" : "bg-gray-700"}`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold gradient-text">Split Bill</h1>
        <div className="w-16"></div>
      </div>

      {renderStepIndicator()}

      {/* Step 1: Create Group */}
      {currentStep === "group" && (
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-green-400" />
              Create Group
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="groupName" className="text-gray-300">
                Group Name
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Dinner at Pizza Hut"
                className="bg-gray-900 border-gray-700 text-white mt-2"
              />
            </div>
            <p className="text-sm text-gray-400">Give your group a memorable name to keep track of this expense.</p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Members */}
      {currentStep === "members" && (
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Plus className="w-5 h-5 text-green-400" />
              Add Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter friend's name"
                className="bg-gray-900 border-gray-700 text-white"
                onKeyPress={(e) => e.key === "Enter" && addMember()}
              />
              <Button onClick={addMember} size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Group Members ({members.length + 1} total):</p>

                {/* User (always included) */}
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-white">You</span>
                  <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">Host</span>
                </div>

                {/* Added members */}
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-white">{member.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-400">Add friends who shared this expense. You can add more later.</p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Enter Amount */}
      {currentStep === "amount" && (
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-green-400" />
              Enter Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-gray-300">
                What's this for?
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Dinner, Movie tickets, Uber ride"
                className="bg-gray-900 border-gray-700 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Total Amount
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <Input
                  id="amount"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-gray-900 border-gray-700 text-white pl-8"
                />
              </div>
            </div>

            {totalAmount && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-gray-300 mb-1">Split equally among {members.length + 1} people:</p>
                <p className="text-2xl font-bold text-green-400">₹{calculatePerPerson()} per person</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Summary */}
      {currentStep === "summary" && (
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-green-400" />
              Split Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-1">{groupName}</h3>
              <p className="text-gray-300 mb-2">{description}</p>
              <p className="text-3xl font-bold text-green-400">₹{totalAmount}</p>
              <p className="text-sm text-gray-400 mt-2">
                ₹{calculatePerPerson()} per person × {members.length + 1} people
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-300">Who owes what:</p>

              <div className="p-3 bg-gray-900 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white">You</span>
                  <span className="text-green-400 font-semibold">Paid ₹{totalAmount}</span>
                </div>
              </div>

              {members.map((member) => (
                <div key={member.id} className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{member.name}</span>
                    <span className="text-red-400 font-semibold">Owes ₹{calculatePerPerson()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Share */}
      {currentStep === "share" && (
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Share2 className="w-5 h-5 text-green-400" />
              Share & Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">Split Created Successfully!</p>
              <p className="text-sm text-gray-300">Share payment details with your friends to collect money.</p>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share UPI Payment Link
              </Button>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-black flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </Button>

              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Copy Split Details
              </Button>
            </div>

            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Quick message preview:</p>
              <p className="text-sm text-gray-300">
                "Hey! I've split our {description} expense of ₹{totalAmount}. Your share is ₹{calculatePerPerson()}. Pay
                via UPI: [payment link] - ByteBudget"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="flex gap-3">
          {currentStep !== "group" && currentStep !== "share" && (
            <Button
              variant="outline"
              onClick={() => {
                const steps: Step[] = ["group", "members", "amount", "summary", "share"]
                const currentIndex = steps.indexOf(currentStep)
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1])
                }
              }}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Previous
            </Button>
          )}

          {currentStep !== "share" ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-green-500 hover:bg-green-600 text-black disabled:opacity-50"
            >
              {currentStep === "summary" ? "Create Split" : "Next"}
            </Button>
          ) : (
            <Button onClick={onBack} className="flex-1 bg-green-500 hover:bg-green-600 text-black">
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
