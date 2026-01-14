// State Management
const state = {
    schedule: [],
    favorites: new Set(),
    hidden: new Set(),
    customEvents: [],
    currentView: 'timeline'
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadSchedule();
    loadPreferences();
    setupEventListeners();
    renderTimeline();
});

// Load schedule data
async function loadSchedule() {
    try {
        const response = await fetch('schedule.data.json?v=1');
        state.schedule = await response.json();
    } catch (error) {
        console.error('Error loading schedule:', error);
        // Fallback to empty schedule
        state.schedule = [];
    }
}

// LocalStorage Management
function loadPreferences() {
    const saved = localStorage.getItem('schedulePreferences');
    if (saved) {
        try {
            const prefs = JSON.parse(saved);
            state.favorites = new Set(prefs.favorites || []);
            state.hidden = new Set(prefs.hidden || []);
            state.customEvents = prefs.customEvents || [];
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }
}

function savePreferences() {
    localStorage.setItem('schedulePreferences', JSON.stringify({
        favorites: Array.from(state.favorites),
        hidden: Array.from(state.hidden),
        customEvents: state.customEvents
    }));
}

// Event Listeners
function setupEventListeners() {
    // Tab navigation
    document.getElementById('timeline-btn').addEventListener('click', () => switchView('timeline'));
    document.getElementById('itinerary-btn').addEventListener('click', () => switchView('itinerary'));

    // Show/hide hidden items toggle
    document.getElementById('show-hidden').addEventListener('change', (e) => {
        document.querySelectorAll('.band-card.hidden').forEach(card => {
            card.style.display = e.target.checked ? 'flex' : 'none';
        });
    });

    // Custom event form
    document.getElementById('custom-event-form').addEventListener('submit', addCustomEvent);

    // Context menu for hiding
    document.addEventListener('contextmenu', handleContextMenu);
}

function switchView(viewName) {
    state.currentView = viewName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');

    if (viewName === 'itinerary') {
        renderItinerary();
    }
}

// Timeline Rendering
function renderTimeline() {
    const grid = document.getElementById('timeline-grid');
    grid.innerHTML = '';

    // Get unique venues in order
    const venues = ['Joy', 'Manhattan', 'Atrium', 'Spice H20', 'The Social', 'Pool Deck'];
    
    // Create time slots: 12 PM (Thu) to 3 AM (Mon) = 63 hours = 126 slots of 30 min each
    const startHour = 12; // 12 PM (noon)
    const slotsPerDay = 48; // 24 hours = 48 half-hour slots
    const totalDays = 3.5; // Thu 12pm -> Sun 3am = 3.5 days worth
    const totalSlots = Math.ceil(totalDays * slotsPerDay); // 168 slots to be safe

    // Build grid structure: each cell is venue × time slot
    const timeSlotGrid = {};
    
    state.schedule.forEach(band => {
        // Calculate which time slot this band occupies
        const bandDate = new Date(band.starttime * 1000);
        const bandHours = bandDate.getUTCHours();
        const bandMinutes = bandDate.getUTCMinutes();
        
        let cruiseDay = band.day;
        
        // Calculate slot from 12 PM Thu (day 1)
        let slotOffset = 0;
        if (bandHours >= startHour) {
            // Same day, after noon
            slotOffset = (bandHours - startHour) * 2 + Math.floor(bandMinutes / 30);
        } else if (bandHours < 12) {
            // Early morning hours (12 AM - 11 AM) belong to same cruise day
            slotOffset = (24 - startHour) * 2 + bandHours * 2 + Math.floor(bandMinutes / 30);
        }
        
        const startSlot = (cruiseDay - 1) * slotsPerDay + slotOffset;
        
        // Calculate duration in slots
        const durationMs = (band.endtime - band.starttime) * 1000;
        const durationSlots = Math.ceil(durationMs / (30 * 60 * 1000));
        
        // Find venue index
        const venueIndex = venues.indexOf(band.location);
        if (venueIndex === -1) return; // Invalid venue
        
        // Store in grid: key = "slot-venue"
        for (let i = 0; i < durationSlots; i++) {
            const slotKey = `${startSlot + i}-${venueIndex}`;
            if (!timeSlotGrid[slotKey]) {
                timeSlotGrid[slotKey] = [];
            }
            timeSlotGrid[slotKey].push(band);
        }
    });

    // Render grid with proper layout
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${venues.length}, 1fr)`;
    grid.style.gap = '4px';
    grid.style.padding = '10px';
    
    // For each time slot and venue, render cards
    for (let slot = 0; slot < totalSlots; slot++) {
        for (let venueIdx = 0; venueIdx < venues.length; venueIdx++) {
            const slotKey = `${slot}-${venueIdx}`;
            const bandsInSlot = timeSlotGrid[slotKey];
            
            if (bandsInSlot && bandsInSlot.length > 0) {
                // Render first band in this slot (avoid duplicates across multiple slots of same show)
                const band = bandsInSlot[0];
                const bandId = `${band.band}-${band.starttime}-${band.endtime}`;
                
                // Only render once at the starting slot
                const bandDate = new Date(band.starttime * 1000);
                const bandHours = bandDate.getUTCHours();
                const bandMinutes = bandDate.getUTCMinutes();
                let slotOffset = 0;
                if (bandHours >= startHour) {
                    slotOffset = (bandHours - startHour) * 2 + Math.floor(bandMinutes / 30);
                } else if (bandHours < 12) {
                    slotOffset = (24 - startHour) * 2 + bandHours * 2 + Math.floor(bandMinutes / 30);
                }
                const bandStartSlot = (band.day - 1) * slotsPerDay + slotOffset;
                
                if (slot === bandStartSlot) {
                    const card = createBandCard(band);
                    const durationMs = (band.endtime - band.starttime) * 1000;
                    const durationSlots = Math.ceil(durationMs / (30 * 60 * 1000));
                    card.style.gridRow = `span ${durationSlots}`;
                    grid.appendChild(card);
                } else {
                    // Add empty cell for continuation of multi-row cards
                    const spacer = document.createElement('div');
                    grid.appendChild(spacer);
                }
            } else {
                // Empty slot
                const empty = document.createElement('div');
                grid.appendChild(empty);
            }
        }
    }
}

function createBandCard(band) {
    const card = document.createElement('div');
    card.className = 'band-card';
    card.dataset.bandId = `${band.band}-${band.starttime}-${band.endtime}`;
    card.style.borderLeftColor = band.color;
    card.style.backgroundColor = hexToRgb(band.color, 0.05);

    const isHidden = state.hidden.has(card.dataset.bandId);
    const isFavorited = state.favorites.has(card.dataset.bandId);

    if (isHidden) {
        card.classList.add('hidden');
    }

    const startTime = formatTime(new Date(band.starttime * 1000));
    const endTime = formatTime(new Date(band.endtime * 1000));

    card.innerHTML = `
        <div>
            <div class="card-header">
                <div class="card-title">${band.band}</div>
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" title="Add to favorites">
                    ${isFavorited ? '❤️' : '🤍'}
                </button>
            </div>
            ${band.subtitle ? `<div class="card-subtitle">${band.subtitle}</div>` : ''}
            <div class="card-location">${band.location}</div>
            <div class="card-time">${startTime} - ${endTime}</div>
        </div>
    `;

    // Event listeners
    card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleHide(card.dataset.bandId, card);
    });

    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(card.dataset.bandId, card);
    });

    // Long-press for mobile
    let pressTimer;
    card.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
            toggleHide(card.dataset.bandId, card);
        }, 500);
    });

    card.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
    });

    return card;
}

function toggleFavorite(bandId, cardElement) {
    if (state.favorites.has(bandId)) {
        state.favorites.delete(bandId);
    } else {
        state.favorites.add(bandId);
    }
    savePreferences();
    
    const btn = cardElement.querySelector('.favorite-btn');
    btn.classList.toggle('favorited');
    btn.textContent = state.favorites.has(bandId) ? '❤️' : '🤍';
}

function toggleHide(bandId, cardElement) {
    if (state.hidden.has(bandId)) {
        state.hidden.delete(bandId);
        cardElement.classList.remove('hidden');
    } else {
        state.hidden.add(bandId);
        cardElement.classList.add('hidden');
    }
    savePreferences();
}

function handleContextMenu(e) {
    const card = e.target.closest('.band-card');
    if (card) {
        e.preventDefault();
        toggleHide(card.dataset.bandId, card);
    }
}

// Itinerary Rendering
function renderItinerary() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = '';

    if (state.favorites.size === 0 && state.customEvents.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>❤️ No favorites yet. Add shows from the timeline!</p></div>';
        return;
    }

    // Combine and sort events
    const allEvents = [];

    // Add favorited bands
    state.favorites.forEach(bandId => {
        const band = findBandById(bandId);
        if (band) {
            allEvents.push({
                type: 'band',
                ...band,
                id: bandId
            });
        }
    });

    // Add custom events
    state.customEvents.forEach((event, index) => {
        allEvents.push({
            type: 'custom',
            ...event,
            id: `custom-${index}`
        });
    });

    // Sort by day and time
    allEvents.sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.starttime - b.starttime;
    });

    // Group by day
    const eventsByDay = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    allEvents.forEach(event => {
        eventsByDay[event.day].push(event);
    });

    const dayNames = ['', 'Thursday, Jan 22', 'Friday, Jan 23', 'Saturday, Jan 24', 'Sunday, Jan 25'];

    // Render grouped by day
    [1, 2, 3, 4].forEach(day => {
        const events = eventsByDay[day];
        if (events.length > 0) {
            const dayHeader = document.createElement('div');
            dayHeader.style.marginTop = '20px';
            dayHeader.style.marginBottom = '10px';
            dayHeader.style.fontWeight = '700';
            dayHeader.style.fontSize = '14px';
            dayHeader.style.color = '#1a1a2e';
            dayHeader.textContent = dayNames[day];
            list.appendChild(dayHeader);

            events.forEach(event => {
                const item = document.createElement('div');
                item.className = 'favorite-item';
                item.style.borderLeftColor = event.color;

                const startTime = formatTime(new Date(event.starttime * 1000));
                const endTime = formatTime(new Date(event.endtime * 1000));

                item.innerHTML = `
                    <div class="favorite-item-content">
                        <div class="favorite-item-title">${event.band || event.name}</div>
                        <div class="favorite-item-meta">
                            ${event.subtitle ? `${event.subtitle} • ` : ''}
                            ${event.location || ''} • ${startTime} - ${endTime}
                        </div>
                    </div>
                    <button class="favorite-item-remove" title="Remove" data-event-id="${event.id}" data-event-type="${event.type}">✕</button>
                `;

                item.querySelector('.favorite-item-remove').addEventListener('click', (e) => {
                    e.preventDefault();
                    if (event.type === 'band') {
                        state.favorites.delete(event.id);
                    } else {
                        state.customEvents = state.customEvents.filter((_, i) => `custom-${i}` !== event.id);
                    }
                    savePreferences();
                    renderItinerary();
                    if (state.currentView === 'timeline') {
                        renderTimeline();
                    }
                });

                list.appendChild(item);
            });
        }
    });
}

function findBandById(bandId) {
    return state.schedule.find(b => b.id === bandId || `${b.band}-${b.starttime}-${b.endtime}` === bandId);
}

// Custom Events
function addCustomEvent(e) {
    e.preventDefault();

    const name = document.getElementById('event-name').value;
    const day = parseInt(document.getElementById('event-day').value);
    const time = document.getElementById('event-time').value;
    const duration = parseInt(document.getElementById('event-duration').value);
    const color = document.getElementById('event-color').value;

    // Convert time to epoch
    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(`2026-01-${21 + day}T${hours}:${minutes}:00Z`);
    const starttime = Math.floor(eventDate.getTime() / 1000);
    const endtime = starttime + (duration * 60);

    state.customEvents.push({
        name,
        day,
        starttime,
        endtime,
        color,
        location: 'Personal Event'
    });

    savePreferences();
    document.getElementById('custom-event-form').reset();
    renderItinerary();
}

// Utility Functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function hexToRgb(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
