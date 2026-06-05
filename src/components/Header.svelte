<!-- Instagram-style Top Header -->
<script>
  import { createEventDispatcher } from 'svelte';
  export let currentView = 'calendar';
  const dispatch = createEventDispatcher();
</script>

<header class="header">
  <div class="header-logo">
    <div class="logo-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="url(#grad1)" stroke-width="2"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke="url(#grad1)" stroke-width="2"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="url(#grad1)" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="url(#grad1)" stroke-width="2" stroke-linecap="round"/>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f58529"/>
            <stop offset="50%" stop-color="#dd2a7b"/>
            <stop offset="100%" stop-color="#8134af"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span class="logo-text gradient-text">Calengram</span>
  </div>

  <div class="header-actions">
    <button class="icon-btn" on:click={() => dispatch('search')} aria-label="Search events" id="btn-search">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </button>
    <button class="icon-btn" on:click={() => dispatch('add')} aria-label="Add new event" id="btn-add-event">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    </button>
    <button class="icon-btn notifications" aria-label="Notifications" id="btn-notifications">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="notif-dot"></span>
    </button>
  </div>
</header>

<style>
  .header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--border-color);
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
    flex-shrink: 0;
  }

  .header-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    transition: background var(--transition);
    position: relative;
  }

  .icon-btn:hover {
    background: var(--bg-card);
  }

  .icon-btn:active {
    transform: scale(0.92);
  }

  .notifications {
    position: relative;
  }

  .notif-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ig-gradient);
    border: 2px solid var(--bg-primary);
  }
</style>
