


"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DeviceDetails } from "@/components/dashboard/device-details"
import { MapComponent } from "@/components/map-component"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useDashboardUtils } from "@/hooks/use-dashboard-utils"

export default function DashboardPage() {
  const [liveTracking, setLiveTracking] = useState(true)
  const { devices, positions, selectedDevice, setSelectedDevice, loading, lastUpdate, fetchData } = useDashboardData()
  const {
    getTimeAgo,
    knotsToKmh,
    metersToKm,
    getGpsAccuracy,
    getSignalStrength,
    getBatteryStatus,
    getStatusColor,
    getMotionStatus,
  } = useDashboardUtils()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Live tracking - refresh every 30 seconds
  useEffect(() => {
    if (!liveTracking) return

    const interval = setInterval(() => {
      fetchData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [liveTracking, fetchData])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  const getDevicePosition = (deviceId: number) => {
    return positions.find((pos) => pos.deviceId === deviceId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        lastUpdate={lastUpdate}
        liveTracking={liveTracking}
        onLiveTrackingChange={setLiveTracking}
        onLogout={handleLogout}
      />

      <div className="flex h-[calc(100vh-73px)] ">
        <Sidebar
          devices={devices}
          positions={positions}
          selectedDevice={selectedDevice}
          onDeviceSelect={setSelectedDevice}
          getDevicePosition={getDevicePosition}
          getMotionStatus={getMotionStatus}
          getTimeAgo={getTimeAgo}
          knotsToKmh={knotsToKmh}
        />

        {/* Main Content - Map and Device Details */}
        <div className="flex-1 flex flex-col">
          {selectedDevice && (
            <DeviceDetails
              selectedDevice={selectedDevice}
              position={getDevicePosition(selectedDevice.id)}
              getStatusColor={getStatusColor}
              getMotionStatus={getMotionStatus}
              knotsToKmh={knotsToKmh}
              getGpsAccuracy={getGpsAccuracy}
              getSignalStrength={getSignalStrength}
              getBatteryStatus={getBatteryStatus}
              metersToKm={metersToKm}
            />
          )}

          {/* Map */}
          <div className="flex-1">
            <MapComponent
              devices={devices}
              positions={positions}
              selectedDevice={selectedDevice}
              onDeviceSelect={setSelectedDevice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
