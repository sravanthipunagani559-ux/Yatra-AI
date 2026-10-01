import ExploreMap from './components/ExploreMap.jsx'

const highlights = {
  Hampi: ['Sunrise at Hemakuta Hill', 'Tungabhadra riverside walks', 'Vijayanagara temple ruins'],
  'Araku Valley': ['Borra Caves', 'Coffee plantation trails', 'Scenic mountain train'],
  Jaipur: ['Amber Fort at golden hour', 'Blue pottery workshops', 'Old city food walks'],
  Kerala: ['Backwater canoe rides', 'Spice garden visits', 'Slow coastal mornings'],
  Meghalaya: ['Living root bridges', 'Cloud forest hikes', 'Waterfall picnics'],
  Varanasi: ['Sunrise on the ghats', 'Evening Ganga Aarti', 'Heritage lanes and silk workshops'],
  Udaipur: ['Lake Pichola boat ride', 'City Palace courtyards', 'Monsoon Palace views'],
  Goa: ['Quiet village kitchens', 'Heritage Latin Quarter', 'Sunset along the coast'],
}

const bestTimes = {
  Hampi: 'October - February',
  'Araku Valley': 'October - March',
  Jaipur: 'October - March',
  Kerala: 'September - March',
  Meghalaya: 'October - April',
  Varanasi: 'October - March',
  Udaipur: 'October - March',
  Goa: 'November - February',
}

function directionsUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
}

function DestinationDetails({ destination, onNavigate }) {
  if (!destination) {
    return <main className="simple-route-page"><section className="simple-route-card"><p className="section-kicker">Destination not found</p><h1>That place is off the map.</h1><button className="primary-button" type="button" onClick={() => onNavigate('/explore')}>Back to Explore</button></section></main>
  }

  const destinationHighlights = highlights[destination.name] || ['Local landmarks and hidden corners', 'Regional food and culture', 'A slower way to see the place']
  const bestTime = bestTimes[destination.name] || 'October - March'

  return (
    <main className="destination-details-page">
      <nav className="nav-shell destination-details-nav" aria-label="Destination navigation">
        <button className="back-link destination-back" type="button" onClick={() => onNavigate('/explore')}>← <span>Back to Explore</span></button>
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}><span className="brand-mark">Y</span><span>Yatra<span className="brand-accent">AI</span></span></a>
      </nav>
      <section className="destination-detail-hero">
        <img src={destination.image} alt={`${destination.name} landscape`} />
        <div className="destination-detail-overlay"><p className="eyebrow"><span></span> {destination.category} escape</p><h1>{destination.name}</h1><p>{destination.region}</p></div>
      </section>
      <section className="destination-detail-content">
        <div className="destination-detail-copy">
          <p className="section-kicker">A considered way to go</p>
          <h2>Find your <em>way there.</em></h2>
          <p className="destination-description">{destination.description}</p>
          <div className="destination-detail-actions"><a className="primary-button" href={directionsUrl(destination)} target="_blank" rel="noreferrer">Get Directions <span aria-hidden="true">↗</span></a><button className="secondary-button" type="button" onClick={() => onNavigate('/planner')}>Book Now <span aria-hidden="true">↗</span></button></div>
        </div>
        <div className="destination-facts">
          <div><span>Location</span><strong>{destination.region}</strong></div>
          <div><span>Estimated budget</span><strong>{destination.budget}</strong></div>
          <div><span>Best time to visit</span><strong>{bestTime}</strong></div>
          <div><span>Traveller rating</span><strong>★ {destination.rating}</strong></div>
        </div>
      </section>
      <section className="destination-highlights"><div><p className="section-kicker">Make it yours</p><h2>Highlights and <em>small wonders.</em></h2></div><div className="highlight-list">{destinationHighlights.map((highlight, index) => <div key={highlight}><span>0{index + 1}</span><strong>{highlight}</strong></div>)}</div></section>
      <section className="destination-detail-map"><div><p className="section-kicker">Arrive with intention</p><h2>Find {destination.name} <em>on the map.</em></h2></div><ExploreMap destinations={[destination]} focusDestination={destination.name} onSelectDestination={() => {}} /></section>
    </main>
  )
}

export default DestinationDetails
