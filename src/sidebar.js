(function () {
  const STORAGE_KEY = 'novapad.sidebar.expanded';
  const ORDER_KEY = 'novapad.sidebar.order';
  const ITEM_ORDER_KEY = 'novapad.sidebar.itemOrder';
  const FAVORITES_KEY = 'novapad.sidebar.favorites';

  const icon = {
    panel: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path></svg>',
    notes: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z"></path></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="m14 4 6 6-4 1-5 5-1 4-6-6 4-1 5-5z"></path><path d="m14 4 6 6"></path></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m6 6 1 14h10l1-14"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>',
    palette: '<svg viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 1 10-10c0 1.7-1.3 3-3 3h-1.5a1.5 1.5 0 0 0 0 3H18a4 4 0 0 1-4 4z"></path><circle cx="7.5" cy="10.5" r=".8"></circle><circle cx="10.5" cy="7.5" r=".8"></circle><circle cx="14.5" cy="7.5" r=".8"></circle><circle cx="16.5" cy="11.5" r=".8"></circle></svg>',
    plug: '<svg viewBox="0 0 24 24"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M6 8h12v4a6 6 0 0 1-12 0z"></path></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6.9h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>',
    chevron: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg>',
    grip: '<svg viewBox="0 0 24 24"><path d="M9 6h.01"></path><path d="M9 12h.01"></path><path d="M9 18h.01"></path><path d="M15 6h.01"></path><path d="M15 12h.01"></path><path d="M15 18h.01"></path></svg>'
  };

  const SIDEBAR_I18N = {
    en: {
      notes_section: 'Notes',
      notes: 'Notes',
      all: 'All',
      favorites: 'Favorites',
      pinned: 'Pinned',
      organization: 'Organization',
      workspaces: 'Workspaces',
      folders: 'Folders',
      trash: 'Trash',
      days_30: '30d',
      interface: 'Interface',
      themes: 'Themes',
      visual: 'Look',
      system: 'System',
      plugins: 'Plugins',
      settings: 'Settings',
      general: 'General',
      advanced: 'Advanced',
      favorite_item: 'Favorite item',
      workspace_daily: 'Daily workspace',
      collapse: 'Expand/collapse (Ctrl+B)',
      collapse_label: 'Expand or collapse sidebar',
    },
    'pt-BR': {
      notes_section: 'Notas',
      notes: 'Notas',
      all: 'Tudo',
      favorites: 'Favoritas',
      pinned: 'Fixadas',
      organization: 'Organização',
      workspaces: 'Workspaces',
      folders: 'Pastas',
      trash: 'Lixeira',
      days_30: '30d',
      interface: 'Interface',
      themes: 'Temas',
      visual: 'Visual',
      system: 'Sistema',
      plugins: 'Plugins',
      settings: 'Ajustes',
      general: 'Geral',
      advanced: 'Avançado',
      favorite_item: 'Favoritar item',
      workspace_daily: 'Workspace diário',
      collapse: 'Expandir/recolher (Ctrl+B)',
      collapse_label: 'Expandir ou recolher a barra lateral',
    }
  };

  function sidebarLanguage() {
    return window.NovaPadLanguage === 'pt-BR' || document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en';
  }

  function s(key) {
    const catalog = SIDEBAR_I18N[sidebarLanguage()] || SIDEBAR_I18N.en;
    return catalog[key] || SIDEBAR_I18N.en[key] || key;
  }

  const SECTION_TITLE_KEYS = {
    notes: 'notes_section',
    organization: 'organization',
    interface: 'interface',
    system: 'system',
  };

  const ITEM_LABEL_KEYS = {
    notes: 'notes',
    favorites: 'favorites',
    pinned: 'pinned',
    workspaces: 'workspaces',
    trash: 'trash',
    themes: 'themes',
    plugins: 'plugins',
    settings: 'settings',
    'settings-general': 'general',
    'settings-advanced': 'advanced',
  };

  const ITEM_SHORTCUT_KEYS = {
    notes: 'all',
    workspaces: 'folders',
    trash: 'days_30',
    themes: 'visual',
  };

  function itemLabel(item) {
    return s(ITEM_LABEL_KEYS[item.id]) || item.label || '';
  }

  function itemShortcut(item) {
    return ITEM_SHORTCUT_KEYS[item.id] ? s(ITEM_SHORTCUT_KEYS[item.id]) : (item.shortcut || '');
  }

  const baseSections = [
    {
      id: 'notes',
      title: 'Notas',
      items: [
        { id: 'notes', label: 'Notas', action: 'view:notes', shortcut: 'Tudo', icon: icon.notes },
        { id: 'favorites', label: 'Favoritas', action: 'view:favorites', shortcut: '*', icon: icon.star },
        { id: 'pinned', label: 'Fixadas', action: 'view:pinned', shortcut: 'P', icon: icon.pin }
      ]
    },
    {
      id: 'organization',
      title: 'Organização',
      items: [
        { id: 'workspaces', label: 'Workspaces', action: 'modal:workspaces', shortcut: 'Pastas', icon: icon.folder },
        { id: 'trash', label: 'Lixeira', action: 'view:trash', shortcut: '30d', icon: icon.trash }
      ]
    },
    {
      id: 'interface',
      title: 'Interface',
      items: [
        { id: 'themes', label: 'Temas', action: 'settings:appearance', shortcut: 'Visual', icon: icon.palette }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      items: [
        { id: 'plugins', label: 'Plugins', action: 'settings:plugins', shortcut: 'OCR', icon: icon.plug },
        {
          id: 'settings',
          label: 'Ajustes',
          icon: icon.settings,
          children: [
            { id: 'settings-general', label: 'Geral', action: 'settings:editor', icon: icon.settings },
            { id: 'settings-advanced', label: 'Avançado', action: 'settings:data', icon: icon.shield }
          ]
        }
      ]
    }
  ];

  let activeItemId = 'notes';
  let openGroups = new Set();
  let tooltip;

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // LocalStorage can be disabled in a hardened shell.
    }
  }

  function getFavoriteIds() {
    return new Set(readJson(FAVORITES_KEY, []));
  }

  function toggleFavorite(id) {
    const favorites = getFavoriteIds();
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    writeJson(FAVORITES_KEY, [...favorites]);
    renderSidebar();
  }

  function orderedSections() {
    const order = readJson(ORDER_KEY, null);
    if (!Array.isArray(order)) return baseSections;
    const byId = new Map(baseSections.map(section => [section.id, section]));
    const ordered = order.map(id => byId.get(id)).filter(Boolean);
    baseSections.forEach(section => {
      if (!ordered.includes(section)) ordered.push(section);
    });
    return ordered;
  }

  function orderedItems(section) {
    const allOrders = readJson(ITEM_ORDER_KEY, {});
    const order = Array.isArray(allOrders[section.id]) ? allOrders[section.id] : null;
    if (!order) return section.items;
    const byId = new Map(section.items.map(item => [item.id, item]));
    const ordered = order.map(id => byId.get(id)).filter(Boolean);
    section.items.forEach(item => {
      if (!ordered.includes(item)) ordered.push(item);
    });
    return ordered;
  }

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function renderItem(item, nested = false, sectionId = '') {
    const isOpen = openGroups.has(item.id);
    const isActive = activeItemId === item.id;
    const favorites = getFavoriteIds();
    const favoriteClass = favorites.has(item.id) ? ' active' : '';
    const label = itemLabel(item);
    const shortcut = itemShortcut(item);
    const chevron = item.children ? `<span class="sidebar-chevrons">${icon.chevron}</span>` : '<span class="sidebar-chevrons"></span>';
    const favorite = !item.children ? `<button type="button" class="sidebar-favorite${favoriteClass}" data-sidebar-favorite="${esc(item.id)}" title="${esc(s('favorite_item'))}">*</button>` : '<span></span>';
    const attrs = item.children
      ? `data-sidebar-toggle="${esc(item.id)}"`
      : `data-sidebar-action="${esc(item.action)}"`;
    const children = item.children
      ? `<div class="sidebar-submenu ${isOpen ? 'is-open' : ''}" data-sidebar-submenu="${esc(item.id)}">${item.children.map(child => renderItem(child, true)).join('')}</div>`
      : '';

    return `
      <div class="sidebar-item-wrap ${nested ? 'is-nested' : ''}">
        <div class="sidebar-nav-item ${isActive ? 'active' : ''} ${isOpen ? 'is-open' : ''}"
          role="button" tabindex="0" draggable="${nested ? 'false' : 'true'}"
          data-sidebar-id="${esc(item.id)}" data-sidebar-section-id="${esc(sectionId)}" data-tooltip="${esc(label)}" ${attrs}>
          <span class="sidebar-icon">${item.icon || icon.notes}</span>
          <span class="sidebar-label">${esc(label)}</span>
          <span class="sidebar-shortcut">${esc(shortcut)}</span>
          ${item.children ? chevron : favorite}
        </div>
        ${children}
      </div>
    `;
  }

  function renderSidebar() {
    const root = document.getElementById('sidebar-root');
    if (!root) return;

    const sections = orderedSections();
    root.innerHTML = `
      <div class="sidebar-brand-row">
        <div class="sidebar-brand">
          <div class="sidebar-brand-mark">N</div>
          <div class="sidebar-brand-text">
            <div class="sidebar-brand-title">NovaPad</div>
            <div class="sidebar-brand-sub">${esc(s('workspace_daily'))}</div>
          </div>
        </div>
        <button type="button" class="sidebar-collapse-btn" data-sidebar-collapse title="${esc(s('collapse'))}" aria-label="${esc(s('collapse_label'))}">${icon.panel}</button>
      </div>
      ${sections.map(section => `
        <section class="sidebar-section-block" data-sidebar-section="${esc(section.id)}" draggable="true">
          <div class="sidebar-section-title">${esc(s(SECTION_TITLE_KEYS[section.id]) || section.title)}</div>
          ${orderedItems(section).map(item => renderItem(item, false, section.id)).join('')}
        </section>
      `).join('')}
    `;

    setActiveItem(activeItemId);
    bindDragAndDrop(root);
  }

  function setActiveItem(id) {
    activeItemId = id || 'notes';
    document.querySelectorAll('[data-sidebar-id]').forEach(item => {
      item.classList.toggle('active', item.dataset.sidebarId === activeItemId);
    });
  }

  function runAction(action, id) {
    setActiveItem(id);
    if (action === 'view:notes') window.setNotesView?.('active');
    else if (action === 'view:favorites') window.setNotesView?.('favorites');
    else if (action === 'view:pinned') window.setNotesView?.('pinned');
    else if (action === 'view:trash') window.setNotesView?.('trash');
    else if (action === 'modal:workspaces') window.openWorkspaceModal?.();
    else if (action === 'settings:appearance') window.openSettingsModal?.('appearance');
    else if (action === 'settings:plugins') window.openSettingsModal?.('plugins');
    else if (action === 'settings:editor') window.openSettingsModal?.('editor');
    else if (action === 'settings:data') window.openSettingsModal?.('data');
    else if (action === 'command:palette') window.openCommandPalette?.();
  }

  function toggleSubmenu(id) {
    if (openGroups.has(id)) openGroups.delete(id);
    else openGroups.add(id);
    renderSidebar();
  }

  function handleSidebarClick(event) {
    const favoriteButton = event.target.closest('[data-sidebar-favorite]');
    if (favoriteButton) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(favoriteButton.dataset.sidebarFavorite);
      return;
    }

    const collapseButton = event.target.closest('[data-sidebar-collapse]');
    if (collapseButton) {
      event.preventDefault();
      toggleSidebar();
      return;
    }

    const toggle = event.target.closest('[data-sidebar-toggle]');
    if (toggle) {
      event.preventDefault();
      toggleSubmenu(toggle.dataset.sidebarToggle);
      return;
    }

    const item = event.target.closest('[data-sidebar-action]');
    if (!item) return;
    event.preventDefault();
    runAction(item.dataset.sidebarAction, item.dataset.sidebarId);
  }

  function handleSidebarKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('[data-sidebar-action], [data-sidebar-toggle], [data-sidebar-collapse]');
    if (!item) return;
    event.preventDefault();
    item.click();
  }

  function isExpanded() {
    const sidebar = document.getElementById('sidebar');
    return sidebar?.classList.contains('is-expanded');
  }

  function applyExpandedState(expanded) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('is-expanded', Boolean(expanded));
    sidebar.classList.toggle('is-collapsed', !expanded);
    sidebar.classList.remove('hidden');
    localStorage.setItem(STORAGE_KEY, expanded ? 'expanded' : 'collapsed');
  }

  function toggleSidebar(force) {
    const next = typeof force === 'boolean' ? force : !isExpanded();
    applyExpandedState(next);
    window.syncResizeHandles?.();
  }

  function getTooltip() {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'sidebar-floating-tooltip';
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove('visible');
  }

  function handleHoverTooltip(event) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || sidebar.classList.contains('is-expanded')) {
      hideTooltip();
      return;
    }
    const item = event.target.closest?.('[data-tooltip]');
    if (!item || !sidebar.contains(item)) {
      hideTooltip();
      return;
    }
    const tip = getTooltip();
    const rect = item.getBoundingClientRect();
    tip.textContent = item.dataset.tooltip || '';
    tip.style.left = `${rect.right + 10}px`;
    tip.style.top = `${rect.top + rect.height / 2}px`;
    tip.classList.add('visible');
  }

  function bindDragAndDrop(root) {
    let draggedItem = null;
    root.querySelectorAll('[data-sidebar-id][draggable="true"]').forEach(item => {
      item.addEventListener('dragstart', event => {
        draggedItem = {
          id: item.dataset.sidebarId,
          sectionId: item.dataset.sidebarSectionId
        };
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', draggedItem.id);
      });
      item.addEventListener('dragover', event => {
        const canDropNote = Array.from(event.dataTransfer?.types || []).includes('application/x-novapad-note')
          && ['notes', 'favorites', 'pinned', 'trash'].includes(item.dataset.sidebarId);
        if (canDropNote) {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
          return;
        }
        if (!draggedItem || draggedItem.sectionId !== item.dataset.sidebarSectionId) return;
        event.preventDefault();
      });
      item.addEventListener('drop', event => {
        const noteId = event.dataTransfer?.getData('application/x-novapad-note');
        if (noteId && ['notes', 'favorites', 'pinned', 'trash'].includes(item.dataset.sidebarId)) {
          event.preventDefault();
          window.moveNoteToSidebarSection?.(noteId, item.dataset.sidebarId);
          return;
        }
        if (!draggedItem || draggedItem.sectionId !== item.dataset.sidebarSectionId) return;
        event.preventDefault();
        const targetId = item.dataset.sidebarId;
        if (targetId === draggedItem.id) return;
        const section = baseSections.find(group => group.id === draggedItem.sectionId);
        if (!section) return;
        const allOrders = readJson(ITEM_ORDER_KEY, {});
        const current = orderedItems(section).map(entry => entry.id);
        const from = current.indexOf(draggedItem.id);
        const to = current.indexOf(targetId);
        if (from < 0 || to < 0) return;
        const [moved] = current.splice(from, 1);
        current.splice(to, 0, moved);
        allOrders[section.id] = current;
        writeJson(ITEM_ORDER_KEY, allOrders);
        draggedItem = null;
        renderSidebar();
      });
      item.addEventListener('dragend', () => {
        draggedItem = null;
      });
    });
  }

  function init() {
    const sidebar = document.getElementById('sidebar');
    const root = document.getElementById('sidebar-root');
    if (!sidebar || !root) return;

    applyExpandedState(localStorage.getItem(STORAGE_KEY) === 'expanded');
    renderSidebar();
    root.addEventListener('click', handleSidebarClick);
    root.addEventListener('keydown', handleSidebarKeydown);
    sidebar.addEventListener('mousemove', handleHoverTooltip);
    sidebar.addEventListener('mouseleave', hideTooltip);
    document.addEventListener('click', event => {
      if (!event.target.closest('#sidebar')) hideTooltip();
    });
  }

  window.NovaPadSidebar = {
    init,
    renderSidebar,
    toggleSidebar,
    setActiveItem,
    handleSidebarClick,
    handleHoverTooltip
  };
  window.toggleSidebar = toggleSidebar;
  window.setActiveItem = setActiveItem;
  window.handleSidebarClick = handleSidebarClick;
  window.renderSidebar = renderSidebar;
  window.handleHoverTooltip = handleHoverTooltip;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
