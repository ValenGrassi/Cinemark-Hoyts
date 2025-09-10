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
  powerConsumption: number
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
  isUsed?: boolean
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

  // Parse basic information - look for specific labels in column A
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 2) continue

    const label = String(row[0] || "")
      .toLowerCase()
      .trim()
    const value = row[1]

    if (label === "nombre del cine") {
      result.cinemaName = String(value || "")
      result.location = result.cinemaName // Use cinema name as location
    } else if (label === "dirección") {
      result.address = String(value || "")
    } else if (label === "kva totales del rack (suma ups)") {
      result.totalKVA = Number(value) || 0
    } else if (label === "consumo total de componentes (w)") {
      result.totalConsumption = Number(value) || 0
    } else if (label === "autonomía estimada (hr)") {
      result.estimatedAutonomy = Number(value) || 0
    } else if (label === "fecha último cambio de baterías") {
      result.lastBatteryChange = String(value || "")
    } else if (label === "fecha próxima de cambio (aprox +4 años)") {
      result.nextBatteryChange = String(value || "")
    } else if (label === "¿tiene generador?") {
      result.hasGenerator = String(value || "")
        .toLowerCase()
        .includes("sí")
    }
  }

  // Parse UPS components - find the UPS table
  let upsStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      String(row[0] || "")
        .toLowerCase()
        .trim() === "ups id"
    ) {
      upsStartIndex = i + 1
      break
    }
  }

  if (upsStartIndex > -1) {
    for (let i = upsStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 4 || !row[0] || String(row[0]).toLowerCase().includes("tipo")) break

      const upsId = String(row[0])
      const brand = String(row[1] || "")
      const model = String(row[2] || "")
      const capacity = Number(row[3]) || 0

      if (upsId && brand && model && capacity > 0) {
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

  // Parse main components - find the components table (Tipo, Marca, Modelo, Consumo)
  let componentsStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      row.length >= 4 &&
      String(row[0] || "")
        .toLowerCase()
        .trim() === "tipo" &&
      String(row[1] || "")
        .toLowerCase()
        .trim() === "marca" &&
      String(row[2] || "")
        .toLowerCase()
        .trim() === "modelo" &&
      String(row[3] || "")
        .toLowerCase()
        .includes("consumo")
    ) {
      componentsStartIndex = i + 1
      break
    }
  }

  // Parse component status table (Estado, Nº Puertos, Puertos usados)
  const componentStatusAndPorts: Array<{
    estado: string
    totalPorts: number
    usedPorts: number
  }> = []

  let statusStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      row.length >= 3 &&
      String(row[0] || "")
        .toLowerCase()
        .includes("estado") &&
      String(row[1] || "")
        .toLowerCase()
        .includes("nº puertos")
    ) {
      statusStartIndex = i + 1
      break
    }
  }

  if (statusStartIndex > -1) {
    for (let i = statusStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 3) continue

      const estado = String(row[0] || "")
        .toLowerCase()
        .trim()
      const totalPorts = Number(row[1]) || 0
      const usedPorts = Number(row[2]) || 0

      // Stop when we reach other sections
      if (estado.includes("detalle") || estado.includes("ubicación")) break

      if (estado && (estado.includes("usado") || estado.includes("sin usar"))) {
        componentStatusAndPorts.push({
          estado,
          totalPorts,
          usedPorts,
        })
      }
    }
  }

  // Parse JSON port details - find the "Detalle de puertos (JSON)" column
  const componentPortDetails: Array<string> = []
  let jsonStartIndex = -1
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (
      row &&
      String(row[0] || "")
        .toLowerCase()
        .includes("detalle de puertos") &&
      String(row[0] || "")
        .toLowerCase()
        .includes("json")
    ) {
      jsonStartIndex = i + 1
      break
    }
  }

  if (jsonStartIndex > -1) {
    for (let i = jsonStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 1) continue

      const jsonDetails = String(row[0] || "{}")
      componentPortDetails.push(jsonDetails)

      // Stop when we reach empty rows or other sections
      if (!jsonDetails || jsonDetails.trim() === "" || jsonDetails === "{}") {
        break
      }
    }
  }

  // Create components from the main components list
  if (componentsStartIndex > -1) {
    let position = 1
    let componentIndex = 0

    for (let i = componentsStartIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length < 4) continue

      const type = String(row[0] || "").trim()
      const brand = String(row[1] || "").trim()
      const model = String(row[2] || "").trim()
      const consumption = Number(row[3]) || 0

      // Stop when we reach other sections or empty rows
      if (
        !type ||
        !brand ||
        !model ||
        type.toLowerCase().includes("patchpanel") ||
        type.toLowerCase().includes("estado") ||
        type.toLowerCase().includes("detalle")
      ) {
        break
      }

      const componentType = mapComponentType(type)

      // Get status and port info for this component
      const statusInfo = componentStatusAndPorts[componentIndex] || {
        estado: "usado",
        totalPorts: 0,
        usedPorts: 0,
      }

      const isUsed = statusInfo.estado.includes("usado")

      const component = {
        id: `${componentType}-${position}`,
        type: componentType,
        name: `${brand} ${model}`,
        brand,
        model,
        status: isUsed ? ("online" as const) : ("maintenance" as const),
        position,
        isUsed,
        powerConsumption: consumption,
        specs: {
          powerUsage: consumption,
        },
      }

      // Add port details for network components
      if (["switch", "router", "firewall", "wireless-controller"].includes(componentType)) {
        component.specs.ports = statusInfo.totalPorts
        component.specs.connections = statusInfo.usedPorts

        // Parse JSON port details
        const jsonDetails = componentPortDetails[componentIndex] || "{}"
        if (jsonDetails && jsonDetails !== "{}" && jsonDetails.trim() !== "") {
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
                    description: `Conectado a ${connection}`,
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
                    description: `Conectado a ${connection}`,
                  })
                }
              }
            })

            // Fill remaining ports as inactive
            const maxPorts = statusInfo.totalPorts || Math.max(...portConnections.map((p) => p.portNumber), 24)
            for (let p = 1; p <= maxPorts; p++) {
              if (!portConnections.find((pc) => pc.portNumber === p)) {
                portConnections.push({
                  portNumber: p,
                  isConnected: false,
                  status: "inactive",
                  description: "Puerto libre",
                })
              }
            }

            component.specs.portDetails = portConnections.sort((a, b) => a.portNumber - b.portNumber)
          } catch (e) {
            console.warn("Error parsing JSON port details:", e)
            // Create default port structure if JSON parsing fails
            if (statusInfo.totalPorts > 0) {
              const defaultPorts = []
              for (let p = 1; p <= statusInfo.totalPorts; p++) {
                defaultPorts.push({
                  portNumber: p,
                  isConnected: p <= statusInfo.usedPorts,
                  status: p <= statusInfo.usedPorts ? "active" : "inactive",
                  description: p <= statusInfo.usedPorts ? "Puerto en uso" : "Puerto libre",
                })
              }
              component.specs.portDetails = defaultPorts
            }
          }
        } else if (statusInfo.totalPorts > 0) {
          // Create default port structure when no JSON is provided
          const defaultPorts = []
          for (let p = 1; p <= statusInfo.totalPorts; p++) {
            defaultPorts.push({
              portNumber: p,
              isConnected: p <= statusInfo.usedPorts,
              status: p <= statusInfo.usedPorts ? "active" : "inactive",
              description: p <= statusInfo.usedPorts ? "Puerto en uso" : "Puerto libre",
            })
          }
          component.specs.portDetails = defaultPorts
        }
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
      componentIndex++
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
        .trim() === "patchpanel id"
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
    description: `${comp.brand} ${comp.model} - ${comp.type.replace("-", " ").toUpperCase()}${comp.isUsed === false ? " (SIN USAR)" : ""}`,
    batteryInstallDate: comp.batteryInstallDate,
    batteryLifespan: comp.batteryLifespan,
    isUsed: comp.isUsed,
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
        powerConsumption: 0,
        specs: {
          ports: port.totalPorts,
          connections: 0,
          portDetails: [],
        },
        description: `Panel de conexiones de ${port.totalPorts} puertos`,
        isUsed: true,
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
        description: port.isConnected ? "Puerto en uso" : "Puerto libre",
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
