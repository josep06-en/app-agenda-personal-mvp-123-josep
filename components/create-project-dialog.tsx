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
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Plus, X, Users } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Milestone {
  name: string
  completed: boolean
  dueDate?: string
}

interface TeamMember {
  name: string
  avatar: string
}

interface Project {
  id: number
  title: string
  description: string
  progress: number
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "in-progress" | "near-completion" | "completed"
  team: TeamMember[]
  milestones: Milestone[]
  calendar?: string // Agregar campo opcional
}

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (project: any) => void
  onUpdateProject?: (project: Project) => void
  editingProject?: Project | null
  selectedCalendar?: string // Agregar prop
}

const availableTeamMembers = [
  { id: "ana", name: "Ana García" },
  { id: "carlos", name: "Carlos López" },
  { id: "maria", name: "María Rodríguez" },
  { id: "elena", name: "Elena Ruiz" },
  { id: "david", name: "David Martín" },
]

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
  onUpdateProject,
  editingProject,
  selectedCalendar,
}: CreateProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [milestones, setMilestones] = useState<{ name: string; dueDate?: Date }>([{ name: "", dueDate: undefined }])
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!editingProject

  // Cargar datos del proyecto cuando estamos editando
  useEffect(() => {
    if (editingProject && open) {
      console.log("Loading project data for editing:", editingProject)
      setTitle(editingProject.title)
      setDescription(editingProject.description)
      setPriority(editingProject.priority)
      setDueDate(editingProject.dueDate ? new Date(editingProject.dueDate) : undefined)

      // Cargar milestones con fechas
      const projectMilestones = editingProject.milestones.map((m) => ({
        name: m.name,
        dueDate: m.dueDate ? new Date(m.dueDate) : undefined,
      }))
      setMilestones(projectMilestones.length > 0 ? projectMilestones : [{ name: "", dueDate: undefined }])

      // Cargar team members - convertir nombres a IDs
      const teamIds = editingProject.team
        .map((member) => {
          switch (member.name) {
            case "Ana García":
              return "ana"
            case "Carlos López":
              return "carlos"
            case "María Rodríguez":
              return "maria"
            case "Elena Ruiz":
              return "elena"
            case "David Martín":
              return "david"
            default:
              return ""
          }
        })
        .filter((id) => id !== "")

      setSelectedTeamMembers(teamIds)
    } else if (!editingProject && open) {
      // Reset form para crear nuevo proyecto
      setTitle("")
      setDescription("")
      setPriority("")
      setDueDate(undefined)
      setMilestones([{ name: "", dueDate: undefined }])
      setSelectedTeamMembers([])
    }
  }, [editingProject, open])

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

  const addMilestone = () => {
    setMilestones([...milestones, { name: "", dueDate: undefined }])
  }

  const updateMilestone = (index: number, field: "name" | "dueDate", value: string | Date | undefined) => {
    const updated = [...milestones]
    if (field === "name") {
      updated[index].name = value as string
    } else {
      updated[index].dueDate = value as Date | undefined
    }
    setMilestones(updated)
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

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

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      progress: isEditing ? editingProject!.progress : 0,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      priority,
      status: (isEditing ? editingProject!.status : "in-progress") as const,
      calendar: selectedCalendar, // Agregar calendario
      team: selectedTeamMembers.map((memberId) => {
        const member = availableTeamMembers.find((m) => m.id === memberId)
        return {
          name: member?.name || "Sin asignar",
          avatar: "/placeholder.svg?height=32&width=32",
        }
      }),
      milestones: milestones
        .filter((m) => m.name.trim())
        .map((milestone, index) => ({
          name: milestone.name.trim(),
          completed:
            isEditing && editingProject!.milestones[index] ? editingProject!.milestones[index].completed : false,
          dueDate: milestone.dueDate ? milestone.dueDate.toISOString().split("T")[0] : undefined,
        })),
    }

    if (isEditing && editingProject && onUpdateProject) {
      // Actualizar proyecto existente
      const updatedProject = {
        ...editingProject,
        ...projectData,
      }
      console.log("Updating project:", updatedProject)
      onUpdateProject(updatedProject)
    } else {
      // Crear nuevo proyecto
      console.log("Creating project:", projectData)
      onCreateProject(projectData)
    }

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("")
    setDueDate(undefined)
    setMilestones([{ name: "", dueDate: undefined }])
    setSelectedTeamMembers([])
    setErrors({})

    // Close dialog
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los detalles del proyecto y guarda los cambios."
              : "Crea un nuevo proyecto definiendo objetivos, milestones y asignando miembros del equipo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Proyecto *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({ ...errors, title: "" })
              }}
              placeholder="Nombre del proyecto"
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
              placeholder="Descripción detallada del proyecto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad *</Label>
              <Select
                value={priority}
                onValueChange={(value) => {
                  setPriority(value)
                  if (errors.priority) setErrors({ ...errors, priority: "" })
                }}
              >
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Milestones</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <Input
                      value={milestone.name}
                      onChange={(e) => updateMilestone(index, "name", e.target.value)}
                      placeholder={`Milestone ${index + 1}`}
                      className="mb-2"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-normal bg-white"
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {milestone.dueDate ? format(milestone.dueDate, "PPP", { locale: es }) : "Fecha del milestone"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={milestone.dueDate}
                          onSelect={(date) => updateMilestone(index, "dueDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {milestones.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <Label>Miembros del equipo</Label>
              <span className="text-sm text-gray-500">({selectedTeamMembers.length} seleccionados)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50">
              {availableTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedTeamMembers.includes(member.id)}
                    onCheckedChange={() => toggleTeamMember(member.id)}
                  />
                  <Label htmlFor={`member-${member.id}`} className="text-sm cursor-pointer">
                    {member.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedTeamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTeamMembers.map((memberId) => {
                  const member = availableTeamMembers.find((m) => m.id === memberId)
                  return (
                    <div key={memberId} className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm">
                      <span>{member?.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => toggleTeamMember(memberId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !priority}>
              {isEditing ? "Guardar Cambios" : "Crear Proyecto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
