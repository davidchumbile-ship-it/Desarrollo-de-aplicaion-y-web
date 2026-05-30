"use client"

import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TeamTable({ data, setData }: any) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [birthdate, setBirthdate] = useState<Date>()

  const [newMember, setNewMember] = useState({
    name: "", role: "", email: "", position: "", phone: "", projectId: ""
  })

  const handleAdd = () => {
    if (!newMember.name || !newMember.email || !birthdate) {
      setError("Nombre, Email y Fecha de nacimiento son obligatorios.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      const member = {
        ...newMember,
        userId: Math.random().toString(36).substr(2, 9),
        birthdate,
        isActive: true,
        projectId: newMember.projectId || "Sin asignar"
      }
      setData([...data, member])
      setLoading(false)
      setError("")
      setNewMember({ name: "", role: "", email: "", position: "", phone: "", projectId: "" })
      setBirthdate(undefined)
    }, 800)
  }

  return (
    <div className="space-y-6">
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      
      <div className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-indigo-50/30">
        <div className="space-y-1">
          <Label>Nombre</Label>
          <Input size={1} value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
        </div>
        <div className="space-y-1">
          <Label>Rol</Label>
          <Input value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} />
        </div>
        <div className="space-y-1">
          <Label>Posición</Label>
          <Input value={newMember.position} onChange={e => setNewMember({...newMember, position: e.target.value})} />
        </div>
        <div className="space-y-1">
          <Label>ID Proyecto</Label>
          <Input value={newMember.projectId} onChange={e => setNewMember({...newMember, projectId: e.target.value})} placeholder="P-101" />
        </div>
        <div className="space-y-1">
          <Label>Teléfono</Label>
          <Input value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
        </div>
        <div className="space-y-1 flex flex-col">
          <Label className="mb-1">Cumpleaños</Label>
          <Popover>
            <PopoverTrigger className={buttonVariants({ variant: "outline", className: "w-full justify-start text-left font-normal h-10" })}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthdate ? format(birthdate, "dd/MM/yyyy") : <span>Fecha</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={birthdate} onSelect={setBirthdate} /></PopoverContent>
          </Popover>
        </div>
        <Button className="col-span-3 mt-2" onClick={handleAdd} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Añadir al Equipo"}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Email / Tel</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((m: any) => (
              <TableRow key={m.userId}>
                <TableCell>
                  <p className="font-bold text-indigo-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role} • {m.position}</p>
                  <p className="text-[10px] text-muted-foreground">Nac: {m.birthdate ? format(m.birthdate, "dd/MM/yyyy") : "N/A"}</p>
                </TableCell>
                <TableCell className="text-sm">
                  <div>{m.email}</div>
                  <div className="text-xs text-muted-foreground">{m.phone}</div>
                </TableCell>
                <TableCell className="text-sm">{m.projectId}</TableCell>
                <TableCell><Badge variant="outline">{m.isActive ? "Activo" : "Inactivo"}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setData(data.filter((x: any) => x.userId !== m.userId))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}