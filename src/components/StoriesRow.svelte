<!-- Instagram Stories-style Upcoming Events Row -->
<script>
  import { format, isToday, isTomorrow } from '../utils/dateUtils.js';

  export let events = [];
  export let onSelect = () => {};

  const COLORS = [
    'linear-gradient(135deg, #f58529, #dd2a7b)',
    'linear-gradient(135deg, #dd2a7b, #8134af)',
    'linear-gradient(135deg, #8134af, #515bd4)',
    'linear-gradient(135deg, #515bd4, #30a8e0)',
    'linear-gradient(135deg, #30a8e0, #2ecc71)',
    'linear-gradient(135deg, #f09433, #e6683c)',
  ];

  function getLabel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d');
  }

  $: upcoming = events
    .filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0,0,0,0);
      return d >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);
</script>

<div class="stories-section">
  <div class="stories-scroll">
    <!-- Add New Story Button -->
    <button class="story-item add-story" on:click={() => onSelect(null)} id="story-add-new">
      <div class="story-ring add-ring">
        <div class="story-avatar add-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </div>
      <span class="story-label">New Event</span>
    </button>

    {#each upcoming as event, i}
      <button class="story-item" on:click={() => onSelect(event)} id="story-event-{i}">
        <div class="story-ring" style="background: {COLORS[i % COLORS.length]}">
          <div class="story-avatar">
            <span class="story-emoji">{event.emoji || '📅'}</span>
          </div>
        </div>
        <span class="story-label">{getLabel(event.date)}</span>
        <span class="story-sublabel">{event.title.length > 8 ? event.title.slice(0, 8) + '…' : event.title}</span>
      </button>
    {/each}

    {#if upcoming.length === 0}
      <div class="empty-stories">
        <span>No upcoming events</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .stories-section {
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .stories-scroll {
    display: flex;
    gap: 14px;
    padding: 0 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .stories-scroll::-webkit-scrollbar {
    display: none;
  }

  .story-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform var(--transition);
  }

  .story-item:hover {
    transform: scale(1.05);
  }

  .story-item:active {
    transform: scale(0.95);
  }

  .story-ring {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: var(--ig-gradient);
    padding: 2.5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-ring {
    background: var(--border-light);
  }

  .story-avatar {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .add-avatar {
    color: var(--text-secondary);
  }

  .story-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-primary);
    max-width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  .story-sublabel {
    font-size: 10px;
    color: var(--text-muted);
    max-width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    margin-top: -3px;
  }

  .story-emoji {
    font-size: 22px;
    line-height: 1;
  }

  .empty-stories {
    display: flex;
    align-items: center;
    color: var(--text-muted);
    font-size: 13px;
    padding: 8px;
  }
</style>
