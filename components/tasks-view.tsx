"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Calendar, Flag, User, CheckSquare, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface TasksViewProps {
  selectedCalendar: string
  tasks: Task[]
  onCreateTask: (task: Omit<Task, "id">) => void
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export function TasksView({ selectedCalendar, tasks, onCreateTask }: TasksViewProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [localTasks, setLocalTasks] = useState<Task[]>([])
  const [completingTasks, setCompletingTasks] = useState<Set<number>>(new Set())

  // Sincronizar tareas cuando cambien las props
  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  const toggleTask = (taskId: number) => {
    const task = localTasks.find((t) => t.id === taskId)
    if (!task) return

    if (!task.completed) {
      // Marcar como completada y programar eliminación
      setLocalTasks(localTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))
      setCompletingTasks((prev) => new Set(prev).add(taskId))

      // Eliminar después de 2 segundos con animación
      setTimeout(() => {
        setLocalTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId))
        setCompletingTasks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
      }, 2000)
    } else {
      // Desmarcar como completada (cancelar eliminación si aún no se ha eliminado)
      if (completingTasks.has(taskId)) {
        setCompletingTasks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
      }
      setLocalTasks(localTasks.map((task) => (task.id === taskId ? { ...task, completed: false } : task)))
    }
  }

  const filteredTasks = localTasks.filter((task) => {
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Tareas</h3>
          <p className="text-gray-600">
            Organiza y gestiona tus tareas ({localTasks.length} tareas, {filteredTasks.length} mostradas)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar ({filter})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>Todas las tareas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>Pendientes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>Completadas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isCompleting = completingTasks.has(task.id)

            return (
              <Card
                key={task.id}
                className={`p-4 hover:shadow-md transition-all duration-500 ${
                  task.completed ? "opacity-75" : ""
                } ${isCompleting ? "animate-pulse bg-green-50 border-green-200" : ""}`}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description || "Sin descripción"}</p>

                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span
                              className={`text-xs ${
                                isOverdue(task.dueDate) && !task.completed
                                  ? "text-red-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {task.dueDate}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Flag className="h-3 w-3 text-gray-400" />
                            <Badge className={`${priorityColors[task.priority]} text-xs`}>
                              {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.project}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {isCompleting && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✓ Tarea completada - Se eliminará en breve...
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem>Asignar a...</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setLocalTasks(localTasks.filter((t) => t.id !== task.id))}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {localTasks.length === 0 ? "No hay tareas" : "No hay tareas que coincidan con el filtro"}
            </h3>
            <p className="text-gray-500 mb-4">
              {localTasks.length === 0
                ? "Comienza creando tu primera tarea para organizar tu trabajo."
                : `Hay ${localTasks.length} tareas en total, pero ninguna coincide con el filtro "${filter}".`}
            </p>
            <p className="text-sm text-gray-400">Usa el botón "+ Nueva tarea" en el header para crear una tarea.</p>
          </div>
        </div>
      )}
    </div>
  )
}
