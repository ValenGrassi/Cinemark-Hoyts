import { Cinema, PortConnection } from '../types/cinema'

// Detalles de puertos para switches y patch panels
const createPortDetails = (totalPorts: number, connections: { [key: number]: string }): PortConnection[] => {
  return Array.from({ length: totalPorts }, (_, index) => {
    const portNumber = index + 1
    const connectedTo = connections[portNumber]
    return {
      portNumber,
      isConnected: !!connectedTo,
      connectedTo,
      description: connectedTo ? `Conectado a ${connectedTo}` : 'Puerto libre',
      status: connectedTo ? 'active' : 'inactive'
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
    upsWarnings: 0,
    totalPowerConsumption: 775,
    upsAutonomyHours: 6,
    upsCapacityVA: 10000,
    rackComponents: [
      {
        id: 'quidway-3308',
        type: 'switch',
        name: 'Quidway 3308 Series',
        model: 'Quidway 3308',
        status: 'online',
        position: 1,
        powerConsumption: { min: 20, max: 30, current: 25 },
        specs: {
          ports: 24,
          connections: 18,
          portDetails: createPortDetails(24, {
            1: 'Servidor de Proyección 01',
            2: 'Servidor de Audio',
            3: 'Cisco C8200 4T',
            4: 'Cisco FPR1000',
            5: 'HP ProLiant DL360',
            6: 'Cisco Catalyst 2960',
            7: 'Wireless Controller 2500',
            8: 'Cisco Catalyst 1000 #1',
            9: 'Cisco Catalyst 1000 #2',
            10: 'Huawei AR 651 #1',
            11: 'Huawei AR 651 #2',
            12: 'Cisco SF220 24Port',
            13: 'Fibercorp Converter',
            14: 'Cámara IP Sala 1',
            15: 'Cámara IP Sala 2',
            16: 'Cámara IP Lobby',
            17: 'Sistema POS',
            18: 'Backup Server'
          })
        },
        description: 'Switch principal de distribución de red'
      },
      {
        id: 'cisco-c8200',
        type: 'router',
        name: 'Cisco C8200 4T',
        model: 'C8200-1N-4T',
        status: 'online',
        position: 2,
        powerConsumption: { min: 30, max: 50, current: 40 },
        specs: {
          ports: 4,
          connections: 2,
          portDetails: createPortDetails(4, {
            1: 'ISP Principal - Fibra',
            2: 'ISP Backup - ADSL'
          })
        },
        description: 'Router principal de conectividad a Internet'
      },
      {
        id: 'cisco-fpr1000',
        type: 'firewall',
        name: 'Cisco FPR1000 Series',
        model: 'FPR1010',
        status: 'online',
        position: 3,
        powerConsumption: { min: 15, max: 30, current: 22 },
        specs: {
          ports: 8,
          connections: 4,
          portDetails: createPortDetails(8, {
            1: 'WAN - Cisco C8200',
            2: 'LAN - Quidway 3308',
            3: 'DMZ - Servidor Web',
            4: 'Management - VLAN Admin'
          })
        },
        description: 'Firewall de seguridad perimetral'
      },
      {
        id: 'cisco-catalyst-2960',
        type: 'switch',
        name: 'Cisco Catalyst 2960 Series',
        model: 'WS-C2960-24TT-L',
        status: 'online',
        position: 4,
        powerConsumption: { min: 30, max: 50, current: 40 },
        specs: {
          ports: 24,
          connections: 20,
          portDetails: createPortDetails(24, {
            1: 'Proyector Digital Sala 1',
            2: 'Proyector Digital Sala 2',
            3: 'Proyector Digital Sala 3',
            4: 'Sistema Audio Sala 1',
            5: 'Sistema Audio Sala 2',
            6: 'Sistema Audio Sala 3',
            7: 'Servidor de Medios',
            8: 'Sistema de Ticketing',
            9: 'POS Terminal 1',
            10: 'POS Terminal 2',
            11: 'POS Terminal 3',
            12: 'Sistema de Iluminación',
            13: 'Sistema HVAC',
            14: 'Cámara IP Sala 4',
            15: 'Cámara IP Sala 5',
            16: 'Access Point Lobby',
            17: 'Access Point Salas',
            18: 'Sistema de Emergencia',
            19: 'Servidor de Backup',
            20: 'Sistema de Monitoreo'
          })
        },
        description: 'Switch para equipos de salas de cine'
      },
      {
        id: 'wireless-controller-2500',
        type: 'wireless-controller',
        name: 'Cisco 2500 Wireless Controller',
        model: 'AIR-CT2504-5-K9',
        status: 'online',
        position: 5,
        powerConsumption: { min: 40, max: 70, current: 55 },
        specs: {
          ports: 4,
          connections: 3,
          portDetails: createPortDetails(4, {
            1: 'Management - VLAN 100',
            2: 'AP Trunk - VLAN 200-210',
            3: 'Guest Network - VLAN 300'
          })
        },
        description: 'Controlador para puntos de acceso inalámbricos'
      },
      {
        id: '3com-baseline-2226',
        type: 'switch',
        name: '3Com Baseline Switch 2226',
        model: '3CBLSF26',
        status: 'online',
        position: 6,
        powerConsumption: { min: 20, max: 30, current: 25 },
        specs: {
          ports: 26,
          connections: 15,
          portDetails: createPortDetails(26, {
            1: 'Impresora Tickets 1',
            2: 'Impresora Tickets 2',
            3: 'Scanner Códigos QR',
            4: 'Terminal Autoservicio 1',
            5: 'Terminal Autoservicio 2',
            6: 'Sistema Sonido Lobby',
            7: 'Pantalla Información 1',
            8: 'Pantalla Información 2',
            9: 'Sistema Control Acceso',
            10: 'Cámara IP Entrada',
            11: 'Cámara IP Salida',
            12: 'Sistema Alarma',
            13: 'UPS Management',
            14: 'Servidor NTP',
            15: 'Sistema Backup Red'
          })
        },
        description: 'Switch para dispositivos auxiliares y periféricos'
      },
      {
        id: 'hp-proliant-dl360',
        type: 'server',
        name: 'HP ProLiant DL360 Gen 10',
        model: 'DL360 Gen10',
        status: 'online',
        position: 7,
        powerConsumption: { min: 200, max: 350, current: 275 },
        specs: {
          cpu: '2x Intel Xeon Silver 4214R',
          ram: '64GB DDR4 ECC',
          storage: '4x 1TB NVMe SSD RAID 10',
          temperature: 42,
          powerUsage: 275
        },
        description: 'Servidor principal para aplicaciones críticas del cine'
      },
      {
        id: 'cisco-catalyst-1000-1',
        type: 'switch',
        name: 'Cisco Catalyst 1000 Series #1',
        model: 'C1000-24T-4G-L',
        status: 'online',
        position: 8,
        powerConsumption: { min: 20, max: 40, current: 30 },
        specs: {
          ports: 24,
          connections: 12,
          portDetails: createPortDetails(24, {
            1: 'Cámara IP Estacionamiento 1',
            2: 'Cámara IP Estacionamiento 2',
            3: 'Cámara IP Estacionamiento 3',
            4: 'Cámara IP Perímetro 1',
            5: 'Cámara IP Perímetro 2',
            6: 'Sistema Control Barreras',
            7: 'Sensor Movimiento 1',
            8: 'Sensor Movimiento 2',
            9: 'Iluminación Exterior',
            10: 'Sistema Riego',
            11: 'Sensor Temperatura Ext',
            12: 'Sistema Emergencia Ext'
          })
        },
        description: 'Switch para sistemas exteriores y seguridad'
      },
      {
        id: 'cisco-catalyst-1000-2',
        type: 'switch',
        name: 'Cisco Catalyst 1000 Series #2',
        model: 'C1000-24T-4G-L',
        status: 'online',
        position: 9,
        powerConsumption: { min: 20, max: 40, current: 30 },
        specs: {
          ports: 24,
          connections: 10,
          portDetails: createPortDetails(24, {
            1: 'Sistema HVAC Sala 1',
            2: 'Sistema HVAC Sala 2',
            3: 'Sistema HVAC Sala 3',
            4: 'Control Iluminación Salas',
            5: 'Sistema Audio Lobby',
            6: 'Pantalla LED Exterior',
            7: 'Sistema Intercomunicador',
            8: 'Control Temperatura',
            9: 'Sistema Ventilación',
            10: 'Backup HVAC'
          })
        },
        description: 'Switch para sistemas de climatización y control'
      },
      {
        id: 'huawei-ar651-1',
        type: 'router',
        name: 'Huawei NetEngine AR 651 #1',
        model: 'AR651-X8',
        status: 'online',
        position: 10,
        powerConsumption: { min: 15, max: 25, current: 20 },
        specs: {
          ports: 8,
          connections: 4,
          portDetails: createPortDetails(8, {
            1: 'MPLS Link Principal',
            2: 'Backup Link ADSL',
            3: 'VPN Oficina Central',
            4: 'Management VLAN'
          })
        },
        description: 'Router para conectividad MPLS y VPN'
      },
      {
        id: 'huawei-ar651-2',
        type: 'router',
        name: 'Huawei NetEngine AR 651 #2',
        model: 'AR651-X8',
        status: 'online',
        position: 11,
        powerConsumption: { min: 15, max: 25, current: 20 },
        specs: {
          ports: 8,
          connections: 3,
          portDetails: createPortDetails(8, {
            1: 'Backup MPLS Link',
            2: 'Site-to-Site VPN',
            3: 'Remote Management'
          })
        },
        description: 'Router de respaldo para redundancia'
      },
      {
        id: 'cisco-sf220-24',
        type: 'switch',
        name: 'Cisco SF220 24Port',
        model: 'SF220-24-K9',
        status: 'online',
        position: 12,
        powerConsumption: { min: 15, max: 25, current: 20 },
        specs: {
          ports: 24,
          connections: 8,
          portDetails: createPortDetails(24, {
            1: 'Teléfono IP Recepción',
            2: 'Teléfono IP Gerencia',
            3: 'Teléfono IP Técnico',
            4: 'Sistema Paging',
            5: 'Fax IP',
            6: 'Sistema Conferencia',
            7: 'Grabadora Llamadas',
            8: 'Gateway VoIP'
          })
        },
        description: 'Switch dedicado para telefonía IP'
      },
      {
        id: 'fibercorp-converter',
        type: 'converter',
        name: 'Fibercorp (conversor fibra)',
        model: 'FC-MC-1000',
        status: 'online',
        position: 13,
        powerConsumption: { min: 5, max: 10, current: 7 },
        specs: {
          ports: 2,
          connections: 2,
          portDetails: createPortDetails(2, {
            1: 'Fibra Óptica - ISP',
            2: 'Ethernet - Router'
          })
        },
        description: 'Conversor de medios fibra óptica a ethernet'
      },
      {
        id: 'ups-main-10kva',
        type: 'ups',
        name: 'UPS Principal 10kVA',
        model: 'APC Smart-UPS SRT 10kVA',
        status: 'online',
        position: 14,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          capacity: '10000VA / 10000W',
          batteryHealth: 95,
          loadPercentage: 8, // 775W / 10000VA = ~8%
          estimatedRuntime: 360 // 6 horas en minutos
        },
        description: 'UPS principal con autonomía de 5-7 horas',
        batteryInstallDate: '2023-08-15',
        batteryLifespan: 60 // UPS de alta capacidad duran más
      }
    ]
  },
  {
    id: 'moreno',
    name: 'Cine Moreno',
    location: 'Moreno',
    address: 'Av. Victorica 1234, Moreno, Buenos Aires',
    lastUpdated: '2024-01-08',
    upsWarnings: 2,
    totalPowerConsumption: 485,
    upsAutonomyHours: 2.8,
    upsCapacityVA: 3000,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor de Proyección 01',
        status: 'online',
        position: 1,
        powerConsumption: { min: 150, max: 200, current: 180 },
        specs: {
          cpu: 'Intel Xeon E5-2680 v4',
          ram: '64GB DDR4',
          storage: '4TB NVMe SSD',
          temperature: 42,
          powerUsage: 180
        },
        description: 'Servidor principal de proyección digital de cine'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Alimentación Principal',
        status: 'warning',
        position: 2,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          capacity: '3000VA / 2700W',
          batteryHealth: 75,
          loadPercentage: 45,
          estimatedRuntime: 25
        },
        description: 'UPS principal para equipos críticos del cine',
        batteryInstallDate: '2022-03-15',
        batteryLifespan: 36
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Servidor de Audio',
        status: 'online',
        position: 3,
        powerConsumption: { min: 120, max: 180, current: 150 },
        specs: {
          cpu: 'AMD EPYC 7542',
          ram: '32GB DDR4',
          storage: '2TB SSD',
          temperature: 38,
          powerUsage: 150
        },
        description: 'Servidor de procesamiento de audio Dolby Atmos'
      },
      {
        id: 'patch-1',
        type: 'patch-panel',
        name: 'Panel de Conexiones de Red',
        status: 'online',
        position: 4,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          ports: 24,
          connections: 20,
          portDetails: createPortDetails(24, {
            1: 'Servidor Proyección',
            2: 'Servidor Audio',
            3: 'Switch Principal',
            4: 'Router ISP',
            5: 'Proyector Sala 1',
            6: 'Proyector Sala 2',
            7: 'Sistema Audio Sala 1',
            8: 'Sistema Audio Sala 2',
            9: 'POS Terminal 1',
            10: 'POS Terminal 2',
            11: 'Cámara IP 1',
            12: 'Cámara IP 2',
            13: 'Access Point 1',
            14: 'Access Point 2',
            15: 'Sistema HVAC',
            16: 'Iluminación',
            17: 'Sistema Alarma',
            18: 'Backup Server',
            19: 'Management',
            20: 'UPS Network'
          })
        },
        description: 'Panel de conexiones de 24 puertos para equipos del cine'
      },
      {
        id: 'ups-2',
        type: 'ups',
        name: 'UPS Secundario',
        status: 'warning',
        position: 5,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          capacity: '1500VA / 1350W',
          batteryHealth: 65,
          loadPercentage: 60,
          estimatedRuntime: 15
        },
        description: 'UPS secundario para equipos de red',
        batteryInstallDate: '2022-01-10',
        batteryLifespan: 36
      }
    ]
  },
  {
    id: 'moron',
    name: 'Cine Morón',
    location: 'Morón',
    address: 'Av. Rivadavia 5678, Morón, Buenos Aires',
    lastUpdated: '2024-01-08',
    upsWarnings: 1,
    totalPowerConsumption: 520,
    upsAutonomyHours: 2.1,
    upsCapacityVA: 2200,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor de Proyección 01',
        status: 'online',
        position: 1,
        powerConsumption: { min: 140, max: 180, current: 160 },
        specs: {
          cpu: 'Intel Xeon Silver 4214',
          ram: '32GB DDR4',
          storage: '2TB NVMe SSD',
          temperature: 40,
          powerUsage: 160
        },
        description: 'Servidor de proyección digital de cine'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Alimentación Principal',
        status: 'online',
        position: 2,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          capacity: '2200VA / 1980W',
          batteryHealth: 85,
          loadPercentage: 35,
          estimatedRuntime: 30
        },
        description: 'UPS principal para equipos del cine',
        batteryInstallDate: '2023-06-20',
        batteryLifespan: 36
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Servidor de Medios',
        status: 'online',
        position: 3,
        powerConsumption: { min: 180, max: 220, current: 200 },
        specs: {
          cpu: 'Intel Core i7-10700K',
          ram: '64GB DDR4',
          storage: '8TB HDD RAID',
          temperature: 45,
          powerUsage: 200
        },
        description: 'Servidor de almacenamiento y streaming de medios'
      },
      {
        id: 'ups-2',
        type: 'ups',
        name: 'UPS de Red',
        status: 'warning',
        position: 4,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          capacity: '1000VA / 900W',
          batteryHealth: 70,
          loadPercentage: 50,
          estimatedRuntime: 20
        },
        description: 'UPS para equipos de red y auxiliares',
        batteryInstallDate: '2022-08-15',
        batteryLifespan: 36
      }
    ]
  },
  {
    id: 'san-martin',
    name: 'Cine San Martín',
    location: 'San Martín',
    address: 'Av. San Martín 9012, San Martín, Buenos Aires',
    lastUpdated: '2024-01-08',
    upsWarnings: 0,
    totalPowerConsumption: 280,
    upsAutonomyHours: 4.5,
    upsCapacityVA: 3000,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Servidor de Proyección 01',
        status: 'online',
        position: 1,
        powerConsumption: { min: 120, max: 160, current: 140 },
        specs: {
          cpu: 'AMD Ryzen 9 5900X',
          ram: '32GB DDR4',
          storage: '1TB NVMe SSD',
          temperature: 35,
          powerUsage: 140
        },
        description: 'Servidor de proyección de última generación'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Alimentación Principal',
        status: 'online',
        position: 2,
        powerConsumption: { min: 0, max: 0, current: 0 },
        specs: {
          capacity: '3000VA / 2700W',
          batteryHealth: 95,
          loadPercentage: 40,
          estimatedRuntime: 35
        },
        description: 'Nuevo sistema UPS principal',
        batteryInstallDate: '2023-11-01',
        batteryLifespan: 36
      }
    ]
  }
]
