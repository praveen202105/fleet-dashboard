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
    const [devices, setDevices] = useState<Device[]>([
        {
            id: 3,
            attributes: {},
            groupId: 1,
            calendarId: 1,
            name: "Vehicle-Alpha",
            uniqueId: "864275071897105",
            status: "online",
            lastUpdate: "2025-07-13T12:42:03.000+00:00",
            positionId: 379,
            phone: "+919876543210",
            model: "Teltonika FMC130",
            contact: "alpha.driver@example.com",
            category: "Truck",
            disabled: false,
            expirationTime: "2026-07-01T00:00:00.000+00:00"
        },
        {
            id: 4,
            attributes: {},
            groupId: 1,
            calendarId: 1,
            name: "Vehicle-Bravo",
            uniqueId: "864275071897200",
            status: "offline",
            lastUpdate: "2025-07-12T14:15:00.000+00:00",
            positionId: 380,
            phone: "+919123456789",
            model: "Teltonika FMC920",
            contact: "bravo.driver@example.com",
            category: "Van",
            disabled: false,
            expirationTime: "2026-01-01T00:00:00.000+00:00"
        },
        {
            id: 5,
            attributes: {},
            groupId: 2,
            calendarId: 2,
            name: "Vehicle-Charlie",
            uniqueId: "864275071897300",
            status: "moving",
            lastUpdate: "2025-07-14T07:30:00.000+00:00",
            positionId: 381,
            phone: "+917856341256",
            model: "Queclink GV300",
            contact: "charlie.driver@example.com",
            category: "Car",
            disabled: false,
            expirationTime: null
        },
        {
            id: 6,
            attributes: {},
            groupId: 2,
            calendarId: 3,
            name: "Vehicle-Delta",
            uniqueId: "864275071897400",
            status: "unknown",
            lastUpdate: "2025-07-13T18:05:30.000+00:00",
            positionId: 382,
            phone: "+916543218765",
            model: "Ruptela FM-Eco4",
            contact: "delta.driver@example.com",
            category: "Bus",
            disabled: false,
            expirationTime: "2025-12-31T00:00:00.000+00:00"
        },
        {
            id: 7,
            attributes: {},
            groupId: 3,
            calendarId: 4,
            name: "Vehicle-Echo",
            uniqueId: "864275071897500",
            status: "maintenance",
            lastUpdate: "2025-07-11T09:30:45.000+00:00",
            positionId: 383,
            phone: "+915678123456",
            model: "Concox GT06N",
            contact: "echo.driver@example.com",
            category: "Trailer",
            disabled: true,
            expirationTime: "2026-06-30T00:00:00.000+00:00"
        }
    ])
    const [positions, setPositions] = useState<Position[]>([
        {
            id: 379,
            attributes: {
                priority: 0,
                sat: 5,
                event: 240,
                ignition: true,
                motion: true,
                rssi: 4,
                pdop: 1.5,
                hdop: 1.0,
                power: 12.7,
                battery: 3.9,
                operator: 40471,
                odometer: 5500,
                distance: 120,
                totalDistance: 30500
            },
            deviceId: 3,
            protocol: "teltonika",
            serverTime: "2025-07-13T12:42:03.000+00:00",
            deviceTime: "2025-07-13T12:42:01.000+00:00",
            fixTime: "2025-07-13T12:42:01.000+00:00",
            outdated: false,
            valid: true,
            latitude: 12.8600,
            longitude: 74.8450,
            altitude: 15,
            speed: 40,
            course: 90,
            address: "Mangalore, India",
            accuracy: 5,
            network: null,
            geofenceIds: null
        },
        {
            id: 380,
            attributes: {
                priority: 0,
                sat: 4,
                event: 241,
                ignition: false,
                motion: false,
                rssi: 3,
                pdop: 2.0,
                hdop: 2.5,
                power: 11.8,
                battery: 3.7,
                operator: 40470,
                odometer: 9800,
                distance: 0,
                totalDistance: 12000
            },
            deviceId: 4,
            protocol: "teltonika",
            serverTime: "2025-07-12T14:15:00.000+00:00",
            deviceTime: "2025-07-12T14:14:58.000+00:00",
            fixTime: "2025-07-12T14:14:58.000+00:00",
            outdated: false,
            valid: true,
            latitude: 12.8825,
            longitude: 74.8400,
            altitude: 12,
            speed: 0,
            course: 0,
            address: "Mangalore, India",
            accuracy: 10,
            network: null,
            geofenceIds: null
        },
        {
            id: 381,
            attributes: {
                priority: 0,
                sat: 6,
                event: 242,
                ignition: true,
                motion: true,
                rssi: 5,
                pdop: 1.2,
                hdop: 1.2,
                power: 12.9,
                battery: 4.0,
                operator: 40472,
                odometer: 18000,
                distance: 350,
                totalDistance: 25500
            },
            deviceId: 5,
            protocol: "queclink",
            serverTime: "2025-07-14T07:30:00.000+00:00",
            deviceTime: "2025-07-14T07:29:58.000+00:00",
            fixTime: "2025-07-14T07:29:58.000+00:00",
            outdated: false,
            valid: true,
            latitude: 12.8700,
            longitude: 74.8700,
            altitude: 18,
            speed: 55,
            course: 45,
            address: "Mangalore, India",
            accuracy: 3,
            network: null,
            geofenceIds: null
        },
        {
            id: 382,
            attributes: {
                priority: 0,
                sat: 3,
                event: 243,
                ignition: false,
                motion: false,
                rssi: 2,
                pdop: 3.0,
                hdop: 4.0,
                power: 11.2,
                battery: 3.6,
                operator: 40473,
                odometer: 7500,
                distance: 0,
                totalDistance: 9000
            },
            deviceId: 6,
            protocol: "ruptela",
            serverTime: "2025-07-13T18:05:30.000+00:00",
            deviceTime: "2025-07-13T18:05:28.000+00:00",
            fixTime: "2025-07-13T18:05:28.000+00:00",
            outdated: false,
            valid: true,
            latitude: 12.8900,
            longitude: 74.8600,
            altitude: 5,
            speed: 0,
            course: 0,
            address: "Mangalore, India",
            accuracy: 12,
            network: null,
            geofenceIds: null
        },
        {
            id: 383,
            attributes: {
                priority: 0,
                sat: 4,
                event: 244,
                ignition: false,
                motion: false,
                rssi: 1,
                pdop: 4.5,
                hdop: 5.0,
                power: 10.9,
                battery: 3.2,
                operator: 40474,
                odometer: 6500,
                distance: 0,
                totalDistance: 8000
            },
            deviceId: 7,
            protocol: "concox",
            serverTime: "2025-07-11T09:30:45.000+00:00",
            deviceTime: "2025-07-11T09:30:42.000+00:00",
            fixTime: "2025-07-11T09:30:42.000+00:00",
            outdated: false,
            valid: true,
            latitude: 12.8500,
            longitude: 74.8300,
            altitude: 10,
            speed: 0,
            course: 0,
            address: "Mangalore, India",
            accuracy: 15,
            network: null,
            geofenceIds: null
        }
    ])

    const fetchData = useCallback(async () => {
        try {
            const [devicesRes, positionsRes] = await Promise.all([fetch("/api/devices"), fetch("/api/positions")])

            if (!devicesRes.ok || !positionsRes.ok) {
                router.push("/login")
                return
            }

            const devicesData = await devicesRes.json()
            const positionsData = await positionsRes.json()

            // setDevices(devicesData)
            // setPositions(positionsData)
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
