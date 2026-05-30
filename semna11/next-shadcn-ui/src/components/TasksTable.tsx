"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

interface TasksTableProps {
  tasks: any[]
  setTasks: (tasks: any[]) => void
}

export function TasksTable({ tasks, setTasks }: TasksTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [date, setDate] = useState<Date>()
  
  const [newTask, setNewTask] = useState({
    description: "",
    projectId: "",
    status: "Pendiente",
    priority: "Baja",
    userId: ""
  })

  const itemsPerPage = 5
  
  const currentTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return tasks.slice(startIndex, startIndex + itemsPerPage)
  }, [tasks, currentPage])

  const totalPages = Math.ceil(tasks.length / itemsPerPage)

  const handleAddTask = () => {
    if (!newTask.description || !date || !newTask.projectId) {
      setError("La descripción, el proyecto y la fecha son obligatorios.")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulación de petición al backend (Spinner)
    setTimeout(() => {
      const taskToAdd = {
        ...newTask,
        id: Date.now(),
        title: newTask.description.substring(0, 20) + "...",
        dueDate: format(date, "yyyy-MM-dd")
      }
      setTasks([taskToAdd, ...tasks])
      setIsLoading(false)
      setIsAdding(false)
      setNewTask({ description: "", projectId: "", status: "Pendiente", priority: "Baja", userId: "" })
      setDate(undefined)
    }, 800)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Validación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setIsAdding(!isAdding)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> {isAdding ? "Cancelar" : "Nueva Tarea"}
        </Button>
      </div>

      {isAdding && (
        <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50/50">
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="¿Qué hay que hacer?" />
          </div>
          <div className="space-y-2">
            <Label>Proyecto ID</Label>
            <Input value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} placeholder="ID del proyecto" />
          </div>
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Input value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} placeholder="Alta, Media, Baja" />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label className="mb-2">Fecha Límite (Dateline)</Label>
            <Popover>
              <PopoverTrigger className={buttonVariants({ variant: "outline", className: "justify-start text-left font-normal" })}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <Button className="col-span-2" onClick={handleAddTask} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar Tarea
          </Button>
        </div>
      )}

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell><Badge variant="outline">{task.status}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={task.priority === "Alta" ? "destructive" : "secondary"}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{task.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>
                    Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-4">No hay tareas.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
          </PaginationItem>
          <PaginationItem>
            <span className="text-sm px-4">Página {currentPage} de {totalPages || 1}</span>
          </PaginationItem>
          <PaginationItem>
            <Button variant="ghost" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Siguiente</Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
