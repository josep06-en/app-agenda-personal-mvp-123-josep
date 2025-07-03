"use client"

import type React from "react"

import { useState } from "react"
import { Search, Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchResultsDialog } from "@/components/search-results-dialog"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

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

interface HeaderProps {
  currentView: "calendar" | "projects" | "tasks"
  selectedCalendar: string
  onNewClick: () => void
  tasks?: Task[]
  projects?: Project[]
}

export function Header({ currentView, selectedCalendar, onNewClick, tasks = [], projects = [] }: HeaderProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const viewTitles = {
    calendar: t("calendar"),
    projects: t("projects"),
    tasks: t("tasks"),
  }

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results: SearchResult[] = []
    const searchLower = term.toLowerCase()

    // Buscar en tareas
    tasks.forEach((task) => {
      const matchesTitle = task.title.toLowerCase().includes(searchLower)
      const matchesDescription = task.description.toLowerCase().includes(searchLower)
      const matchesProject = task.project.toLowerCase().includes(searchLower)
      const matchesTags = task.tags.some((tag) => tag.toLowerCase().includes(searchLower))

      if (matchesTitle || matchesDescription || matchesProject || matchesTags) {
        results.push({
          type: "task",
          id: `task-${task.id}`,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          completed: task.completed,
          projectTitle: task.project,
          assignee: task.assignee,
        })
      }
    })

    // Buscar en proyectos
    projects.forEach((project) => {
      const matchesTitle = project.title.toLowerCase().includes(searchLower)
      const matchesDescription = project.description.toLowerCase().includes(searchLower)

      if (matchesTitle || matchesDescription) {
        results.push({
          type: "project",
          id: `project-${project.id}`,
          title: project.title,
          description: project.description,
          priority: project.priority,
          dueDate: project.dueDate,
          completed: project.status === "completed",
          team: project.team,
          progress: project.progress,
        })
      }

      // Buscar en milestones del proyecto
      project.milestones.forEach((milestone, index) => {
        const matchesMilestone = milestone.name.toLowerCase().includes(searchLower)

        if (matchesMilestone) {
          results.push({
            type: "milestone",
            id: `milestone-${project.id}-${index}`,
            title: milestone.name,
            dueDate: milestone.dueDate,
            completed: milestone.completed,
            projectTitle: project.title,
          })
        }
      })
    })

    // Ordenar resultados por relevancia (coincidencias exactas primero)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === searchLower ? 1 : 0
      const bExact = b.title.toLowerCase() === searchLower ? 1 : 0
      return bExact - aExact
    })

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      performSearch(searchTerm)
    }
  }

  const handleSearchClick = () => {
    performSearch(searchTerm)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Búsqueda en tiempo real si hay más de 2 caracteres
    if (value.length > 2) {
      performSearch(value)
    } else if (value.length === 0) {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleNewClick = () => {
    console.log("Header + Nuevo button clicked for view:", currentView)
    onNewClick()
  }

  const getNewButtonText = () => {
    switch (currentView) {
      case "calendar":
        return t("newTask")
      case "projects":
        return t("newProject")
      case "tasks":
        return t("newTask")
      default:
        return t("create")
    }
  }

  const handleResultClick = (result: SearchResult) => {
    console.log("Clicked on search result:", result)
    // Aquí podrías navegar al elemento específico o abrir un modal con detalles
    // Por ejemplo, cambiar de vista o filtrar por el elemento seleccionado
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">{viewTitles[currentView]}</h2>
          <Badge variant="outline" className="text-xs">
            {selectedCalendar}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                placeholder={t("searchPlaceholder")}
                className="pl-10 pr-4 w-64 h-9 bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button type="button" variant="ghost" size="sm" className="ml-2 h-9 px-3" onClick={handleSearchClick}>
              {t("search")}
            </Button>
          </form>

          <Button size="sm" className="h-9" onClick={handleNewClick}>
            <Plus className="mr-2 h-4 w-4" />
            {getNewButtonText()}
          </Button>

          <LanguageSelector />

          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Bell className="h-4 w-4" />
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <SearchResultsDialog
        open={showSearchResults}
        onOpenChange={setShowSearchResults}
        searchTerm={searchTerm}
        results={searchResults}
        onResultClick={handleResultClick}
      />
    </>
  )
}
