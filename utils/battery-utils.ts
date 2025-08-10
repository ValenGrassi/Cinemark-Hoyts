export function calculateBatteryRemainingLife(installDate: string, lifespanMonths: number): number {
  const install = new Date(installDate)
  const now = new Date()
  const monthsUsed = (now.getFullYear() - install.getFullYear()) * 12 + (now.getMonth() - install.getMonth())
  return Math.max(0, lifespanMonths - monthsUsed)
}

export function isBatteryDueForReplacement(installDate: string, lifespanMonths: number, warningMonths: number = 12): boolean {
  const remainingMonths = calculateBatteryRemainingLife(installDate, lifespanMonths)
  return remainingMonths <= warningMonths
}

export function getBatteryStatusColor(installDate: string, lifespanMonths: number): string {
  const remainingMonths = calculateBatteryRemainingLife(installDate, lifespanMonths)
  if (remainingMonths <= 6) return '#ef4444' // Rojo - Crítico
  if (remainingMonths <= 12) return '#f59e0b' // Amarillo - Advertencia
  return '#22c55e' // Verde - Bueno
}
