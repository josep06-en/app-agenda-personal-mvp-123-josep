"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { ChevronLeft, ChevronRight, X, Calendar, FolderOpen, CheckSquare, Plus, Search } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  position: "center" | "top" | "bottom" | "left" | "right"
  icon?: React.ReactNode
}

interface TutorialOverlayProps {
  onComplete: () => void
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const { t } = useLanguage()
  const { updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: t("tutorial.welcome.title"),
      description: t("tutorial.welcome.description"),
      position: "center",
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
    },
    {
      id: "sidebar",
      title: t("tutorial.sidebar.title"),
      description: t("tutorial.sidebar.description"),
      target: ".sidebar",
      position: "right",
      icon: <FolderOpen className="h-6 w-6 text-green-600" />,
    },
    {
      id: "calendar-view",
      title: t("tutorial.calendar.title"),
      description: t("tutorial.calendar.description"),
      target: ".calendar-view",
      position: "top",
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
    },
    {
      id: "new-button",
      title: t("tutorial.newButton.title"),
      description: t("tutorial.newButton.description"),
      target: ".new-button",
      position: "bottom",
      icon: <Plus className="h-6 w-6 text-purple-600" />,
    },
    {
      id: "search",
      title: t("tutorial.search.title"),
      description: t("tutorial.search.description"),
      target: ".search-bar",
      position: "bottom",
      icon: <Search className="h-6 w-6 text-orange-600" />,
    },
    {
      id: "tasks",
      title: t("tutorial.tasks.title"),
      description: t("tutorial.tasks.description"),
      target: ".tasks-nav",
      position: "right",
      icon: <CheckSquare className="h-6 w-6 text-red-600" />,
    },
    {
      id: "complete",
      title: t("tutorial.complete.title"),
      description: t("tutorial.complete.description"),
      position: "center",
      icon: <CheckSquare className="h-8 w-8 text-green-600" />,
    },
  ]

  const currentStepData = tutorialSteps[currentStep]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsVisible(false)
    await updateProfile({ tutorial_completed: true })
    onComplete()
  }

  const handleSkip = async () => {
    setIsVisible(false)
    await updateProfile({ tutorial_completed: true })
    onComplete()
  }

  const getCardPosition = () => {
    if (!currentStepData.target || currentStepData.position === "center") {
      return "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    }

    // For targeted elements, we'll position relative to viewport center for simplicity
    // In a real implementation, you'd calculate the actual target element position
    switch (currentStepData.position) {
      case "top":
        return "fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      case "bottom":
        return "fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
      case "left":
        return "fixed top-1/2 left-20 transform -translate-y-1/2 z-50"
      case "right":
        return "fixed top-1/2 right-20 transform -translate-y-1/2 z-50"
      default:
        return "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Tutorial card */}
      <Card className={`w-full max-w-md ${getCardPosition()}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStepData.icon}
              <div>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  {currentStep + 1} / {tutorialSteps.length}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">{currentStepData.description}</CardDescription>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("tutorial.previous")}
            </Button>

            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                />
              ))}
            </div>

            <Button size="sm" onClick={handleNext}>
              {currentStep === tutorialSteps.length - 1 ? t("tutorial.finish") : t("tutorial.next")}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>

          {currentStep === 0 && (
            <div className="pt-2 border-t">
              <Button variant="link" size="sm" onClick={handleSkip} className="w-full text-xs">
                {t("tutorial.skip")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
