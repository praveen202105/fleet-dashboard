"use client"

import { useState } from "react"
import { SidebarHeader } from "./sidebar-header"
import { StatusFilters } from "./status-filters"
import { VehicleList } from "./vehicle-list"
import type { Device, Position } from "@/types/dashboard"

interface SidebarProps {
    devices: Device[]
    positions: Position[]
    selectedDevice: Device | null
    onDeviceSelect: (device: Device) => void
    getDevicePosition: (deviceId: number) => Position | undefined
    getMotionStatus: (position: Position | undefined) => string
    getTimeAgo: (dateString: string) => string
    knotsToKmh: (knots: number) => number
}

export function Sidebar({
    devices,
    positions,
    selectedDevice,
    onDeviceSelect,
    getDevicePosition,
    getMotionStatus,
    getTimeAgo,
    knotsToKmh,
}: SidebarProps) {
    const [statusFilter, setStatusFilter] = useState<"all" | "online" | "transit">("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Filter devices based on status and search
    const filteredDevices = devices.filter((device) => {
        // Search filter
        const matchesSearch =
            searchQuery === "" ||
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.contact?.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false

        // Status filter
        if (statusFilter === "all") return true
        if (statusFilter === "online") return device.status === "online"
        if (statusFilter === "transit") {
            const position = getDevicePosition(device.id)
            return getMotionStatus(position) === "Moving"
        }
        return true
    })

    const allCount = devices.length
    const onlineCount = devices.filter((d) => d.status === "online").length
    const transitCount = devices.filter((d) => getMotionStatus(getDevicePosition(d.id)) === "Moving").length

    return (
        <div className="w-100 bg-white border-r border-gray-200 overflow-y-auto">
            <SidebarHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <StatusFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                allCount={allCount}
                onlineCount={onlineCount}
                transitCount={transitCount}
            />

            <VehicleList
                devices={filteredDevices}
                positions={positions}
                selectedDevice={selectedDevice}
                onDeviceSelect={onDeviceSelect}
                getDevicePosition={getDevicePosition}
                getMotionStatus={getMotionStatus}
                getTimeAgo={getTimeAgo}
                knotsToKmh={knotsToKmh}
            />
        </div>
    )
}
