<!-- Instagram-style Profile View -->
<script>
  export let events = [];

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  $: totalEvents = events.length;
  $: upcomingCount = events.filter(e => new Date(e.date + 'T00:00:00') >= new Date(new Date().setHours(0,0,0,0))).length;
  $: thisMonthCount = events.filter(e => {
    const d = new Date(e.date + 'T00:00:00');
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Group events by month for the grid
  $: recentEvents = [...events].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 12);

  const COLORS = [
    'linear-gradient(135deg, #f58529, #dd2a7b)',
    'linear-gradient(135deg, #dd2a7b, #8134af)',
    'linear-gradient(135deg, #8134af, #515bd4)',
    'linear-gradient(135deg, #515bd4, #30a8e0)',
    'linear-gradient(135deg, #2ecc71, #30a8e0)',
    'linear-gradient(135deg, #f09433, #e6683c)',
  ];
</script>

<div class="profile-view">
  <!-- Profile Card -->
  <div class="profile-card">
    <div class="profile-avatar-wrap">
      <div class="avatar-ring">
        <div class="avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <span class="stat-value">{totalEvents}</span>
        <span class="stat-label">Events</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{upcomingCount}</span>
        <span class="stat-label">Upcoming</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{thisMonthCount}</span>
        <span class="stat-label">This Month</span>
      </div>
    </div>
  </div>

  <div class="profile-info">
    <h2 class="profile-name">My Calendar</h2>
    <p class="profile-bio">Organizing life, one event at a time ✨</p>
    <div class="profile-tags">
      <span class="ptag">#productivity</span>
      <span class="ptag">#calendar</span>
      <span class="ptag">#schedule</span>
    </div>
  </div>

  <!-- Grid Header -->
  <div class="grid-header">
    <button class="grid-tab active" id="profile-grid-tab">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    </button>
  </div>

  <!-- Events Grid (Instagram-style 3-col grid) -->
  {#if recentEvents.length === 0}
    <div class="empty-grid">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <p>No events yet</p>
    </div>
  {:else}
    <div class="events-grid">
      {#each recentEvents as event, i}
        <div class="grid-item" style="background: {event.color || COLORS[i % COLORS.length]}">
          <span class="grid-emoji">{event.emoji || '📅'}</span>
          <div class="grid-overlay">
            <span class="grid-title">{event.title}</span>
            <span class="grid-date">{event.date.slice(5).replace('-', '/')}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .profile-view {
    flex: 1;
    overflow-y: auto;
    padding-bottom: calc(var(--nav-height) + 16px);
  }

  .profile-card {
    display: flex;
    align-items: center;
    padding: 20px 16px 8px;
    gap: 16px;
  }

  .profile-avatar-wrap {
    flex-shrink: 0;
  }

  .avatar-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--ig-gradient);
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--bg-card);
    border: 3px solid var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-stats {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .stat-divider {
    width: 1px;
    height: 30px;
    background: var(--border-color);
  }

  .profile-info {
    padding: 4px 16px 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .profile-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .profile-bio {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .profile-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ptag {
    font-size: 13px;
    color: var(--accent-purple);
    font-weight: 500;
  }

  .grid-header {
    display: flex;
    justify-content: center;
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .grid-tab {
    color: var(--text-muted);
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    transition: color var(--transition);
  }

  .grid-tab.active {
    color: var(--text-primary);
  }

  .empty-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    color: var(--text-muted);
    font-size: 14px;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .grid-item {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: filter var(--transition);
  }

  .grid-item:hover {
    filter: brightness(0.85);
  }

  .grid-item:hover .grid-overlay {
    opacity: 1;
  }

  .grid-emoji {
    font-size: 32px;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
    z-index: 1;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--transition);
    gap: 4px;
    padding: 8px;
  }

  .grid-title {
    font-size: 11px;
    font-weight: 700;
    color: white;
    text-align: center;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .grid-date {
    font-size: 10px;
    color: rgba(255,255,255,0.7);
  }
</style>
