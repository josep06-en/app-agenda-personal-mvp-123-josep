"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Plus, X } from "lucide-react"

interface InviteCollaboratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteCollaboratorDialog({ open, onOpenChange }: InviteCollaboratorDialogProps) {
  const [emails, setEmails] = useState<string[]>([""])
  const [message, setMessage] = useState("")
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [role, setRole] = useState("")
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const validEmails = emails.filter((email) => email.trim())

    if (validEmails.length === 0) {
      newErrors.emails = "Debe agregar al menos un email"
    } else {
      const invalidEmails = validEmails.filter((email) => !validateEmail(email))
      if (invalidEmails.length > 0) {
        newErrors.emails = `Emails inválidos: ${invalidEmails.join(", ")}`
      }
    }

    if (!role) {
      newErrors.role = "Debe seleccionar un rol"
    }

    if (selectedCalendars.length === 0 && selectedProjects.length === 0) {
      newErrors.access = "Debe seleccionar al menos un calendario o proyecto"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addEmailField = () => {
    setEmails([...emails, ""])
  }

  const updateEmail = (index: number, value: string) => {
    const updated = [...emails]
    updated[index] = value
    setEmails(updated)

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.emails) {
      setErrors({ ...errors, emails: "" })
    }
  }

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const toggleCalendar = (calendarId: string) => {
    setSelectedCalendars((prev) =>
      prev.includes(calendarId) ? prev.filter((id) => id !== calendarId) : [...prev, calendarId],
    )

    // Limpiar error de acceso
    if (errors.access) {
      setErrors({ ...errors, access: "" })
    }
  }

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )

    // Limpiar error de acceso
    if (errors.access) {
      setErrors({ ...errors, access: "" })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const validEmails = emails.filter((email) => email.trim() && validateEmail(email))

    // Aquí iría la lógica para enviar las invitaciones
    console.log({
      emails: validEmails,
      message,
      selectedCalendars,
      selectedProjects,
      role,
    })

    onOpenChange(false)

    // Reset form
    setEmails([""])
    setMessage("")
    setSelectedCalendars([])
    setSelectedProjects([])
    setRole("")
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    setErrors({})
  }

  const calendars = [
    { id: "general", name: "General" },
    { id: "work", name: "Trabajo" },
    { id: "personal", name: "Personal" },
    { id: "team", name: "Equipo" },
  ]

  const projects = [
    { id: "redesign", name: "Rediseño de la aplicación móvil" },
    { id: "api", name: "Implementación de API v2" },
    { id: "marketing", name: "Campaña de marketing Q1" },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Invitar Colaboradores
          </DialogTitle>
          <DialogDescription>
            Invita a colaboradores a tus calendarios y proyectos especificando sus permisos y accesos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Correos electrónicos</Label>
              <Button type="button" variant="outline" size="sm" onClick={addEmailField}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={errors.emails ? "border-red-500" : ""}
                    required={index === 0}
                  />
                  {emails.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeEmail(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.emails && <p className="text-sm text-red-600">{errors.emails}</p>}
          </div>

          <div className="space-y-2">
            <Label>Rol</Label>
            <Select
              value={role}
              onValueChange={(value) => {
                setRole(value)
                if (errors.role) setErrors({ ...errors, role: "" })
              }}
            >
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Visualizador</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
          </div>

          <div className="space-y-2">
            <Label>Calendarios</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {calendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`calendar-${calendar.id}`}
                    checked={selectedCalendars.includes(calendar.id)}
                    onCheckedChange={() => toggleCalendar(calendar.id)}
                  />
                  <Label htmlFor={`calendar-${calendar.id}`} className="text-sm">
                    {calendar.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Proyectos</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => toggleProject(project.id)}
                  />
                  <Label htmlFor={`project-${project.id}`} className="text-sm">
                    {project.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.access && <p className="text-sm text-red-600">{errors.access}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje personalizado (opcional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje de invitación personalizado..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Enviar Invitaciones</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
