"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SettingsForm() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl space-y-6">
      {saved && <Alert className="bg-green-50 border-green-200 text-green-800"><AlertDescription>Configuración guardada correctamente.</AlertDescription></Alert>}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Nombre de la Organización</Label>
          <Input defaultValue="Mi Empresa Tech" />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label>Notificaciones por correo</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label>Modo de mantenimiento</Label>
          <Switch />
        </div>
      </div>
      <Button onClick={handleSave} className="w-full">Guardar Preferencias</Button>
    </div>
  )
}