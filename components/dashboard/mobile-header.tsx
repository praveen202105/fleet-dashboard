"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, Bell, Settings, LogOut, Wifi } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileHeaderProps {
    onMenuToggle: () => void
    onLogout: () => void
    onlineDevices: number
    totalDevices: number
}

export function MobileHeader({ onMenuToggle, onLogout, onlineDevices, totalDevices }: MobileHeaderProps) {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 shadow-lg">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" onClick={onMenuToggle} className="text-white hover:bg-white/10 h-10 w-10">
                        <Menu size={20} />
                    </Button>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Fleet Dashboard</h1>
                            <div className="flex items-center space-x-2 text-xs opacity-90">
                                <div className="flex items-center space-x-1">
                                    <Wifi size={12} />
                                    <span>{onlineDevices}</span>
                                </div>
                                <span>/</span>
                                <span>{totalDevices} vehicles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-2 py-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        Live
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
                                <Settings size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
