"use client"

import { Button } from "@/components/ui/button"

interface StatusFiltersProps {
    statusFilter: "all" | "online" | "transit"
    onStatusFilterChange: (filter: "all" | "online" | "transit") => void
    allCount: number
    onlineCount: number
    transitCount: number
}

export function StatusFilters({
    statusFilter,
    onStatusFilterChange,
    allCount,
    onlineCount,
    transitCount,
}: StatusFiltersProps) {
    return (
        <div className="flex space-x-2 mb-6 px-4">
            <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                className={`${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"} px-3 py-1`}
                onClick={() => onStatusFilterChange("all")}
            >
                All Status{" "}
                <span className="ml-1 bg-white text-blue-600 px-1 rounded text-xs">{allCount.toString().padStart(2, "0")}</span>
            </Button>
            <Button
                variant={statusFilter === "online" ? "default" : "outline"}
                size="sm"
                className={`${statusFilter === "online" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"} px-3 py-1`}
                onClick={() => onStatusFilterChange("online")}
            >
                Online{" "}
                <span className="ml-1 bg-white text-blue-600 px-1 rounded text-xs">
                    {onlineCount.toString().padStart(2, "0")}
                </span>
            </Button>
            <Button
                variant={statusFilter === "transit" ? "default" : "outline"}
                size="sm"
                className={`${statusFilter === "transit" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"} px-3 py-1`}
                onClick={() => onStatusFilterChange("transit")}
            >
                In-Transit{" "}
                <span className="ml-1 bg-white text-blue-600 px-1 rounded text-xs">
                    {transitCount.toString().padStart(2, "0")}
                </span>
            </Button>
        </div>
    )
}
