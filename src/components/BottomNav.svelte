<!-- Instagram-style Bottom Navigation Bar -->
<script>
  export let activeTab = 'calendar';
  export let onTabChange = () => {};
</script>

<nav class="bottom-nav" role="navigation" aria-label="Main navigation">
  <button
    class="nav-item"
    class:active={activeTab === 'calendar'}
    on:click={() => onTabChange('calendar')}
    id="nav-calendar"
    aria-label="Calendar view"
    aria-current={activeTab === 'calendar' ? 'page' : undefined}
  >
    <div class="nav-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'calendar' ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="3" y="4" width="18" height="18" rx="3"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
      </svg>
    </div>
    <span class="nav-label">Calendar</span>
  </button>

  <button
    class="nav-item"
    class:active={activeTab === 'feed'}
    on:click={() => onTabChange('feed')}
    id="nav-feed"
    aria-label="Events feed"
    aria-current={activeTab === 'feed' ? 'page' : undefined}
  >
    <div class="nav-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" fill={activeTab === 'feed' ? 'currentColor' : 'none'}/>
        <rect x="14" y="3" width="7" height="7" rx="1" fill={activeTab === 'feed' ? 'currentColor' : 'none'}/>
        <rect x="3" y="14" width="7" height="7" rx="1" fill={activeTab === 'feed' ? 'currentColor' : 'none'}/>
        <rect x="14" y="14" width="7" height="7" rx="1" fill={activeTab === 'feed' ? 'currentColor' : 'none'}/>
      </svg>
    </div>
    <span class="nav-label">Feed</span>
  </button>

  <!-- Center Add Button -->
  <button
    class="nav-add"
    on:click={() => onTabChange('add')}
    id="nav-add"
    aria-label="Add new event"
  >
    <div class="add-inner">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
  </button>

  <button
    class="nav-item"
    class:active={activeTab === 'agenda'}
    on:click={() => onTabChange('agenda')}
    id="nav-agenda"
    aria-label="Agenda view"
    aria-current={activeTab === 'agenda' ? 'page' : undefined}
  >
    <div class="nav-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="8" y1="6" x2="21" y2="6" stroke-width={activeTab === 'agenda' ? 2.5 : 2}/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3" cy="6" r="1.5" fill={activeTab === 'agenda' ? 'currentColor' : 'none'} stroke="currentColor"/>
        <circle cx="3" cy="12" r="1.5" fill="none" stroke="currentColor"/>
        <circle cx="3" cy="18" r="1.5" fill="none" stroke="currentColor"/>
      </svg>
    </div>
    <span class="nav-label">Agenda</span>
  </button>

  <button
    class="nav-item"
    class:active={activeTab === 'profile'}
    on:click={() => onTabChange('profile')}
    id="nav-profile"
    aria-label="Profile"
    aria-current={activeTab === 'profile' ? 'page' : undefined}
  >
    <div class="nav-icon profile-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
    <span class="nav-label">Profile</span>
  </button>
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: var(--nav-height);
    background: rgba(10, 10, 10, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 200;
    padding: 0 8px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 10px;
    border-radius: var(--radius-md);
    color: var(--text-muted);
    transition: all var(--transition);
    flex: 1;
  }

  .nav-item:hover {
    color: var(--text-secondary);
  }

  .nav-item.active {
    color: var(--text-primary);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--transition);
  }

  .nav-item:active .nav-icon {
    transform: scale(0.85);
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  /* Center Add Button */
  .nav-add {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: 0 4px;
  }

  .add-inner {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-xl);
    background: var(--ig-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(221, 42, 123, 0.4);
    transition: all var(--transition);
  }

  .nav-add:hover .add-inner {
    transform: scale(1.08);
    box-shadow: 0 6px 24px rgba(221, 42, 123, 0.6);
  }

  .nav-add:active .add-inner {
    transform: scale(0.92);
  }
</style>
