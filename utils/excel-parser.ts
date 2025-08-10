import * as XLSX from "xlsx"

export interface ExcelCinemaData {
  cinemaName: string
  location: string
  address: string
  totalKVA: number
  totalConsumption: number
  estimatedAutonomy: number
  lastBatteryChange: string
  nextBatteryChange: string
  hasGenerator: boolean
  components: any[]
  upsComponents: any[]
  patchPanelPorts: any[]
}

export interface ParsedComponent {
  id: string
  type: "server" | "patch-panel" | "ups" | "switch" | "router" | "firewall" | "wireless-controller" | "converter"
  name: string
  model?: string
  brand?: string
  status: "online" | "offline" | "warning" | "maintenance"
  position: number
  powerConsumption: {
    min: number
    max: number
    current: number
  }
  specs?: {
    cpu?: string
    ram?: string
    storage?: string
    temperature?: number
    powerUsage?: number
    ports?: number
    connections?: number
    capacity?: string
    batteryHealth?: number
    loadPercentage?: number
    estimatedRuntime?: number
    portDetails?: any[]
  }
  description?: string
  batteryInstallDate?: string
  batteryLifespan?: number
}

export function parseExcelFile(file: File): Promise<ExcelCinemaData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        const parsedData = parseExcelData(jsonData as any[][])
        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Error reading file"))
    reader.readAsArrayBuffer(file)
  })
}

