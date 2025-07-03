"use client"

import { useState, useEffect } from "react"
import { CalendarView } from "@/components/calendar-view"
import { ProjectsView } from "@/components/projects-view"
import { TasksView } from "@/components/tasks-view"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { LoginForm } from "@/components/auth/login-form"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useToast } from "@/components/toast"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

interface CalendarItem {
  id: string
  name: string
  color: string
  tasks: number
}

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
  calendar: string
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
  calendar?: string
}

export default function AgendaApp() {
  const { user, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentView, setCurrentView] = useState<"calendar" | "projects" | "tasks">("calendar")
  const [selectedCalendar, setSelectedCalendar] = useState("general")
  const [calendars, setCalendars] = useState<CalendarItem[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Dialog states
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false)
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const { showToast, ToastContainer } = useToast()

  // Check if user needs tutorial
  useEffect(() => {
    if (user && !user.tutorial_completed) {
      setShowTutorial(true)
    }
  }, [user])

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load calendars
      const { data: calendarsData } = await supabase
        .from("calendars")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at")

      if (calendarsData) {
        const formattedCalendars = calendarsData.map((cal) => ({
          id: cal.id,
          name: cal.name,
          color: cal.color,
          tasks: 0, // Will be updated when tasks load
        }))
        setCalendars(formattedCalendars)

        // Set default calendar
        const defaultCal = calendarsData.find((cal) => cal.is_default)
        if (defaultCal) {
          setSelectedCalendar(defaultCal.id)
        }
      }

      // Load tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (tasksData) {
        const formattedTasks = tasksData.map((task) => ({
          id: Number.parseInt(task.id),
          title: task.title,
          description: task.description || "",
          completed: task.completed,
          priority: task.priority,
          dueDate: task.due_date || new Date().toISOString().split("T")[0],
          assignee: {
            name: task.assignee_name || "Sin asignar",
            avatar: task.assignee_avatar || "/placeholder.svg?height=32&width=32",
          },
          project: task.project_name || "General",
          tags: task.tags || [],
          calendar: task.calendar_id,
        }))
        setTasks(formattedTasks)
      }

      // Load projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (projectsData) {
        const formattedProjects = projectsData.map((project) => ({
          id: Number.parseInt(project.id),
          title: project.title,
          description: project.description || "",
          progress: project.progress,
          dueDate: project.due_date || new Date().toISOString().split("T")[0],
          priority: project.priority,
          status: project.status,
          team: project.team_members || [],
          milestones: project.milestones || [],
          calendar: project.calendar_id,
        }))
        setProjects(formattedProjects)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  /* ---------- Calendars ---------- */
  const handleCreateCalendar = async (newCalendar: { name: string; description: string; color: string }) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("calendars")
        .insert({
          user_id: user.id,
          name: newCalendar.name,
          description: newCalendar.description,
          color: newCalendar.color,
        })
        .select()
        .single()

      if (error) throw error

      const calendar: CalendarItem = {
        id: data.id,
        name: data.name,
        color: data.color,
        tasks: 0,
      }

      setCalendars((prev) => [...prev, calendar])
      setSelectedCalendar(calendar.id)
      showToast(`Calendario "${newCalendar.name}" creado exitosamente`, "success")
    } catch (error) {
      console.error("Error creating calendar:", error)
      showToast("Error al crear el calendario", "error")
    }
  }

  /* ---------- Tasks ---------- */
  const handleCreateTask = async (newTask: Omit<Task, "id">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          calendar_id: selectedCalendar,
          title: newTask.title,
          description: newTask.description,
          completed: newTask.completed,
          priority: newTask.priority,
          due_date: newTask.dueDate,
          assignee_name: newTask.assignee.name,
          assignee_avatar: newTask.assignee.avatar,
          project_name: newTask.project,
          tags: newTask.tags,
        })
        .select()
        .single()

      if (error) throw error

      const task: Task = {
        ...newTask,
        id: Number.parseInt(data.id),
        calendar: selectedCalendar,
      }

      setTasks((prev) => [...prev, task])
      showToast(`Tarea "${newTask.title}" creada exitosamente`, "success")
    } catch (error) {
      console.error("Error creating task:", error)
      showToast("Error al crear la tarea", "error")
    }
  }

  /* ---------- Projects ---------- */
  const handleCreateProject = async (newProject: Omit<Project, "id">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          calendar_id: selectedCalendar,
          title: newProject.title,
          description: newProject.description,
          progress: newProject.progress,
          due_date: newProject.dueDate,
          priority: newProject.priority,
          status: newProject.status,
          team_members: newProject.team,
          milestones: newProject.milestones,
        })
        .select()
        .single()

      if (error) throw error

      const project: Project = {
        ...newProject,
        id: Number.parseInt(data.id),
        calendar: selectedCalendar,
      }

      setProjects((prev) => [...prev, project])
      showToast(`Proyecto "${newProject.title}" creado exitosamente`, "success")
    } catch (error) {
      console.error("Error creating project:", error)
      showToast("Error al crear el proyecto", "error")
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowCreateProjectDialog(true)
  }

  const handleUpdateProject = async (updated: Project) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title: updated.title,
          description: updated.description,
          progress: updated.progress,
          due_date: updated.dueDate,
          priority: updated.priority,
          status: updated.status,
          team_members: updated.team,
          milestones: updated.milestones,
        })
        .eq("id", updated.id)

      if (error) throw error

      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditingProject(null)
      showToast(`Proyecto "${updated.title}" actualizado exitosamente`, "success")
    } catch (error) {
      console.error("Error updating project:", error)
      showToast("Error al actualizar el proyecto", "error")
    }
  }

  const handleDuplicateProject = (project: Project) => {
    const duplicated = {
      ...project,
      id: Date.now(),
      title: `${project.title} (Copia)`,
      progress: 0,
      status: "in-progress" as const,
      milestones: project.milestones.map((m) => ({ ...m, completed: false })),
    }
    handleCreateProject(duplicated)
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!user) return

    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId)

      if (error) throw error

      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      showToast(`Proyecto "${project.title}" eliminado exitosamente`, "success")
    } catch (error) {
      console.error("Error deleting project:", error)
      showToast("Error al eliminar el proyecto", "error")
    }
  }

  /* ---------- New Button ---------- */
  const handleNewClick = () => {
    if (currentView === "projects") {
      setEditingProject(null)
      setShowCreateProjectDialog(true)
    } else {
      setShowCreateTaskDialog(true)
    }
  }

  /* ---------- Counter Sync ---------- */
  useEffect(() => {
    setCalendars((prev) =>
      prev.map((cal) => ({
        ...cal,
        tasks: tasks.filter((task) => task.calendar === cal.id).length,
      })),
    )
  }, [tasks])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginForm onToggleMode={() => setIsSignUp(!isSignUp)} isSignUp={isSignUp} />
  }

  return (
    <>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <div className="sidebar">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            selectedCalendar={selectedCalendar}
            setSelectedCalendar={setSelectedCalendar}
            calendars={calendars}
            onCreateCalendar={handleCreateCalendar}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header
            currentView={currentView}
            selectedCalendar={selectedCalendar}
            onNewClick={handleNewClick}
            tasks={tasks}
            projects={projects}
          />

          <main className="flex-1 overflow-hidden">
            {currentView === "calendar" && (
              <div className="calendar-view">
                <CalendarView
                  selectedCalendar={selectedCalendar}
                  projects={projects.filter((p) => p.calendar === selectedCalendar)}
                  tasks={tasks.filter((t) => t.calendar === selectedCalendar)}
                />
              </div>
            )}

            {currentView === "projects" && (
              <ProjectsView
                selectedCalendar={selectedCalendar}
                projects={projects.filter((p) => p.calendar === selectedCalendar)}
                onCreateProject={handleCreateProject}
                onEditProject={handleEditProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onUpdateProject={handleUpdateProject}
              />
            )}

            {currentView === "tasks" && (
              <div className="tasks-nav">
                <TasksView
                  selectedCalendar={selectedCalendar}
                  tasks={tasks.filter((t) => t.calendar === selectedCalendar)}
                  onCreateTask={handleCreateTask}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Tutorial overlay */}
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}

      {/* Global dialogs */}
      <CreateTaskDialog
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
        onCreateTask={handleCreateTask}
        selectedCalendar={selectedCalendar}
      />

      <CreateProjectDialog
        open={showCreateProjectDialog}
        onOpenChange={setShowCreateProjectDialog}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        editingProject={editingProject}
        selectedCalendar={selectedCalendar}
      />

      <ToastContainer />
    </>
  )
}
