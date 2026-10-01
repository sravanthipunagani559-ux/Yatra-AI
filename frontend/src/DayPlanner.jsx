import { useState } from 'react'
import PlannerNav from './PlannerNav.jsx'
import { destinations } from './discoveryData.js'
import { generateDayPlan } from './dayPlanData.js'

const interestOptions = ['nature', 'temples', 'food', 'adventure', 'shopping', 'history']
const initialForm = { destination: '', date: '', hotel: '', interests: [], budget: 'medium', transport: 'car' }

function DayPlanner({ onNavigate, initialData }) {
  const [form, setForm] = useState({ ...initialForm, ...(initialData || {}) })
  const [error, setError] = useState('')
  const update = (field, value) => { setError(''); setForm((current) => ({ ...current, [field]: value })) }
  const toggleInterest = (interest) => update('interests', form.interests.includes(interest) ? form.interests.filter((item) => item !== interest) : [...form.interests, interest])
  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (!form.destination || !form.date || !form.hotel || !form.interests.length) { setError('Choose a destination, date, starting point, and at least one interest.'); return }
    onNavigate('/my-day-plan', generateDayPlan(form))
  }
  const destinationNames = destinations.map((destination) => destination.name)

  return <main className="planner-page day-planner-page"><PlannerNav /><section className="planner-wrap"><div className="planner-intro"><p className="eyebrow"><span></span> Your day, beautifully considered</p><h1>Plan a day<br /><em>worth remembering.</em></h1><p>Tell us how you want to move through the day. We will shape a thoughtful route from breakfast to dinner.</p><div className="planner-progress"><span className="progress-active">01</span><span></span><span>02</span><small>Your day plan</small></div></div><form className="planner-form day-planner-form" onSubmit={submit} noValidate><div className="form-heading"><span>Build your day</span><strong>AI STYLE / 01</strong></div>{error && <p className="field-error day-form-error">{error}</p>}<div className="form-grid"><label className="planner-field"><span>Destination</span><input list="day-destinations" value={form.destination} onChange={(event) => update('destination', event.target.value)} placeholder="Jaipur, Hampi, Kerala..." /><datalist id="day-destinations">{destinationNames.map((name) => <option key={name} value={name} />)}</datalist></label><label className="planner-field"><span>Travel date</span><input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} /></label><label className="planner-field"><span>Starting location / hotel</span><input value={form.hotel} onChange={(event) => update('hotel', event.target.value)} placeholder="Hotel or starting point" /></label></div><fieldset className="choice-group"><legend>What calls to you?</legend><div className="interest-grid">{interestOptions.map((interest) => <button key={interest} className={form.interests.includes(interest) ? 'interest selected' : 'interest'} type="button" onClick={() => toggleInterest(interest)}>{interest}</button>)}</div></fieldset><fieldset className="choice-group"><legend>Budget</legend><div className="choice-grid">{['low', 'medium', 'premium'].map((budget) => <button key={budget} className={form.budget === budget ? 'choice selected' : 'choice'} type="button" onClick={() => update('budget', budget)}>{budget}</button>)}</div></fieldset><fieldset className="choice-group"><legend>How will you move?</legend><div className="choice-grid">{['walk', 'bike', 'car'].map((transport) => <button key={transport} className={form.transport === transport ? 'choice selected' : 'choice'} type="button" onClick={() => update('transport', transport)}>{transport}</button>)}</div></fieldset><div className="form-submit day-form-submit"><p>8:00 AM to 8:00 PM<br /><span>A full day, at your pace.</span></p><button className="primary-button generate-button" type="submit">Plan My Day <span aria-hidden="true">↗</span></button></div></form></section></main>
}

export default DayPlanner
