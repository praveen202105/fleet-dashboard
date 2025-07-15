"use client"

import { useEffect, useRef } from "react"
import { MapStatsOverlay } from "./dashboard/map-stats-overlay"
import type { Device, Position } from "@/types/dashboard"


interface MapComponentProps {
  devices: Device[]
  positions: Position[]
  selectedDevice: Device | null
  onDeviceSelect: (device: Device) => void
}

declare global {
  interface Window {
    google: any
  }
}

export function MapComponent({ devices, positions, selectedDevice, onDeviceSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  // const truckIconUrl = "/public/truck.png"
  const truckIconUrl = `${window.location.origin}/truck.png`


  const markersRef = useRef<{ marker: any; infoWindow: any }[]>([])

  const knotsToKmh = (knots: number) => knots * 1.852


  // useEffect(() => {
  //   if (!mapRef.current || !window.google) return

  //   const map = new window.google.maps.Map(mapRef.current, {
  //     zoom: 12,
  //     center: { lat: 24.7136, lng: 46.6753 },
  //     mapTypeId: window.google.maps.MapTypeId.ROADMAP,
  //     styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
  //   })

  //   mapInstanceRef.current = map

  //   return () => {
  //     markersRef.current.forEach(({ marker }) => marker.setMap(null))
  //     markersRef.current = []
  //   }
  // }, [])

  useEffect(() => {
    import("@/sdk/OlaMapsWebSDKNew").then((module) => {
      const { OlaMaps } = module;
      const olaMaps = new OlaMaps({ apiKey: process.env.NEXT_PUBLIC_MAP_KEY || "" });

      const calculateCenter = () => {
        if (positions.length === 0) {
          // Fallback to India center if positions empty
          return [74.8388, 12.8855];
        }
        const totalLat = positions.reduce((sum, pos) => sum + pos.latitude, 0);
        const totalLng = positions.reduce((sum, pos) => sum + pos.longitude, 0);
        const centerLat = totalLat / positions.length;
        const centerLng = totalLng / positions.length;
        return [centerLng, centerLat];
      };

      const center = calculateCenter();

      const map = olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapRef.current!,
        zoom: 12,
        center,
      });

      // mapInstanceRef.current = map;

      positions.forEach((position) => {
        const device = devices.find((d) => d.id === position.deviceId);
        if (!device) return;

        const el = document.createElement("img");
        el.src = "/truck.png";
        el.style.width = "40px";
        el.style.height = "40px";

        const popup = olaMaps
          .addPopup({ offset: [0, -30], anchor: "bottom" })
          .setHTML(`
          <div style="min-width:150px;">
            <strong>${device.name}</strong><br/>
            Status: ${device.status}<br/>
            Location: ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}
          </div>
        `);

        olaMaps
          .addMarker({ element: el, anchor: "bottom" })
          .setLngLat([position.longitude, position.latitude])
          .setPopup(popup)
          .addTo(map);
      });

      map.setZoom(12);
    });
  }, [devices, positions]);


  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return

    // Clear old markers
    markersRef.current.forEach(({ marker }) => marker.setMap(null))
    markersRef.current = []

    if (positions.length === 0) return

    const bounds = new window.google.maps.LatLngBounds()
    let hasValidPositions = false

    positions.forEach((position) => {
      const device = devices.find((d) => d.id === position.deviceId)
      if (!device) return

      const isMoving = position.attributes.motion
      const speedKmh = knotsToKmh(position.speed)

      const infoContent = `
        <div style="max-width: 400px ">
          <strong>${device.name}</strong> (${device.uniqueId})<br/>
          <strong>Status:</strong> ${device.status}<br/>
          <strong>Speed:</strong> ${speedKmh.toFixed(1)} km/h<br/>
          <strong>Location:</strong> ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}<br/>
          <strong>Motion:</strong> ${isMoving ? "Moving" : "Idle"}<br/>
        
          ${position.address ? `<strong>Address:</strong> ${position.address}` : ""}
        </div>`

      // let iconColor = "#6B7280"
      // let iconSymbol = window.google.maps.SymbolPath.CIRCLE


      // if (device.status === "online") {
      //   if (isMoving) {
      //     iconColor = "#10B981"
      //     iconSymbol = window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
      //   } else {
      //     iconColor = "#059669"
      //   }
      // } else {
      //   iconColor = "#EF4444"
      // }

      const marker = new window.google.maps.Marker({
        position: { lat: position.latitude, lng: position.longitude },
        map: mapInstanceRef.current,
        title: device.name,
        icon: {
          url: truckIconUrl,
          scaledSize: new window.google.maps.Size(50, 50), // Adjust size as needed
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 400,
      })

      marker.addListener("click", () => {
        markersRef.current.forEach(({ infoWindow }) => infoWindow.close())
        infoWindow.open(mapInstanceRef.current, marker)
        onDeviceSelect(device)
      })

      markersRef.current.push({ marker, infoWindow })
      bounds.extend(marker.getPosition()!)
      hasValidPositions = true
    })

    if (hasValidPositions) {
      mapInstanceRef.current.fitBounds(bounds)
      window.google.maps.event.addListenerOnce(mapInstanceRef.current, "bounds_changed", () => {
        if (mapInstanceRef.current.getZoom() > 12) {
          mapInstanceRef.current.setZoom(12)
        }
      })
    }
  }, [devices, positions, onDeviceSelect])

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDevice) return

    const pos = positions.find((p) => p.deviceId === selectedDevice.id)
    if (pos) {
      mapInstanceRef.current.setCenter({ lat: pos.latitude, lng: pos.longitude })
      mapInstanceRef.current.setZoom(12)
    }
  }, [selectedDevice, positions])

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDevice) return

    const selectedPosition = positions.find((p) => p.deviceId === selectedDevice.id)
    if (!selectedPosition) return

    const markerEntry = markersRef.current.find((entry) => entry.marker.getTitle() === selectedDevice.name)
    if (markerEntry) {
      mapInstanceRef.current.setCenter(markerEntry.marker.getPosition())
      mapInstanceRef.current.setZoom(12)

      // Close all other info windows
      markersRef.current.forEach(({ infoWindow }) => infoWindow.close())

      // Open the info window for selected device
      markerEntry.infoWindow.open(mapInstanceRef.current, markerEntry.marker)
    }
  }, [selectedDevice, positions])

  const getMotionStatus = (position: Position | undefined) => {
    if (!position) return "Unknown"
    return position.attributes.motion || position.speed > 0 ? "Moving" : "Stationary"
  }
  const getDevicePosition = (deviceId: number) => {
    return positions.find((pos) => pos.deviceId === deviceId)
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <MapStatsOverlay
        devices={devices}
        positions={positions}
        getDevicePosition={getDevicePosition}
        getMotionStatus={getMotionStatus}
      />

      {positions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}


    </div>
  )
}
