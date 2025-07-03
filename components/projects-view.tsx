"use client"

import { useEffect } from "react"
import { MoreHorizontal, Users, Calendar, Target, FolderOpen, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Milestone {
  name: string
  completed: boolean
  dueDate?: string
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
  milestones: Milestone[]
}

interface ProjectsViewProps {
  selectedCalendar: string
  projects: Project[]
  onCreateProject: (project: Omit<Project, "id">) => void
  onEditProject?: (project: Project) => void
  onDuplicateProject?: (project: Project) => void
  onDeleteProject?: (projectId: number) => void
  onUpdateProject?: (project: Project) => void
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

const statusColors = {
  "in-progress": "bg-blue-100 text-blue-800",
  "near-completion": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
}

export function ProjectsView({
  selectedCalendar,
  projects,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onUpdateProject,
}: ProjectsViewProps) {
  // Sincronizar con props usando useEffect
  useEffect(() => {
    console.log("Projects updated from props:", projects)
  }, [projects])

  const calculateProgress = (milestones: Milestone[]) => {
    if (milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.completed).length
    return Math.round((completed / milestones.length) * 100)
  }

  const updateProjectStatus = (project: Project, newProgress: number) => {
    let newStatus = project.status
    if (newProgress === 100) {
      newStatus = "completed"
    } else if (newProgress >= 80) {
      newStatus = "near-completion"
    } else {
      newStatus = "in-progress"
    }
    return newStatus
  }

  const toggleMilestone = (projectId: number, milestoneIndex: number) => {
    console.log("=== TOGGLE MILESTONE ===")
    console.log("Project ID:", projectId)
    console.log("Milestone Index:", milestoneIndex)

    // Encontrar el proyecto
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      console.error("Project not found:", projectId)
      return
    }

    console.log("Current project:", project)
    console.log("Current milestone:", project.milestones[milestoneIndex])

    // Crear nueva copia del proyecto con milestone actualizado
    const updatedMilestones = [...project.milestones]
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      completed: !updatedMilestones[milestoneIndex].completed,
    }

    const newProgress = calculateProgress(updatedMilestones)
    const newStatus = updateProjectStatus(project, newProgress)

    const updatedProject = {
      ...project,
      milestones: updatedMilestones,
      progress: newProgress,
      status: newStatus,
    }

    console.log("Updated project:", updatedProject)
    console.log("New progress:", newProgress)
    console.log("New status:", newStatus)

    // Notificar al componente padre
    if (onUpdateProject) {
      console.log("Calling onUpdateProject...")
      onUpdateProject(updatedProject)
    } else {
      console.error("onUpdateProject is not defined!")
    }

    console.log("=== END TOGGLE ===")
  }

  const handleEdit = (project: Project) => {
    console.log("Editando proyecto:", project.title)
    if (onEditProject) {
      onEditProject(project)
    } else {
      alert(`Función de editar proyecto "${project.title}" - Por implementar`)
    }
  }

  const handleDuplicate = (project: Project) => {
    console.log("Duplicando proyecto:", project.title)
    if (onDuplicateProject) {
      onDuplicateProject(project)
    } else {
      // Crear una copia del proyecto
      const duplicatedProject = {
        ...project,
        id: Date.now(),
        title: `${project.title} (Copia)`,
        progress: 0,
        status: "in-progress" as const,
        milestones: project.milestones.map((m) => ({ ...m, completed: false })),
      }

      onCreateProject(duplicatedProject)
    }
  }

  const handleDelete = (project: Project) => {
    console.log("Eliminando proyecto:", project.title)

    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el proyecto "${project.title}"?\n\nEsta acción no se puede deshacer.`,
    )

    if (confirmDelete) {
      if (onDeleteProject) {
        onDeleteProject(project.id)
      }
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const formatMilestoneDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return format(new Date(dateString), "dd MMM", { locale: es })
    } catch {
      return null
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Proyectos</h3>
          <p className="text-gray-600">Gestiona tus proyectos y milestones ({projects.length} proyectos)</p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(project)} className="cursor-pointer">
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(project)} className="cursor-pointer">
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(project)} className="text-red-600 cursor-pointer">
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progreso</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span
                      className={`text-sm ${isOverdue(project.dueDate) ? "text-red-600 font-medium" : "text-gray-600"}`}
                    >
                      {formatMilestoneDate(project.dueDate) || project.dueDate}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                      {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status === "in-progress"
                        ? "En progreso"
                        : project.status === "near-completion"
                          ? "Por completar"
                          : "Completado"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">Milestones</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {project.milestones.filter((m) => m.completed).length}/{project.milestones.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {project.milestones.map((milestone, index) => {
                      const milestoneDate = formatMilestoneDate(milestone.dueDate)
                      const isMilestoneOverdue =
                        milestone.dueDate && isOverdue(milestone.dueDate) && !milestone.completed

                      return (
                        <div
                          key={`${project.id}-${index}`}
                          className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <Checkbox
                              checked={milestone.completed}
                              onCheckedChange={() => {
                                console.log(
                                  "Checkbox clicked for milestone:",
                                  milestone.name,
                                  "completed:",
                                  milestone.completed,
                                )
                                toggleMilestone(project.id, index)
                              }}
                              className="flex-shrink-0"
                            />
                            <span
                              className={`text-xs truncate cursor-pointer ${
                                milestone.completed
                                  ? "text-gray-900 line-through"
                                  : isMilestoneOverdue
                                    ? "text-red-600 font-medium"
                                    : "text-gray-700"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log(
                                  "Text clicked for milestone:",
                                  milestone.name,
                                  "completed:",
                                  milestone.completed,
                                )
                                toggleMilestone(project.id, index)
                              }}
                            >
                              {milestone.name}
                            </span>
                          </div>
                          {milestoneDate && (
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span
                                className={`text-xs ${
                                  isMilestoneOverdue
                                    ? "text-red-600 font-medium"
                                    : milestone.completed
                                      ? "text-green-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {milestoneDate}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Equipo ({project.team.length})</span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 4).map((member, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-white" title={member.name}>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{project.team.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primer proyecto para organizar tus tareas y milestones.
            </p>
            <p className="text-sm text-gray-400">
              Usa el botón "+ Nuevo proyecto" en el header para crear un proyecto.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
