<!-- Add/Edit Event Modal -->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let show = false;
  export let editEvent = null;
  export let defaultDate = null;

  const dispatch = createEventDispatcher();

  const EMOJIS = ['📅','🎉','🎂','💼','🏥','✈️','🏋️','🍽️','📚','🎵','🎮','💪','🏖️','🌟','❤️','🎓','🔔','🏆','🎯','🚀'];
  const COLORS = [
    { bg: 'linear-gradient(135deg, #f58529, #dd2a7b)', id: 'sunset' },
    { bg: 'linear-gradient(135deg, #dd2a7b, #8134af)', id: 'rose' },
    { bg: 'linear-gradient(135deg, #8134af, #515bd4)', id: 'violet' },
    { bg: 'linear-gradient(135deg, #515bd4, #30a8e0)', id: 'ocean' },
    { bg: 'linear-gradient(135deg, #2ecc71, #30a8e0)', id: 'mint' },
    { bg: 'linear-gradient(135deg, #f09433, #e6683c)', id: 'fire' },
  ];

  let title = '';
  let date = '';
  let time = '';
  let description = '';
  let emoji = '📅';
  let color = COLORS[0].bg;
  let tagsInput = '';
  let emojiPickerOpen = false;
  let errors = {};

  $: if (show) {
    if (editEvent) {
      title = editEvent.title || '';
      date = editEvent.date || '';
      time = editEvent.time || '';
      description = editEvent.description || '';
      emoji = editEvent.emoji || '📅';
      color = editEvent.color || COLORS[0].bg;
      tagsInput = (editEvent.tags || []).join(', ');
    } else {
      title = '';
      date = defaultDate || new Date().toISOString().split('T')[0];
      time = '';
      description = '';
      emoji = '📅';
      color = COLORS[0].bg;
      tagsInput = '';
    }
    errors = {};
    emojiPickerOpen = false;
  }

  function validate() {
    errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!date) errors.date = 'Date is required';
    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const eventData = {
      id: editEvent?.id || Date.now().toString(),
      title: title.trim(),
      date,
      time: time || null,
      description: description.trim(),
      emoji,
      color,
      tags,
    };
    dispatch('save', eventData);
  }

  function handleClose() {
    dispatch('close');
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) handleClose();
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdrop}>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <!-- Modal Handle -->
      <div class="modal-handle"></div>

      <!-- Header -->
      <div class="modal-header">
        <button class="modal-close" on:click={handleClose} id="btn-modal-close" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2 class="modal-title" id="modal-title">{editEvent ? 'Edit Event' : 'New Event'}</h2>
        <button class="modal-save" on:click={handleSubmit} id="btn-modal-save">
          {editEvent ? 'Update' : 'Share'}
        </button>
      </div>

      <!-- Preview Banner -->
      <div class="preview-banner" style="background: {color}">
        <span class="preview-emoji">{emoji}</span>
        <div class="preview-info">
          <span class="preview-title">{title || 'Event Title'}</span>
          {#if time}
            <span class="preview-time">{time}</span>
          {/if}
        </div>
      </div>

      <!-- Form -->
      <div class="modal-body">
        <!-- Emoji Picker -->
        <div class="form-group">
          <label class="form-label">Emoji</label>
          <button class="emoji-trigger" on:click={() => emojiPickerOpen = !emojiPickerOpen} id="btn-emoji-picker">
            <span class="selected-emoji">{emoji}</span>
            <span class="emoji-caret">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </button>
          {#if emojiPickerOpen}
            <div class="emoji-grid">
              {#each EMOJIS as em, i}
                <button
                  class="emoji-option"
                  class:active={emoji === em}
                  on:click={() => { emoji = em; emojiPickerOpen = false; }}
                  id="emoji-opt-{i}"
                >
                  {em}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Color Picker -->
        <div class="form-group">
          <label class="form-label">Theme</label>
          <div class="color-row">
            {#each COLORS as c, i}
              <button
                class="color-dot"
                class:active={color === c.bg}
                style="background: {c.bg}"
                on:click={() => color = c.bg}
                id="color-opt-{i}"
                aria-label="Color theme {i + 1}"
              ></button>
            {/each}
          </div>
        </div>

        <!-- Title -->
        <div class="form-group">
          <label class="form-label" for="input-title">Title *</label>
          <input
            id="input-title"
            type="text"
            class="form-input"
            class:error={errors.title}
            bind:value={title}
            placeholder="What's the event?"
            maxlength="60"
          />
          {#if errors.title}<span class="error-msg">{errors.title}</span>{/if}
        </div>

        <!-- Date & Time -->
        <div class="form-row">
          <div class="form-group flex1">
            <label class="form-label" for="input-date">Date *</label>
            <input
              id="input-date"
              type="date"
              class="form-input"
              class:error={errors.date}
              bind:value={date}
            />
            {#if errors.date}<span class="error-msg">{errors.date}</span>{/if}
          </div>
          <div class="form-group flex1">
            <label class="form-label" for="input-time">Time</label>
            <input
              id="input-time"
              type="time"
              class="form-input"
              bind:value={time}
            />
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label" for="input-desc">Description</label>
          <textarea
            id="input-desc"
            class="form-textarea"
            bind:value={description}
            placeholder="Add a caption..."
            rows="3"
            maxlength="200"
          ></textarea>
        </div>

        <!-- Tags -->
        <div class="form-group">
          <label class="form-label" for="input-tags">Tags</label>
          <input
            id="input-tags"
            type="text"
            class="form-input"
            bind:value={tagsInput}
            placeholder="work, personal, health (comma separated)"
          />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    background: var(--bg-secondary);
    border-radius: 24px 24px 0 0;
    width: 100%;
    max-width: 480px;
    max-height: 92vh;
    overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    scrollbar-width: none;
  }

  .modal::-webkit-scrollbar { display: none; }

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-handle {
    width: 36px;
    height: 4px;
    background: var(--border-light);
    border-radius: 2px;
    margin: 10px auto 0;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-close {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all var(--transition);
  }

  .modal-close:hover {
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .modal-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .modal-save {
    font-size: 14px;
    font-weight: 700;
    background: var(--ig-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: opacity var(--transition);
    padding: 6px 8px;
  }

  .modal-save:hover { opacity: 0.8; }
  .modal-save:active { opacity: 0.6; }

  .preview-banner {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
    transition: background 0.4s ease;
  }

  .preview-emoji {
    font-size: 42px;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));
    animation: floatEmoji 3s ease-in-out infinite;
  }

  @keyframes floatEmoji {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .preview-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .preview-title {
    font-size: 16px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  .preview-time {
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
  }

  .modal-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 32px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-row {
    display: flex;
    gap: 12px;
  }

  .flex1 { flex: 1; }

  .form-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .form-input, .form-textarea {
    background: var(--bg-input);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 11px 14px;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color var(--transition);
    width: 100%;
    resize: none;
  }

  .form-input:focus, .form-textarea:focus {
    border-color: var(--accent-pink);
  }

  .form-input.error {
    border-color: var(--danger);
  }

  .form-input::placeholder, .form-textarea::placeholder {
    color: var(--text-muted);
  }

  /* Date/time input color fix for dark */
  input[type="date"], input[type="time"] {
    color-scheme: dark;
  }

  .error-msg {
    font-size: 11px;
    color: var(--danger);
  }

  /* Emoji Picker */
  .emoji-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-input);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    transition: border-color var(--transition);
    width: fit-content;
  }

  .emoji-trigger:hover {
    border-color: var(--border-light);
  }

  .selected-emoji {
    font-size: 22px;
    line-height: 1;
  }

  .emoji-caret {
    color: var(--text-muted);
  }

  .emoji-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 10px;
    animation: fadeIn 0.15s ease;
  }

  .emoji-option {
    width: 38px;
    height: 38px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: background var(--transition), transform var(--transition);
  }

  .emoji-option:hover {
    background: var(--bg-card-hover);
    transform: scale(1.15);
  }

  .emoji-option.active {
    background: var(--bg-card-hover);
    outline: 2px solid var(--accent-pink);
  }

  /* Color Picker */
  .color-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .color-dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition: transform var(--transition), box-shadow var(--transition);
    border: 2.5px solid transparent;
  }

  .color-dot:hover {
    transform: scale(1.15);
  }

  .color-dot.active {
    transform: scale(1.1);
    box-shadow: 0 0 0 3px var(--bg-secondary), 0 0 0 5px white;
  }
</style>
