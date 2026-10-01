import { useState } from 'react'
import PlannerNav from './PlannerNav.jsx'
import { tripApi } from './api.js'

const scenarios = ['Attraction Closed', 'Bad Weather', 'Heavy Crowd', 'Transport Delay', 'Budget Exceeded']
const fallbackTrip = { destination: 'Jaipur', days: 3, travelers: 2, budget: 35000, interests: [], days_plan: [] }

function Adaptive({ tripData, onNavigate }) {
  const trip = tripData || fallbackTrip
  const [scenario, setScenario] = useState(scenarios[0])
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)
  const current = trip.days_plan?.[0]?.activities?.[0] || { place: 'Scheduled attraction', activity: 'Morning visit', time: '10:00 AM', cost: '₹150', travel: '20 min' }

  const requestPlan = async (nextScenario) => {
    setScenario(nextScenario); setLoading(true); setError(''); setAccepted(false)
    try { setRecommendation(await tripApi.replan({ trip_id: trip.id, scenario: nextScenario, current_activity: current, destination: trip.destination, days: trip.days, travelers: trip.travelers, budget: trip.budget, interests: trip.interests })) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  const accept = async () => {
    if (!recommendation) return
    setLoading(true); setError('')
    try {
      const updated = trip.id ? await tripApi.accept(trip.id, { day_index: 0, activity_index: 0, new_activity: recommendation.new_activity }) : { ...trip, days_plan: trip.days_plan?.length ? trip.days_plan.map((day, i) => i ? day : { ...day, activities: [recommendation.new_activity, ...day.activities.slice(1)] }) : [] }
      setAccepted(true); window.setTimeout(() => onNavigate('/itinerary', updated), 700)
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return <main className="planner-page adaptive-page"><PlannerNav /><section className="adaptive-demo-header"><div><p className="eyebrow"><span></span> YatraAI adaptive intelligence</p><h1>Adaptive AI<br /><em>Re-planner</em></h1><p>Plans change. Your journey doesn’t have to.</p></div><div className="adaptive-trip-context"><span>Your active trip</span><strong>{trip.destination}</strong><small>{trip.days} days • {trip.travelers} travellers • ₹{Number(trip.budget).toLocaleString('en-IN')}</small></div></section><section className="scenario-selector"><div className="section-title-row"><div><p className="section-kicker">Simulate a disruption</p><h2>What changed?</h2></div><span className="live-indicator"><i></i> Live API</span></div><div className="scenario-buttons">{scenarios.map((name, index) => <button key={name} className={scenario === name ? 'scenario-button active' : 'scenario-button'} type="button" onClick={() => requestPlan(name)}><span>0{index + 1}</span>{name}</button>)}</div></section><section className="adaptive-itinerary-grid"><div className="current-plan"><div className="adaptive-label">CURRENT ITINERARY <span>{current.time}</span></div><div className="current-activity"><div className="timeline-dot"></div><div><span>{current.place}</span><h2>{current.activity}</h2><p>{current.description || 'Your scheduled experience.'}</p><div className="activity-meta"><span>Cost <strong>{current.cost}</strong></span><span>Travel <strong>{current.travel}</strong></span></div></div></div></div><div className="travel-alert"><div className="alert-icon">!</div><div><span>Unexpected Change</span><h2>{recommendation?.alert || 'Checking live conditions…'}</h2><small>Scenario: {scenario}</small></div></div></section><section className="recommendation-section"><div className="processing-state"><div className="ai-orbit"><span>✦</span></div><div><span className="adaptive-label">YatraAI PROCESSING</span><h2>{loading ? 'Finding the best alternative…' : 'AI Recommendation'}</h2><p>{error || (!loading && 'Matched to your available time, interests and budget.')}</p></div></div>{recommendation && !loading && <div className="recommendation-card"><div className="recommendation-card-top"><div><span>BEST MATCH</span><h2>{recommendation.alternative}</h2></div><strong>↗</strong></div><div className="recommendation-details"><span><b>{recommendation.time}</b>Start time</span><span><b>{recommendation.distance}</b>Distance</span><span><b>{recommendation.cost}</b>Estimated cost</span><span><b>{recommendation.saved}</b>Time saved</span></div><p>{recommendation.reason}</p></div>}</section>{accepted ? <section className="success-card"><div className="success-mark">✓</div><div><h2>Trip Updated Successfully</h2><p>Opening your updated itinerary…</p></div></section> : <section className="adaptive-actions"><button className="primary-button" type="button" disabled={loading || !recommendation} onClick={accept}>Accept New Plan ↗</button><button className="secondary-button" type="button" onClick={() => requestPlan(scenarios[(scenarios.indexOf(scenario) + 1) % scenarios.length])}>View Other Alternatives ↗</button></section>}</main>
}
export default Adaptive
