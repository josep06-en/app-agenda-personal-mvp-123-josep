"use client"

import { useState } from "react"
import { Calendar, FolderOpen, CheckSquare, Settings, Users, ChevronRight, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SimpleCalendarDialog } from "@/components/simple-calendar-dialog"
import { InviteCollaboratorDialog } from "@/components/invite-collaborator-dialog"
import { useLanguage } from "@/contexts/language-context"

interface CalendarItem {
  id: string
  name: string
  color: string
  tasks: number
}

interface SidebarProps {
  currentView: "calendar" | "projects" | "tasks"
  setCurrentView: (view: "calendar" | "projects" | "tasks") => void
  selectedCalendar: string
  setSelectedCalendar: (calendar: string) => void
  calendars: CalendarItem[]
  onCreateCalendar: (calendar: { name: string; description: string; color: string }) => void
}

export function Sidebar({
  currentView,
  setCurrentView,
  selectedCalendar,
  setSelectedCalendar,
  calendars,
  onCreateCalendar,
}: SidebarProps) {
  const { t } = useLanguage()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [expandedCalendars, setExpandedCalendars] = useState(true)

  const menuItems = [
    { id: "calendar", label: t("calendar"), icon: Calendar },
    { id: "projects", label: t("projects"), icon: FolderOpen },
    { id: "tasks", label: t("tasks"), icon: CheckSquare },
  ]

  const handleCreateCalendar = (name: string) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    onCreateCalendar({
      name,
      description: "",
      color: randomColor,
    })
  }

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Agenda</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-9 text-sm font-medium"
                  onClick={() => setCurrentView(item.id as any)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto font-medium text-gray-700"
                onClick={() => setExpandedCalendars(!expandedCalendars)}
              >
                {expandedCalendars ? (
                  <ChevronDown className="mr-1 h-3 w-3" />
                ) : (
                  <ChevronRight className="mr-1 h-3 w-3" />
                )}
                {t("calendars")} ({calendars.length})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowCreateDialog(true)}
                title={t("newCalendar")}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {expandedCalendars && (
              <div className="space-y-1">
                {calendars.map((calendar) => (
                  <Button
                    key={calendar.id}
                    variant={selectedCalendar === calendar.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-8 text-sm"
                    onClick={() => setSelectedCalendar(calendar.id)}
                  >
                    <div className={`mr-2 h-2 w-2 rounded-full ${calendar.color}`} />
                    <span className="flex-1 text-left">{calendar.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {calendar.tasks}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-t border-gray-100 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-9 text-sm"
            onClick={() => setShowInviteDialog(true)}
          >
            <Users className="mr-3 h-4 w-4" />
            {t("inviteCollaborators")}
          </Button>
          <Button variant="ghost" className="w-full justify-start h-9 text-sm">
            <Settings className="mr-3 h-4 w-4" />
            {t("settings")}
          </Button>
        </div>
      </div>

      <SimpleCalendarDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateCalendar}
      />

      <InviteCollaboratorDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} />
    </>
  )
}
