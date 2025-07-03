"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { EventDetailsDialog } from "@/components/event-details-dialog"
import { useLanguage } from "@/contexts/language-context"

interface CalendarViewProps {
  selectedCalendar: string
  projects?: Array<{
    id: number
    title: string
    dueDate: string
    priority: "high" | "medium" | "low"
    status: "in-progress" | "near-completion" | "completed"
    milestones: Array<{
      name: string
      completed: boolean
      dueDate?: string
    }>
  }>
  tasks?: Array<{
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
  }>
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "project" | "milestone" | "task"
  priority?: "high" | "medium" | "low"
  completed?: boolean
  projectTitle?: string
}

export function CalendarView({ selectedCalendar, projects = [], tasks = [] }: CalendarViewProps) {
  const { t, language } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

  const monthNames = t("months")
  const weekDays = t("daysShort")
  const weekDaysFull = Object.values(t("days"))

  // Generar eventos del calendario basados en proyectos, milestones y tareas
  const generateCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = []

    // Agregar tareas como eventos
    tasks.forEach((task) => {
      if (task.dueDate) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: task.dueDate,
          type: "task",
          priority: task.priority,
          completed: task.completed,
          projectTitle: task.project,
        })
      }
    })

    projects.forEach((project) => {
      // Agregar fecha de entrega del proyecto
      if (project.dueDate) {
        events.push({
          id: `project-${project.id}`,
          title: project.title,
          date: project.dueDate,
          type: "project",
          priority: project.priority,
          completed: project.status === "completed",
        })
      }

      // Agregar milestones con fecha
      project.milestones.forEach((milestone, index) => {
        if (milestone.dueDate) {
          events.push({
            id: `milestone-${project.id}-${index}`,
            title: milestone.name,
            date: milestone.dueDate,
            type: "milestone",
            completed: milestone.completed,
            projectTitle: project.title,
          })
        }
      })
    })

    return events
  }

  const calendarEvents = generateCalendarEvents()

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateString = date.toISOString().split("T")[0]
    return calendarEvents.filter((event) => event.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const days = direction === "prev" ? -7 : 7
      newDate.setDate(prev.getDate() + days)
      return newDate
    })
  }

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const days = direction === "prev" ? -1 : 1
      newDate.setDate(prev.getDate() + days)
      return newDate
    })
  }

  const handleNavigate = (direction: "prev" | "next") => {
    switch (view) {
      case "month":
        navigateMonth(direction)
        break
      case "week":
        navigateWeek(direction)
        break
      case "day":
        navigateDay(direction)
        break
    }
  }

  const getTitle = () => {
    switch (view) {
      case "month":
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      case "week":
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      case "day":
        return `${weekDaysFull[currentDate.getDay()]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    }
  }

  const getEventColor = (event: CalendarEvent) => {
    if (event.completed) {
      return "bg-green-500"
    }

    if (event.type === "task") {
      switch (event.priority) {
        case "high":
          return "bg-red-600"
        case "medium":
          return "bg-orange-500"
        case "low":
          return "bg-blue-600"
        default:
          return "bg-gray-500"
      }
    } else if (event.type === "project") {
      switch (event.priority) {
        case "high":
          return "bg-red-500"
        case "medium":
          return "bg-yellow-500"
        case "low":
          return "bg-blue-500"
        default:
          return "bg-gray-500"
      }
    } else {
      return "bg-purple-500"
    }
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const renderMonthView = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1)
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0)

    // Primer día de la semana que contiene el primer día del mes
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

    // Último día de la semana que contiene el último día del mes
    const endDate = new Date(lastDayOfMonth)
    endDate.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()))

    // Generar todas las fechas a mostrar
    const dates = []
    const currentDateIterator = new Date(startDate)

    while (currentDateIterator <= endDate) {
      dates.push(new Date(currentDateIterator))
      currentDateIterator.setDate(currentDateIterator.getDate() + 1)
    }

    const numberOfWeeks = Math.ceil(dates.length / 7)

    return (
      <div className="h-full flex flex-col">
        {/* Header de días de la semana */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div className="flex-1 grid grid-cols-7" style={{ gridTemplateRows: `repeat(${numberOfWeeks}, 1fr)` }}>
          {dates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month
            const isToday = date.toDateString() === new Date().toDateString()
            const dayEvents = getEventsForDate(date)

            return (
              <div
                key={index}
                className={`border-r border-b border-gray-200 p-2 hover:bg-gray-50 cursor-pointer last:border-r-0 flex flex-col ${
                  !isCurrentMonth ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-2 flex-shrink-0 ${
                    isToday
                      ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : isCurrentMonth
                        ? "text-gray-900"
                        : "text-gray-400"
                  }`}
                >
                  {date.getDate()}
                </div>

                <div className="space-y-1 flex-1 overflow-hidden">
                  {/* Mostrar hasta 2 eventos como texto */}
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs px-2 py-1 rounded border cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{
                        backgroundColor: event.completed
                          ? "#dcfce7"
                          : event.type === "task"
                            ? event.priority === "high"
                              ? "#fef2f2"
                              : event.priority === "medium"
                                ? "#fff7ed"
                                : "#eff6ff"
                            : event.type === "project"
                              ? event.priority === "high"
                                ? "#fef2f2"
                                : event.priority === "medium"
                                  ? "#fefce8"
                                  : "#eff6ff"
                              : "#faf5ff",
                        borderColor: event.completed
                          ? "#bbf7d0"
                          : event.type === "task"
                            ? event.priority === "high"
                              ? "#fecaca"
                              : event.priority === "medium"
                                ? "#fed7aa"
                                : "#bfdbfe"
                            : event.type === "project"
                              ? event.priority === "high"
                                ? "#fecaca"
                                : event.priority === "medium"
                                  ? "#fef08a"
                                  : "#bfdbfe"
                              : "#e9d5ff",
                        color: event.completed
                          ? "#166534"
                          : event.type === "task"
                            ? event.priority === "high"
                              ? "#dc2626"
                              : event.priority === "medium"
                                ? "#ea580c"
                                : "#2563eb"
                            : event.type === "project"
                              ? event.priority === "high"
                                ? "#dc2626"
                                : event.priority === "medium"
                                  ? "#d97706"
                                  : "#2563eb"
                              : "#7c3aed",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                      title={`${event.type === "milestone" ? `${event.projectTitle}: ` : event.type === "task" ? `Tarea: ` : ""}${event.title}`}
                    >
                      {event.type === "milestone" && "📍 "}
                      {event.type === "project" && "📋 "}
                      {event.type === "task" && "✓ "}
                      {event.title}
                    </div>
                  ))}

                  {/* Mostrar puntos de colores para eventos adicionales */}
                  {dayEvents.length > 2 && (
                    <div className="flex items-center space-x-1 mt-auto">
                      {dayEvents.slice(2, 7).map((event) => (
                        <div
                          key={event.id}
                          className={`w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform ${getEventColor(event)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event)
                          }}
                          title={`${event.type === "milestone" ? `${event.projectTitle}: ` : ""}${event.title}`}
                        />
                      ))}
                      {dayEvents.length > 7 && (
                        <span className="text-xs text-gray-500 ml-1">+{dayEvents.length - 7}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })

    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex flex-col h-full">
        {/* Header con días de la semana */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="w-16 p-3 border-r border-gray-200"></div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString()
            const dayEvents = getEventsForDate(date)
            return (
              <div key={index} className="flex-1 p-3 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-xs text-gray-500 mb-1">{weekDays[index]}</div>
                <div
                  className={`text-sm font-medium mb-2 ${
                    isToday
                      ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                      : "text-gray-900"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: event.completed
                          ? "#dcfce7"
                          : event.type === "project"
                            ? event.priority === "high"
                              ? "#fef2f2"
                              : event.priority === "medium"
                                ? "#fefce8"
                                : "#eff6ff"
                            : "#faf5ff",
                        borderColor: event.completed
                          ? "#bbf7d0"
                          : event.type === "project"
                            ? event.priority === "high"
                              ? "#fecaca"
                              : event.priority === "medium"
                                ? "#fef08a"
                                : "#bfdbfe"
                            : "#e9d5ff",
                        color: event.completed
                          ? "#166534"
                          : event.type === "project"
                            ? event.priority === "high"
                              ? "#dc2626"
                              : event.priority === "medium"
                                ? "#d97706"
                                : "#2563eb"
                            : "#7c3aed",
                      }}
                      onClick={() => handleEventClick(event)}
                      title={`${event.type === "milestone" ? `${event.projectTitle}: ` : ""}${event.title}`}
                    >
                      {event.type === "milestone" && "📍"}
                      {event.type === "project" && "📋"}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Grid de horas */}
        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b border-gray-100 last:border-b-0">
              <div className="w-16 p-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {weekDates.map((_, dayIndex) => (
                <div
                  key={`${hour}-${dayIndex}`}
                  className="flex-1 h-12 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 cursor-pointer relative"
                >
                  {/* Aquí se mostrarían los eventos de la hora */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDate(currentDate)

    return (
      <div className="flex flex-col h-full">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">
            {weekDaysFull[currentDate.getDay()]}, {currentDate.getDate()} {monthNames[currentDate.getMonth()]}
          </h3>
          {dayEvents.length > 0 && (
            <div className="space-y-1">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-sm px-2 py-1 rounded border inline-block mr-2 cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: event.completed
                      ? "#dcfce7"
                      : event.type === "project"
                        ? event.priority === "high"
                          ? "#fef2f2"
                          : event.priority === "medium"
                            ? "#fefce8"
                            : "#eff6ff"
                        : "#faf5ff",
                    borderColor: event.completed
                      ? "#bbf7d0"
                      : event.type === "project"
                        ? event.priority === "high"
                          ? "#fecaca"
                          : event.priority === "medium"
                            ? "#fef08a"
                            : "#bfdbfe"
                        : "#e9d5ff",
                    color: event.completed
                      ? "#166534"
                      : event.type === "project"
                        ? event.priority === "high"
                          ? "#dc2626"
                          : event.priority === "medium"
                            ? "#d97706"
                            : "#2563eb"
                        : "#7c3aed",
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  {event.type === "milestone" && "📍 "}
                  {event.type === "project" && "📋 "}
                  {event.title}
                  {event.type === "milestone" && event.projectTitle && (
                    <span className="text-xs opacity-75"> ({event.projectTitle})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b border-gray-100 last:border-b-0">
              <div className="w-16 p-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 h-12 hover:bg-gray-50 cursor-pointer p-2">
                {/* Aquí se mostrarían los eventos de la hora */}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header con controles */}
      <div className="flex items-center justify-between p-6 flex-shrink-0 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => handleNavigate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold min-w-0">{getTitle()}</h3>
            <Button variant="ghost" size="sm" onClick={() => handleNavigate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            {t("today")}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: "month", label: t("month") },
              { key: "week", label: t("week") },
              { key: "day", label: t("day") },
            ].map((viewType) => (
              <Button
                key={viewType.key}
                variant={view === viewType.key ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setView(viewType.key as any)}
              >
                {viewType.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendario principal */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full m-6 overflow-hidden">
          <div className="h-full">
            {view === "month" && renderMonthView()}
            {view === "week" && renderWeekView()}
            {view === "day" && renderDayView()}
          </div>
        </Card>
      </div>

      {/* Eventos próximos - solo en vista de mes */}
      {view === "month" && (
        <div className="flex-shrink-0 p-6 pt-0">
          {calendarEvents.length > 0 ? (
            <>
              <h4 className="text-lg font-semibold mb-4">{t("upcomingEvents")}</h4>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {calendarEvents
                  .filter((event) => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 6)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: event.completed
                          ? "#dcfce7"
                          : event.type === "project"
                            ? event.priority === "high"
                              ? "#fef2f2"
                              : event.priority === "medium"
                                ? "#fefce8"
                                : "#eff6ff"
                            : "#faf5ff",
                        borderColor: event.completed
                          ? "#bbf7d0"
                          : event.type === "project"
                            ? event.priority === "high"
                              ? "#fecaca"
                              : event.priority === "medium"
                                ? "#fef08a"
                                : "#bfdbfe"
                            : "#e9d5ff",
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {event.type === "milestone" && "📍 "}
                          {event.type === "project" && "📋 "}
                          {event.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(event.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </Badge>
                      </div>
                      {event.type === "milestone" && event.projectTitle && (
                        <p className="text-xs opacity-75 mt-1">{event.projectTitle}</p>
                      )}
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-semibold mb-4">{t("upcomingEvents")}</h4>
              <div className="text-center py-8 text-gray-500">
                <p>{t("noEventsScheduled")}</p>
                <p className="text-sm mt-2">{t("eventsWillAppear")}</p>
              </div>
            </>
          )}
        </div>
      )}

      <CreateTaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <EventDetailsDialog open={showEventDetails} onOpenChange={setShowEventDetails} event={selectedEvent} />
    </div>
  )
}
