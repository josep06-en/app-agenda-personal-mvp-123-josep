"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, FolderOpen, CheckSquare, Clock, Flag } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
  dueDate: string
  assignee: { name: string; avatar: string }
  project: string
  tags: string[]
}

interface Project {
  id: number
  title: string
  description: string
  progress: number
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "in-progress" | "near-completion" | "completed"
  team: Array<{ name: string; avatar: string }>
  milestones: Array<{ name: string; completed: boolean; dueDate?: string }>
}

interface SearchResult {
  type: "task" | "project" | "milestone"
  id: string
  title: string
  description?: string
  priority?: "high" | "medium" | "low"
  dueDate?: string
  completed?: boolean
  projectTitle?: string
  assignee?: { name: string; avatar: string }
  team?: Array<{ name: string; avatar: string }>
  progress?: number
}

interface SearchResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchTerm: string
  results: SearchResult[]
  onResultClick?: (result: SearchResult) => void
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export function SearchResultsDialog({
  open,
  onOpenChange,
  searchTerm,
  results,
  onResultClick,
}: SearchResultsDialogProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es })
    } catch {
      return dateString
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4 text-blue-600" />
      case "project":
        return <FolderOpen className="h-4 w-4 text-green-600" />
      case "milestone":
        return <Flag className="h-4 w-4 text-purple-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Resultados de búsqueda</span>
            {searchTerm && (
              <Badge variant="outline" className="text-xs">
                "{searchTerm}"
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-gray-600">
                Se encontraron {results.length} resultado{results.length !== 1 ? "s" : ""}
              </p>

              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getResultIcon(result.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{result.title}</h4>
                            {result.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {result.type === "task"
                                  ? "Tarea"
                                  : result.type === "project"
                                    ? "Proyecto"
                                    : "Milestone"}
                              </Badge>

                              {result.priority && (
                                <Badge className={`${priorityColors[result.priority]} text-xs`}>
                                  {result.priority === "high"
                                    ? "Alta"
                                    : result.priority === "medium"
                                      ? "Media"
                                      : "Baja"}
                                </Badge>
                              )}

                              {result.completed !== undefined && (
                                <Badge
                                  className={`text-xs ${
                                    result.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {result.completed ? "Completado" : "Pendiente"}
                                </Badge>
                              )}

                              {result.projectTitle && (
                                <Badge variant="outline" className="text-xs">
                                  {result.projectTitle}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {result.dueDate && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(result.dueDate)}</span>
                                </div>
                              )}

                              {result.progress !== undefined && (
                                <div className="flex items-center space-x-1">
                                  <span>Progreso: {result.progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {result.assignee && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={result.assignee.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {result.assignee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            {result.team && result.team.length > 0 && (
                              <div className="flex -space-x-1">
                                {result.team.slice(0, 3).map((member, index) => (
                                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {result.team.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{result.team.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <CheckSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No hay elementos que coincidan con "${searchTerm}"`
                  : "Ingresa un término de búsqueda para encontrar tareas, proyectos y milestones"}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
