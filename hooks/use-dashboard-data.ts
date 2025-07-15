"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Device, Position } from "@/types/dashboard"

export function useDashboardData() {
    // const [devices, setDevices] = useState<Device[]>([])
    // const [positions, setPositions] = useState<Position[]>([])
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
    const router = useRouter()
    const [devices, setDevices] = useState<Device[]>([])
    const [positions, setPositions] = useState<Position[]>([])

    const fetchData = useCallback(async () => {
        try {
            const [devicesRes, positionsRes] = await Promise.all([fetch("/api/devices"), fetch("/api/positions")])

            if (!devicesRes.ok || !positionsRes.ok) {
                router.push("/login")
                return
            }

            const devicesData = await devicesRes.json()
            const positionsData = await positionsRes.json()

            setDevices(devicesData)
            setPositions(positionsData)
            setLastUpdate(new Date())

            if (devicesData.length > 0 && !selectedDevice) {
                setSelectedDevice(devicesData[0])
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            router.push("/login")
        } finally {
            setLoading(false)
        }
    }, [router, selectedDevice])

    return {
        devices,
        positions,
        selectedDevice,
        setSelectedDevice,
        loading,
        lastUpdate,
        fetchData,
    }
}
