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
        const response = await fetch('schedule.data.json');
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
    // Debug button
    const debugBtn = document.getElementById('debug-load-btn');
    if (debugBtn) {
        debugBtn.addEventListener('click', async () => {
            console.log('🔄 Manual load triggered...');
            console.log('Current schedule data count:', state.schedule.length);
            await loadSchedule();
            console.log('After reload - schedule data count:', state.schedule.length);
            renderTimeline();
            console.log('Timeline rendered');
        });
    }

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

    // Group bands by venue for grid layout
    const venues = [...new Set(state.schedule.map(b => b.location))];
    const days = [1, 2, 3, 4];

    // Create grid positions
    venues.forEach((venue, venueIndex) => {
        const bandsByVenue = state.schedule.filter(b => b.location === venue);
        
        bandsByVenue.forEach(band => {
            const card = createBandCard(band);
            
            // Calculate position in grid
            const dayOffset = (band.day - 1) * 100;
            const venueOffset = venueIndex * 10;
            const order = dayOffset + venueOffset;
            
            card.style.order = order;
            grid.appendChild(card);
        });
    });

    // Sort cards visually
    const cards = Array.from(grid.children);
    cards.sort((a, b) => parseInt(a.style.order) - parseInt(b.style.order));
    cards.forEach(card => grid.appendChild(card));
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
