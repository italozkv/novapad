const DiscordRPC = require('discord-rpc');

function createDiscordRichPresence(context = {}) {
  const state = {
    client: null,
    connected: false,
    startedAt: new Date(),
    retryTimer: null,
    refreshTimer: null,
    stopping: false,
    localContext: {},
    lastSignature: '',
  };

  const clientId = context.clientId || '1500357586283921488';
  const log = typeof context.log === 'function' ? context.log : () => {};

  function getSettings() {
    const settings = context.getSettings ? context.getSettings() : {};
    return settings.discord_rich_presence || {};
  }

  function isEnabled() {
    return getSettings().enabled !== false;
  }

  function getRuntimeContext() {
    return {
      ...(context.getContext ? context.getContext() : {}),
      ...state.localContext,
    };
  }

  function buildActivity() {
    const settings = getSettings();
    const runtime = getRuntimeContext();
    const fragments = [];

    if (settings.showCurrentWorkspace && runtime.currentWorkspace) {
      fragments.push(`Workspace: ${runtime.currentWorkspace}`);
    }
    if (settings.showCurrentNote && runtime.currentNoteTitle) {
      fragments.push(`Nota: ${runtime.currentNoteTitle}`);
    }

    const stateText = fragments.length ? fragments.join(' • ') : 'Organizando ideias';

    return {
      details: 'Escrevendo notas',
      state: stateText,
      startTimestamp: state.startedAt,
      largeImageText: 'NovaPad',
      smallImageText: 'Organizando ideias',
      instance: false,
    };
  }

  function clearTimers() {
    if (state.retryTimer) clearTimeout(state.retryTimer);
    if (state.refreshTimer) clearInterval(state.refreshTimer);
    state.retryTimer = null;
    state.refreshTimer = null;
  }

  function scheduleReconnect() {
    if (state.stopping || !isEnabled()) return;
    if (state.retryTimer) clearTimeout(state.retryTimer);
    state.retryTimer = setTimeout(() => {
      state.retryTimer = null;
      startRPC().catch(() => {});
    }, 15000);
  }

  async function clearActivity() {
    if (!state.client || !state.connected) return;
    try {
      await state.client.clearActivity();
    } catch (error) {
      log('Discord clearActivity failed', error?.message || error);
    }
  }

  async function setActivity() {
    if (!state.client || !state.connected) return;
    if (!isEnabled()) {
      await clearActivity();
      return;
    }

    const activity = buildActivity();
    const signature = JSON.stringify(activity);
    if (signature === state.lastSignature) return;

    try {
      await state.client.setActivity(activity);
      state.lastSignature = signature;
    } catch (error) {
      log('Discord setActivity failed', error?.message || error);
      scheduleReconnect();
    }
  }

  async function startRPC() {
    if (state.client && state.connected) return state.client;
    if (!clientId || !isEnabled()) return null;
    if (state.client && !state.connected) {
      try {
        await state.client.login({ clientId });
        return state.client;
      } catch (error) {
        log('Discord relogin failed', error?.message || error);
        scheduleReconnect();
        return null;
      }
    }

    try {
      const client = new DiscordRPC.Client({ transport: 'ipc' });
      client.on('ready', async () => {
        state.connected = true;
        clearTimers();
        state.refreshTimer = setInterval(() => {
          updatePresence().catch(() => {});
        }, 12000);
        await setActivity();
      });
      client.on('disconnected', () => {
        state.connected = false;
        clearTimers();
        scheduleReconnect();
      });
      client.on('error', error => {
        state.connected = false;
        log('Discord RPC error', error?.message || error);
        scheduleReconnect();
      });

      state.client = client;
      await client.login({ clientId });
      return client;
    } catch (error) {
      state.client = null;
      state.connected = false;
      log('Discord RPC unavailable', error?.message || error);
      scheduleReconnect();
      return null;
    }
  }

  async function startPresence() {
    if (state.stopping) return;
    if (!state.startedAt) state.startedAt = new Date();
    if (!isEnabled()) {
      await stopPresence({ keepTimestamp: true });
      return;
    }
    await startRPC();
    await setActivity();
  }

  async function updatePresence() {
    if (state.stopping) return;
    if (!isEnabled()) {
      await stopPresence({ keepTimestamp: true });
      return;
    }
    if (!state.client || !state.connected) {
      await startRPC();
    }
    await setActivity();
  }

  async function stopPresence(options = {}) {
    const keepTimestamp = Boolean(options.keepTimestamp);
    clearTimers();
    await clearActivity();
    if (state.client) {
      try {
        state.client.destroy();
      } catch (error) {
        log('Discord destroy failed', error?.message || error);
      }
    }
    state.client = null;
    state.connected = false;
    state.lastSignature = '';
    state.stopping = !keepTimestamp && state.stopping;
  }

  async function handleAppStart() {
    state.stopping = false;
    if (!state.startedAt) state.startedAt = new Date();
    await startPresence();
  }

  async function handleAppClose() {
    state.stopping = true;
    await stopPresence({ keepTimestamp: true });
  }

  function setContext(nextContext = {}) {
    state.localContext = {
      ...state.localContext,
      ...(nextContext || {}),
    };
  }

  return {
    startRPC,
    setActivity,
    clearActivity,
    startPresence,
    updatePresence,
    stopPresence,
    handleAppStart,
    handleAppClose,
    setContext,
  };
}

function activate(context) {
  return createDiscordRichPresence(context);
}

module.exports = {
  createDiscordRichPresence,
  activate,
};
