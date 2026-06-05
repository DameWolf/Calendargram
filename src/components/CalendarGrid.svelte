<!-- Calendar Grid Component -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { isToday } from '../utils/dateUtils.js';

  export let year;
  export let month; // 0-indexed
  export let events = [];
  export let selectedDate = null;

  const dispatch = createEventDispatcher();

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let animDir = 1; // 1 = forward, -1 = backward
  let prevMonth = month;
  let prevYear = year;

  $: if (month !== prevMonth || year !== prevYear) {
    animDir = (year > prevYear || (year === prevYear && month > prevMonth)) ? 1 : -1;
    prevMonth = month;
    prevYear = year;
  }

  function getDaysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  function getFirstDayOfWeek(y, m) {
    return new Date(y, m, 1).getDay();
  }

  function getEventsByDate(dateStr) {
    return events.filter(e => e.date === dateStr);
  }

  function toDateStr(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function handleDayClick(day) {
    const dateStr = toDateStr(year, month, day);
    dispatch('selectDate', { date: dateStr });
  }

  function prevMonthClick() {
    dispatch('prevMonth');
  }

  function nextMonthClick() {
    dispatch('nextMonth');
  }

  function goToday() {
    const now = new Date();
    dispatch('goToday', { year: now.getFullYear(), month: now.getMonth() });
  }

  $: daysInMonth = getDaysInMonth(year, month);
  $: firstDay = getFirstDayOfWeek(year, month);
  $: calendarDays = (() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  })();

  $: todayStr = (() => {
    const t = new Date();
    return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
  })();
</script>

<div class="calendar">
  <!-- Month Nav -->
  <div class="month-nav">
    <button class="nav-btn" on:click={prevMonthClick} id="btn-prev-month" aria-label="Previous month">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>

    <div class="month-title-wrap">
      <button class="month-title" on:click={goToday} id="btn-month-title" title="Go to today">
        <span class="month-name gradient-text">{MONTHS[month]}</span>
        <span class="year-name">{year}</span>
      </button>
    </div>

    <button class="nav-btn" on:click={nextMonthClick} id="btn-next-month" aria-label="Next month">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>

  <!-- Day Labels -->
  <div class="day-labels">
    {#each DAYS as day, i}
      <div class="day-label" class:weekend={i === 0 || i === 6}>{day}</div>
    {/each}
  </div>

  <!-- Calendar Grid -->
  <div class="grid-wrap">
    <div class="calendar-grid">
      {#each calendarDays as day, i}
        {#if day === null}
          <div class="day-cell empty"></div>
        {:else}
          {@const dateStr = toDateStr(year, month, day)}
          {@const dayEvents = getEventsByDate(dateStr)}
          {@const isSelected = selectedDate === dateStr}
          {@const isTodayDay = dateStr === todayStr}
          {@const dayOfWeek = (firstDay + day - 1) % 7}
          <button
            class="day-cell"
            class:today={isTodayDay}
            class:selected={isSelected}
            class:has-events={dayEvents.length > 0}
            class:weekend={dayOfWeek === 0 || dayOfWeek === 6}
            on:click={() => handleDayClick(day)}
            id="day-{dateStr}"
            aria-label="{day} {MONTHS[month]} {year}{dayEvents.length > 0 ? ', ' + dayEvents.length + ' events' : ''}"
          >
            <span class="day-number">{day}</span>
            {#if dayEvents.length > 0}
              <div class="dot-row">
                {#each dayEvents.slice(0, 3) as ev, di}
                  <span class="event-dot" style="background: {ev.color || 'var(--accent-pink)'}"></span>
                {/each}
              </div>
            {/if}
          </button>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .calendar {
    padding: 8px 12px 4px;
    flex-shrink: 0;
  }

  .month-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0 4px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    transition: background var(--transition), transform var(--transition);
  }

  .nav-btn:hover {
    background: var(--bg-card);
  }

  .nav-btn:active {
    transform: scale(0.88);
  }

  .month-title-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .month-title {
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    transition: background var(--transition);
  }

  .month-title:hover {
    background: var(--bg-card);
  }

  .month-name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .year-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
  }

  .day-labels {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 4px;
  }

  .day-label {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 4px 0;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .day-label.weekend {
    color: var(--accent-pink);
    opacity: 0.8;
  }

  .grid-wrap {
    overflow: hidden;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
  }

  .day-cell {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition), transform var(--transition);
    position: relative;
    gap: 2px;
  }

  .day-cell:hover:not(.empty) {
    background: var(--bg-card);
  }

  .day-cell:active:not(.empty) {
    transform: scale(0.88);
  }

  .day-cell.empty {
    cursor: default;
  }

  .day-cell.today .day-number {
    background: var(--ig-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
  }

  .day-cell.selected {
    background: var(--ig-gradient) !important;
  }

  .day-cell.selected .day-number {
    color: white;
    font-weight: 700;
    background: none;
    -webkit-text-fill-color: white;
  }

  .day-cell.weekend:not(.selected) .day-number {
    color: rgba(221, 42, 123, 0.7);
  }

  .day-number {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1;
  }

  .dot-row {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  .event-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .day-cell.selected .event-dot {
    background: rgba(255,255,255,0.7) !important;
  }
</style>
