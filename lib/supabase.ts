import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  language: string
  tutorial_completed: boolean
  created_at: string
  updated_at: string
}

export interface Calendar {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  calendar_id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  due_date?: string
  assignee_name?: string
  assignee_avatar?: string
  project_name?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  calendar_id: string
  title: string
  description?: string
  progress: number
  due_date?: string
  priority: "low" | "medium" | "high"
  status: "in-progress" | "near-completion" | "completed"
  team_members: Array<{ name: string; avatar: string }>
  milestones: Array<{ name: string; completed: boolean; dueDate?: string }>
  created_at: string
  updated_at: string
}
