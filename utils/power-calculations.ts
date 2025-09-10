export function calculateTotalPowerConsumption(components: any[]): number {
  return components.reduce((total, component) => {
    if (component.powerConsumption) {
      return total + (component.powerConsumption || 0)
    }
    return total
  }, 0)
}

export function calculateTotalKva(components: any[]): number {
  return components.reduce((total, component) => {
    if (component.type == "ups") {
      return total + (component.capacityVA || 0)
    }
    return total
  }, 0)
}

export function calculateUPSAutonomy(components: any[]): number {
  // Fórmula simplificada: (Capacidad en VA * Eficiencia * Factor de batería) / Consumo en W
  // Factor de batería típico para UPS es ~0.7 para baterías en buen estado
  const totalConsumptionW = calculateTotalPowerConsumption(components)
  const totalCapacityVA = calculateTotalKva(components)
  const efficiency = 0.9
  const batteryFactor = 0.7
  const autonomyHours = (totalCapacityVA * efficiency * batteryFactor) / totalConsumptionW
  return Math.round(autonomyHours * 10) / 10 // Redondear a 1 decimal
}

export function getUPSLoadPercentage(totalConsumptionW: number, upsCapacityVA: number): number {
  return Math.round((totalConsumptionW / upsCapacityVA) * 100)
}
