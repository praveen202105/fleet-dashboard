"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gauge, User, Clock } from "lucide-react"
import type { Device, Position } from "@/types/dashboard"

interface VehicleCardProps {
    device: Device
    position: Position | undefined
    isSelected: boolean
    onSelect: (device: Device) => void
    speedKmh: number
    motionStatus: string
    timeAgo: string
}

export function VehicleCard({
    device,
    position,
    isSelected,
    onSelect,
    speedKmh,
    motionStatus,
    timeAgo,
}: VehicleCardProps) {
    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md border ${isSelected ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" : "border-gray-200"
                }`}
            onClick={() => onSelect(device)}
        >
            <CardContent className="p-4">
                {/* Vehicle Name and Status */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base">{device.name}</h3>
                        <p className="text-sm text-gray-500">#{device.uniqueId}</p>
                    </div>
                    <Badge
                        variant="outline"
                        className={`text-xs px-2 py-1 ${motionStatus === "Moving"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                            }`}
                    >
                        {motionStatus === "Moving" ? "Moving" : "Idle"}
                    </Badge>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 mb-3">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {position?.address ||
                            `${position?.latitude.toFixed(4)}, ${position?.longitude.toFixed(4)}` ||
                            "Location unavailable"}
                    </span>
                </div>

                {/* Speed Progress */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                            <Gauge size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">Speed</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{speedKmh.toFixed(0)} km/h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${speedKmh > 50 ? "bg-blue-500" : speedKmh > 20 ? "bg-yellow-500" : "bg-gray-400"
                                }`}
                            style={{ width: `${Math.min((speedKmh / 100) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Driver and Time */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <User size={14} className="text-gray-400" />
                        <span>{device.contact || "Driver Name"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
