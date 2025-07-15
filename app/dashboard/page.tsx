"use client"

import { useEffect, useState } from "react"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MapComponent } from "@/components/map-component"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useDashboardUtils } from "@/hooks/use-dashboard-utils"
import { DeviceDetails } from "@/components/dashboard/device-details"

export default function DashboardPage() {
  const [liveTracking, setLiveTracking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const onlineDevices = devices.filter((d) => d.status === "online").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-sm text-gray-600">Fetching vehicle data...</p>
          <div className="mt-4 bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={handleLogout}
          onlineDevices={onlineDevices}
          totalDevices={devices.length}
        />
      </div>

      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Fleet Dashboard</h1>
              <p className="text-sm text-gray-600">
                {onlineDevices} of {devices.length} vehicles online • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] lg:h-[calc(100vh-89px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
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
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          devices={devices}
          positions={positions}
          selectedDevice={selectedDevice}
          onDeviceSelect={setSelectedDevice}
          getDevicePosition={getDevicePosition}
          getMotionStatus={getMotionStatus}
          getTimeAgo={getTimeAgo}
          knotsToKmh={knotsToKmh}
        />

        <div className="flex-1 flex flex-col">
          {/* Device Details (Only visible on desktop) */}
          <div className="hidden lg:block">
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
          </div>

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
