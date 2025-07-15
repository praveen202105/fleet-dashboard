"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { LogOut, Clock } from "lucide-react"

interface DashboardHeaderProps {
    lastUpdate: Date
    liveTracking: boolean
    onLiveTrackingChange: (enabled: boolean) => void
    onLogout: () => void
}

export function DashboardHeader({ lastUpdate, liveTracking, onLiveTrackingChange, onLogout }: DashboardHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-sm"></div>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-gray-900">Fleet Dashboard</h1>
                        <div className="hidden sm:flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                            <Clock size={12} />
                            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Live Tracking Toggle - Hidden on small screens */}
                    <div className="hidden sm:flex items-center space-x-2">
                        <Switch checked={liveTracking} onCheckedChange={onLiveTrackingChange} id="live-tracking" />
                        <label htmlFor="live-tracking" className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                            Live Tracking
                        </label>
                    </div>

                    {/* Logout Button */}
                    <Button
                        onClick={onLogout}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 md:space-x-2 bg-transparent text-xs md:text-sm px-2 md:px-3"
                    >
                        <LogOut size={14} />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Live Tracking Toggle */}
            <div className="sm:hidden mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Clock size={12} />
                    <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch checked={liveTracking} onCheckedChange={onLiveTrackingChange} id="live-tracking-mobile" />
                    <label htmlFor="live-tracking-mobile" className="text-xs text-gray-700">
                        Live Tracking
                    </label>
                </div>
            </div>
        </header>
    )
}
