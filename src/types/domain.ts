/**
 * Ad Agency Management Platform domain types.
 * These are frontend-facing models; the backend may use different column names.
 */

export type Priority = 'low' | 'medium' | 'high'
export type WorkStatus = 'backlog' | 'todo' | 'designing' | 'review' | 'done'
export type ViewMode = 'dashboard' | 'clients' | 'team' | 'work'

export interface Client {
  id: string
  name: string
  icon: string
  color: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
  assignedTaskCount: number
  createdAt: string
  updatedAt: string
}

export interface Checklist {
  total: number
  completed: number
}

export interface ActivityEntry {
  id: string
  user: string
  action: string
  time: string
}

export interface Work {
  id: string
  clientId: string
  columnId: WorkStatus
  title: string
  description: string
  imageUrl: string
  priority: Priority
  assignee: string
  dueDate: string
  comments: number
  attachments: number
  checklist: Checklist
  labels: string[]
  activity: ActivityEntry[]
  createdAt: string
  updatedAt: string
}

export interface CreateWorkInput {
  clientId: string
  title: string
  description?: string
  imageUrl?: string
  priority?: Priority
  assignee: string
  dueDate: string
  labels?: string[]
  checklistTotal?: number
}

export interface UpdateWorkInput extends Partial<CreateWorkInput> {
  columnId?: WorkStatus
  comments?: number
  attachments?: number
  checklist?: Checklist
}

export interface CreateTeamMemberInput {
  name: string
  role: string
  avatar?: string
  email?: string
}

export interface CreateClientInput {
  name: string
  icon?: string
  color?: string
  description?: string
}

export interface WorkFilters {
  searchTerm: string
  priority: Priority | 'all'
  assignee: string | 'all'
  status: WorkStatus | 'all'
}

export interface DashboardStats {
  totalWorks: number
  completedWorks: number
  overdueWorks: number
  activeClients: number
  teamMembers: number
}
