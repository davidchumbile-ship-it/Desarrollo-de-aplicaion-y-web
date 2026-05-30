"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import { TeamTable } from "@/components/TeamTable"
import { SettingsForm } from "@/components/SettingsForm"
import { Loader2, Trash2, Eye } from "lucide-react"

export default function DashboardPage() {
  // Estados para persistencia en memoria
  const [projects, setProjects] = useState([
    { id: 1, title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65, team: 5 },
    { id: 2, title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90, team: 3 },
    { id: 3, title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", status: "Planificado", progress: 20, team: 4 },
  ])

  const [team, setTeam] = useState([
    { userId: "1", role: "Frontend Developer", name: "María García", email: "maria@example.com", position: "Senior", birthdate: new Date(1995, 5, 15), phone: "999888777", projectId: "1", isActive: true },
    { userId: "2", role: "Backend Developer", name: "Juan Pérez", email: "juan@example.com", position: "Lead", birthdate: new Date(1990, 2, 20), phone: "999111222", projectId: "1", isActive: true },
  ])

  const [tasks, setTasks] = useState([
    { id: 1, title: "Implementar autenticación", description: "Configurar NextAuth", projectId: "1", status: "En progreso", priority: "Alta", userId: "1", dueDate: "2025-11-15" },
  ])

  const [isLoading, setIsLoading] = useState(false)

  // Lógica de Negocio: Métricas calculadas
  const metrics = {
    totalProjects: projects.length,
    completedTasks: tasks.filter(t => t.status === "Completado").length,
    activeMembers: team.filter(m => m.isActive).length,
    avgProgress: Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1))
  }

  const handleDeleteProject = (id: number) => {
    setIsLoading(true)
    setTimeout(() => {
      setProjects(projects.filter(p => p.id !== id))
      setIsLoading(false)
    }, 800)
  }

  const handleAddProject = (newProject: any) => {
    setProjects([...projects, { ...newProject, id: projects.length + 1, progress: 0, team: 0 }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-950 mb-2">
            Dashboard de Proyectos
          </h1>
          <p className="text-slate-600">
            Gestión avanzada de recursos y flujos de trabajo
          </p>
          <div className="pt-4">
            <ProjectForm onAddProject={handleAddProject} />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 border">
            <TabsTrigger value="overview">📊 Resumen</TabsTrigger>
            <TabsTrigger value="projects">📁 Proyectos</TabsTrigger>
            <TabsTrigger value="team">👥 Equipo</TabsTrigger>
            <TabsTrigger value="tasks">✅ Tareas</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                  <span className="text-xl">📁</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progreso Medio</CardTitle>
                  <span className="text-xl">📈</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.avgProgress}%</div>
                  <p className="text-xs text-muted-foreground">Rendimiento general</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tareas Listas</CardTitle>
                  <span className="text-xl">✅</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.completedTasks}</div>
                  <p className="text-xs text-muted-foreground">Finalizadas este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
                  <span className="text-xl">👥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.activeMembers}</div>
                  <p className="text-xs text-muted-foreground">+1 nuevo miembro</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
                    { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
                    { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
                    { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} <span className="font-medium">{activity.task}</span>
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant={project.status === "Completado" ? "default" : project.status === "En revisión" ? "secondary" : "outline"}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-xs">👥 {project.team} miembros</span>
                        </div>
                        <div className="flex gap-2">
                           <Button size="sm" variant="outline" onClick={() => alert(`Detalles de: ${project.title}`)}>
                            <Eye className="h-4 w-4" />
                           </Button>
                           <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamTable data={team} setData={setTeam} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tasks */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable tasks={tasks} setTasks={setTasks} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}