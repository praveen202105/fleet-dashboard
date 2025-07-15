"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Wifi, TrendingUp, Clock, WifiOff, Activity } from "lucide-react"
import type { Device, Position } from "@/types/dashboard"

interface EnhancedMapStatsProps {
    devices: Device[]
    positions: Position[]
    getDevicePosition: (deviceId: number) => Position | undefined
    getMotionStatus: (position: Position | undefined) => string
    knotsToKmh: (knots: number) => number
}

export function EnhancedMapStats({
    devices,
    positions,
    getDevicePosition,
    getMotionStatus,
    knotsToKmh,
}: EnhancedMapStatsProps) {
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

    // Calculate average speed
    const movingVehicles = devices.filter((device) => {
        const position = getDevicePosition(device.id)
        return getMotionStatus(position) === "Moving"
    })
    const avgSpeed =
        movingVehicles.length > 0
            ? movingVehicles.reduce((sum, device) => {
                const position = getDevicePosition(device.id)
                return sum + (position ? knotsToKmh(position.speed) : 0)
            }, 0) / movingVehicles.length
            : 0

    const stats = [
        {
            value: totalLoad,
            label: "Total Fleet",
            icon: Truck,
            bgColor: "bg-gradient-to-br from-slate-600 to-slate-700",
            textColor: "text-white",
            iconColor: "text-white",
            trend: null,
        },
        {
            value: onlineCount,
            label: "Online",
            icon: Wifi,
            bgColor: "bg-gradient-to-br from-green-500 to-green-600",
            textColor: "text-white",
            iconColor: "text-white",
            trend: `${Math.round((onlineCount / totalLoad) * 100)}%`,
        },
        {
            value: inTransitCount,
            label: "In Transit",
            icon: TrendingUp,
            bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
            textColor: "text-white",
            iconColor: "text-white",
            trend: `${avgSpeed.toFixed(0)} km/h avg`,
        },
        {
            value: idleCount,
            label: "Idle",
            icon: Clock,
            bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
            textColor: "text-white",
            iconColor: "text-white",
            trend: null,
        },
        {
            value: offlineCount,
            label: "Offline",
            icon: WifiOff,
            bgColor: "bg-gradient-to-br from-red-500 to-red-600",
            textColor: "text-white",
            iconColor: "text-white",
            trend: offlineCount > 0 ? "Alert" : null,
        },
    ]

    return (
        <>
            {/* Desktop Layout */}
            <div className="absolute top-4 left-4 right-4 z-10 hidden lg:flex flex-wrap gap-3 justify-start">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className={`${stat.bgColor} ${stat.textColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[160px] backdrop-blur-sm`}
                    >
                        <div className="p-4 flex items-center space-x-3">
                            <div className={`${stat.iconColor} flex-shrink-0 p-2 bg-white/10 rounded-lg`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm opacity-90 truncate">{stat.label}</div>
                                {stat.trend && <div className="text-xs opacity-75 mt-1">{stat.trend}</div>}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tablet Layout */}
            <div className="absolute top-4 left-4 right-4 z-10 hidden md:flex lg:hidden">
                <div className="grid grid-cols-3 gap-2 w-full">
                    {stats.slice(0, 3).map((stat, index) => (
                        <Card key={index} className={`${stat.bgColor} ${stat.textColor} border-0 shadow-lg`}>
                            <div className="p-3 text-center">
                                <div className={`${stat.iconColor} flex justify-center mb-2`}>
                                    <stat.icon size={20} />
                                </div>
                                <div className="text-xl font-bold">{stat.value}</div>
                                <div className="text-xs opacity-90 truncate">{stat.label}</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Mobile Layout - Compact Horizontal Scroll */}
            <div className="absolute top-4 left-4 right-4 z-10 md:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className={`${stat.bgColor} ${stat.textColor} border-0 shadow-lg flex-shrink-0 w-24 backdrop-blur-sm`}
                        >
                            <div className="p-2 text-center">
                                <div className={`${stat.iconColor} flex justify-center mb-1`}>
                                    <stat.icon size={16} />
                                </div>
                                <div className="text-lg font-bold">{stat.value}</div>
                                <div className="text-xs opacity-90 truncate leading-tight">{stat.label}</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Mobile Bottom Stats Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 md:hidden">
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                    <div className="p-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">{onlineCount} Online</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Activity size={12} className="text-purple-600" />
                                    <span className="text-gray-700">{inTransitCount} Moving</span>
                                </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 text-xs">Live Tracking</Badge>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
