export interface ExcelCinemaData {
  cinemaName: string
  location: string
  address: string
  components: any[]
}

export function parseExcelData(data: any[]): ExcelCinemaData {
  // This would parse actual Excel data
  // For now, we'll return mock data structure
  return {
    cinemaName: data[0]?.cinemaName || 'Unknown Cinema',
    location: data[0]?.location || 'Unknown Location',
    address: data[0]?.address || 'Unknown Address',
    components: data || []
  }
}

export function convertExcelToRackComponents(excelData: any[]): RackComponent[] {
  return excelData.map((row, index) => ({
    id: `component-${index}`,
    type: row.type || 'server',
    name: row.name || `Component ${index + 1}`,
    status: row.status || 'online',
    position: row.position || index + 1,
    specs: {
      cpu: row.cpu,
      ram: row.ram,
      storage: row.storage,
      temperature: row.temperature,
      powerUsage: row.powerUsage,
      capacity: row.capacity,
      batteryHealth: row.batteryHealth,
      loadPercentage: row.loadPercentage,
      estimatedRuntime: row.estimatedRuntime
    },
    description: row.description,
    batteryInstallDate: row.batteryInstallDate,
    batteryLifespan: row.batteryLifespan || 36
  }))
}
