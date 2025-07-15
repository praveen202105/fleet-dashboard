"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Clock, SortAsc, Truck, Navigation } from "lucide-react"
import { VehicleCard } from "./vehicle-card"
import type { Device, Position } from "@/types/dashboard"

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
    devices: Device[]
    positions: Position[]
    selectedDevice: Device | null
    onDeviceSelect: (device: Device) => void
    getDevicePosition: (deviceId: number) => Position | undefined
    getMotionStatus: (position: Position | undefined) => string
    getTimeAgo: (dateString: string) => string
    knotsToKmh: (knots: number) => number
}

export function MobileSidebar({
    isOpen,
    onClose,
    devices,
    positions,
    selectedDevice,
    onDeviceSelect,
    getDevicePosition,
    getMotionStatus,
    getTimeAgo,
    knotsToKmh,
}: MobileSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "online" | "moving" | "idle">("all")
    const [sortBy, setSortBy] = useState<"name" | "speed" | "time">("name")

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    // Filter and sort devices
    const filteredAndSortedDevices = devices
        .filter((device) => {
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

            const position = getDevicePosition(device.id)
            const motionStatus = getMotionStatus(position)

            if (statusFilter === "moving") return motionStatus === "Moving"
            if (statusFilter === "idle") return device.status === "online" && motionStatus === "Stationary"

            return true
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name)
            if (sortBy === "speed") {
                const speedA = knotsToKmh(getDevicePosition(a.id)?.speed || 0)
                const speedB = knotsToKmh(getDevicePosition(b.id)?.speed || 0)
                return speedB - speedA
            }
            if (sortBy === "time") {
                const timeA = new Date(getDevicePosition(a.id)?.deviceTime || a.lastUpdate).getTime()
                const timeB = new Date(getDevicePosition(b.id)?.deviceTime || b.lastUpdate).getTime()
                return timeB - timeA
            }
            return 0
        })

    const handleDeviceSelect = (device: Device) => {
        onDeviceSelect(device)
        onClose()
    }

    const statusCounts = {
        all: devices.length,
        online: devices.filter((d) => d.status === "online").length,
        moving: devices.filter((d) => getMotionStatus(getDevicePosition(d.id)) === "Moving").length,
        idle: devices.filter((d) => d.status === "online" && getMotionStatus(getDevicePosition(d.id)) === "Stationary")
            .length,
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Vehicle List</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 h-8 w-8">
                            <X size={18} />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
                        <Input
                            placeholder="Search vehicles..."
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {(["all", "online", "moving", "idle"] as const).map((filter) => (
                            <Button
                                key={filter}
                                variant={statusFilter === filter ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(filter)}
                                className={`text-xs ${statusFilter === filter ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {filter === "all" && <Truck size={12} className="mr-1" />}
                                {filter === "online" && <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />}
                                {filter === "moving" && <Navigation size={12} className="mr-1" />}
                                {filter === "idle" && <Clock size={12} className="mr-1" />}
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                <Badge variant="secondary" className="ml-1 text-xs">
                                    {statusCounts[filter]}
                                </Badge>
                            </Button>
                        ))}
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-2">
                        <SortAsc size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <div className="flex space-x-1">
                            {(["name", "speed", "time"] as const).map((sort) => (
                                <Button
                                    key={sort}
                                    variant={sortBy === sort ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy(sort)}
                                    className="text-xs h-7"
                                >
                                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vehicle List */}
                <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
                    <div className="p-4 space-y-3">
                        {filteredAndSortedDevices.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Truck size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-sm">No vehicles found</p>
                                <p className="text-xs mt-1">Try adjusting your filters</p>
                            </div>
                        ) : (
                            filteredAndSortedDevices.map((device) => {
                                const position = getDevicePosition(device.id)
                                const isSelected = selectedDevice?.id === device.id
                                const motionStatus = getMotionStatus(position)
                                const speedKmh = position ? knotsToKmh(position.speed) : 0
                                const timeAgo = getTimeAgo(position?.deviceTime || device.lastUpdate)

                                return (
                                    <VehicleCard
                                        key={device.id}
                                        device={device}
                                        position={position}
                                        isSelected={isSelected}
                                        onSelect={handleDeviceSelect}
                                        speedKmh={speedKmh}
                                        motionStatus={motionStatus}
                                        timeAgo={timeAgo}
                                    />
                                )
                            })
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Stats */}
                <div className="p-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{statusCounts.online}</div>
                            <div className="text-xs text-gray-600">Online</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">{statusCounts.moving}</div>
                            <div className="text-xs text-gray-600">Moving</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
