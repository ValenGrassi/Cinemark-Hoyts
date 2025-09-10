"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="pt-12 pb-12">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Página No Encontrada</h1>
            <p className="text-gray-600 mb-8">La página que buscas no existe.</p>
            <Link href="/">
              <Button size="lg" className="cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
