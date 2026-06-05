<!-- Instagram Post-style Event Cards -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDisplay } from '../utils/dateUtils.js';

  export let events = [];
  export let selectedDate = null;
  export let onEdit = () => {};
  export let onDelete = () => {};

  const dispatch = createEventDispatcher();

  const EVENT_COLORS = [
    { bg: 'linear-gradient(135deg, #f58529, #dd2a7b)', label: 'Sunset' },
    { bg: 'linear-gradient(135deg, #dd2a7b, #8134af)', label: 'Rose' },
    { bg: 'linear-gradient(135deg, #8134af, #515bd4)', label: 'Violet' },
    { bg: 'linear-gradient(135deg, #515bd4, #30a8e0)', label: 'Ocean' },
    { bg: 'linear-gradient(135deg, #2ecc71, #30a8e0)', label: 'Mint' },
    { bg: 'linear-gradient(135deg, #f09433, #e6683c)', label: 'Fire' },
  ];

  $: filteredEvents = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : events.slice().sort((a, b) => a.date.localeCompare(b.date));

  function getColor(event) {
    return event.color || 'linear-gradient(135deg, #dd2a7b, #8134af)';
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatTime(timeStr) {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }

  let likeCounts = {};
  function toggleLike(id) {
    likeCounts[id] = (likeCounts[id] || 0) === 0 ? 1 : 0;
    likeCounts = { ...likeCounts };
  }
  let liked = {};
  function handleLike(id) {
    liked[id] = !liked[id];
    liked = { ...liked };
    toggleLike(id);
  }
</script>

<div class="events-section">
  {#if selectedDate}
    <div class="section-header">
      <span class="section-title">{formatDate(selectedDate)}</span>
      {#if filteredEvents.length > 0}
        <span class="event-count">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</span>
      {/if}
    </div>
  {:else}
    <div class="section-header">
      <span class="section-title">All Events</span>
      <span class="event-count">{events.length} total</span>
    </div>
  {/if}

  {#if filteredEvents.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.3">
          <rect x="3" y="4" width="18" height="18" rx="3"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
        </svg>
      </div>
      <p class="empty-text">No events {selectedDate ? 'on this day' : 'yet'}</p>
      <p class="empty-sub">Tap + to add your first event</p>
    </div>
  {:else}
    <div class="events-list">
      {#each filteredEvents as event, i}
        <article class="event-card" id="event-card-{event.id}">
          <!-- Card Header (like IG post header) -->
          <div class="card-header">
            <div class="card-avatar" style="background: {getColor(event)}">
              <span>{event.emoji || '📅'}</span>
            </div>
            <div class="card-meta">
              <span class="card-title">{event.title}</span>
              <span class="card-date">{formatDate(event.date)}</span>
            </div>
            <div class="card-actions-top">
              <button class="icon-btn-sm" on:click={() => onEdit(event)} id="edit-event-{event.id}" aria-label="Edit event">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="icon-btn-sm danger" on:click={() => onDelete(event.id)} id="delete-event-{event.id}" aria-label="Delete event">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Visual Banner -->
          {#if event.photo}
            <div class="card-banner card-banner-photo" style="background: url('{event.photo}') center/cover no-repeat">
              <div class="photo-banner-overlay">
                {#if event.time}
                  <div class="banner-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{formatTime(event.time)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="card-banner" style="background: {getColor(event)}">
              <div class="banner-content">
                <span class="banner-emoji">{event.emoji || '📅'}</span>
                {#if event.time}
                  <div class="banner-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{formatTime(event.time)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Card Body -->
          <div class="card-body">
            {#if event.description}
              <p class="card-desc"><span class="desc-author">{event.title}</span> {event.description}</p>
            {:else}
              <p class="card-desc card-desc-empty"><span class="desc-author">{event.title}</span></p>
            {/if}

            {#if event.tags && event.tags.length > 0}
              <div class="card-tags">
                {#each event.tags as tag}
                  <span class="tag">#{tag}</span>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Card Footer (like IG interactions) -->
          <div class="card-footer">
            <div class="footer-actions">
              <button
                class="action-btn"
                class:liked={liked[event.id]}
                on:click={() => handleLike(event.id)}
                id="like-event-{event.id}"
                aria-label="Like event"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={liked[event.id] ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>

              <button class="action-btn" on:click={() => onEdit(event)} id="comment-event-{event.id}" aria-label="Edit event">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>

              <button class="action-btn" aria-label="Share event">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            {#if likeCounts[event.id]}
              <div class="like-count">{likeCounts[event.id]} like{likeCounts[event.id] !== 1 ? 's' : ''}</div>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  .events-section {
    flex: 1;
    overflow-y: auto;
    padding-bottom: calc(var(--nav-height) + 16px);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px 8px;
    position: sticky;
    top: 0;
    background: var(--bg-primary);
    z-index: 10;
    border-bottom: 1px solid var(--border-color);
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .event-count {
    font-size: 12px;
    color: var(--text-muted);
    background: var(--bg-card);
    padding: 3px 10px;
    border-radius: var(--radius-full);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 8px;
  }

  .empty-icon {
    margin-bottom: 8px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .empty-sub {
    font-size: 13px;
    color: var(--text-muted);
  }

  .events-list {
    display: flex;
    flex-direction: column;
  }

  .event-card {
    border-bottom: 1px solid var(--border-color);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
  }

  .card-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .card-meta {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-date {
    font-size: 11px;
    color: var(--text-muted);
  }

  .card-actions-top {
    display: flex;
    gap: 4px;
  }

  .icon-btn-sm {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all var(--transition);
  }

  .icon-btn-sm:hover {
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .icon-btn-sm.danger:hover {
    background: rgba(231, 76, 60, 0.15);
    color: var(--danger);
  }

  .card-banner {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .card-banner-photo {
    height: 200px;
  }

  .photo-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
    display: flex;
    align-items: flex-end;
    padding: 12px;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .banner-emoji {
    font-size: 48px;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
    animation: floatEmoji 3s ease-in-out infinite;
  }

  @keyframes floatEmoji {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .banner-time {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(8px);
    padding: 5px 12px;
    border-radius: var(--radius-full);
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .card-body {
    padding: 10px 16px;
  }

  .card-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .desc-author {
    font-weight: 700;
    color: var(--text-primary);
    margin-right: 4px;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
  }

  .tag {
    font-size: 12px;
    color: var(--accent-purple);
    font-weight: 500;
  }

  .card-footer {
    padding: 4px 8px 12px;
  }

  .footer-actions {
    display: flex;
    gap: 4px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    transition: all var(--transition);
  }

  .action-btn:hover {
    color: var(--text-primary);
    transform: scale(1.1);
  }

  .action-btn.liked {
    color: #e74c3c;
    animation: heartPop 0.3s ease;
  }

  @keyframes heartPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.35); }
    100% { transform: scale(1); }
  }

  .like-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    padding: 0 8px;
  }
</style>
