"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Flag, FolderOpen, CheckSquare } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "project" | "milestone" | "task"
  priority?: "high" | "medium" | "low"
  completed?: boolean
  projectTitle?: string
}

interface EventDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
}

export function EventDetailsDialog({ open, onOpenChange, event }: EventDetailsDialogProps) {
  if (!event) return null

  const getEventColor = (event: CalendarEvent) => {
    if (event.completed) {
      return "bg-green-100 text-green-800 border-green-200"
    }

    if (event.type === "task") {
      switch (event.priority) {
        case "high":
          return "bg-red-100 text-red-800 border-red-200"
        case "medium":
          return "bg-orange-100 text-orange-800 border-orange-200"
        case "low":
          return "bg-blue-100 text-blue-800 border-blue-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    } else if (event.type === "project") {
      switch (event.priority) {
        case "high":
          return "bg-red-100 text-red-800 border-red-200"
        case "medium":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "low":
          return "bg-blue-100 text-blue-800 border-blue-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    } else {
      return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })
    } catch {
      return dateString
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {event.type === "project" ? (
              <FolderOpen className="h-5 w-5 text-blue-600" />
            ) : event.type === "task" ? (
              <CheckSquare className="h-5 w-5 text-green-600" />
            ) : (
              <Flag className="h-5 w-5 text-purple-600" />
            )}
            <span>Detalles del Evento</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getEventColor(event)}`}>
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>

            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{event.type === "project" ? "Fecha de entrega" : "Milestone"}</span>
            </div>

            {event.projectTitle && (
              <div className="mb-3">
                <span className="text-sm font-medium">Proyecto: </span>
                <span className="text-sm">{event.projectTitle}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {event.type === "project" ? "Proyecto" : event.type === "task" ? "Tarea" : "Milestone"}
              </Badge>

              {event.priority && (
                <Badge
                  className={
                    event.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : event.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Media" : "Baja"}
                </Badge>
              )}

              {event.completed && <Badge className="bg-green-100 text-green-800">Completado</Badge>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
