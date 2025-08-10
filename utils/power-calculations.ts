export function calculateTotalPowerConsumption(components: any[]): number {
  return components.reduce((total, component) => {
    if (component.type !== 'ups') {
      return total + (component.powerConsumption?.current || 0)
    }
    return total
  }, 0)
}

export function calculateUPSAutonomy(upsCapacityVA: number, totalConsumptionW: number, efficiency: number = 0.9): number {
  // Fórmula simplificada: (Capacidad en VA * Eficiencia * Factor de batería) / Consumo en W
  // Factor de batería típico para UPS es ~0.7 para baterías en buen estado
  const batteryFactor = 0.7
  const autonomyHours = (upsCapacityVA * efficiency * batteryFactor) / totalConsumptionW
  return Math.round(autonomyHours * 10) / 10 // Redondear a 1 decimal
}

export function getUPSLoadPercentage(totalConsumptionW: number, upsCapacityVA: number): number {
  return Math.round((totalConsumptionW / upsCapacityVA) * 100)
}
