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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">Fleet Dashboard</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={14} />
                        <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
