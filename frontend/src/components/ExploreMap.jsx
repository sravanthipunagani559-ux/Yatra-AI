import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const INDIA_CENTER = [22.5, 78.9]
const DEFAULT_ZOOM = 5

function markerIcon() {
  return L.divIcon({
    className: 'destination-marker-wrap',
    html: '<span class="destination-marker" aria-hidden="true"></span>',
    iconSize: [22, 30],
    iconAnchor: [11, 30],
    popupAnchor: [0, -28],
  })
}

function directionsUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
}

function popupContent(destination, onSelectDestination) {
  const wrapper = document.createElement('div')
  wrapper.className = 'map-popup'

  const image = document.createElement('img')
  image.src = destination.image
  image.alt = `${destination.name} landscape`
  image.className = 'map-popup-image'
  wrapper.appendChild(image)

  const name = document.createElement('h3')
  name.textContent = destination.name
  wrapper.appendChild(name)

  const description = document.createElement('p')
  description.textContent = destination.description
  wrapper.appendChild(description)

  const link = document.createElement('a')
  link.href = directionsUrl(destination)
  link.target = '_blank'
  link.rel = 'noreferrer'
  link.className = 'map-directions-button'
  link.textContent = 'Get Directions'
  wrapper.appendChild(link)

  const details = document.createElement('a')
  details.href = `/destination/${destination.name.toLowerCase().replaceAll(' ', '-')}`
  details.className = 'map-details-link'
  details.textContent = 'View Details'
  details.addEventListener('click', (event) => {
    event.preventDefault()
    onSelectDestination?.(destination)
  })
  wrapper.appendChild(details)

  return wrapper
}

function ExploreMap({ destinations, focusDestination, onSelectDestination }) {
  const mapElement = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return undefined

    const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView(INDIA_CENTER, DEFAULT_ZOOM)
    const markers = markersRef.current
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map

    destinations.forEach((destination) => {
      const marker = L.marker([destination.latitude, destination.longitude], { icon: markerIcon() })
        .bindPopup(popupContent(destination, onSelectDestination), { maxWidth: 280 })
        .addTo(map)
      markers.set(destination.name.toLowerCase(), marker)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markers.clear()
    }
  }, [destinations, onSelectDestination])

  const focus = (destination) => {
    if (!destination || !mapRef.current) return
    const map = mapRef.current
    map.setView([destination.latitude, destination.longitude], 10, { animate: true })
    markersRef.current.get(destination.name.toLowerCase())?.openPopup()
  }

  useEffect(() => {
    if (!focusDestination) return
    const destination = destinations.find((item) => item.name === focusDestination)
    focus(destination)
  }, [focusDestination, destinations])

  const matchingDestinations = destinations.filter((destination) => destination.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <section className="explore-map-section" id="explore-map" aria-labelledby="explore-map-title">
      <div className="explore-map-heading">
        <div>
          <p className="section-kicker">Plan with a sense of place</p>
          <h2 id="explore-map-title">Explore <em>on the map.</em></h2>
        </div>
        <p>Find your next stop across India, then open directions when you are ready to go.</p>
      </div>
      <div className="map-search-wrap">
        <label htmlFor="destination-search">Search destinations</label>
        <input id="destination-search" type="search" value={query} onChange={(event) => { const nextQuery = event.target.value; setQuery(nextQuery); const exactMatch = destinations.find((destination) => destination.name.toLowerCase() === nextQuery.trim().toLowerCase()); if (exactMatch) focus(exactMatch) }} placeholder="Search Hampi, Jaipur, Kerala..." />
        {query && matchingDestinations.length > 0 && (
          <div className="map-search-results" role="listbox">
            {matchingDestinations.map((destination) => (
              <button key={destination.name} type="button" onClick={() => { focus(destination); onSelectDestination?.(destination) }}>{destination.name}<span>{destination.region}</span></button>
            ))}
          </div>
        )}
      </div>
      <div ref={mapElement} className="explore-map" aria-label="Interactive map of tourist destinations" />
    </section>
  )
}

export default ExploreMap
