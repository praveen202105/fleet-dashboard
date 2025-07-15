"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

interface SidebarHeaderProps {
    searchQuery: string
    onSearchChange: (query: string) => void
}

export function SidebarHeader({ searchQuery, onSearchChange }: SidebarHeaderProps) {
    return (
        <div className="p-4">

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    placeholder="Search vehicles, locations, or IDs..."
                    className="pl-10 h-12 bg-gray-50 border-gray-200"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Live Updates and Add Device */}
            <div className="flex items-center justify-between mb-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Live Updates Active
                </Badge>

            </div>
        </div>
    )
}
