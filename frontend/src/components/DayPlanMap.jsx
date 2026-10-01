import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function numberedIcon(number) {
  return L.divIcon({ className: 'day-plan-marker-wrap', html: `<span class="day-plan-marker">${number}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] })
}

function DayPlanMap({ places, focusedPlace }) {
  const mapElement = useRef(null)
  const mapRef = useRef(null)
  const markerMap = useRef(new Map())

  useEffect(() => {
    if (!mapElement.current || mapRef.current || !places.length) return undefined
    const first = places[0]
    const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView([first.latitude, first.longitude], 12)
    const markerCollection = markerMap.current
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map)
    places.forEach((place, index) => {
      const marker = L.marker([place.latitude, place.longitude], { icon: numberedIcon(index + 1) }).bindPopup(`<strong>${place.time} · ${place.name}</strong><br />${place.description}`).addTo(map)
      markerCollection.set(place.name, marker)
    })
    const routeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#D9734A'
    L.polyline(places.map((place) => [place.latitude, place.longitude]), { color: routeColor, weight: 4, opacity: 0.9, dashArray: '8 8' }).addTo(map)
    map.fitBounds(L.latLngBounds(places.map((place) => [place.latitude, place.longitude])), { padding: [30, 30] })
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null; markerCollection.clear() }
  }, [places])

  useEffect(() => {
    if (!focusedPlace || !mapRef.current) return
    const marker = markerMap.current.get(focusedPlace.name)
    if (!marker) return
    mapRef.current.setView([focusedPlace.latitude, focusedPlace.longitude], 14, { animate: true })
    marker.openPopup()
  }, [focusedPlace])

  return <div ref={mapElement} className="day-plan-map" aria-label="Interactive map showing the day plan route" />
}

export default DayPlanMap
