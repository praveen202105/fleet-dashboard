"use client"

import { VehicleCard } from "./vehicle-card"
import type { Device, Position } from "@/types/dashboard"

interface VehicleListProps {
    devices: Device[]
    positions: Position[]
    selectedDevice: Device | null
    onDeviceSelect: (device: Device) => void
    getDevicePosition: (deviceId: number) => Position | undefined
    getMotionStatus: (position: Position | undefined) => string
    getTimeAgo: (dateString: string) => string
    knotsToKmh: (knots: number) => number
}

export function VehicleList({
    devices,
    positions,
    selectedDevice,
    onDeviceSelect,
    getDevicePosition,
    getMotionStatus,
    getTimeAgo,
    knotsToKmh,
}: VehicleListProps) {
    return (
        <div className="space-y-3 px-4">
            {devices.map((device) => {
                const position = getDevicePosition(device.id)
                const isSelected = selectedDevice?.id === device.id
                const motionStatus = getMotionStatus(position)
                const speedKmh = position ? knotsToKmh(position.speed) : 0
                const timeAgo = getTimeAgo(position?.deviceTime || device.lastUpdate)
                // console.log("position", getDevicePosition(device.id));

                return (
                    <VehicleCard
                        key={device.id}
                        device={device}
                        position={position}
                        isSelected={isSelected}
                        onSelect={onDeviceSelect}
                        speedKmh={speedKmh}
                        motionStatus={motionStatus}
                        timeAgo={timeAgo}
                    />
                )
            })}
        </div>
    )
}