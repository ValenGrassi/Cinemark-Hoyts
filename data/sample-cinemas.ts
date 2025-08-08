import { Cinema } from '../types/cinema'

export const sampleCinemas: Cinema[] = [
  {
    id: 'moreno',
    name: 'Cinema Moreno',
    location: 'Moreno',
    address: 'Av. Victorica 1234, Moreno, Buenos Aires',
    lastUpdated: '2024-01-08',
    upsWarnings: 2,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Projection Server 01',
        status: 'online',
        position: 1,
        specs: {
          cpu: 'Intel Xeon E5-2680 v4',
          ram: '64GB DDR4',
          storage: '4TB NVMe SSD',
          temperature: 42,
          powerUsage: 180
        },
        description: 'Primary digital cinema projection server'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Main Power',
        status: 'warning',
        position: 2,
        specs: {
          capacity: '3000VA / 2700W',
          batteryHealth: 75,
          loadPercentage: 45,
          estimatedRuntime: 25
        },
        description: 'Main UPS for critical cinema equipment',
        batteryInstallDate: '2022-03-15',
        batteryLifespan: 36
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Audio Processing Server',
        status: 'online',
        position: 3,
        specs: {
          cpu: 'AMD EPYC 7542',
          ram: '32GB DDR4',
          storage: '2TB SSD',
          temperature: 38,
          powerUsage: 150
        },
        description: 'Dolby Atmos audio processing server'
      },
      {
        id: 'patch-1',
        type: 'patch-panel',
        name: 'Network Patch Panel',
        status: 'online',
        position: 4,
        specs: {
          ports: 24,
          connections: 20
        },
        description: '24-port network patch panel for cinema equipment'
      },
      {
        id: 'ups-2',
        type: 'ups',
        name: 'UPS Secondary',
        status: 'warning',
        position: 5,
        specs: {
          capacity: '1500VA / 1350W',
          batteryHealth: 65,
          loadPercentage: 60,
          estimatedRuntime: 15
        },
        description: 'Secondary UPS for network equipment',
        batteryInstallDate: '2022-01-10',
        batteryLifespan: 36
      }
    ]
  },
  {
    id: 'moron',
    name: 'Cinema Morón',
    location: 'Morón',
    address: 'Av. Rivadavia 5678, Morón, Buenos Aires',
    lastUpdated: '2024-01-08',
    upsWarnings: 1,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Projection Server 01',
        status: 'online',
        position: 1,
        specs: {
          cpu: 'Intel Xeon Silver 4214',
          ram: '32GB DDR4',
          storage: '2TB NVMe SSD',
          temperature: 40,
          powerUsage: 160
        },
        description: 'Digital cinema projection server'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Main Power',
        status: 'online',
        position: 2,
        specs: {
          capacity: '2200VA / 1980W',
          batteryHealth: 85,
          loadPercentage: 35,
          estimatedRuntime: 30
        },
        description: 'Main UPS for cinema equipment',
        batteryInstallDate: '2023-06-20',
        batteryLifespan: 36
      },
      {
        id: 'server-2',
        type: 'server',
        name: 'Media Server',
        status: 'online',
        position: 3,
        specs: {
          cpu: 'Intel Core i7-10700K',
          ram: '64GB DDR4',
          storage: '8TB HDD RAID',
          temperature: 45,
          powerUsage: 200
        },
        description: 'Media storage and streaming server'
      },
      {
        id: 'ups-2',
        type: 'ups',
        name: 'UPS Network',
        status: 'warning',
        position: 4,
        specs: {
          capacity: '1000VA / 900W',
          batteryHealth: 70,
          loadPercentage: 50,
          estimatedRuntime: 20
        },
        description: 'UPS for network and auxiliary equipment',
        batteryInstallDate: '2022-08-15',
        batteryLifespan: 36
      }
    ]
  },
  {
    id: 'san-martin',
    name: 'Cinema San Martín',
    location: 'San Martín',
    address: 'Av. San Martín 9012, San Martín, Buenos Aires',
    lastUpdated: '2024-01-08',
    upsWarnings: 0,
    rackComponents: [
      {
        id: 'server-1',
        type: 'server',
        name: 'Projection Server 01',
        status: 'online',
        position: 1,
        specs: {
          cpu: 'AMD Ryzen 9 5900X',
          ram: '32GB DDR4',
          storage: '1TB NVMe SSD',
          temperature: 35,
          powerUsage: 140
        },
        description: 'Latest generation projection server'
      },
      {
        id: 'ups-1',
        type: 'ups',
        name: 'UPS Main Power',
        status: 'online',
        position: 2,
        specs: {
          capacity: '3000VA / 2700W',
          batteryHealth: 95,
          loadPercentage: 40,
          estimatedRuntime: 35
        },
        description: 'New main UPS system',
        batteryInstallDate: '2023-11-01',
        batteryLifespan: 36
      }
    ]
  }
]
