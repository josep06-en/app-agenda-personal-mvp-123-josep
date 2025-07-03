"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

interface CreateCalendarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCalendar: (calendar: { name: string; description: string; color: string }) => void
}

const colors = [
  { name: "Azul", value: "bg-blue-500" },
  { name: "Verde", value: "bg-green-500" },
  { name: "Púrpura", value: "bg-purple-500" },
  { name: "Naranja", value: "bg-orange-500" },
  { name: "Rojo", value: "bg-red-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Índigo", value: "bg-indigo-500" },
  { name: "Amarillo", value: "bg-yellow-500" },
]

export function CreateCalendarDialog({ open, onOpenChange, onCreateCalendar }: CreateCalendarDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")
  const [errors, setErrors] = useState<Record<string, string>>({})

  console.log("CreateCalendarDialog props:", { open, onCreateCalendar: !!onCreateCalendar }) // Debug log

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onOpenChange])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "El nombre del calendario es requerido"
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", { name, description, selectedColor }) // Debug log

    if (!validateForm()) {
      console.log("Form validation failed:", errors) // Debug log
      return
    }

    const calendarData = {
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    }

    console.log("Calling onCreateCalendar with:", calendarData) // Debug log
    onCreateCalendar(calendarData)

    // Reset form
    setName("")
    setDescription("")
    setSelectedColor("bg-blue-500")
    setErrors({})

    // Close dialog
    onOpenChange(false)
  }

  const handleClose = () => {
    console.log("Dialog closing") // Debug log
    onOpenChange(false)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nuevo Calendario</DialogTitle>
          <DialogDescription>
            Crea un nuevo calendario para organizar tus eventos y tareas por categorías específicas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Calendario *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              placeholder="Ej: Trabajo, Personal, Estudios..."
              className={errors.name ? "border-red-500" : ""}
              required
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el propósito de este calendario..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Color del Calendario</Label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-10 w-full rounded-md ${color.value} transition-all relative ${
                    selectedColor === color.value ? "ring-2 ring-gray-900 ring-offset-2 scale-105" : "hover:scale-105"
                  }`}
                  onClick={() => {
                    console.log("Color selected:", color.value) // Debug log
                    setSelectedColor(color.value)
                  }}
                  title={color.name}
                  aria-label={`Seleccionar color ${color.name}`}
                >
                  {selectedColor === color.value && (
                    <CheckCircle className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Crear Calendario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
