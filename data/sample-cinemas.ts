import { Cinema, PortConnection } from '../types/cinema'

// Función para generar detalles de puertos
const createPortDetails = (totalPorts: number, connections: { [key: number]: string }): PortConnection[] => {
  return Array.from({ length: totalPorts }, (_, index) => {
    const portNumber = index + 1
    const connectedTo = connections[portNumber]
    return {
      portNumber,
      isConnected: !!connectedTo,
      connectedTo,
      description: connectedTo ? `Conectado a ${connectedTo}` : 'Puerto libre'
    }
  })
}

export const sampleCinemas: Cinema[] = [
  {
    id: 'malvinas-argentinas',
    name: 'Cine Malvinas Argentinas',
    location: 'Malvinas Argentinas',
    address: 'Av. Presidente Perón 2500, Malvinas Argentinas, Buenos Aires',
    lastUpdated: '2024-01-08',
    generator: false,
    rackComponents: [
      {
        id: 'quidway-3308',
        type: 'switch',
        name: 'Quidway 3308 Series',
        model: 'Quidway 3308',
        status: 'online',
        position: 1,
        powerConsumption: 25,
        specs: {
          ports: 24,
          connections: 18,
          portDetails: createPortDetails(24, {
            1: 'Servidor de Proyección 01',
            2: 'Servidor de Audio',
            3: 'Cisco C8200 4T',
            4: 'Cisco FPR1000'
          })
        },
        description: 'Switch principal de distribución de red'
      },
      {
        id: 'hp-proliant-dl360',
        type: 'server',
        name: 'HP ProLiant DL360 Gen 10',
        model: 'DL360 Gen10',
        status: 'online',
        position: 7,
        powerConsumption: 275,
        specs: {
          cpu: '2x Intel Xeon Silver 4214R',
          ram: '64GB DDR4 ECC',
          storage: '4x 1TB NVMe SSD RAID 10'
        },
        description: 'Servidor principal para aplicaciones críticas del cine'
      },
      {
        id: 'ups-main-10kva',
        type: 'ups',
        name: 'UPS Principal 10kVA',
        model: 'APC Smart-UPS SRT 10kVA',
        status: 'online',
        position: 14,
        specs: {},
        description: 'UPS principal con autonomía de 5-7 horas',
        batteryInstallDate: '2023-08-15',
        capacityVA: 10000,
        loadPercentage: 8
      }
    ]
  },
  {
    id: 'moreno',
    name: 'Cine Moreno',
    location: 'Moreno',
    address: 'Av. Victorica 1234, Moreno, Buenos Aires',
    lastUpdated: '2024-01-08',

    generator: false,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor de Proyección 01',
        status: 'online',
        position: 1,
        powerConsumption: 180,
        specs: {
          cpu: 'Intel Xeon E5-2680 v4',
          ram: '64GB DDR4',
          storage: '4TB NVMe SSD'
        },
        description: 'Servidor principal de proyección digital de cine'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Alimentación Principal',
        model: 'APC Smart-UPS 3000',
        status: 'warning',
        position: 2,
        specs: {},
        description: 'UPS principal para equipos críticos del cine',
        batteryInstallDate: '2022-03-15',
        capacityVA: 3000,
        loadPercentage: 70
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Servidor de Audio',
        status: 'online',
        position: 3,
        powerConsumption: 150,
        specs: {
          cpu: 'AMD EPYC 7542',
          ram: '32GB DDR4',
          storage: '2TB SSD'
        },
        description: 'Servidor de procesamiento de audio Dolby Atmos'
      },
      {
        id: 'ups-2',
        type: 'ups',
        name: 'UPS Secundario',
        model: 'APC Smart-UPS 1500',
        status: 'warning',
        position: 5,
        specs: {},
        description: 'UPS secundario para equipos de red',
        batteryInstallDate: '2022-01-10',
        capacityVA: 1500,
        loadPercentage: 80
      }
    ]
  },
  {
    id: 'moron',
    name: 'Cine Morón',
    location: 'Morón',
    address: 'Av. Rivadavia 5678, Morón, Buenos Aires',
    lastUpdated: '2024-01-08',

    generator: false,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor de Proyección 01',
        status: 'online',
        position: 1,
        powerConsumption: 160,
        specs: {
          cpu: 'Intel Xeon Silver 4214',
          ram: '32GB DDR4',
          storage: '2TB NVMe SSD'
        },
        description: 'Servidor de proyección digital de cine'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Alimentación Principal',
        model: 'APC Smart-UPS 2200',
        status: 'online',
        position: 2,
        specs: {},
        description: 'UPS principal para equipos del cine',
        batteryInstallDate: '2023-06-20',
        capacityVA: 2200,
        loadPercentage: 35
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Servidor de Medios',
        status: 'online',
        position: 3,
        powerConsumption: 200,
        specs: {
          cpu: 'Intel Core i7-10700K',
          ram: '64GB DDR4',
          storage: '8TB HDD RAID'
        },
        description: 'Servidor de almacenamiento y streaming de medios'
      },
      {
        id: 'ups-2',
        type: 'ups',
        name: 'UPS de Red',
        model: 'APC Smart-UPS 1000',
        status: 'warning',
        position: 4,
        specs: {},
        description: 'UPS para equipos de red y auxiliares',
        batteryInstallDate: '2022-08-15',
        capacityVA: 1000,
        loadPercentage: 50
      }
    ]
  },
  {
    id: 'san-martin',
    name: 'Cine San Martín',
    location: 'San Martín',
    address: 'Av. San Martín 9012, San Martín, Buenos Aires',
    lastUpdated: '2024-01-08',

    generator: true,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor de Proyección 01',
        status: 'online',
        position: 1,
        powerConsumption: 140,
        specs: {
          cpu: 'AMD Ryzen 9 5900X',
          ram: '32GB DDR4',
          storage: '1TB NVMe SSD'
        },
        description: 'Servidor de proyección de última generación'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Alimentación Principal',
        model: 'APC Smart-UPS 3000',
        status: 'online',
        position: 2,
        specs: {},
        description: 'Nuevo sistema UPS principal',
        batteryInstallDate: '2023-11-01',
        capacityVA: 3000,
        loadPercentage: 40
      }
    ]
  },
  {
    id: 'palermo',
    name: 'Cine Palermo',
    location: 'Palermo',
    address: 'Av. Santa Fe 1234, Palermo, Buenos Aires',
    lastUpdated: '2025-08-15',
    generator: true,
    rackComponents: [
      {
        id: 'switch-core-1',
        type: 'switch',
        name: 'Switch Core 48p',
        model: 'Cisco Catalyst 9500',
        status: 'online',
        position: 1,
        powerConsumption: 50,
        specs: {
          ports: 48,
          connections: 36,
          portDetails: createPortDetails(48, {
            1: 'Servidor Cine 01',
            2: 'Servidor Cine 02',
            3: 'Router Principal',
            4: 'Patch Panel 1',
            5: 'Patch Panel 2',
            6: 'Switch Sala 1',
            7: 'Switch Sala 2',
            8: 'Switch Sala 3'
          })
        },
        description: 'Switch core que conecta todas las salas y servidores'
      },
      {
        id: 'patch-panel-1',
        type: 'patch-panel',
        name: 'Patch Panel Principal 48p',
        status: 'online',
        position: 2,
        powerConsumption: 0,
        specs: {
          ports: 48,
          connections: 24,
          portDetails: createPortDetails(48, {
            1: 'Switch Core 48p',
            2: 'Switch Sala 1',
            3: 'Switch Sala 2',
            4: 'Switch Sala 3',
            5: 'Servidor Cine 01'
          })
        },
        description: 'Patch panel principal del rack'
      },
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor Cine 01',
        model: 'HP DL380 Gen10',
        status: 'online',
        position: 3,
        powerConsumption: 300,
        specs: {
          cpu: '2x Intel Xeon Gold 5218',
          ram: '128GB DDR4 ECC',
          storage: '8x 2TB NVMe SSD RAID10'
        },
        description: 'Servidor principal de proyección y aplicaciones del cine'
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Servidor Cine 02',
        model: 'Dell PowerEdge R740',
        status: 'online',
        position: 4,
        powerConsumption: 280,
        specs: {
          cpu: '2x Intel Xeon Silver 4210',
          ram: '64GB DDR4 ECC',
          storage: '4x 2TB NVMe SSD'
        },
        description: 'Servidor de medios y streaming'
      },
      {
        id: 'router-1',
        type: 'router',
        name: 'Router Principal',
        model: 'Cisco ISR 4331',
        status: 'online',
        position: 5,
        powerConsumption: 40,
        specs: {
          ports: 8,
          connections: 4,
          portDetails: createPortDetails(8, {
            1: 'Switch Core 48p',
            2: 'ISP Fiber 01'
          })
        },
        description: 'Router principal del cine'
      },
      {
        id: 'ups-main-15kva',
        type: 'ups',
        name: 'UPS Principal 15kVA',
        model: 'APC Smart-UPS SRT 15kVA',
        status: 'online',
        position: 6,
        specs: {},
        description: 'UPS principal con autonomía de 5 horas',
        batteryInstallDate: '2024-01-10',
        capacityVA: 15000
      },
      {
        id: 'switch-sala-1',
        type: 'switch',
        name: 'Switch Sala 1',
        model: 'Cisco Catalyst 2960',
        status: 'online',
        position: 7,
        powerConsumption: 15,
        specs: {
          ports: 24,
          connections: 12,
          portDetails: createPortDetails(24, {
            1: 'Proyector Sala 1',
            2: 'Audio Sala 1'
          })
        },
        description: 'Switch dedicado a Sala 1'
      },
      {
        id: 'switch-sala-2',
        type: 'switch',
        name: 'Switch Sala 2',
        model: 'Cisco Catalyst 2960',
        status: 'online',
        position: 8,
        powerConsumption: 15,
        specs: {
          ports: 24,
          connections: 12,
          portDetails: createPortDetails(24, {
            1: 'Proyector Sala 2',
            2: 'Audio Sala 2'
          })
        },
        description: 'Switch dedicado a Sala 2'
      },
      {
        id: 'switch-sala-3',
        type: 'switch',
        name: 'Switch Sala 3',
        model: 'Cisco Catalyst 2960',
        status: 'online',
        position: 9,
        powerConsumption: 15,
        specs: {
          ports: 24,
          connections: 12,
          portDetails: createPortDetails(24, {
            1: 'Proyector Sala 3',
            2: 'Audio Sala 3'
          })
        },
        description: 'Switch dedicado a Sala 3'
      }
    ]
  }
]