function parseExcelData(data: any[][]): ExcelCinemaData {
  const result: ExcelCinemaData = {
    cinemaName: "",
    location: "",
    address: "",
    totalKVA: 0,
    totalConsumption: 0,
    estimatedAutonomy: 0,
    lastBatteryChange: "",
    nextBatteryChange: "",
    hasGenerator: false,
    components: [],
    upsComponents: [],
    patchPanelPorts: [],
  }

  // Parse basic information (first section)
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 2) continue

    const label = String(row[0] || "").toLowerCase()
    const value = row[1]

    if (label.includes("nombre del cine") || label.includes("cinema name")) {
      result.cinemaName = String(value || "")
      // Extract location from cinema name if it contains " - "
      const parts = result.cinemaName.split(" - ")
      if (parts.length > 1) {
        result.location = parts[1].trim()
      } else {
        result.location = result.cinemaName
      }
    } else if (label.includes("dirección") || label.includes("address")) {
      result.address = String(value || "")
    } else if (label.includes("kva totales") || label.includes("total kva")) {
      result.totalKVA = Number(value) || 0
    } else if (label.includes("consumo total") || label.includes("total consumption")) {
      result.totalConsumption = Number(value) || 0
    } else if (label.includes("autonomía estimada") || label.includes("estimated autonomy")) {
      result.estimatedAutonomy = Number(value) || 0
    } else if (label.includes("fecha último cambio") || label.includes("last battery change")) {
      result.lastBatteryChange = String(value || "")
    } else if (label.includes("fecha próxima") || label.includes("next battery change")) {
      result.nextBatteryChange = String(value || "")
    } else if (label.includes("generador") || label.includes("generator")) {
      result.hasGenerator =
        String(value || "")
          .toLowerCase()
          .includes("sí") ||
        String(value || "")
          .toLowerCase()
          .includes("yes")
    }
  }

  // Parse UPS components
  let upsStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    if (
      String(data[i]?.[0] || "")
        .toLowerCase()
        .includes("ups id")
    ) {
      upsStartIndex = i + 1
      break
    }
  }

  if (upsStartIndex > -1) {
    for (let i = upsStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 4 || !row[0]) break

      const upsId = String(row[0])
      const brand = String(row[1] || "")
      const model = String(row[2] || "")
      const capacity = Number(row[3]) || 0

      if (upsId && brand && model) {
        result.upsComponents.push({
          id: upsId,
          brand,
          model,
          capacity,
          capacityVA: capacity,
        })
      }
    }
  }

  // Parse main components
  let componentsStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      row.length >= 3 &&
      String(row[0] || "")
        .toLowerCase()
        .includes("tipo") &&
      String(row[1] || "")
        .toLowerCase()
        .includes("marca") &&
      String(row[2] || "")
        .toLowerCase()
        .includes("modelo")
    ) {
      componentsStartIndex = i + 1
      break
    }
  }

  if (componentsStartIndex > -1) {
    let position = 1
    for (let i = componentsStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 3 || !row[0]) {
        // Check if we've reached patch panel section
        if (
          String(row?.[0] || "")
            .toLowerCase()
            .includes("patchpanel") ||
          String(row?.[0] || "")
            .toLowerCase()
            .includes("patch panel")
        ) {
          break
        }
        continue
      }

      const type = String(row[0] || "").toLowerCase()
      const brand = String(row[1] || "")
      const model = String(row[2] || "")
      const consumption = Number(row[3]) || 0

      if (type && brand && model) {
        const componentType = mapComponentType(type)
        const component = {
          id: `${componentType}-${position}`,
          type: componentType,
          name: `${brand} ${model}`,
          brand,
          model,
          status: "online" as const,
          position,
          powerConsumption: {
            min: Math.floor(consumption * 0.7),
            max: Math.floor(consumption * 1.3),
            current: consumption,
          },
          specs: {
            powerUsage: consumption,
          },
        }

        // Add specific specs based on type
        if (componentType === "ups") {
          const upsData = result.upsComponents.find(
            (ups) => ups.brand.toLowerCase() === brand.toLowerCase() && ups.model.toLowerCase() === model.toLowerCase(),
          )

          component.specs = {
            ...component.specs,
            capacity: `${upsData?.capacityVA || 1000}VA / ${Math.floor((upsData?.capacityVA || 1000) * 0.9)}W`,
            batteryHealth: 90,
            loadPercentage: Math.floor((consumption / (upsData?.capacityVA || 1000)) * 100),
            estimatedRuntime: Math.floor(result.estimatedAutonomy * 60),
          }
          component.batteryInstallDate = result.lastBatteryChange
          component.batteryLifespan = 48 // 4 years in months
        }

        result.components.push(component)
        position++
      }
    }
  }

  // Parse patch panel ports
  let patchPanelStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      String(row[0] || "")
        .toLowerCase()
        .includes("patchpanel id")
    ) {
      patchPanelStartIndex = i + 1
      break
    }
  }

  if (patchPanelStartIndex > -1) {
    for (let i = patchPanelStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 4 || !row[0]) break

      const ppId = String(row[0])
      const totalPorts = Number(row[1]) || 0
      const portNumber = Number(row[2]) || 0
      const status = String(row[3] || "").toLowerCase()

      if (ppId && totalPorts && portNumber) {
        result.patchPanelPorts.push({
          patchPanelId: ppId,
          totalPorts,
          portNumber,
          isConnected: status.includes("usado") || status.includes("used"),
          status: status.includes("usado") || status.includes("used") ? "active" : "inactive",
        })
      }
    }
  }

  // Parse port details JSON (look for JSON column)
  let portDetailsStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      String(row[0] || "")
        .toLowerCase()
        .includes("nº puertos")
    ) {
      portDetailsStartIndex = i + 1
      break
    }
  }

  if (portDetailsStartIndex > -1) {
    let componentIndex = 0
    for (let i = portDetailsStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 3) continue

      const totalPorts = Number(row[0]) || 0
      const usedPorts = Number(row[1]) || 0
      const jsonDetails = String(row[2] || "{}")

      if (totalPorts > 0 && componentIndex < result.components.length) {
        const component = result.components[componentIndex]

        // Only add port details to network devices and patch panels
        if (["switch", "router", "firewall", "wireless-controller", "patch-panel"].includes(component.type)) {
          component.specs = {
            ...component.specs,
            ports: totalPorts,
            connections: usedPorts,
          }

          // Parse JSON port details
          try {
            const portDetails = JSON.parse(jsonDetails)
            const portConnections: any[] = []

            Object.entries(portDetails).forEach(([portRange, connection]) => {
              if (portRange.includes("-")) {
                // Handle port ranges like "1-20"
                const [start, end] = portRange.split("-").map(Number)
                for (let p = start; p <= end; p++) {
                  portConnections.push({
                    portNumber: p,
                    isConnected: true,
                    connectedTo: String(connection),
                    status: "active",
                  })
                }
              } else {
                // Handle single ports
                const portNum = Number(portRange)
                if (portNum) {
                  portConnections.push({
                    portNumber: portNum,
                    isConnected: true,
                    connectedTo: String(connection),
                    status: "active",
                  })
                }
              }
            })

            // Fill remaining ports as inactive
            for (let p = 1; p <= totalPorts; p++) {
              if (!portConnections.find((pc) => pc.portNumber === p)) {
                portConnections.push({
                  portNumber: p,
                  isConnected: false,
                  status: "inactive",
                })
              }
            }

            component.specs.portDetails = portConnections.sort((a, b) => a.portNumber - b.portNumber)
          } catch (e) {
            console.warn("Error parsing JSON port details:", e)
          }
        }

        componentIndex++
      }
    }
  }

  return result
}

