"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-500",
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${style.bg} border rounded-lg p-4 shadow-lg max-w-sm animate-in slide-in-from-top-2 duration-300`}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
