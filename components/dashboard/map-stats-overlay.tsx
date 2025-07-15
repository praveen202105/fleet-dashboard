"use client"

import { Card } from "@/components/ui/card"
import { Truck, Wifi, TrendingUp, Clock, WifiOff } from "lucide-react"
import type { Device, Position } from "@/types/dashboard"

interface MapStatsOverlayProps {
    devices: Device[]
    positions: Position[]
    getDevicePosition: (deviceId: number) => Position | undefined
    getMotionStatus: (position: Position | undefined) => string
}

export function MapStatsOverlay({ devices, positions, getDevicePosition, getMotionStatus }: MapStatsOverlayProps) {
    const totalLoad = devices.length
    const onlineCount = devices.filter((device) => device.status === "online").length
    const inTransitCount = devices.filter((device) => {
        const position = getDevicePosition(device.id)
        return getMotionStatus(position) === "Moving"
    }).length
    const idleCount = devices.filter((device) => {
        const position = getDevicePosition(device.id)
        return device.status === "online" && getMotionStatus(position) === "Stationary"
    }).length
    const offlineCount = devices.filter((device) => device.status === "offline").length

    const stats = [
        {
            value: totalLoad,
            label: "Total Load",
            icon: Truck,
            bgColor: "bg-gray-800",
            textColor: "text-white",
            iconColor: "text-white",
        },
        {
            value: onlineCount,
            label: "Online",
            icon: Wifi,
            bgColor: "bg-green-500",
            textColor: "text-white",
            iconColor: "text-white",
        },
        {
            value: inTransitCount,
            label: "In-Transit",
            icon: TrendingUp,
            bgColor: "bg-purple-500",
            textColor: "text-white",
            iconColor: "text-white",
        },
        {
            value: idleCount,
            label: "Idle",
            icon: Clock,
            bgColor: "bg-orange-500",
            textColor: "text-white",
            iconColor: "text-white",
        },
        {
            value: offlineCount,
            label: "Offline",
            icon: WifiOff,
            bgColor: "bg-red-500",
            textColor: "text-white",
            iconColor: "text-white",
        },
    ]

    return (
        <>
            {/* Desktop Layout */}
            <div className="absolute top-4 left-4 right-4 z-10 hidden md:flex flex-wrap gap-3 justify-start">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className={`${stat.bgColor} ${stat.textColor} border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 min-w-[140px]`}
                    >
                        <div className="p-4 flex items-center space-x-3">
                            <div className={`${stat.iconColor} flex-shrink-0`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm opacity-90 truncate">{stat.label}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Mobile Layout - Horizontal Scroll */}
            <div className="absolute top-4 left-4 right-4 z-10 md:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {stats.map((stat, index) => (
                        <Card key={index} className={`${stat.bgColor} ${stat.textColor} border-0 shadow-lg flex-shrink-0 w-28`}>
                            <div className="p-3 text-center">
                                <div className={`${stat.iconColor} flex justify-center mb-1`}>
                                    <stat.icon size={18} />
                                </div>
                                <div className="text-lg font-bold">{stat.value}</div>
                                <div className="text-xs opacity-90 truncate">{stat.label}</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
