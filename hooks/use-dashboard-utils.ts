"use client"

export function useDashboardUtils() {
    // Get time ago helper
    const getTimeAgo = (dateString: string) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Just now"
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
        return `${Math.floor(diffInMinutes / 1440)}d ago`
    }

    // Convert knots to km/h
    const knotsToKmh = (knots: number) => knots * 1.852

    // Convert meters to kilometers
    const metersToKm = (meters: number) => meters / 1000

    // Get GPS accuracy description
    const getGpsAccuracy = (sat: number, hdop?: number) => {
        if (sat >= 4 && hdop && hdop < 2) return { level: "Excellent", color: "text-green-600" }
        if (sat >= 4 && hdop && hdop < 5) return { level: "Good", color: "text-blue-600" }
        if (sat >= 3) return { level: "Fair", color: "text-yellow-600" }
        return { level: "Poor", color: "text-red-600" }
    }

    // Get signal strength description
    const getSignalStrength = (rssi: number) => {
        if (rssi >= 4) return { level: "Excellent", percentage: 100 }
        if (rssi >= 3) return { level: "Good", percentage: 75 }
        if (rssi >= 2) return { level: "Fair", percentage: 50 }
        return { level: "Poor", percentage: 25 }
    }

    // Get battery status
    const getBatteryStatus = (voltage: number) => {
        if (voltage >= 12.5) return { level: "Good", color: "bg-green-500" }
        if (voltage >= 11.5) return { level: "Low", color: "bg-yellow-500" }
        return { level: "Critical", color: "bg-red-500" }
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "online":
                return "bg-green-500"
            case "offline":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    const getMotionStatus = (position: any) => {
        if (!position) return "Unknown"
        return position.attributes.motion || position.speed > 0 ? "Moving" : "Stationary"
    }

    const getDevicePosition = (devices: any[], positions: any[], deviceId: number) => {
        return positions.find((pos) => pos.deviceId === deviceId)
    }

    return {
        getTimeAgo,
        knotsToKmh,
        metersToKm,
        getGpsAccuracy,
        getSignalStrength,
        getBatteryStatus,
        getStatusColor,
        getMotionStatus,
        getDevicePosition,
    }
}
