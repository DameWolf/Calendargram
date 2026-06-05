<!-- Agenda View - Timeline style -->
<script>
  import { formatDisplay } from '../utils/dateUtils.js';
  export let events = [];
  export let onEdit = () => {};
  export let onDelete = () => {};
  export let onAdd = () => {};

  function formatTime(t) {
    if (!t) return 'All day';
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${period}`;
  }

  $: grouped = (() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const upcoming = events.filter(e => new Date(e.date + 'T00:00:00') >= today);
    const sorted = [...upcoming].sort((a,b) => a.date.localeCompare(b.date));
    const map = {};
    for (const ev of sorted) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return Object.entries(map);
  })();
</script>

<div class="agenda-view">
  {#if grouped.length === 0}
    <div class="empty-agenda">
      <div class="empty-blob">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.3">
          <rect x="3" y="4" width="18" height="18" rx="3"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
        </svg>
      </div>
      <p class="empty-title">Your agenda is clear</p>
      <p class="empty-sub">Start adding events to see them here</p>
      <button class="empty-cta" on:click={onAdd} id="agenda-add-btn">+ Add Event</button>
    </div>
  {:else}
    <div class="timeline">
      {#each grouped as [dateStr, dayEvents]}
        <div class="timeline-group">
          <div class="timeline-date-label">
            <div class="date-pill">{formatDisplay(dateStr)}</div>
          </div>
          <div class="timeline-events">
            {#each dayEvents as event, i}
              <div class="timeline-item" style="--accent: {event.color || 'linear-gradient(135deg, #dd2a7b, #8134af)'}">
                <div class="timeline-line">
                  <div class="timeline-dot" style="background: {event.color || 'linear-gradient(135deg, #dd2a7b, #8134af)'}"></div>
                  {#if i < dayEvents.length - 1}
                    <div class="timeline-connector"></div>
                  {/if}
                </div>
                <div class="timeline-card">
                  <div class="tcard-left">
                    <span class="tcard-emoji">{event.emoji || '📅'}</span>
                  </div>
                  <div class="tcard-body">
                    <div class="tcard-title">{event.title}</div>
                    <div class="tcard-time">{formatTime(event.time)}</div>
                    {#if event.description}
                      <div class="tcard-desc">{event.description}</div>
                    {/if}
                    {#if event.tags && event.tags.length > 0}
                      <div class="tcard-tags">
                        {#each event.tags as tag}
                          <span class="tag">#{tag}</span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                  <div class="tcard-actions">
                    <button class="tact-btn" on:click={() => onEdit(event)} aria-label="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="tact-btn danger" on:click={() => onDelete(event.id)} aria-label="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .agenda-view {
    flex: 1;
    overflow-y: auto;
    padding-bottom: calc(var(--nav-height) + 16px);
  }

  .empty-agenda {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 10px;
  }

  .empty-blob { margin-bottom: 10px; }

  .empty-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-secondary);
  }

  .empty-sub {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .empty-cta {
    margin-top: 8px;
    padding: 10px 24px;
    border-radius: var(--radius-full);
    background: var(--ig-gradient);
    color: white;
    font-size: 14px;
    font-weight: 700;
    transition: all var(--transition);
  }

  .empty-cta:hover { opacity: 0.85; transform: scale(1.02); }
  .empty-cta:active { transform: scale(0.97); }

  .timeline {
    padding: 16px 0;
  }

  .timeline-group {
    margin-bottom: 8px;
  }

  .timeline-date-label {
    padding: 8px 16px;
    position: sticky;
    top: 0;
    background: var(--bg-primary);
    z-index: 5;
  }

  .date-pill {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    background: var(--bg-card);
    padding: 4px 12px;
    border-radius: var(--radius-full);
  }

  .timeline-events {
    padding: 4px 16px;
  }

  .timeline-item {
    display: flex;
    gap: 12px;
    margin-bottom: 4px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .timeline-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 16px;
    width: 16px;
    flex-shrink: 0;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .timeline-connector {
    width: 2px;
    flex: 1;
    min-height: 16px;
    background: var(--border-color);
    margin-top: 4px;
  }

  .timeline-card {
    flex: 1;
    background: var(--bg-card);
    border-radius: var(--radius-md);
    padding: 12px;
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
    border: 1px solid var(--border-color);
    transition: background var(--transition);
  }

  .timeline-card:hover {
    background: var(--bg-card-hover);
  }

  .tcard-left {
    font-size: 24px;
    flex-shrink: 0;
    line-height: 1;
    padding-top: 2px;
  }

  .tcard-body {
    flex: 1;
    min-width: 0;
  }

  .tcard-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tcard-time {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .tcard-desc {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tcard-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
  }

  .tag {
    font-size: 11px;
    color: var(--accent-purple);
    font-weight: 500;
  }

  .tcard-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }

  .tact-btn {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: all var(--transition);
  }

  .tact-btn:hover { background: var(--bg-input); color: var(--text-primary); }
  .tact-btn.danger:hover { background: rgba(231,76,60,0.15); color: var(--danger); }
</style>
