import { useState } from 'react'
import './App.css'
import Planner from './Planner.jsx'
import Itinerary from './Itinerary.jsx'
import Adaptive from './Adaptive.jsx'
import { Explore, HiddenGems, Experiences } from './Discovery.jsx'
import { BusinessDashboard, AdminDashboard, BudgetPage, SafetyPage } from './DashboardViews.jsx'
import { destinationBySlug, destinations } from './discoveryData.js'
import ExploreMap from './components/ExploreMap.jsx'
import DestinationDetails from './DestinationDetails.jsx'
import DayPlanner from './DayPlanner.jsx'
import MyDayPlan from './MyDayPlan.jsx'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [route, setRoute] = useState(() => {
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    if (redirect) {
      window.history.replaceState(null, '', redirect)
      return redirect
    }
    return window.location.pathname
  })
  const [tripData, setTripData] = useState(null)
  const [dayPlan, setDayPlan] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('yatraai-day-plan')) }
    catch { return null }
  })

  const navigate = (path, state = null) => {
    window.history.pushState(state, '', path)
    if (state) setTripData(state)
    if ((path === '/my-day-plan' || path === '/day-planner') && state) {
      setDayPlan(state)
      window.localStorage.setItem('yatraai-day-plan', JSON.stringify(state))
    }
    setRoute(path)
  }

  if (route === '/planner') return <Planner onNavigate={navigate} />
  if (route === '/day-planner') return <DayPlanner onNavigate={navigate} initialData={dayPlan} />
  if (route === '/my-day-plan') return <MyDayPlan plan={dayPlan} onNavigate={navigate} />
  if (route === '/itinerary') return <Itinerary tripData={tripData} onNavigate={navigate} />
  if (route === '/adaptive') return <Adaptive tripData={tripData} onNavigate={navigate} />
  if (route.startsWith('/destination/')) return <DestinationDetails destination={destinationBySlug(route.split('/')[2])} onNavigate={navigate} />
  if (route === '/explore' || route.startsWith('/explore/')) return <Explore onNavigate={navigate} />
  if (route === '/hidden-gems' || route.startsWith('/hidden-gems/')) return <HiddenGems />
  if (route === '/experiences' || route.startsWith('/experiences/')) return <Experiences />
  if (route === '/business') return <BusinessDashboard />
  if (route === '/admin') return <AdminDashboard />
  if (route === '/budget') return <BudgetPage />
  if (route === '/safety') return <SafetyPage />

  const closeMenu = () => setMenuOpen(false)
  const openDestination = (destination) => navigate(`/destination/${destination.name.toLowerCase().replaceAll(' ', '-')}`)

  return (
    <main>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu}><span className="brand-mark">Y</span><span>Yatra<span className="brand-accent">AI</span></span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen(!menuOpen)}><span className="sr-only">Toggle menu</span><span></span><span></span></button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`} id="nav-links">
          <a href="/" onClick={closeMenu}>Home</a><a href="/explore" onClick={closeMenu}>Explore</a><a href="/hidden-gems" onClick={closeMenu}>Hidden Gems</a><a href="/experiences" onClick={closeMenu}>Experiences</a><a href="/day-planner" onClick={closeMenu}>My Day</a><a href="/business" onClick={closeMenu}>Business</a><a href="/admin" onClick={closeMenu}>Admin</a><a className="nav-cta" href="/planner" onClick={closeMenu}>Plan My Trip <span aria-hidden="true">↗</span></a>
        </div>
      </nav>
      <section className="hero-section" id="top">
        <div className="hero-copy"><p className="eyebrow"><span></span> Your next chapter starts here</p><h1>Travel with<br /><em>intention.</em></h1><p className="hero-text">Thoughtful itineraries, shaped around the way you want to feel, not just the places you want to see.</p><a className="primary-button" href="/planner">Plan My Trip <span aria-hidden="true">↗</span></a><p className="hero-note">Free to explore <span>•</span> No sign-up required</p></div>
          <div className="hero-visual" aria-label="A colorful coastal travel destination"><div className="sun"></div><div className="photo-frame"><img src="https://images.unsplash.com/photo-1507529598-2ad2dc00d0c2?auto=format&fit=crop&w=1100&q=85" onError={(event) => { event.currentTarget.style.display = 'none' }} alt="Turquoise waves meeting a sandy beach" /><span className="image-label">01 / 04 &nbsp; — &nbsp; The coast, slowly</span></div><div className="route-stamp">Made for<br /><strong>curious</strong><br />minds</div></div><div className="scroll-cue"><span></span> Scroll to wander</div>
      </section>
      <section className="intro-section" id="about"><p className="section-kicker">A different kind of travel tool</p><h2>Less ticking boxes.<br /><em>More collecting moments.</em></h2><p className="section-lede">YatraAI turns a few good questions into a trip that feels unmistakably yours. From the first coffee to the last train home.</p></section>
      <section className="features-section" id="how-it-works"><div className="feature-heading"><span>01 — 03</span><h2>Your trip,<br /><em>your rhythm.</em></h2></div><div className="feature-list"><article><span className="feature-number">01</span><div><h3>Tell us your tempo</h3><p>Early riser or night owl? Big landmarks or little lanes? We start with the details that make a trip yours.</p></div><span className="feature-arrow">↗</span></article><article><span className="feature-number">02</span><div><h3>Find your feeling</h3><p>Choose a mood, a season, a point of view. We match your curiosity with places that will meet it well.</p></div><span className="feature-arrow">↗</span></article><article><span className="feature-number">03</span><div><h3>Go somewhere wonderful</h3><p>Get a considered itinerary with room to wander, built around the moments you will remember.</p></div><span className="feature-arrow">↗</span></article></div></section>
      <section className="inspiration-section" id="inspiration"><div><p className="section-kicker">A little inspiration</p><h2>Where will your<br /><em>curiosity lead?</em></h2></div><div className="destination-card" role="button" tabIndex="0" onClick={() => openDestination(destinations.find((destination) => destination.name === 'Udaipur'))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openDestination(destinations.find((destination) => destination.name === 'Udaipur')) }}><img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85" onError={(event) => { event.currentTarget.style.display = 'none' }} alt="Person looking over a mountain valley" /><div><span>For the wide-eyed</span><strong>Somewhere<br />with a view</strong></div></div></section>
      <ExploreMap destinations={destinations} onSelectDestination={openDestination} />
      <section className="cta-section" id="start-planning"><p className="eyebrow"><span></span> No ordinary holidays</p><h2>Your best trip<br /><em>is still ahead.</em></h2><a className="primary-button light-button" href="/planner">Plan My Trip <span aria-hidden="true">↗</span></a></section>
      <footer><a className="brand" href="#top"><span className="brand-mark">Y</span><span>Yatra<span className="brand-accent">AI</span></span></a><span>Travel thoughtfully. Go far.</span><span>© 2026 YatraAI</span></footer>
    </main>
  )
}

export default App
