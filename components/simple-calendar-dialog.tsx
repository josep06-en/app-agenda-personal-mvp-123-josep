"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SimpleCalendarDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export function SimpleCalendarDialog({ open, onClose, onCreate }: SimpleCalendarDialogProps) {
  const [name, setName] = useState("")

  console.log("SimpleCalendarDialog render:", { open, name }) // Debug log

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with name:", name) // Debug log

    if (name.trim()) {
      console.log("Calling onCreate with:", name.trim()) // Debug log
      onCreate(name.trim())
      setName("")
      onClose()
    } else {
      console.log("Name is empty, not creating calendar") // Debug log
    }
  }

  const handleClose = () => {
    console.log("Dialog closing") // Debug log
    setName("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nuevo Calendario</DialogTitle>
          <DialogDescription>Crea un nuevo calendario para organizar tus eventos y tareas.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="calendar-name">Nombre del Calendario</Label>
            <Input
              id="calendar-name"
              value={name}
              onChange={(e) => {
                console.log("Input changed:", e.target.value) // Debug log
                setName(e.target.value)
              }}
              placeholder="Ej: Trabajo, Personal, Estudios..."
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              onClick={() => console.log("Submit button clicked")} // Debug log
            >
              Crear Calendario
            </Button>
          </div>
        </form>

        {/* Botón de prueba adicional */}
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600 mb-2">Prueba directa:</p>
          <Button
            onClick={() => {
              console.log("Direct test button clicked")
              onCreate("Calendario de Prueba")
              onClose()
            }}
            className="w-full"
            variant="secondary"
          >
            Crear "Calendario de Prueba" (Botón Directo)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
