export function calculateBatteryRemainingLife(installDate: string): number {
  const install = new Date(installDate)
  const now = new Date()
  const monthsUsed = (now.getFullYear() - install.getFullYear()) * 12 + (now.getMonth() - install.getMonth())
  return Math.max(0, 48 - monthsUsed)
}

export function isBatteryDueForReplacement(installDate: string, warningMonths: number = 12): boolean {
  const remainingMonths = calculateBatteryRemainingLife(installDate)
  return remainingMonths <= warningMonths
}

export function getBatteryStatusColor(installDate: string): string {
  const remainingMonths = calculateBatteryRemainingLife(installDate)
  if (remainingMonths <= 6) return '#ef4444' // Rojo - Crítico
  if (remainingMonths <= 12) return '#f59e0b' // Amarillo - Advertencia
  return '#22c55e' // Verde - Bueno
}
