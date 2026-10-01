import { destinations } from './discoveryData.js'

const placeLibrary = {
  Jaipur: [
    { name: 'Hawa Mahal', type: 'History', latitude: 26.9239, longitude: 75.8267, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=85', description: 'Begin among Jaipur’s rose-pink facades and the layered stories of the old city.', fee: 200, duration: 75, distance: 2.4 },
    { name: 'City Palace', type: 'History', latitude: 26.9258, longitude: 75.8237, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85', description: 'Explore royal courtyards, textile galleries and a living palace complex.', fee: 300, duration: 100, distance: 1.2 },
    { name: 'Jantar Mantar', type: 'History', latitude: 26.9247, longitude: 75.8246, image: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=900&q=85', description: 'Read the sky through extraordinary eighteenth-century astronomical instruments.', fee: 150, duration: 60, distance: 0.8 },
    { name: 'Johari Bazaar', type: 'Shopping', latitude: 26.9196, longitude: 75.8267, image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=85', description: 'Browse jewellery, block prints and small craft studios in the old bazaar.', fee: 0, duration: 90, distance: 3.5 },
    { name: 'Tapri Central', type: 'Food', latitude: 26.9062, longitude: 75.8037, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85', description: 'Pause for a relaxed chai and a skyline view before the evening unfolds.', fee: 350, duration: 60, distance: 4.1 },
  ],
  Hampi: [
    { name: 'Virupaksha Temple', type: 'Temples', latitude: 15.335, longitude: 76.46, image: 'https://images.unsplash.com/photo-1600100397608-f0107f7d5a35?auto=format&fit=crop&w=900&q=85', description: 'Walk through the living heart of Hampi beside the Tungabhadra.', fee: 50, duration: 90, distance: 2.1 },
    { name: 'Hemakuta Hill', type: 'Nature', latitude: 15.324, longitude: 76.463, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85', description: 'A quiet hilltop of stone shrines with wide valley views.', fee: 0, duration: 75, distance: 1.6 },
    { name: 'Vittala Temple', type: 'History', latitude: 15.314, longitude: 76.478, image: 'https://images.unsplash.com/photo-1600100397608-f0107f7d5a35?auto=format&fit=crop&w=900&q=85', description: 'See the famous stone chariot and musical pillars in the ruins.', fee: 40, duration: 100, distance: 4.2 },
    { name: 'Tungabhadra Riverside', type: 'Nature', latitude: 15.343, longitude: 76.468, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85', description: 'Slow down beside the river as the granite landscape turns gold.', fee: 0, duration: 70, distance: 3.4 },
  ],
  Kerala: [
    { name: 'Alleppey Backwaters', type: 'Nature', latitude: 9.4981, longitude: 76.3388, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85', description: 'Glide through palm-lined canals and watch village life move at water speed.', fee: 900, duration: 120, distance: 5.5 },
    { name: 'Mattancherry Palace', type: 'History', latitude: 9.9619, longitude: 76.2594, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85', description: 'Discover murals, royal rooms and the layered history of Kochi.', fee: 100, duration: 75, distance: 3.2 },
    { name: 'Fort Kochi Food Walk', type: 'Food', latitude: 9.9658, longitude: 76.2421, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85', description: 'Taste coastal recipes, cardamom tea and stories from old trading streets.', fee: 650, duration: 100, distance: 2.8 },
    { name: 'Spice Garden', type: 'Nature', latitude: 9.9312, longitude: 76.2673, image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85', description: 'Meet the plants and aromas that shape Kerala’s generous cuisine.', fee: 250, duration: 80, distance: 6.1 },
  ],
}

function fallbackPlaces(destination) {
  const base = destinations.find((item) => item.name.toLowerCase() === destination.toLowerCase()) || destinations[0]
  return [
    { name: `${base.name} Old Town`, type: 'History', latitude: base.latitude, longitude: base.longitude, image: base.image, description: `Take a considered first walk through the stories and architecture of ${base.name}.`, fee: 150, duration: 90, distance: 2.5 },
    { name: `${base.name} Scenic View`, type: 'Nature', latitude: base.latitude + 0.025, longitude: base.longitude + 0.018, image: base.image, description: `Find a slower view of ${base.name} with room to breathe and wander.`, fee: 0, duration: 90, distance: 3.2 },
    { name: `${base.name} Local Table`, type: 'Food', latitude: base.latitude - 0.018, longitude: base.longitude + 0.022, image: base.image, description: `Taste a local favourite and learn what makes the region delicious.`, fee: 550, duration: 75, distance: 2.1 },
    { name: `${base.name} Makers' Quarter`, type: 'Shopping', latitude: base.latitude + 0.014, longitude: base.longitude - 0.026, image: base.image, description: `Browse small makers and take home something with a story.`, fee: 0, duration: 80, distance: 3.8 },
  ]
}

export function generateDayPlan(form) {
  const places = placeLibrary[form.destination] || fallbackPlaces(form.destination)
  const interests = form.interests.map((interest) => interest.toLowerCase())
  const sorted = [...places].sort((a, b) => {
    const aMatch = interests.some((interest) => a.type.toLowerCase().includes(interest))
    const bMatch = interests.some((interest) => b.type.toLowerCase().includes(interest))
    return Number(bMatch) - Number(aMatch)
  })
  const selected = sorted.slice(0, 4)
  const times = ['8:00 AM', '10:30 AM', '1:30 PM', '4:30 PM']
  const mealCost = form.budget === 'premium' ? 2200 : form.budget === 'medium' ? 1300 : 700
  const meals = [
    { label: 'Breakfast', time: '8:00 AM', name: `${form.destination} Morning Table`, cost: Math.round(mealCost * 0.2) },
    { label: 'Lunch', time: '12:15 PM', name: 'A local kitchen lunch', cost: Math.round(mealCost * 0.38) },
    { label: 'Tea & snack', time: '3:45 PM', name: 'Chai and something warm', cost: Math.round(mealCost * 0.12) },
    { label: 'Dinner', time: '7:15 PM', name: 'A slow regional supper', cost: Math.round(mealCost * 0.3) },
  ]
  const itinerary = selected.map((place, index) => ({ ...place, time: times[index], travelToNext: index === selected.length - 1 ? 0 : place.distance, travelMinutes: index === selected.length - 1 ? 0 : Math.max(8, Math.round(place.distance * (form.transport === 'walk' ? 14 : form.transport === 'bike' ? 5 : 3))) }))
  const entryFees = itinerary.reduce((total, place) => total + place.fee, 0)
  const totalDistance = itinerary.reduce((total, place) => total + place.distance, 0)
  const totalTravelMinutes = itinerary.reduce((total, place) => total + place.travelMinutes, 0)
  return { ...form, places: itinerary, meals, totalCost: entryFees + meals.reduce((total, meal) => total + meal.cost, 0), totalDistance: Number(totalDistance.toFixed(1)), totalTravelMinutes }
}