function mapComponentType(
  type: string,
): "server" | "patch-panel" | "ups" | "switch" | "router" | "firewall" | "wireless-controller" | "converter" {
  const lowerType = type.toLowerCase()

  if (lowerType.includes("firewall")) return "firewall"
  if (lowerType.includes("router")) return "router"
  if (lowerType.includes("switch")) return "switch"
  if (lowerType.includes("wlc") || lowerType.includes("wireless")) return "wireless-controller"
  if (lowerType.includes("servidor") || lowerType.includes("server")) return "server"
  if (lowerType.includes("ap") || lowerType.includes("access point")) return "wireless-controller"
  if (lowerType.includes("patch") || lowerType.includes("panel")) return "patch-panel"
  if (lowerType.includes("ups")) return "ups"
  if (lowerType.includes("converter") || lowerType.includes("conversor")) return "converter"

  return "server" // default
}

export function convertExcelToRackComponents(excelData: ExcelCinemaData): any[] {
  const components = excelData.components.map((comp, index) => ({
    id: comp.id,
    type: comp.type,
    name: comp.name,
    model: comp.model,
    status: comp.status,
    position: comp.position,
    powerConsumption: comp.powerConsumption,
    specs: comp.specs,
    description: `${comp.brand} ${comp.model} - ${comp.type.replace("-", " ").toUpperCase()}`,
    batteryInstallDate: comp.batteryInstallDate,
    batteryLifespan: comp.batteryLifespan,
  }))

  // Add patch panels based on patch panel ports data
  const patchPanels = new Map()
  excelData.patchPanelPorts.forEach((port) => {
    if (!patchPanels.has(port.patchPanelId)) {
      patchPanels.set(port.patchPanelId, {
        id: port.patchPanelId,
        type: "patch-panel",
        name: `Panel de Conexiones ${port.patchPanelId}`,
        status: "online",
        position: components.length + patchPanels.size + 1,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          ports: port.totalPorts,
          connections: 0,
          portDetails: [],
        },
        description: `Panel de conexiones de ${port.totalPorts} puertos`,
      })
    }
  })

  // Add port details to patch panels
  excelData.patchPanelPorts.forEach((port) => {
    const patchPanel = patchPanels.get(port.patchPanelId)
    if (patchPanel) {
      patchPanel.specs.portDetails.push({
        portNumber: port.portNumber,
        isConnected: port.isConnected,
        status: port.status,
        connectedTo: port.isConnected ? "Dispositivo conectado" : undefined,
      })

      if (port.isConnected) {
        patchPanel.specs.connections++
      }
    }
  })

  // Add patch panels to components
  patchPanels.forEach((pp) => {
    components.push(pp)
  })

  return components
}
