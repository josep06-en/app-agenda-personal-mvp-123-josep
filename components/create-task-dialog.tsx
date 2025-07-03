"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask?: (task: any) => void
  selectedCalendar?: string // Agregar prop
}

export function CreateTaskDialog({ open, onOpenChange, onCreateTask, selectedCalendar }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [project, setProject] = useState("")
  const [assignee, setAssignee] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Manejar cierre con ESC
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

    if (!title.trim()) {
      newErrors.title = "El título es requerido"
    }

    if (!priority) {
      newErrors.priority = "La prioridad es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Crear la tarea si se proporciona la función
    if (onCreateTask) {
      onCreateTask({
        title,
        description,
        completed: false,
        priority,
        dueDate: dueDate ? dueDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        calendar: selectedCalendar, // Agregar calendario
        assignee: {
          name:
            assignee === "ana"
              ? "Ana García"
              : assignee === "carlos"
                ? "Carlos López"
                : assignee === "maria"
                  ? "María Rodríguez"
                  : assignee === "elena"
                    ? "Elena Ruiz"
                    : assignee === "david"
                      ? "David Martín"
                      : "Sin asignar",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        project:
          project === "redesign"
            ? "Rediseño web"
            : project === "api"
              ? "API v2"
              : project === "marketing"
                ? "Marketing"
                : project === "docs"
                  ? "Documentación"
                  : "General",
        tags: [priority, project].filter(Boolean),
      })
    }

    onOpenChange(false)

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("")
    setProject("")
    setAssignee("")
    setDueDate(undefined)
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Tarea</DialogTitle>
          <DialogDescription>
            Crea una nueva tarea especificando el título, descripción, prioridad y otros detalles importantes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la tarea"
              className={errors.title ? "border-red-500" : ""}
              required
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada de la tarea"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-600">{errors.priority}</p>}
            </div>

            <div className="space-y-2">
              <Label>Proyecto</Label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redesign">Rediseño web</SelectItem>
                  <SelectItem value="api">API v2</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="docs">Documentación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asignado a</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Asignar a..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ana">Ana García</SelectItem>
                  <SelectItem value="carlos">Carlos López</SelectItem>
                  <SelectItem value="maria">María Rodríguez</SelectItem>
                  <SelectItem value="elena">Elena Ruiz</SelectItem>
                  <SelectItem value="david">David Martín</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha de entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear Tarea</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
