export interface Device {
    id: number
    name: string
    uniqueId: string
    status: string
    lastUpdate: string
    groupId: number
    phone: string
    model: string
    contact: string
    category: string
}

export interface Position {
    id: number
    deviceId: number
    protocol: string
    serverTime: string
    deviceTime: string
    fixTime: string
    outdated: boolean
    valid: boolean
    latitude: number
    longitude: number
    altitude: number
    speed: number
    course: number
    address: string | null
    accuracy: number
    network: string | null
    geofenceIds: string | null
    attributes: {
        priority?: number
        sat?: number
        event?: number
        ignition?: boolean
        motion?: boolean
        rssi?: number
        io200?: number
        io69?: number
        io68?: number
        pdop?: number
        hdop?: number
        power?: number
        battery?: number
        operator?: number
        odometer?: number
        distance?: number
        totalDistance?: number
    }
}
