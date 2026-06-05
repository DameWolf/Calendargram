<script>
  import './app.css';
  import Header from './components/Header.svelte';
  import StoriesRow from './components/StoriesRow.svelte';
  import CalendarGrid from './components/CalendarGrid.svelte';
  import EventCards from './components/EventCards.svelte';
  import EventModal from './components/EventModal.svelte';
  import BottomNav from './components/BottomNav.svelte';
  import AgendaView from './components/AgendaView.svelte';
  import ProfileView from './components/ProfileView.svelte';

  // ── State ──────────────────────────────────────────────
  const now = new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();
  let selectedDate = null;
  let activeTab = 'calendar';

  // Modal state
  let showModal = false;
  let editingEvent = null;
  let modalDefaultDate = null;

  // Seed demo events
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function offsetDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  let events = [
    {
      id: '1',
      title: 'Team Standup',
      date: todayStr(),
      time: '09:00',
      description: 'Daily sync with the engineering team. Sprint review and blockers.',
      emoji: '💼',
      color: 'linear-gradient(135deg, #515bd4, #30a8e0)',
      tags: ['work', 'meeting'],
    },
    {
      id: '2',
      title: "Sara's Birthday 🎉",
      date: offsetDate(2),
      time: '18:00',
      description: 'Don\'t forget to get a gift! Restaurant reservation at 7PM.',
      emoji: '🎂',
      color: 'linear-gradient(135deg, #f58529, #dd2a7b)',
      tags: ['personal', 'celebration'],
    },
    {
      id: '3',
      title: 'Gym Session',
      date: offsetDate(1),
      time: '07:00',
      description: 'Leg day at the gym. Don\'t skip!',
      emoji: '🏋️',
      color: 'linear-gradient(135deg, #2ecc71, #30a8e0)',
      tags: ['health', 'fitness'],
    },
    {
      id: '4',
      title: 'Flight to Bali ✈️',
      date: offsetDate(5),
      time: '14:30',
      description: 'Terminal 3, Gate B12. Check-in 2 hours early.',
      emoji: '✈️',
      color: 'linear-gradient(135deg, #8134af, #515bd4)',
      tags: ['travel', 'vacation'],
    },
    {
      id: '5',
      title: 'Doctor Appointment',
      date: offsetDate(3),
      time: '10:00',
      description: 'Annual checkup at City Medical Center.',
      emoji: '🏥',
      color: 'linear-gradient(135deg, #dd2a7b, #8134af)',
      tags: ['health'],
    },
  ];

  // ── Handlers ───────────────────────────────────────────
  function handleNavChange(tab) {
    if (tab === 'add') {
      openAddModal();
    } else {
      activeTab = tab;
    }
  }

  function openAddModal(date = null) {
    editingEvent = null;
    modalDefaultDate = date || selectedDate || todayStr();
    showModal = true;
  }

  function openEditModal(event) {
    editingEvent = event;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingEvent = null;
  }

  function handleSaveEvent(e) {
    const eventData = e.detail;
    if (editingEvent) {
      events = events.map(ev => ev.id === eventData.id ? eventData : ev);
    } else {
      events = [...events, eventData];
    }
    showModal = false;
    editingEvent = null;
    // Auto-navigate to the event's date on calendar
    const d = new Date(eventData.date + 'T00:00:00');
    currentYear = d.getFullYear();
    currentMonth = d.getMonth();
    selectedDate = eventData.date;
    activeTab = 'calendar';
  }

  function handleDeleteEvent(id) {
    events = events.filter(e => e.id !== id);
    if (selectedDate && !events.some(e => e.date === selectedDate)) {
      // keep selected date, just no events
    }
  }

  function handleSelectDate(e) {
    selectedDate = e.detail.date;
    activeTab = 'calendar';
  }

  function handleStorySelect(event) {
    if (event === null) {
      openAddModal();
    } else {
      const d = new Date(event.date + 'T00:00:00');
      currentYear = d.getFullYear();
      currentMonth = d.getMonth();
      selectedDate = event.date;
      activeTab = 'calendar';
    }
  }

  function clearDateFilter() {
    selectedDate = null;
  }
</script>

<div id="app-root">
  <!-- Header -->
  <Header
    currentView={activeTab}
    on:add={() => openAddModal()}
    on:search={() => {}}
  />

  <!-- Main Content -->
  <main class="main-content">
    {#if activeTab === 'calendar'}
      <!-- Stories Row -->
      <StoriesRow {events} onSelect={handleStorySelect} />

      <!-- Calendar Grid -->
      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        {events}
        {selectedDate}
        on:selectDate={handleSelectDate}
        on:prevMonth={() => {
          if (currentMonth === 0) { currentMonth = 11; currentYear--; }
          else currentMonth--;
        }}
        on:nextMonth={() => {
          if (currentMonth === 11) { currentMonth = 0; currentYear++; }
          else currentMonth++;
        }}
        on:goToday={(e) => {
          currentYear = e.detail.year;
          currentMonth = e.detail.month;
          selectedDate = null;
        }}
      />

      <!-- Date Filter Bar -->
      {#if selectedDate}
        <div class="filter-bar">
          <button class="filter-clear" on:click={clearDateFilter} id="btn-clear-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            All dates
          </button>
          <button class="filter-add" on:click={() => openAddModal(selectedDate)} id="btn-add-for-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add event
          </button>
        </div>
      {/if}

      <!-- Events Feed -->
      <EventCards
        {events}
        {selectedDate}
        onEdit={openEditModal}
        onDelete={handleDeleteEvent}
      />

    {:else if activeTab === 'feed'}
      <div class="feed-header">
        <span class="feed-title">All Events</span>
      </div>
      <EventCards
        {events}
        selectedDate={null}
        onEdit={openEditModal}
        onDelete={handleDeleteEvent}
      />

    {:else if activeTab === 'agenda'}
      <AgendaView
        {events}
        onEdit={openEditModal}
        onDelete={handleDeleteEvent}
        onAdd={() => openAddModal()}
      />

    {:else if activeTab === 'profile'}
      <ProfileView {events} />
    {/if}
  </main>

  <!-- Bottom Nav -->
  <BottomNav activeTab={activeTab} onTabChange={handleNavChange} />

  <!-- Event Modal -->
  <EventModal
    show={showModal}
    editEvent={editingEvent}
    defaultDate={modalDefaultDate}
    on:save={handleSaveEvent}
    on:close={closeModal}
  />
</div>

<style>
  #app-root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: var(--border-light) transparent;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .filter-clear {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    padding: 5px 12px;
    transition: all var(--transition);
  }

  .filter-clear:hover {
    color: var(--text-primary);
    border-color: var(--border-light);
  }

  .filter-add {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    background: var(--ig-gradient);
    border-radius: var(--radius-full);
    padding: 5px 12px;
    transition: opacity var(--transition);
    margin-left: auto;
  }

  .filter-add:hover { opacity: 0.85; }

  .feed-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .feed-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }
</style>
