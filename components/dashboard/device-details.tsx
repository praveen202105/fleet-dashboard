"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Navigation, Satellite, Signal, Battery, Route } from "lucide-react"
import type { Device, Position } from "@/types/dashboard"

interface DeviceDetailsProps {
    selectedDevice: Device
    position: Position | undefined
    getStatusColor: (status: string) => string
    getMotionStatus: (position: Position | undefined) => string
    knotsToKmh: (knots: number) => number
    getGpsAccuracy: (sat: number, hdop?: number) => { level: string; color: string }
    getSignalStrength: (rssi: number) => { level: string; percentage: number }
    getBatteryStatus: (voltage: number) => { level: string; color: string }
    metersToKm: (meters: number) => number
}

export function DeviceDetails({
    selectedDevice,
    position,
    getStatusColor,
    getMotionStatus,
    knotsToKmh,
    getGpsAccuracy,
    getSignalStrength,
    getBatteryStatus,
    metersToKm,
}: DeviceDetailsProps) {
    if (!position) return null

    const speedKmh = knotsToKmh(position.speed)
    const gpsAccuracy = getGpsAccuracy(position.attributes.sat || 0, position.attributes.hdop)
    const signalStrength = getSignalStrength(position.attributes.rssi || 0)
    const batteryStatus = getBatteryStatus(position.attributes.battery || 0)
    const motionStatus = getMotionStatus(position)

    return (
        <div className="bg-white border-b border-gray-200 p-4 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedDevice.name}</h2>
                    <p className="text-sm text-gray-600">
                        {selectedDevice.uniqueId} • {selectedDevice.model}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`${getStatusColor(selectedDevice.status)} text-white`}>
                        {selectedDevice.status}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={`${motionStatus === "Moving" ? "border-green-500 text-green-700" : "border-gray-500 text-gray-700"
                            }`}
                    >
                        {motionStatus}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Location & Movement */}
                <Card className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div>Lat: {position.latitude.toFixed(4)}</div>
                        <div>Lng: {position.longitude.toFixed(4)}</div>
                        <div>Alt: {position.altitude}m</div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <Navigation size={16} className="text-green-600" />
                        <span className="text-xs font-medium text-gray-700">Movement</span>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div>Speed: {speedKmh.toFixed(1)} km/h</div>
                        <div>Course: {position.course}°</div>
                        <div>Motion: {position.attributes.motion ? "Yes" : "No"}</div>
                    </div>
                </Card>

                {/* Signal & GPS */}
                <Card className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <Satellite size={16} className="text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">GPS</span>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div>Sats: {position.attributes.sat || 0}</div>
                        <div className={gpsAccuracy.color}>Quality: {gpsAccuracy.level}</div>
                        <div>HDOP: {position.attributes.hdop?.toFixed(1) || "N/A"}</div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <Signal size={16} className="text-indigo-600" />
                        <span className="text-xs font-medium text-gray-700">Signal</span>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div>RSSI: {position.attributes.rssi || 0}</div>
                        <div>{signalStrength.level}</div>
                        <Progress value={signalStrength.percentage} className="h-1" />
                    </div>
                </Card>

                {/* Power */}
                <Card className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <Battery size={16} className="text-red-600" />
                        <span className="text-xs font-medium text-gray-700">Power</span>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div>Ext: {position.attributes.power?.toFixed(1) || "N/A"}V</div>
                        <div>Bat: {position.attributes.battery?.toFixed(1) || "N/A"}V</div>
                        <div >Status: {batteryStatus.level}</div>
                    </div>
                </Card>

                {/* Distance & Events */}
                <Card className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <Route size={16} className="text-orange-600" />
                        <span className="text-xs font-medium text-gray-700">Distance</span>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div>Odo: {metersToKm(position.attributes.odometer || 0).toFixed(1)} km</div>
                        <div>Trip: {metersToKm(position.attributes.distance || 0).toFixed(2)} km</div>
                        <div>Total: {metersToKm(position.attributes.totalDistance || 0).toFixed(1)} km</div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
