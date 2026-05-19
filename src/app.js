// ────────────────────────────────────────────────────────────
//  NovaPad — app.js
// ────────────────────────────────────────────────────────────

const TAG_COLORS = {
  pessoal:  { bg: '#FCA5A5', text: '#7F0000' },
  trabalho: { bg: '#FCD34D', text: '#6B4000' },
  ideias:   { bg: '#6EE7B7', text: '#004D33' },
  estudo:   { bg: '#7DD3FC', text: '#003A5C' },
  criativo: { bg: '#C4B5FD', text: '#3B0080' },
  projetos: { bg: '#FDA4AF', text: '#7F001A' },
  pesquisa: { bg: '#86EFAC', text: '#004A1A' },
};
const ALL_TAGS = Object.keys(TAG_COLORS);

const THEME_PRESETS = {
  midnight: {
    label: 'Midnight',
    hint: 'Noturno confortavel',
    dark: true,
    icon: 'MO',
    editorFont: 'Cascadia Mono',
    vars: {
      bg: '#101624', sidebar: '#151C2B', panel: '#1B2435', panel2: '#243047',
      text: '#E7ECF5', muted: '#8D99AE', border: '#2E3A52', accent: '#7DD3FC', accent2: '#A5B4FC'
    },
  },
  dev: {
    label: 'Dev Hacker',
    hint: 'Preto e verde neon',
    dark: true,
    icon: '</>',
    editorFont: 'Cascadia Mono',
    vars: {
      bg: '#030806', sidebar: '#06110B', panel: '#09170F', panel2: '#0D2116',
      text: '#D7FFE8', muted: '#6DAF83', border: '#153B27', accent: '#00FF88', accent2: '#39FF14'
    },
  },
  paper: {
    label: 'Papel',
    hint: 'Escrita e leitura',
    dark: false,
    icon: 'Aa',
    editorFont: 'Georgia',
    vars: {
      bg: '#F6EEDC', sidebar: '#E8DEC8', panel: '#FFF8EA', panel2: '#F1E5CB',
      text: '#2B2418', muted: '#8A7B62', border: '#D6C7AA', accent: '#A56A2A', accent2: '#3D7D61'
    },
  },
  minimal: {
    label: 'Minimal',
    hint: 'Claro moderno',
    dark: false,
    icon: 'MN',
    editorFont: 'Cascadia Mono',
    vars: {
      bg: '#F7F8FA', sidebar: '#ECEFF3', panel: '#FFFFFF', panel2: '#F1F4F8',
      text: '#171A1F', muted: '#7B8492', border: '#D8DEE8', accent: '#2563EB', accent2: '#14B8A6'
    },
  },
  gamer: {
    label: 'Gamer Neon',
    hint: 'Roxo, azul e glow',
    dark: true,
    icon: 'GG',
    editorFont: 'Cascadia Mono',
    vars: {
      bg: '#0B0714', sidebar: '#120C24', panel: '#19102F', panel2: '#241642',
      text: '#F1EAFE', muted: '#9585B8', border: '#38265F', accent: '#8B5CF6', accent2: '#22D3EE'
    },
  },
  nature: {
    label: 'Nature Calm',
    hint: 'Verde suave e bege',
    dark: false,
    icon: 'NC',
    editorFont: 'Georgia',
    vars: {
      bg: '#EFF4E8', sidebar: '#E1E9D8', panel: '#FAF8EF', panel2: '#EAF0DD',
      text: '#202A1F', muted: '#71806B', border: '#CED8C2', accent: '#2F855A', accent2: '#84A98C'
    },
  },
  custom: {
    label: 'Custom',
    hint: 'Suas cores',
    dark: true,
    icon: 'CU',
    editorFont: '',
    vars: {
      bg: '#0E0E12', sidebar: '#141418', panel: '#1A1A20', panel2: '#202028',
      text: '#E8E6E0', muted: '#5A5870', border: '#2A2830', accent: '#6EE7B7', accent2: '#38BDF8'
    },
  },
};
const THEME_ORDER = ['midnight', 'dev', 'paper', 'minimal', 'gamer', 'nature', 'custom'];
const EDITOR_FONT_PRESETS = [
  { value: 'DM Mono', label: 'DM Mono' },
  { value: 'Cascadia Mono', label: 'Cascadia Mono' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Lucida Console', label: 'Lucida Console' },
  { value: 'Source Code Pro', label: 'Source Code Pro' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Fira Code', label: 'Fira Code' },
  { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
  { value: 'Segoe UI', label: 'Segoe UI' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Aptos', label: 'Aptos' },
  { value: 'Calibri', label: 'Calibri' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Cambria', label: 'Cambria' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Palatino Linotype', label: 'Palatino Linotype' },
  { value: 'Book Antiqua', label: 'Book Antiqua' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: '__custom__', label: 'Personalizada' },
];
const MONO_FONT_NAMES = new Set(['DM Mono', 'Cascadia Mono', 'Consolas', 'Courier New', 'Lucida Console', 'Source Code Pro', 'JetBrains Mono', 'Fira Code', 'IBM Plex Mono']);
const SERIF_FONT_NAMES = new Set(['Georgia', 'Cambria', 'Garamond', 'Palatino Linotype', 'Book Antiqua', 'Times New Roman']);
const SANS_FONT_NAMES = new Set(['Segoe UI', 'Inter', 'Arial', 'Aptos', 'Calibri', 'Tahoma', 'Trebuchet MS', 'Verdana']);
const DEFAULT_LICENSE_SERVER_URL = 'https://novapad-server-dtjc.onrender.com';
const DEFAULT_LICENSE_APP_KEY = 'novapad-dev-key';
const SESSION_CACHE_KEY = 'novapad.savedSession';

// ── State ─────────────────────────────────────────────────────
let notes = [];
let settings = { dark_mode: true, theme_preset: 'midnight', custom_theme: {}, font_size: 14, font_family: 'DM Mono', font_family_custom: '', editor_mode: 'markdown', auto_save: true, auto_save_delay: 1500, minimap: true, internal_links_visible: true, workspaces: ['General'], currentWorkspace: 'General', sidebar_width: 260, preview_width: 520, minimap_width: 120, language: 'en', update_url: '', auto_update: true, custom_tags: [], custom_snippets: [], backup_folder: '', auto_backup: false, backup_interval_ms: 300000, discord_rich_presence: { enabled: true, showCurrentNote: false, showCurrentWorkspace: false } };
let activeNoteId = null;
let activeTag = null;
let focusMode = false;
let statsVisible = false;
let previewVisible = false;
let notesView = 'active';
let autoSaveTimer = null;
let isDirty = false;
let selectedNoteIds = new Set();
let appInfo = null;
let pluginWorkbenchState = { buttons: [], panels: [] };

// ── DOM refs ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const editor        = $('editor');
const editorCode    = $('editor-code');
const notesList     = $('notes-list');
const searchInput   = $('search-input');
const noteTitleInput = $('note-title-input');
const noteMeta      = $('note-meta');
const tagsBar       = $('tags-bar');
const sidebar       = $('sidebar');
const statsPanel    = $('stats-panel');
const focusBar      = $('focus-bar');
const modalOverlay  = $('modal-overlay');
const modalBox      = $('modal-box');
const tbFilename    = $('tb-filename');
const btnChangeTag  = $('btn-change-tag');
const minimap       = $('minimap');
const minimapContent = $('minimap-content');
const previewPane = $('preview-pane');
const editorArea = $('editor-area');
const workspaceSelect = $('workspace-select');
const editorMediaBar = $('editor-media-bar');
const pluginWorkbench = $('plugin-workbench');
const pluginToolbar = $('plugin-toolbar');
const pluginPanels = $('plugin-panels');
const selectionToolbar = $('selection-toolbar');
const slashCommandMenu = $('slash-command-menu');
const compactNotePanel = $('compact-note-panel');
const compactNoteInput = $('compact-note-input');
const compactNoteHandle = compactNotePanel?.querySelector('.compact-note-head');
const sidebarResizer = $('sidebar-resizer');
const previewResizer = $('preview-resizer');
const minimapResizer = $('minimap-resizer');
const appShell = $('app');
const noteContextMenu = $('note-context-menu');
const authGate = $('auth-gate');
const toolbarMenus = [...document.querySelectorAll('[data-menu]')];
const menuTriggers = [...document.querySelectorAll('[data-menu-trigger]')];
if (!window.CodeMirror) editor?.addEventListener('paste', handlePasteImage, true);
let codeEditor = null;
let suppressEditorChange = false;
let compactNoteDrag = null;
let contextNoteId = null;
let pendingUpdateInfo = null;
let imageOcrSession = null;
let commandPaletteItems = [];
let selectionToolbarRaf = null;
let selectionToolbarHideTimer = null;
let slashCommandState = null;
let findReplaceBar = null;
let findReplaceState = { matches: [], marks: [], activeIndex: -1, caseSensitive: false, wholeWord: false, timer: null };
let currentSession = null;

function getNovaPadBridge() {
  return window.novapad || window.api?.novapad || null;
}

function unwrapBridgeResult(result, fallback = null) {
  return result && result.success ? result.data : fallback;
}

function bridgeErrorMessage(result, fallback = 'Erro inesperado.') {
  return result?.error || result?.message || fallback;
}

function authBridgeMessage(errorOrResult, fallback = 'Nao foi possivel completar a acao.') {
  if (!errorOrResult) return fallback;
  if (typeof errorOrResult === 'string') return errorOrResult;
  return errorOrResult.error || errorOrResult.message || fallback;
}

function isValidEmail(value = '') {
  const normalized = String(value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

function cacheSession(session) {
  if (!session?.user || !session?.session?.token || !session?.session?.userId) return;
  try {
    localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
      user: session.user,
      license: session.license || null,
      entitlements: session.entitlements || [],
      session: {
        userId: session.session.userId,
        token: session.session.token,
        issuedAt: session.session.issuedAt || null,
        expiresAt: session.session.expiresAt || null,
      },
    }));
  } catch (_) {}
}

function readCachedSession() {
  try {
    const cached = JSON.parse(localStorage.getItem(SESSION_CACHE_KEY) || 'null');
    return cached?.user && cached?.session?.token ? cached : null;
  } catch (_) {
    return null;
  }
}

function clearCachedSession() {
  try { localStorage.removeItem(SESSION_CACHE_KEY); } catch (_) {}
}

async function restoreCachedSession(bridge = getNovaPadBridge()) {
  const cached = readCachedSession();
  if (!cached?.session?.token) return null;
  if (!bridge?.auth?.restoreSession) return cached;

  const restored = unwrapBridgeResult(
    await bridge.auth.restoreSession({ session: cached.session }).catch(() => null),
    null,
  );
  if (restored?.user) {
    cacheSession(restored);
    return restored;
  }
  clearCachedSession();
  return null;
}

async function resolveRendererSession({ allowCurrentFallback = true, bridge = getNovaPadBridge() } = {}) {
  if (!bridge?.auth) {
    return {
      session: allowCurrentFallback && currentSession?.user ? currentSession : null,
      source: allowCurrentFallback && currentSession?.user ? 'memory' : 'none',
    };
  }

  const liveResult = await bridge.auth.getSession().catch(error => ({ success: false, error: error?.message }));
  const liveSession = unwrapBridgeResult(liveResult, null);
  if (liveSession?.user) {
    currentSession = liveSession;
    cacheSession(liveSession);
    return { session: liveSession, source: 'live' };
  }

  const cachedSession = await restoreCachedSession(bridge);
  if (cachedSession?.user) {
    currentSession = cachedSession;
    cacheSession(cachedSession);
    return { session: cachedSession, source: 'cached' };
  }

  if (allowCurrentFallback && currentSession?.user) {
    return { session: currentSession, source: 'memory' };
  }

  return { session: null, source: 'none' };
}

function getSettingsExtra() {
  if (!settings.extra || typeof settings.extra !== 'object') {
    settings.extra = {};
  }
  return settings.extra;
}

function isRenderLicenseServerUrl(value = '') {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized.includes('onrender.com');
}

function isPackagedBuild() {
  return Boolean(appInfo?.isPackaged);
}

function getLicenseEnvironmentMode(extra = getSettingsExtra()) {
  const serverUrl = String(extra.licenseServerUrl || extra.license_server_url || '').trim();
  if (isRenderLicenseServerUrl(serverUrl)) return 'production';
  if (isPackagedBuild()) return 'production';

  const mode = String(extra.licenseMode || extra.license_mode || 'development').trim().toLowerCase();
  return mode === 'production' ? 'production' : 'development';
}

function getLicenseConnectionDefaults(mode = 'development') {
  return mode === 'production'
    ? {
        serverUrl: process.env.NOVAPAD_LICENSE_SERVER_URL || DEFAULT_LICENSE_SERVER_URL,
        appKey: process.env.NOVAPAD_LICENSE_APP_KEY || process.env.NOVAPAD_APP_KEY || '',
      }
    : { serverUrl: 'http://localhost:3333', appKey: DEFAULT_LICENSE_APP_KEY };
}

const I18N = {
  en: {
    no_note: 'No note selected',
    app_settings: 'App settings',
    app_settings_sub: 'Adjust writing, language, auto-save, and online updates.',
    font_family: 'Font family',
    editor_mode: 'Editor mode',
    font_size: 'Font size',
    show_minimap: 'Show minimap on long texts',
    auto_save_label: 'Save notes automatically while you type',
    auto_save_interval: 'Auto-save interval',
    language: 'Language',
    update_url: 'Update URL',
    update_url_help: 'Host your NSIS installer files and latest.yml in this folder URL.',
    auto_update: 'Check and download updates automatically',
    current_version: 'Current version',
    local_data_folder: 'Local data folder',
    open_folder: 'Open folder',
    save_now: 'Save now',
    save_settings: 'Save settings',
    check_updates: 'Check for updates',
    saved_now: 'Saved now',
    settings_updated: 'Settings updated',
    update_url_missing: 'Set an update URL in settings first',
    checking_updates: 'Checking for updates...',
    update_available: 'New version found. Downloading...',
    update_not_available: 'You already have the latest version',
    update_progress: 'Downloading update: {percent}%',
    update_downloaded: 'Update downloaded. Ready to install.',
    update_error: 'Update error: {message}',
    install_update: 'Install update',
    later: 'Later',
    install_update_title: 'Update ready',
    install_update_sub: 'A new version has been downloaded. Restart the app to install it now.',
    restart_install: 'Restart and install',
    autosave_on: '? Auto-save active',
    autosave_off: '? Auto-save off',
    new_note: 'New note',
    internal_links_title: 'Internal links',
    internal_link_section: 'Internal link',
    internal_link_help: '[[Name]] = internal link',
    link_click_help: 'Click = open or create note',
    link_open_create: 'Open or create note',
    link_hint_back: 'points here',
    link_hint_open: 'open',
    link_hint_create: 'create',
    backlinks_title: 'Who points to you',
    graph_title: 'Idea map',
    graph_empty: 'No connected ideas yet.',
    current_note: 'Current note',
    select_note: 'Select a note.',
    backlinks_empty: 'No notes point here yet.',
    linked_note_created: 'Linked note created',
    linked_note_restored: 'Linked note restored',
    image_inserted: 'Image inserted',
    image_paste_failed: 'Could not paste the image',
    welcome_title: 'Welcome to NovaPad!',
    welcome_body: 'Hello! Welcome to NovaPad.\n\nFeatures:\n[ ] Create and organize notes\n[ ] Category tags\n[ ] Focus mode (F11)\n[ ] Export in 7 formats\n[ ] Version history\n[ ] Text statistics\n[ ] Internal links and idea map\n\nTips:\n- [[Name]] = internal link\n- Click = open or create note\n- Backlinks = who points to you\n- Graph = idea map\n- Use [ ] for clickable tasks\n- Ctrl+S saves manually\n- Ctrl+E opens export\n- Ctrl+B shows/hides sidebar',
    all: 'all',
  },
  'pt-BR': {
    no_note: 'Nenhuma nota',
    app_settings: 'Configuracoes do app',
    app_settings_sub: 'Ajuste escrita, idioma, salvamento automatico e atualizacoes online.',
    font_family: 'Tipo de fonte',
    editor_mode: 'Modo do editor',
    font_size: 'Tamanho da fonte',
    show_minimap: 'Mostrar minimap em textos longos',
    auto_save_label: 'Salvar notas automaticamente enquanto voce digita',
    auto_save_interval: 'Intervalo do auto-save',
    language: 'Idioma',
    update_url: 'URL de atualizacao',
    update_url_help: 'Hospede o instalador NSIS e o latest.yml nesta URL de pasta.',
    auto_update: 'Verificar e baixar atualizacoes automaticamente',
    current_version: 'Versao atual',
    local_data_folder: 'Pasta local de dados',
    open_folder: 'Abrir pasta',
    save_now: 'Salvar agora',
    save_settings: 'Salvar configuracoes',
    check_updates: 'Verificar atualizacoes',
    saved_now: 'Salvo agora',
    settings_updated: 'Configuracoes atualizadas',
    update_url_missing: 'Defina primeiro a URL de atualizacao nas configuracoes',
    checking_updates: 'Verificando atualizacoes...',
    update_available: 'Nova versao encontrada. Baixando...',
    update_not_available: 'Voce ja esta na versao mais recente',
    update_progress: 'Baixando atualizacao: {percent}%',
    update_downloaded: 'Atualizacao baixada. Pronta para instalar.',
    update_error: 'Erro na atualizacao: {message}',
    install_update: 'Instalar atualizacao',
    later: 'Depois',
    install_update_title: 'Atualizacao pronta',
    install_update_sub: 'Uma nova versao foi baixada. Reinicie o app para instalar agora.',
    restart_install: 'Reiniciar e instalar',
    autosave_on: '? Auto-save ativo',
    autosave_off: '? Auto-save desligado',
    new_note: 'Nova nota',
    internal_links_title: 'Links internos',
    internal_link_section: 'Link interno',
    internal_link_help: '[[Nome]] = link interno',
    link_click_help: 'Clicar = abrir ou criar nota',
    link_open_create: 'Abrir ou criar nota',
    link_hint_back: 'aponta',
    link_hint_open: 'abrir',
    link_hint_create: 'criar',
    backlinks_title: 'Quem aponta pra voc?',
    graph_title: 'Mapa das ideias',
    graph_empty: 'Sem ideias ligadas ainda.',
    current_note: 'Nota atual',
    select_note: 'Selecione uma nota.',
    backlinks_empty: 'Ningu?m aponta pra esta nota ainda.',
    linked_note_created: 'Nota vinculada criada',
    linked_note_restored: 'Nota restaurada',
    image_inserted: 'Imagem inserida',
// ────────────────────────────────────────────────────────────
    welcome_title: 'Bem-vindo ao NovaPad!',
    welcome_body: 'Ol?! Bem-vindo ao NovaPad!\n\nFuncionalidades:\n[ ] Criar e organizar notas\n[ ] Tags por categoria\n[ ] Modo Foco (F11)\n[ ] Exportar em 7 formatos\n[ ] Hist?rico de vers?es\n[ ] Estat?sticas de texto\n[ ] Links internos e mapa das ideias\n\nDicas:\n- [[Nome]] = link interno\n- Clicar = abrir ou criar nota\n- Backlinks = quem aponta pra voc?\n- Grafo = mapa das ideias\n- Use [ ] para tarefas clic?veis\n- Ctrl+S salva manualmente\n- Ctrl+E abre o exportador\n- Ctrl+B mostra/esconde a sidebar',
    all: 'todas',
  },
};

function currentLanguage() {
  return settings.language === 'pt-BR' ? 'pt-BR' : 'en';
}

const CP1252_BYTE_MAP = {
  '\u20ac': 0x80, '\u201a': 0x82, '\u0192': 0x83, '\u201e': 0x84,
  '\u2026': 0x85, '\u2020': 0x86, '\u2021': 0x87, '\u02c6': 0x88,
  '\u2030': 0x89, '\u0160': 0x8a, '\u2039': 0x8b, '\u0152': 0x8c,
  '\u017d': 0x8e, '\u2018': 0x91, '\u2019': 0x92, '\u201c': 0x93,
  '\u201d': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
  '\u02dc': 0x98, '\u2122': 0x99, '\u0161': 0x9a, '\u203a': 0x9b,
  '\u0153': 0x9c, '\u017e': 0x9e, '\u0178': 0x9f,
};

function mojibakeScore(text) {
  return (String(text).match(/[ÃÂâð�\u0080-\u009f]/g) || []).length;
}

function decodeWin1252AsUtf8(text) {
  const bytes = [];
  for (const char of String(text)) {
    const code = char.codePointAt(0);
    if (code <= 0xff) bytes.push(code);
    else if (Object.prototype.hasOwnProperty.call(CP1252_BYTE_MAP, char)) bytes.push(CP1252_BYTE_MAP[char]);
    else return null;
  }
  return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
}

function repairText(value) {
  if (value === null || value === undefined) return '';
  let text = String(value);
  for (let i = 0; i < 4 && mojibakeScore(text); i++) {
    const next = decodeWin1252AsUtf8(text);
    if (!next || next === text || next.includes('\uFFFD') || mojibakeScore(next) > mojibakeScore(text)) break;
    text = next;
  }
  return text
    .replace(/\uFFFD/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/Configuracoes/g, 'Configurações')
    .replace(/Estatisticas/g, 'Estatísticas')
    .replace(/Historico/g, 'Histórico')
    .replace(/Versoes/g, 'Versões')
    .replace(/Titulo/g, 'Título')
    .replace(/Conteudo/g, 'Conteúdo')
    .replace(/conteudo/g, 'conteúdo')
    .replace(/Ola/g, 'Olá')
    .replace(/clicaveis/g, 'clicáveis')
    .replace(/selecao/g, 'seleção')
    .replace(/rapido/g, 'rápido')
    .replace(/rapidos/g, 'rápidos')
    .replace(/atencao/g, 'atenção')
    .replace(/Acoes/g, 'Ações')
    .replace(/voce/g, 'você')
    .replace(/atualizacao/g, 'atualização')
    .replace(/atualizacoes/g, 'atualizações')
    .replace(/automatico/g, 'automático')
    .replace(/automaticamente/g, 'automaticamente')
    .replace(/anotacao/g, 'anotação')
    .replace(/rapida/g, 'rápida')
    .replace(/edicao/g, 'edição')
    .replace(/Opcoes/g, 'Opções')
    .replace(/Italico/g, 'Itálico')
    .replace(/Citacao/g, 'Citação')
    .replace(/Codigo/g, 'Código')
    .replace(/Proximo/g, 'Próximo');
}

function t(key, vars = {}) {
  const catalog = I18N[currentLanguage()] || I18N.en;
  let value = repairText(catalog[key] ?? I18N.en[key] ?? key);
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replace(new RegExp(`\\{${name}\\}`, 'g'), repairText(replacement));
  }
  return repairText(value);
}

function normalizeTagName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').slice(0, 24);
}

function getCustomTags() {
  return Array.isArray(settings.custom_tags) ? settings.custom_tags : [];
}

function getCustomSnippets() {
  return Array.isArray(settings.custom_snippets) ? settings.custom_snippets : [];
}

function getTagCatalog() {
  const catalog = { ...TAG_COLORS };
  getCustomTags().forEach(tag => {
    const name = normalizeTagName(tag.name);
    if (!name) return;
    catalog[name] = {
      bg: /^#[0-9a-f]{6}$/i.test(tag.bg || '') ? tag.bg : '#6EE7B7',
      text: tag.text || '#0E0E12',
      icon: normalizeTagIcon(tag.icon),
    };
  });
  return catalog;
}

function getAllTags() {
  return Object.keys(getTagCatalog());
}

function getTagMeta(tag) {
  const meta = getTagCatalog()[tag] || TAG_COLORS.pessoal;
  return { ...meta, icon: meta.icon || '' };
}

function normalizeTagIcon(icon) {
  return String(icon || '').trim().replace(/[<>"'`]/g, '').slice(0, 3);
}

function formatTagLabel(tag) {
  const icon = getTagMeta(tag).icon;
  return (icon ? icon + ' ' : '') + tag;
}

function getThemeKey() {
  const key = settings.theme_preset || (settings.dark_mode ? 'midnight' : 'minimal');
  return THEME_PRESETS[key] ? key : 'midnight';
}

function getThemePreset(key = getThemeKey()) {
  const preset = THEME_PRESETS[key] || THEME_PRESETS.midnight;
  const custom = key === 'custom' && settings.custom_theme && typeof settings.custom_theme === 'object'
    ? settings.custom_theme
    : {};
  return {
    ...preset,
    dark: key === 'custom' && typeof custom.dark === 'boolean' ? custom.dark : preset.dark,
    vars: { ...preset.vars, ...custom },
    editorFont: key === 'custom' ? (custom.editorFont || '') : preset.editorFont,
  };
}

function setThemePreset(key) {
  if (!THEME_PRESETS[key]) return;
  settings.theme_preset = key;
  settings.dark_mode = Boolean(getThemePreset(key).dark);
  applyTheme();
  applyLocale();
  window.api.settings.save(settings);
  emitPluginEvent('theme:changed', {
    theme: key,
    dark: Boolean(getThemePreset(key).dark),
  });
}

function nextThemePreset() {
  const current = getThemeKey();
  const index = THEME_ORDER.indexOf(current);
  setThemePreset(THEME_ORDER[(index + 1) % THEME_ORDER.length]);
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || ''));
}

function selectThemePreset(key) {
  if (!THEME_PRESETS[key]) return;
  if ($('custom-theme-bg')) settings.custom_theme = readCustomThemeSettings();
  setThemePreset(key);
  openSettingsModal();
  showToast('Tema aplicado: ' + getThemePreset(key).label);
}

function readCustomThemeSettings() {
  return {
    bg: $('custom-theme-bg')?.value || THEME_PRESETS.custom.vars.bg,
    sidebar: $('custom-theme-sidebar')?.value || THEME_PRESETS.custom.vars.sidebar,
    panel: $('custom-theme-panel')?.value || THEME_PRESETS.custom.vars.panel,
    panel2: $('custom-theme-panel2')?.value || THEME_PRESETS.custom.vars.panel2,
    text: $('custom-theme-text')?.value || THEME_PRESETS.custom.vars.text,
    border: $('custom-theme-border')?.value || THEME_PRESETS.custom.vars.border,
    accent: $('custom-theme-accent')?.value || THEME_PRESETS.custom.vars.accent,
    accent2: $('custom-theme-accent2')?.value || THEME_PRESETS.custom.vars.accent2,
    dark: $('custom-theme-dark') ? $('custom-theme-dark').checked : true,
    editorFont: $('custom-theme-editor-font')?.value.trim() || '',
  };
}

function emitPluginEvent(eventName, payload = {}) {
  return window.api.plugins?.emitEvent?.(eventName, payload);
}

function escapePluginBody(text) {
  return escHtml(String(text || '')).replace(/\n/g, '<br>');
}

function renderPluginWorkbench() {
  if (!pluginWorkbench || !pluginToolbar || !pluginPanels) return;
  const buttons = Array.isArray(pluginWorkbenchState.buttons) ? pluginWorkbenchState.buttons : [];
  const panels = Array.isArray(pluginWorkbenchState.panels) ? pluginWorkbenchState.panels : [];

  const buttonMarkup = buttons.map(button => `
    <button class="plugin-action-btn" data-plugin-action="${escHtml(button.actionId || button.id || '')}" title="${escHtml(button.tooltip || button.label || '')}">
      <span class="plugin-action-icon">${escHtml(button.icon || '◆')}</span>
      <span class="plugin-action-copy">
        <b>${escHtml(button.label || 'Ação')}</b>
        ${button.hint ? `<small>${escHtml(button.hint)}</small>` : ''}
      </span>
    </button>
  `).join('');

  const panelMarkup = panels.map(panel => {
    const panelButtons = Array.isArray(panel.buttons) ? panel.buttons : [];
    return `
      <section class="plugin-panel">
        <div class="plugin-panel-head">
          <div class="plugin-panel-title">${escHtml(panel.title || panel.label || 'Painel')}</div>
          ${panel.tone ? `<span class="note-tag-chip" style="background:var(--accent)18;color:var(--accent)">${escHtml(panel.tone)}</span>` : ''}
        </div>
        <div class="plugin-panel-body">${escapePluginBody(panel.body || '')}</div>
        ${panelButtons.length ? `
          <div class="plugin-panel-actions">
            ${panelButtons.map(action => `
              <button data-plugin-action="${escHtml(action.actionId || action.id || '')}" title="${escHtml(action.hint || action.label || '')}">
                ${action.icon ? `${escHtml(action.icon)} ` : ''}${escHtml(action.label || 'Ação')}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </section>
    `;
  }).join('');

  pluginToolbar.innerHTML = buttonMarkup;
  pluginPanels.innerHTML = panelMarkup;
  pluginWorkbench.classList.toggle('hidden', !buttons.length && !panels.length);
}

async function refreshPluginWorkbench() {
  const ui = await window.api.plugins?.getUI?.().catch(() => null);
  pluginWorkbenchState = {
    buttons: Array.isArray(ui?.buttons) ? ui.buttons : [],
    panels: Array.isArray(ui?.panels) ? ui.panels : [],
  };
  renderPluginWorkbench();
}

function initPluginWorkbench() {
  if (!window.api.plugins) return;
  refreshPluginWorkbench();
  window.api.plugins.onUIChange?.(ui => {
    pluginWorkbenchState = {
      buttons: Array.isArray(ui?.buttons) ? ui.buttons : [],
      panels: Array.isArray(ui?.panels) ? ui.panels : [],
    };
    renderPluginWorkbench();
  });
  pluginWorkbench?.addEventListener('click', async event => {
    const actionButton = event.target.closest('[data-plugin-action]');
    if (!actionButton) return;
    const actionId = actionButton.dataset.pluginAction;
    if (!actionId) return;
    try {
      await window.api.plugins.invokeAction(actionId, {
        noteId: activeNoteId,
        workspace: settings.currentWorkspace || 'General',
      });
    } catch (error) {
      console.error('Plugin action failed:', error);
      showToast('Ação do plugin falhou');
    }
  });
}

// ────────────────────────────────────────────────────────────
async function init() {
  initCodeEditor();
  const savedNotes    = await window.api.notes.load();
  const savedSettings = await window.api.settings.load();
  appInfo = await window.api.app.getInfo();

  if (savedSettings) Object.assign(settings, savedSettings);
  if (savedNotes) notes = savedNotes;
//  NovaPad — app.js
//  NovaPad — app.js

  if (savedSettings) Object.assign(settings, savedSettings);
  migrateData();
  initTopbarNavigation();
  initModernEditorHeader();
  initInternalLinksPanel();
  initFindReplaceBar();
  initPluginWorkbench();
  initAuthGate();
  if (!savedNotes && notes[0]) {
    notes[0].title = t('welcome_title');
    notes[0].content = t('welcome_body');
  }
  purgeOldTrash();
  requestNotificationPermission();

  applyLocale();
  await refreshVersionBadge();
  applyTheme();
  await refreshAuthGate();
  applyLayoutSettings();
  renderWorkspaces();
  renderTagsBar();
  renderNotesList();
  const first = filteredNotes()[0] || notes.find(n => !n.deletedAt);
  if (first) selectNote(first.id);
  setInterval(checkReminders, 30000);
  window.api.notes.onExternalChange?.(syncNotesFromDisk);
  window.api.updater?.onEvent?.(handleUpdaterEvent);
}

function setButtonContent(id, label, hint = '') {
  const node = $(id);
  if (!node) return;
  const cleanLabel = repairText(label);
  const cleanHint = repairText(hint);
  if (cleanHint) node.innerHTML = `<span class="tb-menu-label">${cleanLabel}</span><span class="tb-menu-hint">${cleanHint}</span>`;
  else node.textContent = cleanLabel;
}

function updateAutoSaveIndicator() {
  const indicator = $('autosave-indicator');
  if (indicator) indicator.textContent = settings.auto_save === false ? t('autosave_off') : t('autosave_on');
}

function formatPlanLabel(plan = 'free') {
  const normalized = String(plan || 'free').trim().toLowerCase();
  const labels = {
    free: '',
    trial: 'Trial',
    pro: 'Pro',
    lifetime: 'Lifetime',
  };
  return labels[normalized] ?? normalized.toUpperCase();
}

async function refreshVersionBadge(licenseSnapshot = null) {
  const badge = $('app-version-badge');
  if (!badge) return;
  const version = String(appInfo?.appVersion || '1.0.0').replace(/^v/i, '');
  const shortVersion = version.replace(/\.0$/, '');
  let license = licenseSnapshot;
  if (!license) {
    const bridge = getNovaPadBridge();
    license = bridge ? unwrapBridgeResult(await bridge.license.get().catch(() => null), null) : null;
  }
  const plan = formatPlanLabel(license?.license?.plan || license?.plan || 'free');
  badge.textContent = plan ? `v${shortVersion} ${plan}` : `v${shortVersion}`;
  badge.title = plan ? `NovaPad ${plan}` : 'NovaPad Free';
}

function applyLocale() {
  document.documentElement.lang = currentLanguage();
  window.NovaPadLanguage = currentLanguage();
// ────────────────────────────────────────────────────────────
  if (noteTitleInput) noteTitleInput.placeholder = currentLanguage() === 'pt-BR' ? 'Título da nota...' : 'Note title...';
  if ($('btn-new-note')) $('btn-new-note').textContent = currentLanguage() === 'pt-BR' ? '+ Nova Nota' : '+ New Note';
  if ($('btn-workspaces')) $('btn-workspaces').textContent = currentLanguage() === 'pt-BR' ? 'Pastas' : 'Folders';
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
  if ($('btn-exit-focus')) $('btn-exit-focus').textContent = currentLanguage() === 'pt-BR' ? 'Sair do Foco' : 'Exit Focus';
  if ($('btn-close-presentation')) $('btn-close-presentation').textContent = currentLanguage() === 'pt-BR' ? 'Esc / Fechar' : 'Esc / Close';
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
  if ($('btn-clear-compact-note')) $('btn-clear-compact-note').textContent = currentLanguage() === 'pt-BR' ? 'Limpar' : 'Clear';
  if ($('btn-save-compact-note')) $('btn-save-compact-note').textContent = currentLanguage() === 'pt-BR' ? 'Salvar nota' : 'Save note';
  if (compactNoteInput) compactNoteInput.placeholder = currentLanguage() === 'pt-BR'
    ? 'Escreva uma anotação...\n\nCtrl+Enter salva\nCtrl+F6 fecha'
    : 'Write a quick note...\n\nCtrl+Enter saves\nCtrl+F6 closes';
  setButtonContent('btn-toggle-sidebar', 'Sidebar', 'Ctrl+B');
  setButtonContent('btn-today', currentLanguage() === 'pt-BR' ? 'Hoje' : 'Today', currentLanguage() === 'pt-BR' ? 'Resumo' : 'Digest');
  setButtonContent('btn-command-palette', currentLanguage() === 'pt-BR' ? 'Comandos' : 'Commands', 'Ctrl+K');
  setButtonContent('btn-stats', currentLanguage() === 'pt-BR' ? 'Estatísticas' : 'Stats', currentLanguage() === 'pt-BR' ? 'Painel' : 'Panel');
  setButtonContent('btn-versions', currentLanguage() === 'pt-BR' ? 'Versões' : 'Versions', currentLanguage() === 'pt-BR' ? 'Histórico' : 'History');
  setButtonContent('btn-focus', currentLanguage() === 'pt-BR' ? 'Foco' : 'Focus', 'F11');
  setButtonContent('btn-compact-note', currentLanguage() === 'pt-BR' ? 'Compacta' : 'Compact', 'Ctrl+F6');
  setButtonContent('btn-preview', 'Preview', 'Split');
  setButtonContent('btn-template', 'Template', currentLanguage() === 'pt-BR' ? 'Modelo' : 'Preset');
  setButtonContent('btn-library', currentLanguage() === 'pt-BR' ? 'Bibliotecas' : 'Libraries', 'Snippets');
  setButtonContent('btn-auto-title', currentLanguage() === 'pt-BR' ? 'Título auto' : 'Auto title', currentLanguage() === 'pt-BR' ? 'Nota' : 'Note');
  setButtonContent('btn-clarity', currentLanguage() === 'pt-BR' ? 'Clareza' : 'Clarity', currentLanguage() === 'pt-BR' ? 'Texto' : 'Text');
  setButtonContent('btn-table', currentLanguage() === 'pt-BR' ? 'Tabela' : 'Table', 'Markdown');
  setButtonContent('btn-editor-color', currentLanguage() === 'pt-BR' ? 'Cor' : 'Color', 'Picker');
  setButtonContent('btn-reminder', currentLanguage() === 'pt-BR' ? 'Lembrete' : 'Reminder', currentLanguage() === 'pt-BR' ? 'Alerta' : 'Alert');
  const activeTheme = getThemePreset();
  const themeIcon = activeTheme.icon || $('btn-theme-icon')?.textContent || 'TH';
  setButtonContent('btn-theme', `<span id="btn-theme-icon">${themeIcon}</span> ${currentLanguage() === 'pt-BR' ? 'Tema' : 'Theme'}`, activeTheme.label);
  setButtonContent('btn-settings', currentLanguage() === 'pt-BR' ? 'Ajustes' : 'Settings', currentLanguage() === 'pt-BR' ? 'Fonte' : 'Font');
  setButtonContent('btn-note-color', currentLanguage() === 'pt-BR' ? 'Cor da nota' : 'Note color', currentLanguage() === 'pt-BR' ? 'Destaque' : 'Accent');
  setButtonContent('btn-tags-manager', currentLanguage() === 'pt-BR' ? 'Tags' : 'Tags', currentLanguage() === 'pt-BR' ? 'Cores' : 'Colors');
  setButtonContent('btn-presentation', currentLanguage() === 'pt-BR' ? 'Apresentar' : 'Present', 'Ctrl+P');
  setButtonContent('btn-import', currentLanguage() === 'pt-BR' ? 'Importar' : 'Import', currentLanguage() === 'pt-BR' ? 'Ler' : 'Read');
  setButtonContent('btn-export', currentLanguage() === 'pt-BR' ? 'Exportar' : 'Export', 'Ctrl+E');
  if ($('btn-menu-notes')) {
    setButtonContent('btn-menu-notes', currentLanguage() === 'pt-BR' ? 'Notas' : 'Notes', currentLanguage() === 'pt-BR' ? 'Tudo' : 'All');
    setButtonContent('btn-menu-favorites', currentLanguage() === 'pt-BR' ? 'Favoritas' : 'Favorites', '*');
    setButtonContent('btn-menu-pinned', currentLanguage() === 'pt-BR' ? 'Fixadas' : 'Pinned', 'P');
    setButtonContent('btn-menu-workspaces', 'Workspaces', currentLanguage() === 'pt-BR' ? 'Pastas' : 'Folders');
    setButtonContent('btn-menu-trash', currentLanguage() === 'pt-BR' ? 'Lixeira' : 'Trash', currentLanguage() === 'pt-BR' ? '30 dias' : '30 days');
    setButtonContent('btn-menu-plugins', 'Plugins', 'OCR');
    setButtonContent('btn-menu-themes', currentLanguage() === 'pt-BR' ? 'Temas' : 'Themes', currentLanguage() === 'pt-BR' ? 'Visual' : 'Look');
    updateSidebarNavState();
  }
  updateAutoSaveIndicator();
  renderInternalLinksPanel();
  window.NovaPadSidebar?.renderSidebar?.();
  if (!activeNoteId && tbFilename) tbFilename.textContent = t('no_note');
}

function initCodeEditor() {
  if (!window.CodeMirror || !editor || codeEditor) return;
  codeEditor = window.CodeMirror.fromTextArea(editor, {
    mode: resolveEditorMode(settings.editor_mode || 'markdown'),
    theme: 'material-darker',
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: false,
    autoCloseBrackets: false,
    placeholder: editor.placeholder || '',
  });
  codeEditor.on('change', instance => {
    const value = instance.getValue();
    if (editor.value !== value) editor.value = value;
    syncEditorPlaceholder();
    updateStats();
    updateMinimap();
    updatePreview();
    renderEditorMedia();
    requestSlashCommandSync();
    requestFindReplaceRefresh();
    if (suppressEditorChange) return;
    scheduleSave();
  });
  codeEditor.on('scroll', () => {
    syncMinimap();
    requestSelectionToolbarSync();
  });
  codeEditor.on('cursorActivity', () => {
    requestSelectionToolbarSync();
    requestSlashCommandSync();
  });
  codeEditor.on('blur', () => scheduleSelectionToolbarSync(80));
  codeEditor.getWrapperElement().addEventListener('dragover', e => e.preventDefault());
  codeEditor.getWrapperElement().addEventListener('drop', handleImageDrop);
  codeEditor.getWrapperElement().addEventListener('paste', handlePasteImage, true);
  syncEditorPlaceholder();
}

function syncEditorPlaceholder() {
  return;
}

function getEditorValue() {
  return codeEditor ? codeEditor.getValue() : (editor.value || '');
}

function setEditorValue(value, moveCursorToStart = false) {
  const nextValue = String(value || '');
  editor.value = nextValue;
  if (codeEditor && codeEditor.getValue() !== nextValue) {
    suppressEditorChange = true;
    codeEditor.setValue(nextValue);
    if (moveCursorToStart) codeEditor.setCursor(0, 0);
    else {
      const lastLine = Math.max(0, codeEditor.lineCount() - 1);
      codeEditor.setCursor(lastLine, codeEditor.getLine(lastLine).length);
    }
    suppressEditorChange = false;
  }
  syncEditorPlaceholder();
}

function focusEditor() {
  if (codeEditor) codeEditor.focus();
}

function initFindReplaceBar() {
  const pane = $('editor-pane');
  if (!pane || $('find-replace-bar')) return;
  findReplaceBar = document.createElement('div');
  findReplaceBar.id = 'find-replace-bar';
  findReplaceBar.className = 'find-replace-bar hidden';
  findReplaceBar.innerHTML = `
    <input id="find-query" class="find-input" placeholder="Procurar..." autocomplete="off">
    <input id="replace-query" class="replace-input" placeholder="Substituir por..." autocomplete="off">
    <button class="find-btn" id="find-case" title="Diferenciar maiúsculas/minúsculas">Aa</button>
    <button class="find-btn" id="find-word" title="Palavra inteira">ab</button>
    <span class="find-count" id="find-count">0/0</span>
    <button class="find-btn" id="find-prev" title="Anterior">↑</button>
    <button class="find-btn" id="find-next" title="Próximo">↓</button>
    <button class="find-btn find-action" id="replace-one" title="Substituir atual">Subst.</button>
    <button class="find-btn find-action" id="replace-all" title="Substituir todas">Todas</button>
    <button class="find-btn" id="find-close" title="Fechar">x</button>
  `;
  pane.appendChild(findReplaceBar);
  $('find-query').addEventListener('input', () => refreshFindReplaceMatches(true));
  $('replace-query').addEventListener('keydown', handleFindReplaceInputKey);
  $('find-query').addEventListener('keydown', handleFindReplaceInputKey);
  $('find-case').onclick = () => {
    findReplaceState.caseSensitive = !findReplaceState.caseSensitive;
    $('find-case').classList.toggle('active', findReplaceState.caseSensitive);
    refreshFindReplaceMatches(true);
  };
  $('find-word').onclick = () => {
    findReplaceState.wholeWord = !findReplaceState.wholeWord;
    $('find-word').classList.toggle('active', findReplaceState.wholeWord);
    refreshFindReplaceMatches(true);
  };
  $('find-prev').onclick = () => moveFindResult(-1);
  $('find-next').onclick = () => moveFindResult(1);
  $('replace-one').onclick = replaceCurrentMatch;
  $('replace-all').onclick = replaceAllMatches;
  $('find-close').onclick = closeFindReplaceBar;
}

function initAuthGate() {
  if (!authGate) return;
  $('auth-tab-login')?.addEventListener('click', () => setAuthMode('login'));
  $('auth-tab-register')?.addEventListener('click', () => setAuthMode('register'));
  $('auth-login-form')?.addEventListener('submit', loginFromAuthGate);
  $('auth-register-form')?.addEventListener('submit', registerFromAuthGate);
}

function setAuthMode(mode = 'login') {
  const registerMode = mode === 'register';
  $('auth-tab-login')?.classList.toggle('active', !registerMode);
  $('auth-tab-register')?.classList.toggle('active', registerMode);
  $('auth-login-form')?.classList.toggle('hidden', registerMode);
  $('auth-register-form')?.classList.toggle('hidden', !registerMode);
  if ($('auth-subtitle')) {
    $('auth-subtitle').textContent = registerMode
      ? 'Crie sua conta para liberar o app.'
      : 'Entre para continuar suas notas.';
  }
  setAuthFeedback(registerMode ? 'Sua conta sera salva no banco local do NovaPad.' : 'Use seu email e senha para entrar.', '');
  setTimeout(() => {
    const input = registerMode ? $('auth-register-name') : $('auth-login-email');
    input?.focus();
  }, 0);
}

function setAuthFeedback(message, type = '') {
  const node = $('auth-feedback');
  if (!node) return;
  node.textContent = message;
  node.className = ['auth-feedback', type].filter(Boolean).join(' ');
}

function setAuthGateVisible(visible) {
  document.body.classList.toggle('auth-locked', Boolean(visible));
  authGate?.classList.toggle('hidden', !visible);
  if (visible) setTimeout(() => $('auth-login-email')?.focus(), 0);
}

async function refreshAuthGate() {
  const bridge = getNovaPadBridge();
  if (!bridge?.auth) {
    setAuthGateVisible(true);
    setAuthFeedback('Sistema de conta indisponivel.', 'error');
    return null;
  }
  const { session } = await resolveRendererSession({ allowCurrentFallback: false, bridge });
  currentSession = session;
  setAuthGateVisible(!session?.user);
  if (session?.user) {
    cacheSession(session);
    setAuthFeedback(`Sessao ativa: ${session.user.email || session.user.name}.`, 'ok');
  } else {
    clearCachedSession();
    setAuthFeedback('Use seu email e senha para entrar.', '');
  }
  return session;
}

async function loginFromAuthGate(event) {
  event?.preventDefault?.();
  const bridge = getNovaPadBridge();
  const email = $('auth-login-email')?.value.trim();
  const password = $('auth-login-password')?.value || '';
  const remember = $('auth-login-remember') ? $('auth-login-remember').checked : true;
  if (!email || !password) {
    setAuthFeedback('Preencha email e senha.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    setAuthFeedback('Use um email valido para entrar.', 'error');
    return;
  }
  setAuthFeedback('Entrando...', '');
  const response = await bridge.auth.login({ email, password, remember }).catch(error => ({ success: false, error: error?.message }));
  const result = unwrapBridgeResult(response, null);
  if (!result?.user) {
    setAuthFeedback(authBridgeMessage(response, 'Email ou senha invalidos.'), 'error');
    return;
  }
  currentSession = result;
  if (remember) cacheSession(result);
  else clearCachedSession();
  setAuthFeedback(`Bem-vindo, ${result.user.name || result.user.email}.`, 'ok');
  setAuthGateVisible(false);
  syncAccountPanelVisibility(result);
  await refreshVersionBadge();
  showToast('Login realizado');
}

async function registerFromAuthGate(event) {
  event?.preventDefault?.();
  const bridge = getNovaPadBridge();
  const name = $('auth-register-name')?.value.trim();
  const email = $('auth-register-email')?.value.trim();
  const password = $('auth-register-password')?.value || '';
  const passwordConfirm = $('auth-register-confirm')?.value || '';
  const remember = $('auth-register-remember') ? $('auth-register-remember').checked : true;
  if (!name || !email || !password || !passwordConfirm) {
    setAuthFeedback('Preencha nome, email, senha e confirmacao.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    setAuthFeedback('Use um email valido para criar a conta.', 'error');
    return;
  }
  if (password.length < 6) {
    setAuthFeedback('Use uma senha com pelo menos 6 caracteres.', 'error');
    return;
  }
  if (password !== passwordConfirm) {
    setAuthFeedback('As senhas nao conferem.', 'error');
    return;
  }
  setAuthFeedback('Criando conta...', '');
  const response = await bridge.auth.register({ name, email, password, remember }).catch(error => ({ success: false, error: error?.message }));
  const result = unwrapBridgeResult(response, null);
  if (!result?.user) {
    setAuthFeedback(authBridgeMessage(response, 'Nao foi possivel criar a conta.'), 'error');
    return;
  }
  currentSession = result;
  if (remember) cacheSession(result);
  else clearCachedSession();
  setAuthFeedback(`Conta criada: ${result.user.email}.`, 'ok');
  setAuthGateVisible(false);
  syncAccountPanelVisibility(result);
  await refreshVersionBadge();
  showToast('Conta criada');
}

function handleFindReplaceInputKey(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeFindReplaceBar();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (event.shiftKey) moveFindResult(-1);
    else moveFindResult(1);
  }
}

function openFindReplaceBar(showReplace = false) {
  if (!findReplaceBar) initFindReplaceBar();
  if (!findReplaceBar) return;
  findReplaceBar.classList.remove('hidden');
  findReplaceBar.classList.toggle('replace-open', Boolean(showReplace));
  const selected = codeEditor?.getSelection?.() || '';
  if (selected && !selected.includes('\n')) $('find-query').value = selected;
  refreshFindReplaceMatches(true);
  setTimeout(() => {
    const target = showReplace && $('find-query').value ? $('replace-query') : $('find-query');
    target?.focus();
    target?.select?.();
  }, 0);
}

function closeFindReplaceBar() {
  findReplaceBar?.classList.add('hidden');
  clearFindReplaceMarks();
  findReplaceState.matches = [];
  findReplaceState.activeIndex = -1;
  focusEditor();
}

function requestFindReplaceRefresh() {
  if (!findReplaceBar || findReplaceBar.classList.contains('hidden')) return;
  clearTimeout(findReplaceState.timer);
  findReplaceState.timer = setTimeout(() => refreshFindReplaceMatches(false), 80);
}

function clearFindReplaceMarks() {
  findReplaceState.marks.forEach(mark => mark.clear?.());
  findReplaceState.marks = [];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getFindRegex() {
  const query = $('find-query')?.value || '';
  if (!query) return null;
  const source = findReplaceState.wholeWord ? `\\b${escapeRegExp(query)}\\b` : escapeRegExp(query);
  return new RegExp(source, findReplaceState.caseSensitive ? 'g' : 'gi');
}

function indexToEditorPos(index) {
  if (codeEditor) return codeEditor.posFromIndex(index);
  const value = editor.value.slice(0, index);
  const lines = value.split('\n');
  return { line: lines.length - 1, ch: lines[lines.length - 1].length };
}

function refreshFindReplaceMatches(resetActive = false) {
  clearFindReplaceMarks();
  const regex = getFindRegex();
  const content = getEditorValue();
  const matches = [];
  if (regex) {
    let match;
    while ((match = regex.exec(content))) {
      matches.push({ start: match.index, end: match.index + match[0].length });
      if (match[0].length === 0) regex.lastIndex += 1;
    }
  }
  findReplaceState.matches = matches;
  if (!matches.length) findReplaceState.activeIndex = -1;
  else if (resetActive || findReplaceState.activeIndex < 0 || findReplaceState.activeIndex >= matches.length) findReplaceState.activeIndex = 0;
  paintFindReplaceMarks();
  selectFindResult(findReplaceState.activeIndex, false);
  updateFindReplaceCount();
}

function paintFindReplaceMarks() {
  if (!codeEditor) return;
  codeEditor.operation(() => {
    findReplaceState.matches.forEach((match, index) => {
      const active = index === findReplaceState.activeIndex;
      findReplaceState.marks.push(codeEditor.markText(
        indexToEditorPos(match.start),
        indexToEditorPos(match.end),
        { className: active ? 'cm-search-match-active' : 'cm-search-match' }
      ));
    });
  });
}

function updateFindReplaceCount() {
  const count = $('find-count');
  if (!count) return;
  const total = findReplaceState.matches.length;
  count.textContent = total ? `${findReplaceState.activeIndex + 1}/${total}` : '0/0';
}

function selectFindResult(index, scroll = true) {
  const match = findReplaceState.matches[index];
  if (!match || !codeEditor) return;
  const from = indexToEditorPos(match.start);
  const to = indexToEditorPos(match.end);
  codeEditor.setSelection(from, to);
  if (scroll) codeEditor.scrollIntoView({ from, to }, 80);
}

function moveFindResult(step) {
  const total = findReplaceState.matches.length;
  if (!total) return;
  findReplaceState.activeIndex = (findReplaceState.activeIndex + step + total) % total;
  refreshFindReplaceMatches(false);
  selectFindResult(findReplaceState.activeIndex);
}

function replaceCurrentMatch() {
  const match = findReplaceState.matches[findReplaceState.activeIndex];
  if (!match || !codeEditor) return;
  codeEditor.replaceRange($('replace-query')?.value || '', indexToEditorPos(match.start), indexToEditorPos(match.end));
  refreshFindReplaceMatches(true);
  scheduleSave();
}

function replaceAllMatches() {
  const regex = getFindRegex();
  if (!regex) return;
  const replacement = $('replace-query')?.value || '';
  const current = getEditorValue();
  const next = current.replace(regex, () => replacement);
  if (next === current) return;
  setEditorValue(next);
  updateStats();
  updateMinimap();
  updatePreview();
  renderEditorMedia();
  refreshFindReplaceMatches(true);
  scheduleSave();
  showToast('Substituicao aplicada');
}

function setEditorMode(mode) {
  settings.editor_mode = mode || 'markdown';
  if (codeEditor) codeEditor.setOption('mode', resolveEditorMode(settings.editor_mode));
}

function resolveEditorMode(mode) {
  const nextMode = String(mode || 'markdown').toLowerCase();
  if (nextMode === 'markdown') {
    return {
      name: 'markdown',
      highlightFormatting: true,
      fencedCodeBlocks: true,
      xml: true,
    };
  }
  if (nextMode === 'react' || nextMode === 'jsx' || nextMode === 'javascriptreact') {
    return { name: 'javascript', jsx: true };
  }
  if (nextMode === 'javascript' || nextMode === 'js') {
    return { name: 'javascript', json: false };
  }
  if (nextMode === 'html') return 'htmlmixed';
  if (nextMode === 'text') return 'null';
  return nextMode;
}

function persistEditorMode(mode) {
  setEditorMode(mode);
  window.api.settings.save(settings);
}

function getEditorSelectionRange() {
  if (!codeEditor) {
    return { start: editor.selectionStart || 0, end: editor.selectionEnd || 0 };
  }
  const range = codeEditor.listSelections()[0];
  return {
    start: codeEditor.indexFromPos(range.anchor),
    end: codeEditor.indexFromPos(range.head),
  };
}

function replaceEditorRange(text) {
  if (!codeEditor) return;
  codeEditor.replaceSelection(text, 'around');
}

function hideSelectionToolbar() {
  if (!selectionToolbar) return;
  if (selectionToolbarHideTimer) {
    clearTimeout(selectionToolbarHideTimer);
    selectionToolbarHideTimer = null;
  }
  selectionToolbar.classList.remove('visible');
  selectionToolbar.setAttribute('aria-hidden', 'true');
}

function scheduleSelectionToolbarSync(delay = 0) {
  if (selectionToolbarHideTimer) clearTimeout(selectionToolbarHideTimer);
  selectionToolbarHideTimer = setTimeout(() => {
    selectionToolbarHideTimer = null;
    requestSelectionToolbarSync();
  }, delay);
}

function isToolbarTarget(target) {
  return Boolean(selectionToolbar && target?.closest?.('#selection-toolbar'));
}

function getActiveSelectionSource() {
  if (codeEditor && codeEditor.hasFocus?.() && codeEditor.somethingSelected()) return 'code';
  if (compactNoteInput && document.activeElement === compactNoteInput && compactNoteInput.selectionStart !== compactNoteInput.selectionEnd) return 'compact';
  return null;
}

function getSelectionTextForSource(source) {
  if (source === 'code' && codeEditor) return codeEditor.getSelection() || '';
  if (source === 'compact' && compactNoteInput) {
    const start = compactNoteInput.selectionStart || 0;
    const end = compactNoteInput.selectionEnd || 0;
    return String(compactNoteInput.value || '').slice(start, end);
  }
  return '';
}

function getSelectionRectForSource(source) {
  if (source === 'code' && codeEditor) {
    const from = codeEditor.getCursor('from');
    const to = codeEditor.getCursor('to');
    const startIndex = codeEditor.indexFromPos(from);
    const endIndex = codeEditor.indexFromPos(to);
    if (startIndex === endIndex) return null;
    const start = codeEditor.cursorCoords(from, 'page');
    const end = codeEditor.cursorCoords(to, 'page');
    return {
      left: Math.min(start.left, end.left),
      right: Math.max(start.right, end.right),
      top: Math.min(start.top, end.top),
      bottom: Math.max(start.bottom, end.bottom),
    };
  }
  if (source === 'compact' && compactNoteInput) {
    const rect = compactNoteInput.getBoundingClientRect();
    if (compactNoteInput.selectionStart === compactNoteInput.selectionEnd) return null;
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    };
  }
  return null;
}

function positionSelectionToolbar(rect) {
  if (!selectionToolbar || !rect) return;
  const margin = 12;
  const width = selectionToolbar.offsetWidth || 260;
  const height = selectionToolbar.offsetHeight || 44;
  const centeredLeft = ((rect.left + rect.right) / 2) - (width / 2);
  const aboveTop = rect.top - height - 10;
  let left = centeredLeft;
  let top = aboveTop;
  if (top < 56) top = rect.bottom + 10;
  left = clamp(left, margin, Math.max(margin, window.innerWidth - width - margin));
  top = clamp(top, 56, Math.max(56, window.innerHeight - height - margin));
  selectionToolbar.style.left = `${left}px`;
  selectionToolbar.style.top = `${top}px`;
}

function syncSelectionToolbar() {
  if (!selectionToolbar) return;
  const source = getActiveSelectionSource();
  if (!source) {
    hideSelectionToolbar();
    return;
  }
  const rect = getSelectionRectForSource(source);
  if (!rect) {
    hideSelectionToolbar();
    return;
  }
  selectionToolbar.classList.add('visible');
  selectionToolbar.setAttribute('aria-hidden', 'false');
  positionSelectionToolbar(rect);
}

function requestSelectionToolbarSync() {
  if (selectionToolbarRaf) cancelAnimationFrame(selectionToolbarRaf);
  selectionToolbarRaf = requestAnimationFrame(() => {
    selectionToolbarRaf = null;
    syncSelectionToolbar();
  });
}

function refreshEditorPreviewState() {
  updateStats();
  updateMinimap();
  updatePreview();
  renderEditorMedia();
  scheduleSave();
}

function applyMarkdownWrap(source, prefix, suffix = prefix) {
  const selected = getSelectionTextForSource(source);
  if (!selected) return { text: prefix + suffix, cursorOffset: prefix.length };
  if (selected.startsWith(prefix) && selected.endsWith(suffix) && selected.length >= prefix.length + suffix.length) {
    const text = selected.slice(prefix.length, selected.length - suffix.length);
    return { text, cursorOffset: text.length };
  }
  const text = prefix + selected + suffix;
  return { text, cursorOffset: text.length };
}

function applyQuoteWrap(source) {
  const selected = getSelectionTextForSource(source);
  if (!selected) return { text: '> ', cursorOffset: 2 };
  const lines = selected.split(/\n/);
  const isQuoted = lines.every(line => /^\s*>\s?/.test(line));
  if (isQuoted) {
    const text = lines.map(line => line.replace(/^\s*>\s?/, '')).join('\n');
    return { text, cursorOffset: text.length };
  }
  const text = lines.map(line => `> ${line}`).join('\n');
  return { text, cursorOffset: text.length };
}

function applyCodeWrap(source) {
  const selected = getSelectionTextForSource(source);
  if (!selected) return { text: '```\n\n```', cursorOffset: 4 };
  if (selected.includes('\n')) {
    const text = `\n\`\`\`\n${selected}\n\`\`\`\n`;
    return { text, cursorOffset: text.length };
  }
  if (selected.startsWith('`') && selected.endsWith('`') && selected.length >= 2) {
    const text = selected.slice(1, -1);
    return { text, cursorOffset: text.length };
  }
  const text = `\`${selected}\``;
  return { text, cursorOffset: text.length };
}

function commitSelectionReplacement(source, replacement, cursorOffset = null) {
  if (source === 'code' && codeEditor) {
    const from = codeEditor.getCursor('from');
    const startIndex = codeEditor.indexFromPos(from);
    codeEditor.replaceSelection(replacement, 'around');
    if (cursorOffset !== null) codeEditor.setCursor(codeEditor.posFromIndex(startIndex + cursorOffset));
    focusEditor();
    return;
  }
  if (source === 'compact' && compactNoteInput) {
    const start = compactNoteInput.selectionStart || 0;
    const end = compactNoteInput.selectionEnd || 0;
    const value = String(compactNoteInput.value || '');
    compactNoteInput.value = value.slice(0, start) + replacement + value.slice(end);
    const nextPos = cursorOffset !== null ? start + cursorOffset : start + replacement.length;
    compactNoteInput.selectionStart = compactNoteInput.selectionEnd = nextPos;
    compactNoteInput.focus();
    return;
  }
}

function applySelectionFormatting(action) {
  const source = getActiveSelectionSource();
  if (!source) return;
  let result = null;
  if (action === 'bold') result = applyMarkdownWrap(source, '**');
  else if (action === 'italic') result = applyMarkdownWrap(source, '*');
  else if (action === 'strike') result = applyMarkdownWrap(source, '~~');
  else if (action === 'quote') result = applyQuoteWrap(source);
  else if (action === 'code') result = applyCodeWrap(source);
  if (!result) return;
  commitSelectionReplacement(source, result.text, result.cursorOffset);
  hideSelectionToolbar();
}

function closeSlashMenu() {
  if (!slashCommandMenu) return;
  slashCommandMenu.classList.add('hidden');
  slashCommandMenu.innerHTML = '';
  slashCommandState = null;
}

function hideSlashCommandMenu() {
  closeSlashMenu();
}

function getSlashTrigger() {
  if (codeEditor && codeEditor.hasFocus?.()) {
    const cursor = codeEditor.getCursor();
    const before = codeEditor.getLine(cursor.line).slice(0, cursor.ch);
    const match = before.match(/(^|\s)\/([a-z0-9_-]*)$/i);
    if (!match) return null;
    const slashCh = before.length - match[2].length - 1;
    return {
      query: match[2].toLowerCase(),
      from: { line: cursor.line, ch: slashCh },
      to: cursor,
      mode: 'code',
    };
  }
  if (!editor || document.activeElement !== editor) return null;
  const cursor = editor.selectionStart || 0;
  const before = String(editor.value || '').slice(0, cursor);
  const match = before.match(/(^|\s)\/([a-z0-9_-]*)$/i);
  if (!match) return null;
  const slashIndex = before.length - match[2].length - 1;
  return {
    query: match[2].toLowerCase(),
    from: slashIndex,
    to: cursor,
    mode: 'textarea',
  };
}

function getSlashCommands() {
  const pt = currentLanguage() === 'pt-BR';
  return [
    {
      id: 'table',
      icon: '|',
      title: pt ? 'Inserir tabela' : 'Insert table',
      sub: pt ? 'Tabela pronta' : 'Ready-made table',
      type: 'table',
    },
    {
      id: 'image',
      icon: 'IMG',
      title: pt ? 'Inserir imagem' : 'Insert image',
      sub: pt ? 'Imagem no editor' : 'Markdown image',
      type: 'image',
    },
    {
      id: 'checklist',
      icon: '[]',
      title: pt ? 'Inserir checklist' : 'Insert checklist',
      sub: pt ? 'Nova tarefa' : 'New task',
      type: 'checklist',
    },
    {
      id: 'template',
      icon: 'T',
      title: pt ? 'Inserir template' : 'Insert template',
      sub: pt ? 'Estrutura de reunião' : 'Meeting structure',
      type: 'template',
    },
  ];
}

function getSlashMenuPosition(trigger) {
  if (trigger?.mode === 'code' && codeEditor) return codeEditor.cursorCoords(trigger.to, 'page');
  if (editor) {
    const rect = editor.getBoundingClientRect();
    return {
      left: rect.left + 24,
      top: rect.top + 32,
      bottom: rect.top + 32,
    };
  }
  return { left: 24, top: 72, bottom: 72 };
}

function renderSlashMenu() {
  if (!slashCommandMenu || !slashCommandState?.commands?.length) return;
  const { commands, activeIndex = 0 } = slashCommandState;
  slashCommandMenu.innerHTML = commands.map((item, index) => `
    <button class="slash-item ${index === activeIndex ? 'active' : ''}" data-slash-id="${escHtml(item.id)}" aria-selected="${index === activeIndex ? 'true' : 'false'}">
      <span class="slash-icon">${escHtml(item.icon)}</span>
      <span><span class="slash-title">${escHtml(item.title)}</span><span class="slash-sub">${escHtml(item.sub)}</span></span>
    </button>`).join('');
}

function showSlashMenu(position = {}) {
  if (!slashCommandMenu || !slashCommandState?.commands?.length) {
    closeSlashMenu();
    return;
  }
  slashCommandState.position = position;
  renderSlashMenu();
  const left = position.left ?? position.x ?? 12;
  const topBase = position.bottom ?? position.top ?? 56;
  slashCommandMenu.style.left = clamp(left, 12, Math.max(12, window.innerWidth - 332)) + 'px';
  slashCommandMenu.style.top = clamp(topBase + 8, 56, Math.max(56, window.innerHeight - 320)) + 'px';
  slashCommandMenu.classList.remove('hidden');
}

function handleSlashTrigger() {
  const trigger = getSlashTrigger();
  if (!trigger) {
    closeSlashMenu();
    return false;
  }
  const commands = getSlashCommands()
    .filter(item => !trigger.query || item.title.toLowerCase().includes(trigger.query) || item.sub.toLowerCase().includes(trigger.query))
    .slice(0, 4);
  if (!commands.length) {
    closeSlashMenu();
    return false;
  }
  const sameQuery = slashCommandState?.trigger?.query === trigger.query;
  const activeIndex = sameQuery ? clamp(Number(slashCommandState?.activeIndex) || 0, 0, commands.length - 1) : 0;
  slashCommandState = {
    trigger,
    commands,
    activeIndex,
    position: getSlashMenuPosition(trigger),
  };
  showSlashMenu(slashCommandState.position);
  return true;
}

function requestSlashCommandSync() {
  requestAnimationFrame(handleSlashTrigger);
}

function moveSlashSelection(delta) {
  if (!slashCommandState?.commands?.length) return;
  const next = clamp((Number(slashCommandState.activeIndex) || 0) + delta, 0, slashCommandState.commands.length - 1);
  if (next === slashCommandState.activeIndex) return;
  slashCommandState.activeIndex = next;
  showSlashMenu(slashCommandState.position);
}

function insertSlashCommand(type) {
  const command = type ? getSlashCommands().find(item => item.type === type) : null;
  if (!command) return false;
  const trigger = slashCommandState?.trigger || getSlashTrigger();
  if (!trigger) return false;
  const payload = {
    table: { text: '| Coluna 1 | Coluna 2 |\n|----------|----------|\n|          |          |\n', cursorOffset: '| Coluna 1 | Coluna 2 |\n|----------|----------|\n| '.length },
    image: { text: '![imagem]()', cursorOffset: '![imagem]('.length },
    checklist: { text: '- [ ] Nova tarefa', cursorOffset: '- [ ] Nova tarefa'.length },
// ────────────────────────────────────────────────────────────
  }[type];
  if (!payload) return false;

  if (trigger.mode === 'code' && codeEditor) {
    const startIndex = codeEditor.indexFromPos(trigger.from);
    codeEditor.replaceRange(payload.text, trigger.from, trigger.to);
    const nextIndex = startIndex + (payload.cursorOffset !== null ? payload.cursorOffset : payload.text.length);
    codeEditor.setCursor(codeEditor.posFromIndex(nextIndex));
    focusEditor();
  } else if (editor) {
    const start = trigger.from;
    const end = trigger.to;
    const value = String(editor.value || '');
    editor.value = value.slice(0, start) + payload.text + value.slice(end);
    const nextPos = start + (payload.cursorOffset !== null ? payload.cursorOffset : payload.text.length);
    editor.selectionStart = editor.selectionEnd = nextPos;
    syncEditorPlaceholder();
    refreshEditorPreviewState();
    focusEditor();
  }
  closeSlashMenu();
  return true;
}

function runSlashCommand(id) {
  if (!slashCommandState?.commands?.length) return;
  const command = slashCommandState.commands.find(item => item.id === id);
  if (!command) return;
  insertSlashCommand(command.type);
}

function getEditorScrollRatio() {
  if (!codeEditor) return 0;
  const info = codeEditor.getScrollInfo();
  return info.top / Math.max(1, info.height - info.clientHeight);
}

function setEditorScrollRatio(ratio) {
  if (!codeEditor) return;
  const info = codeEditor.getScrollInfo();
  const maxScroll = Math.max(1, info.height - info.clientHeight);
  codeEditor.scrollTo(null, Math.max(0, ratio) * maxScroll);
  focusEditor();
}

// ────────────────────────────────────────────────────────────
function createNote(title = t('new_note'), tag = 'pessoal', content = '') {
  return {
    id: Date.now(),
    title,
    tag,
    content,
    accentColor: getTagMeta(tag).bg || '#6EE7B7',
    workspace: settings.currentWorkspace || 'General',
    pinned: false,
    favorite: false,
    deletedAt: null,
    reminderAt: null,
    reminderDone: false,
    images: [],
    created: nowStr(),
    modified: nowStr(),
    versions: [],
  };
}

function clearCompactNote() {
  if (compactNoteInput) compactNoteInput.value = '';
}

function openCompactNote() {
  if (window.api.compactNote?.toggle) {
    window.api.compactNote.toggle();
    return;
  }
  if (!compactNotePanel) return;
  compactNotePanel.classList.remove('hidden');
  compactNoteInput?.focus();
}

function closeCompactNote() {
  if (window.api.compactNote?.close) {
    window.api.compactNote.close();
    return;
  }
  compactNotePanel?.classList.add('hidden');
}

function toggleCompactNote() {
  if (window.api.compactNote?.toggle) {
    window.api.compactNote.toggle();
    return;
  }
  if (!compactNotePanel) return;
  if (compactNotePanel.classList.contains('hidden')) openCompactNote();
  else closeCompactNote();
}

function beginCompactNoteDrag(event) {
  if (!compactNotePanel || event.button !== 0 || event.target.closest('button, textarea, input')) return;
  const rect = compactNotePanel.getBoundingClientRect();
  compactNotePanel.style.right = 'auto';
  compactNotePanel.style.left = rect.left + 'px';
  compactNotePanel.style.top = rect.top + 'px';
  compactNoteDrag = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  document.body.style.userSelect = 'none';
  event.preventDefault();
}

function handleCompactNoteDrag(event) {
  if (!compactNoteDrag || !compactNotePanel) return;
  const maxLeft = Math.max(16, window.innerWidth - compactNotePanel.offsetWidth - 16);
  const maxTop = Math.max(16, window.innerHeight - compactNotePanel.offsetHeight - 16);
  const nextLeft = clamp(event.clientX - compactNoteDrag.offsetX, 16, maxLeft);
  const nextTop = clamp(event.clientY - compactNoteDrag.offsetY, 56, maxTop);
  compactNotePanel.style.left = nextLeft + 'px';
  compactNotePanel.style.top = nextTop + 'px';
}

function endCompactNoteDrag() {
  compactNoteDrag = null;
  document.body.style.userSelect = '';
}

function saveCompactNote() {
  const raw = String(compactNoteInput?.value || '').trim();
  if (!raw) return;
  notesView = 'active';
  const firstLine = raw.split(/\r?\n/).find(Boolean) || '';
  const title = firstLine.slice(0, 42) || 'Nota compacta';
  const note = createNote(title, 'pessoal', raw);
  note.pinned = true;
  notes.unshift(note);
  window.api.notes.save(notes);
  clearCompactNote();
  renderNotesList();
  selectNote(note.id);
  closeCompactNote();
  showToast('Nota compacta criada');
  emitPluginEvent('note:created', {
    noteId: note.id,
    title: note.title,
    tag: note.tag,
    workspace: note.workspace || 'General',
    source: 'compact-note',
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nowStr() {
  return new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

function getNote(id) { return notes.find(n => n.id === id); }
function getDraftContent(note) { return note && note.id === activeNoteId ? getEditorValue() : (note?.content || ''); }
function imageToken(id) { return 'novapad-image:' + id; }
function normalizeNoteImages(note) { if (!Array.isArray(note.images)) note.images = []; return note.images; }
function getNoteImage(note, imageId) { return normalizeNoteImages(note).find(img => img.id === imageId); }
function resolveMarkdownImageSource(src) {
  const value = String(src || '').trim();
  if (!value) return value;
  if (/^(?:data:|https?:|file:|blob:)/i.test(value)) return value;
  const normalized = value.replace(/^\.\/+/, '').replace(/\\/g, '/');
  if (!normalized.startsWith('assets/images/')) return value;
  const basePath = String(appInfo?.userDataPath || '').replace(/\\/g, '/').replace(/\/+$/, '');
  if (!basePath) return value;
  return encodeURI(`file:///${basePath}/${normalized}`);
}
function extractNoteImages(note, content = getDraftContent(note)) {
  const refs = [];
  const rx = /!\[([^\]]*)\]\((novapad-image:([^)]+))\)/g;
  for (const match of String(content || '').matchAll(rx)) {
    const imageId = match[3];
    const asset = getNoteImage(note, imageId);
    refs.push({ token: match[0], imageId, name: match[1] || asset?.name || 'imagem', src: asset?.dataUrl || '', asset });
  }
  return refs;
}
function resolveNoteImageTokens(note, content = getDraftContent(note)) {
  return String(content || '').replace(/!\[([^\]]*)\]\((novapad-image:([^)]+))\)/g, (_, alt, __, imageId) => {
    const asset = getNoteImage(note, imageId);
    return asset?.dataUrl ? '![' + (alt || asset.name || 'imagem') + '](' + asset.dataUrl + ')' : '[' + (alt || 'imagem') + ' removida]';
  });
}
function getNotePreviewText(note) {
  return getDraftContent(note)
    .replace(/!\[([^\]]*)\]\((novapad-image:[^)]+)\)/g, '[imagem: $1]')
    .replace(/!\[([^\]]*)\]\(((?:data:image|assets\/images\/)[^)]+)\)/g, '[imagem: $1]')
    .replace(/\[.\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50);
}
function compactInlineImages(note) {
  if (!note) return false;
  normalizeNoteImages(note);
  let changed = false;
  note.content = String(note.content || '').replace(/!\[([^\]]*)\]\((data:image[^)]+)\)/g, (_, alt, dataUrl) => {
    const existing = note.images.find(img => img.dataUrl === dataUrl);
    const imageId = existing?.id || (Date.now() + '-' + Math.random().toString(36).slice(2, 8));
    if (!existing) note.images.push({ id: imageId, name: alt || 'imagem', dataUrl });
    changed = true;
    return '![' + (alt || 'imagem') + '](' + imageToken(imageId) + ')';
  });
  return changed;
}

function filteredNotes() {
  const q = searchInput.value.toLowerCase();
  return notes.filter(n => {
    const deleted = Boolean(n.deletedAt);
    const viewOk = notesView === 'trash'
      ? deleted
      : (!deleted && (notesView === 'favorites' ? n.favorite : notesView === 'pinned' ? n.pinned : true));
    const workspaceOk = notesView === 'trash' ? true : (n.workspace || 'General') === (settings.currentWorkspace || 'General');
    const tagOk = activeTag ? n.tag === activeTag : true;
    const queryOk = q ? (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q) : true;
    return viewOk && workspaceOk && tagOk && queryOk;
  }).sort((a,b) => (Number(!!b.pinned) - Number(!!a.pinned)) || new Date(parseBrDate(b.modified)) - new Date(parseBrDate(a.modified)));
}

// ────────────────────────────────────────────────────────────
function renderTagsBar() {
  tagsBar.innerHTML = '';
  const all = btn(t('all'), !activeTag, () => { activeTag = null; renderTagsBar(); renderNotesList(); });
  tagsBar.appendChild(all);
  getAllTags().forEach(tag => {
    const tc = getTagMeta(tag);
    const b = document.createElement('button');
    b.className = 'tag-btn' + (activeTag === tag ? ' active' : '');
    b.textContent = formatTagLabel(tag);
    if (activeTag === tag) { b.style.background = tc.bg; b.style.color = tc.text; b.style.borderColor = tc.bg; }
    b.onclick = () => { activeTag = activeTag === tag ? null : tag; renderTagsBar(); renderNotesList(); };
    tagsBar.appendChild(b);
  });
}

function btn(text, isActive, onclick) {
  const b = document.createElement('button');
  b.className = 'tag-btn' + (isActive ? ' active' : '');
  b.textContent = text;
  if (isActive) { b.style.background = 'var(--accent)'; b.style.color = '#0E0E12'; b.style.borderColor = 'var(--accent)'; }
  b.onclick = onclick;
  return b;
}

function setNavButtonState(id, active) {
  const node = $(id);
  if (node) node.classList.toggle('active', Boolean(active));
}

function updateSidebarNavState() {
  setNavButtonState('btn-favorites-filter', notesView === 'favorites');
  setNavButtonState('btn-trash-filter', notesView === 'trash');
  setNavButtonState('btn-menu-notes', notesView === 'active');
  setNavButtonState('btn-menu-favorites', notesView === 'favorites');
  setNavButtonState('btn-menu-pinned', notesView === 'pinned');
  setNavButtonState('btn-menu-trash', notesView === 'trash');
  window.NovaPadSidebar?.setActiveItem?.({
    active: 'notes',
    favorites: 'favorites',
    pinned: 'pinned',
    trash: 'trash'
  }[notesView] || 'notes');
}

function updateHeaderNoteActions(note = getNote(activeNoteId)) {
  $('btn-header-favorite')?.classList.toggle('active', Boolean(note?.favorite));
  $('btn-header-pin')?.classList.toggle('active', Boolean(note?.pinned));
  $('btn-header-reminder')?.classList.toggle('active', Boolean(note?.reminderAt && !note?.reminderDone));
  $('btn-action-delete')?.querySelector('.tb-menu-label') && ($('btn-action-delete').querySelector('.tb-menu-label').textContent = note?.deletedAt ? 'Restaurar' : 'Excluir');
}

function setNotesView(view) {
  notesView = view;
  renderNotesList();
}

function initTopbarNavigation() {
  if ($('sidebar-root')) return;
  if ($('btn-menu-notes')) return;
  const menuPanel = document.querySelector('[data-menu] .tb-menu-panel');
  if (!menuPanel) return;
  const nav = document.createElement('div');
  nav.className = 'topbar-nav-group';
  nav.innerHTML = `
    <button class="tb-menu-item" id="btn-menu-notes"><span class="tb-menu-label">Notas</span><span class="tb-menu-hint">Tudo</span></button>
    <button class="tb-menu-item" id="btn-menu-favorites"><span class="tb-menu-label">Favoritas</span><span class="tb-menu-hint">*</span></button>
    <button class="tb-menu-item" id="btn-menu-pinned"><span class="tb-menu-label">Fixadas</span><span class="tb-menu-hint">P</span></button>
    <button class="tb-menu-item" id="btn-menu-workspaces"><span class="tb-menu-label">Workspaces</span><span class="tb-menu-hint">Pastas</span></button>
    <button class="tb-menu-item" id="btn-menu-trash"><span class="tb-menu-label">Lixeira</span><span class="tb-menu-hint">30 dias</span></button>
    <button class="tb-menu-item" id="btn-menu-plugins"><span class="tb-menu-label">Plugins</span><span class="tb-menu-hint">OCR</span></button>
    <button class="tb-menu-item" id="btn-menu-themes"><span class="tb-menu-label">Temas</span><span class="tb-menu-hint">Visual</span></button>
    <div class="context-menu-sep"></div>
  `;
  menuPanel.prepend(nav);
  $('btn-menu-notes').onclick = () => { setNotesView('active'); closeToolbarMenus(); };
  $('btn-menu-favorites').onclick = () => { setNotesView(notesView === 'favorites' ? 'active' : 'favorites'); closeToolbarMenus(); };
  $('btn-menu-pinned').onclick = () => { setNotesView(notesView === 'pinned' ? 'active' : 'pinned'); closeToolbarMenus(); };
  $('btn-menu-workspaces').onclick = () => { openWorkspaceModal(); closeToolbarMenus(); };
  $('btn-menu-trash').onclick = () => { setNotesView(notesView === 'trash' ? 'active' : 'trash'); closeToolbarMenus(); };
  $('btn-menu-plugins').onclick = () => { openSettingsModal('plugins'); closeToolbarMenus(); };
  $('btn-menu-themes').onclick = () => { openSettingsModal('appearance'); closeToolbarMenus(); };
}

function createHeaderButton(id, label, title) {
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.className = 'header-icon-btn';
  button.title = repairText(title);
  button.textContent = repairText(label);
  return button;
}

function initModernEditorHeader() {
  const header = $('note-header');
  if (!header || header.querySelector('.note-header-actions')) return;
  const actions = document.createElement('div');
  actions.className = 'note-header-actions';
  actions.appendChild(createHeaderButton('btn-header-favorite', '*', 'Favoritar nota'));
  actions.appendChild(createHeaderButton('btn-header-pin', 'P', 'Fixar nota'));
  actions.appendChild(createHeaderButton('btn-header-color', 'C', 'Cor da nota'));
  actions.appendChild(createHeaderButton('btn-header-reminder', 'R', 'Lembrete'));
  actions.appendChild(btnChangeTag);
  const menu = document.createElement('div');
  menu.className = 'tb-menu note-action-menu';
  menu.dataset.menu = '';
  menu.innerHTML = repairText(`
    <button class="header-icon-btn" id="btn-note-actions" data-menu-trigger title="Ações da nota">...</button>
    <div class="tb-menu-panel">
      <button class="tb-menu-item" id="btn-action-export"><span class="tb-menu-label">Exportar</span><span class="tb-menu-hint">Ctrl+E</span></button>
      <button class="tb-menu-item" id="btn-action-import"><span class="tb-menu-label">Importar</span><span class="tb-menu-hint">Arquivo</span></button>
      <button class="tb-menu-item" id="btn-action-duplicate"><span class="tb-menu-label">Duplicar nota</span><span class="tb-menu-hint">Copia</span></button>
      <button class="tb-menu-item" id="btn-action-move-workspace"><span class="tb-menu-label">Mover para workspace</span><span class="tb-menu-hint">Organizar</span></button>
      <button class="tb-menu-item danger" id="btn-action-delete"><span class="tb-menu-label">Excluir</span><span class="tb-menu-hint">Lixeira</span></button>
    </div>
  `);
  actions.appendChild(menu);
  header.appendChild(actions);

  $('btn-note-actions').addEventListener('click', event => {
    event.stopPropagation();
    toggleToolbarMenu(menu);
  });
  $('btn-header-favorite').onclick = () => activeNoteId && toggleNoteFlag(activeNoteId, 'fav');
  $('btn-header-pin').onclick = () => activeNoteId && toggleNoteFlag(activeNoteId, 'pin');
  $('btn-header-color').onclick = openColorModal;
  $('btn-header-reminder').onclick = openReminderModal;
  $('btn-action-export').onclick = () => { openExportModal(); closeToolbarMenus(); };
  $('btn-action-import').onclick = () => { openImportModal(); closeToolbarMenus(); };
  $('btn-action-duplicate').onclick = () => { if (activeNoteId) duplicateNote(activeNoteId); closeToolbarMenus(); };
  $('btn-action-move-workspace').onclick = () => { openMoveWorkspaceModal(); closeToolbarMenus(); };
  $('btn-action-delete').onclick = () => { moveActiveToTrash(); closeToolbarMenus(); };
}

function initInternalLinksPanel() {
  if (!editorArea || $('internal-links-panel')) return;
  const panel = document.createElement('aside');
  panel.id = 'internal-links-panel';
  panel.className = 'internal-links-panel';
  panel.classList.toggle('hidden', settings.internal_links_visible === false);
  editorArea.insertBefore(panel, $('minimap-resizer') || null);
}

function setInternalLinksPanelVisible(visible, persist = true) {
  settings.internal_links_visible = Boolean(visible);
  const panel = $('internal-links-panel');
  if (panel) {
    panel.classList.toggle('hidden', !settings.internal_links_visible);
    if (settings.internal_links_visible) renderInternalLinksPanel();
  }
  $('btn-internal-links')?.classList.toggle('active', settings.internal_links_visible);
  if (persist) window.api.settings.save(settings);
}

function toggleInternalLinksPanel() {
  setInternalLinksPanelVisible(settings.internal_links_visible === false);
}

function renderNotesList() {
  const list = filteredNotes();
  notesList.innerHTML = '';
  $('btn-favorites-filter').classList.toggle('active', notesView === 'favorites');
  $('btn-trash-filter').classList.toggle('active', notesView === 'trash');
  if (!list.length) {
    notesList.innerHTML = '<div style="padding:18px 12px;color:var(--muted);font-size:12px;text-align:center">Nenhuma nota aqui.</div>';
    return;
  }
  list.forEach(note => {
    const tc = getTagMeta(note.tag);
    const div = document.createElement('div');
    div.className = 'note-item' + (note.id === activeNoteId ? ' active' : '') + (note.deletedAt ? ' deleted' : '');
    div.draggable = true;
    div.dataset.noteDragId = note.id;
    div.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/x-novapad-note', String(note.id));
      event.dataTransfer.setData('text/plain', note.title || 'Nota');
    });
    if (note.id === activeNoteId) div.style.borderLeftColor = note.accentColor || tc.bg;
    const reminder = note.reminderAt ? ' ⏰' : '';
    const trashInfo = note.deletedAt ? '<span class="note-date">lixeira</span>' : '<span class="note-date">' + note.modified + '</span>';
    div.innerHTML = repairText(
      '<div class="note-item-title">' + escHtml(note.title) + reminder + '</div>' +
      '<div class="note-item-preview">' + (escHtml((note.content || '').replace(/\[.\]/g,'').trim().slice(0,50)) || 'â€”') + '</div>' +
      '<div class="note-item-meta">' +
        '<span class="note-tag-chip" style="background:' + tc.bg + '33;color:' + tc.bg + '">' + escHtml(formatTagLabel(note.tag)) + '</span>' +
        '<span class="note-badges">' +
// ────────────────────────────────────────────────────────────
          '<button class="note-action ' + (note.favorite ? 'active' : '') + '" title="Favoritar" data-act="fav" data-id="' + note.id + '">★</button>' +
          trashInfo +
        '</span>' +
      '</div>');
    div.onclick = (e) => {
      const action = e.target?.dataset?.act;
      if (action) { e.stopPropagation(); toggleNoteFlag(Number(e.target.dataset.id), action); return; }
      selectNote(note.id);
    };
    notesList.appendChild(div);
  });
}

function selectNote(id) {
  if (activeNoteId && isDirty) flushSave(activeNoteId);
  activeNoteId = id;
  const note = getNote(id);
  if (!note) {
    syncDiscordPresence();
    return;
  }
  if (compactInlineImages(note)) window.api.notes.save(notes);
  noteTitleInput.value = note.title;
  setEditorValue(note.content || '', true);
  tbFilename.textContent = note.title;
  updatePreview();
  applyNoteAppearance(note);
  const tc = getTagMeta(note.tag);
  btnChangeTag.textContent = formatTagLabel(note.tag);
  btnChangeTag.style.background = tc.bg + '33';
  btnChangeTag.style.color = tc.bg;
// ────────────────────────────────────────────────────────────
  updateHeaderNoteActions(note);
  isDirty = false;
  updateStats();
  updateMinimap();
  renderNotesList();
  syncDiscordPresence();
  emitPluginEvent('note:selected', {
    noteId: note.id,
    title: note.title,
    tag: note.tag,
    workspace: note.workspace || 'General',
  });
}

function updateSelectionUI() {
  const count = selectedNoteIds.size;
  $('btn-delete-note').classList.toggle('active', count > 0);
  $('btn-delete-note').title = count > 0
    ? (currentLanguage() === 'pt-BR' ? `Mover ${count} notas para lixeira` : `Move ${count} notes to trash`)
    : (currentLanguage() === 'pt-BR' ? 'Mover para lixeira' : 'Move to trash');
}

function toggleNoteSelection(id) {
  if (selectedNoteIds.has(id)) selectedNoteIds.delete(id);
  else selectedNoteIds.add(id);
  renderNotesList();
}

function duplicateNote(id) {
  const source = getNote(id);
  if (!source) return;
  const copy = {
    ...JSON.parse(JSON.stringify(source)),
    id: Date.now(),
    title: `${source.title} copia`,
    pinned: false,
    favorite: false,
    deletedAt: null,
    reminderAt: null,
    reminderDone: false,
    created: nowStr(),
    modified: nowStr(),
  };
  notes.unshift(copy);
  window.api.notes.save(notes);
  renderNotesList();
  selectNote(copy.id);
  showToast('Nota duplicada');
  emitPluginEvent('note:created', {
    noteId: copy.id,
    title: copy.title,
    tag: copy.tag,
    workspace: copy.workspace || 'General',
    source: 'duplicate',
  });
}

async function copyNoteField(id, field) {
  const note = getNote(id);
  if (!note) return;
  const value = field === 'title' ? note.title : resolveNoteImageTokens(note, note.content);
  try {
    await navigator.clipboard.writeText(String(value || ''));
    showToast(field === 'title' ? 'Titulo copiado' : 'Conteudo copiado');
  } catch (_) {
    showToast('Nao consegui copiar');
  }
}

function moveSingleNoteToTrash(id) {
  const note = getNote(id);
  if (!note) return;
  if (note.deletedAt) {
    note.deletedAt = null;
    showToast('Nota restaurada');
  } else {
    note.deletedAt = new Date().toISOString();
    showToast('Nota enviada para lixeira');
  }
  window.api.notes.save(notes);
  renderNotesList();
  const next = filteredNotes()[0] || notes.find(item => !item.deletedAt);
  if (next) selectNote(next.id);
}

function exportSpecificNote(id) {
  if (activeNoteId !== id) selectNote(id);
  openExportModal();
}

function closeNoteContextMenu() {
  contextNoteId = null;
  noteContextMenu?.classList.add('hidden');
}

function openNoteContextMenu(id, x, y) {
  const note = getNote(id);
  if (!note || !noteContextMenu) return;
  contextNoteId = id;
  noteContextMenu.innerHTML = `
    <div class="context-menu-title">${escHtml(note.title)}</div>
    <button class="context-menu-item" data-context-act="copy-title"><span>Copiar titulo</span><span class="context-menu-hint">Ctrl+C</span></button>
    <button class="context-menu-item" data-context-act="copy-content"><span>Copiar texto</span><span class="context-menu-hint">Nota</span></button>
    <button class="context-menu-item" data-context-act="duplicate"><span>Duplicar</span><span class="context-menu-hint">Nova</span></button>
    <button class="context-menu-item" data-context-act="export"><span>Exportar</span><span class="context-menu-hint">Arquivo</span></button>
    <div class="context-menu-sep"></div>
    <button class="context-menu-item" data-context-act="favorite"><span>${note.favorite ? 'Remover dos favoritos' : 'Favoritar'}</span><span class="context-menu-hint">*</span></button>
    <button class="context-menu-item" data-context-act="pin"><span>${note.pinned ? 'Desafixar' : 'Fixar no topo'}</span><span class="context-menu-hint">P</span></button>
    <button class="context-menu-item" data-context-act="select"><span>${selectedNoteIds.has(id) ? 'Desmarcar selecao' : 'Selecionar nota'}</span><span class="context-menu-hint">Lista</span></button>
    <div class="context-menu-sep"></div>
    <button class="context-menu-item danger" data-context-act="trash"><span>${note.deletedAt ? 'Restaurar nota' : 'Mover para lixeira'}</span><span class="context-menu-hint">${note.deletedAt ? 'Voltar' : '30 dias'}</span></button>
  `;
  noteContextMenu.classList.remove('hidden');
  const rect = noteContextMenu.getBoundingClientRect();
  const left = clamp(x, 8, window.innerWidth - rect.width - 8);
  const top = clamp(y, 8, window.innerHeight - rect.height - 8);
  noteContextMenu.style.left = left + 'px';
  noteContextMenu.style.top = top + 'px';
}

function handleNoteContextAction(action, id) {
  if (!action) return;
  if (action === 'copy-title') copyNoteField(id, 'title');
  else if (action === 'copy-content') copyNoteField(id, 'content');
  else if (action === 'duplicate') duplicateNote(id);
  else if (action === 'export') exportSpecificNote(id);
  else if (action === 'favorite') toggleNoteFlag(id, 'fav');
  else if (action === 'pin') toggleNoteFlag(id, 'pin');
  else if (action === 'select') toggleNoteSelection(id);
  else if (action === 'trash') moveSingleNoteToTrash(id);
  closeNoteContextMenu();
}

function renderNotesList() {
  const list = filteredNotes();
  notesList.innerHTML = '';
  updateSidebarNavState();
  if (!list.length) {
    notesList.innerHTML = '<div class="empty-notes">Nenhuma nota aqui.</div>';
    updateSelectionUI();
    return;
  }
  list.forEach(note => {
    const tc = getTagMeta(note.tag);
    const selected = selectedNoteIds.has(note.id);
    const div = document.createElement('div');
    div.className = 'note-item' + (note.id === activeNoteId ? ' active' : '') + (note.deletedAt ? ' deleted' : '');
    div.draggable = true;
    div.dataset.noteDragId = note.id;
    div.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/x-novapad-note', String(note.id));
      event.dataTransfer.setData('text/plain', note.title || 'Nota');
    });
    if (note.id === activeNoteId) div.style.borderLeftColor = note.accentColor || tc.bg;
    const reminder = note.reminderAt ? '<span class="note-action active" title="Lembrete">R</span>' : '';
    const trashInfo = note.deletedAt ? '<span class="note-date">lixeira</span>' : '<span class="note-date">' + note.modified + '</span>';
    div.innerHTML = repairText(
      '<div class="note-item-head">' +
        '<button class="note-select-btn ' + (selected ? 'active' : '') + '" title="Selecionar" data-act="select" data-id="' + note.id + '">' + (selected ? 'x' : '') + '</button>' +
        '<div class="note-item-title">' + escHtml(note.title || 'Sem titulo') + '</div>' +
        reminder +
      '</div>' +
      '<div class="note-item-preview">' + (escHtml(getNotePreviewText(note)) || '-') + '</div>' +
      '<div class="note-item-meta">' +
        '<span class="note-tag-chip" style="background:' + tc.bg + '33;color:' + tc.bg + '">' + escHtml(formatTagLabel(note.tag)) + '</span>' +
        '<span class="note-badges">' +
          '<button class="note-action ' + (note.favorite ? 'active' : '') + '" title="Favoritar" data-act="fav" data-id="' + note.id + '">*</button>' +
          '<button class="note-action ' + (note.pinned ? 'active' : '') + '" title="Fixar" data-act="pin" data-id="' + note.id + '">P</button>' +
          trashInfo +
        '</span>' +
      '</div>');
    div.onclick = (e) => {
      const action = e.target?.dataset?.act;
      if (action) {
        e.stopPropagation();
        if (action === 'select') toggleNoteSelection(Number(e.target.dataset.id));
        else toggleNoteFlag(Number(e.target.dataset.id), action);
        return;
      }
      selectNote(note.id);
    };
    div.oncontextmenu = (e) => {
      e.preventDefault();
      if (activeNoteId !== note.id) selectNote(note.id);
      openNoteContextMenu(note.id, e.clientX, e.clientY);
    };
    notesList.appendChild(div);
  });
  updateSelectionUI();
}

function renderEditorMedia() {
  const note = getNote(activeNoteId);
  if (!note || !editorMediaBar) return;
  const images = extractNoteImages(note);
  if (!images.length) {
    editorMediaBar.style.display = 'none';
    editorMediaBar.innerHTML = '';
    return;
  }
  editorMediaBar.style.display = 'flex';
  editorMediaBar.innerHTML = images.map(img => `
    <div class="editor-image-card">
      <img src="${img.src}" alt="${escHtml(img.name)}">
      <div class="editor-image-meta">
        <span class="editor-image-name">${escHtml(img.name)}</span>
        <button class="editor-image-remove" data-image-remove="${img.imageId}">Remover</button>
      </div>
    </div>`).join('');
}

function removeImageFromActiveNote(imageId) {
  const note = getNote(activeNoteId);
  if (!note) return;
  note.images = normalizeNoteImages(note).filter(img => img.id !== imageId);
  const tokenRx = new RegExp(`!?\\[[^\\]]*\\]\\(${imageToken(imageId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)\\n?`, 'g');
  setEditorValue(getEditorValue().replace(tokenRx, ''));
  updatePreview();
  updateStats();
  updateMinimap();
  renderEditorMedia();
  scheduleSave();
  showToast('Imagem removida');
}

function selectNote(id) {
  if (activeNoteId && isDirty) flushSave(activeNoteId);
  activeNoteId = id;
  const note = getNote(id);
  if (!note) return;
  if (compactInlineImages(note)) window.api.notes.save(notes);
  noteTitleInput.value = note.title;
  setEditorValue(note.content || '', true);
  tbFilename.textContent = note.title;
  updatePreview();
  renderEditorMedia();
  applyNoteAppearance(note);
  const tc = getTagMeta(note.tag);
  btnChangeTag.textContent = formatTagLabel(note.tag);
  btnChangeTag.style.background = tc.bg + '33';
  btnChangeTag.style.color = tc.bg;
// ────────────────────────────────────────────────────────────
  isDirty = false;
  updateStats();
  updateMinimap();
  renderNotesList();
  emitPluginEvent('note:selected', {
    noteId: note.id,
    title: note.title,
    tag: note.tag,
    workspace: note.workspace || 'General',
  });
}

function applyEditorSettings() {
  const fontSize = `${settings.font_size || 14}px`;
  const themeFont = getThemePreset().editorFont;
  const selectedFont = settings.font_family || 'DM Mono';
  const customFont = (settings.font_family_custom || '').trim();
  const fontFamily = selectedFont === '__custom__'
    ? (customFont || (themeFont ? fontStackFromFontName(themeFont) : fontStackFromFontName('DM Mono')))
    : fontStackFromFontName(selectedFont === 'DM Mono' && themeFont ? themeFont : selectedFont);
  document.body.style.setProperty('--editor-font-size', fontSize);
  document.body.style.setProperty('--font-mono', fontFamily);
  if (compactNoteInput) compactNoteInput.style.fontFamily = fontFamily;
  if (minimapContent) minimapContent.style.fontFamily = fontFamily;
  if (codeEditor) {
    const wrapper = codeEditor.getWrapperElement();
    wrapper.style.fontFamily = fontFamily;
    wrapper.style.fontSize = fontSize;
    wrapper.style.lineHeight = '1.9';
    setEditorMode(settings.editor_mode || 'markdown');
    codeEditor.refresh();
  }
}

function fontStackFromFontName(fontName) {
  const name = String(fontName || '').trim();
  if (!name) return 'DM Mono, Consolas, monospace';
  if (name === '__custom__') return (settings.font_family_custom || '').trim() || 'DM Mono, Consolas, monospace';
  if (MONO_FONT_NAMES.has(name)) return `'${name}', monospace`;
  if (SERIF_FONT_NAMES.has(name)) return `'${name}', serif`;
  if (SANS_FONT_NAMES.has(name)) return `'${name}', sans-serif`;
  if (/\b(serif|roman)\b/i.test(name)) return `'${name}', serif`;
  if (/\b(mono|code|console)\b/i.test(name)) return `'${name}', monospace`;
  return `'${name}', sans-serif`;
}

function buildEditorFontOptions() {
  return EDITOR_FONT_PRESETS.map(item => '<option value="' + item.value + '" ' + (settings.font_family === item.value ? 'selected' : '') + '>' + item.label + '</option>').join('');
}

function applyLayoutSettings() {
  document.body.style.setProperty('--sidebar-width', `${clamp(Number(settings.sidebar_width) || 260, 220, 420)}px`);
  document.body.style.setProperty('--preview-width', `${clamp(Number(settings.preview_width) || 520, 280, 900)}px`);
  document.body.style.setProperty('--minimap-width', `${clamp(Number(settings.minimap_width) || 120, 80, 220)}px`);
  syncResizeHandles();
}

function syncResizeHandles() {
  if (sidebarResizer) sidebarResizer.style.display = 'none';
  if (previewResizer) previewResizer.style.display = previewVisible ? 'block' : 'none';
  if (minimapResizer) minimapResizer.style.display = settings.minimap === false || focusMode ? 'none' : 'block';
}

function syncDiscordPresence() {
  const pluginSettings = settings.discord_rich_presence || {};
  const note = getNote(activeNoteId);
  window.api.discordPresence?.updateContext?.({
    currentNoteTitle: pluginSettings.showCurrentNote ? (note?.title || '') : '',
    currentWorkspace: pluginSettings.showCurrentWorkspace ? (settings.currentWorkspace || 'General') : '',
    active: true,
  });
}

function toggleNovaSidebar() {
  if (window.NovaPadSidebar?.toggleSidebar) window.NovaPadSidebar.toggleSidebar();
  else sidebar.classList.toggle('hidden');
  syncResizeHandles();
}

function applyNoteAppearance(note) {
  const accent = note?.accentColor || getTagMeta(note?.tag).bg || 'transparent';
  document.body.style.setProperty('--note-accent', accent);
  $('editor-pane').style.background = `linear-gradient(90deg, ${accent}18 0, transparent 220px), var(--bg)`;
}

function updateStats() {
  const txt = getEditorValue();
  const words = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
  const chars = txt.length;
  const lines = getEditorLineCount(txt);
  const paras = txt.split(/\n\n+/).filter(p => p.trim()).length;
  const readMin = Math.max(1, Math.round(words / 200));
  const tasks = (txt.match(/\[ \]/g) || []).length;
  const done  = (txt.match(/\[x\]/g) || []).length;

  $('sb-words').textContent = words;
  $('sb-chars').textContent = chars;
  $('sb-lines').textContent = lines;
  $('s-words').textContent = words;
  $('s-chars').textContent = chars;
  $('s-lines').textContent = lines;
  $('s-paras').textContent = paras;
  $('s-read').textContent  = readMin;
  $('s-tasks').textContent = tasks + done;
  $('s-done').textContent  = done;
  $('focus-wc').textContent = `${words} palavras`;
}

function getEditorLineCount(text) {
  if (codeEditor) {
    const defaultHeight = Math.max(1, codeEditor.defaultTextHeight?.() || 1);
    let visualLines = 0;
    codeEditor.eachLine(lineHandle => {
      const height = Math.max(defaultHeight, Number(lineHandle?.height) || defaultHeight);
      visualLines += Math.max(1, Math.round(height / defaultHeight));
    });
    return Math.max(1, visualLines);
  }
  return Math.max(1, String(text || '').split('\n').length);
}

// ────────────────────────────────────────────────────────────
function scheduleSave() {
  isDirty = true;
  if (settings.auto_save === false) return;
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => flushSave(activeNoteId), clamp(Number(settings.auto_save_delay) || 1500, 500, 10000));
}

function flushSave(id) {
  const note = getNote(id);
  if (!note) return;
  // Version snapshot
  if (note.content !== getEditorValue() && note.content.trim() !== '') {
    note.versions = [{ content: note.content, saved: note.modified }, ...(note.versions || [])].slice(0, 20);
  }
  note.title    = noteTitleInput.value || 'Sem t?tulo';
  note.content  = getEditorValue();
  note.workspace = note.workspace || settings.currentWorkspace || 'General';
  note.modified = nowStr();
  applyNoteAppearance(note);
  isDirty = false;
  window.api.notes.save(notes);
  tbFilename.textContent = note.title;
// ────────────────────────────────────────────────────────────
  renderNotesList();
  showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Salvo');
  emitPluginEvent('note:saved', {
    noteId: note.id,
    title: note.title,
    tag: note.tag,
    workspace: note.workspace || 'General',
  });
}

// ────────────────────────────────────────────────────────────
function applyTheme() {
  const key = getThemeKey();
  const preset = getThemePreset(key);
  settings.dark_mode = Boolean(preset.dark);
  document.body.classList.toggle('light', !preset.dark);
  document.body.dataset.theme = key;
  Object.entries(preset.vars).forEach(([name, value]) => {
    if (isHexColor(value)) document.body.style.setProperty(`--${name}`, value);
  });
  const themeIcon = $('btn-theme-icon');
  if (themeIcon) themeIcon.textContent = preset.icon || key;
  if (codeEditor) codeEditor.setOption('theme', preset.dark ? 'material-darker' : 'default');
  applyThemeTexture(key);
  applyEditorSettings();
  applyLayoutSettings();
  updateMinimap();
  updatePreview();
}

function toggleTheme() {
  nextThemePreset();
}

function applyThemeTexture(key) {
  document.body.classList.toggle('theme-dev', key === 'dev');
  document.body.classList.toggle('theme-paper', key === 'paper');
  document.body.classList.toggle('theme-gamer', key === 'gamer');
}

function createTokenStore(prefix = '@@TOK') {
  const tokens = [];
  return {
    stash(value) {
      const key = prefix + tokens.length + '@@';
      tokens.push(value);
      return key;
    },
    restore(value) {
      const rx = new RegExp(prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\d+)@@', 'g');
      return value.replace(rx, (_, index) => tokens[Number(index)] || '');
    }
  };
}

function highlightCodeBlock(code, language = '') {
  const lang = String(language || '').toLowerCase();
  const store = createTokenStore();
  let out = escHtml(String(code || '').replace(/\r\n/g, '\n').trim());

  if (['html', 'xml', 'svg'].includes(lang)) {
    out = out.replace(/(&lt;!--[\s\S]*?--&gt;)/g, m => store.stash(`<span class="tok-comment">${m}</span>`));
    out = out.replace(/(&lt;\/?)([a-z0-9:-]+)/gi, (_, open, tag) => `${open}<span class="tok-tag">${tag}</span>`);
    out = out.replace(/([a-zA-Z-:]+)(=)(&quot;.*?&quot;|&#39;.*?&#39;)/g, (_, attr, eq, value) => `<span class="tok-attr">${attr}</span><span class="tok-operator">${eq}</span><span class="tok-value">${value}</span>`);
    return store.restore(out);
  }

  if (lang === 'css') {
    out = out.replace(/\/\*[\s\S]*?\*\//g, m => store.stash(`<span class="tok-comment">${m}</span>`));
    out = out.replace(/([^{]+)(\{)/g, (_, selector, brace) => `<span class="tok-selector">${selector.trim()}</span>${brace}`);
    out = out.replace(/([a-z-]+)(\s*:)([^;]+)(;)/gi, (_, prop, colon, value, semi) => `<span class="tok-property">${prop}</span><span class="tok-operator">${colon}</span><span class="tok-value">${value}</span>${semi}`);
    return store.restore(out);
  }

  const keywordRx = /\b(await|async|break|case|catch|class|const|continue|default|delete|elif|else|export|extends|finally|for|from|function|if|import|in|let|new|return|static|super|switch|throw|try|typeof|var|while|with|yield|def|lambda|pass|True|False|None|null|undefined|SELECT|FROM|WHERE|ORDER|BY|GROUP|LIMIT|INSERT|INTO|VALUES|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|AS|AND|OR)\b/g;
  const functionRx = /\b([A-Za-z_]\w*)(?=\s*\()/g;
  const propertyRx = /(?<=\.)[A-Za-z_]\w*/g;
  const numberRx = /\b\d+(?:\.\d+)?\b/g;
  const operatorRx = /(?:===|!==|=>|<=|>=|\+\+|--|&&|\|\||[=+\-*/%<>!]+)/g;
  const commentRx = lang === 'python' || lang === 'sql' ? /#[^\n]*|--[^\n]*/g : /\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
  out = out.replace(commentRx, m => store.stash(`<span class="tok-comment">${m}</span>`));
  out = out.replace(/"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`/g, m => store.stash(`<span class="tok-string">${m}</span>`));
  out = out.replace(keywordRx, m => `<span class="tok-keyword">${m}</span>`);
  out = out.replace(functionRx, m => `<span class="tok-function">${m}</span>`);
  out = out.replace(propertyRx, m => `<span class="tok-property">${m}</span>`);
  out = out.replace(numberRx, m => `<span class="tok-number">${m}</span>`);
  out = out.replace(operatorRx, m => `<span class="tok-operator">${m}</span>`);
  return store.restore(out);
}

function renderCodeFence(code, language = '') {
  const lang = String(language || '').trim().toLowerCase();
  const label = lang || 'texto';
  return `<div class="code-block"><div class="code-header"><span class="code-lang">${escHtml(label)}</span><span class="code-header-actions"><span class="code-hint">Preview com highlight</span><button class="code-copy-btn" onclick="copyPreviewCode(this)">Copiar</button></span></div><pre><code class="language-${escHtml(label)}">${highlightCodeBlock(code, lang)}</code></pre></div>`;
}

function renderMarkdown(md) {
  md = escHtml(md);
  md = md.replace(/```([a-zA-Z0-9+#._-]*)\n?([\s\S]*?)```/g, (_, lang, code) => renderCodeFence(code, lang));
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>');
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img alt="${escHtml(alt)}" src="${escHtml(resolveMarkdownImageSource(src))}">`);
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  md = md.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');
  md = md.replace(/^(\|.+\|\n\|[-:| ]+\|\n(?:\|.*\|\n?)*)/gm, block => markdownTable(block));
  md = md.replace(/^(?:- |\* )(.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  return md.split(/\n{2,}/).map(block => /<h\d|<ul|code-block|<blockquote|<table|<img/.test(block) ? block : '<p>' + block.replace(/\n/g,'<br>') + '</p>').join('');
}

function updatePreview() {
  const note = getNote(activeNoteId);
  const content = note ? resolveNoteImageTokens(note) : getEditorValue();
  if (previewPane) previewPane.innerHTML = renderMarkdown(content);
  renderInternalLinksPanel();
}

async function copyPreviewCode(button) {
  const block = button?.closest?.('.code-block');
  const code = block?.querySelector?.('pre code')?.textContent || '';
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    showToast('Codigo copiado');
  } catch {
    showToast('Nao consegui copiar');
  }
}

async function syncNotesFromDisk() {
  if (isDirty && activeNoteId) flushSave(activeNoteId);
  const savedNotes = await window.api.notes.load();
  if (!savedNotes) return;
  notes = savedNotes;
  renderNotesList();
  const activeExists = getNote(activeNoteId);
  const next = activeExists || filteredNotes()[0] || notes.find(note => !note.deletedAt);
  if (next) selectNote(next.id);
}

async function checkForAppUpdates(manual = false) {
  if ($('settings-update-url')) {
    settings.update_url = $('settings-update-url').value.trim();
    if ($('settings-auto-update')) settings.auto_update = $('settings-auto-update').checked;
    if ($('settings-language')) settings.language = $('settings-language').value;
    window.api.settings.save(settings);
  }
  if (!settings.update_url) {
    showToast(t('update_url_missing'));
    return;
  }
  if (manual) showToast(t('checking_updates'));
  const result = await window.api.updater?.check?.();
  if (manual && result && result.ok === false && result.reason === 'missing_url') {
    showToast(t('update_url_missing'));
  }
}

function openUpdateReadyModal() {
  if (!pendingUpdateInfo) return;
  openModal(`
    <div class="modal-title">${t('install_update_title')}</div>
    <div class="modal-sub">${t('install_update_sub')}</div>
    <div class="modal-actions">
      <button class="modal-close" onclick="closeModal()">${t('later')}</button>
      <button class="modal-close" onclick="installDownloadedUpdate()">${t('restart_install')}</button>
    </div>
  `);
}

function installDownloadedUpdate() {
  closeModal();
  window.api.updater?.install?.();
}

function handleUpdaterEvent(event) {
  if (!event?.status) return;
  if (event.status === 'checking') showToast(t('checking_updates'));
  else if (event.status === 'available') showToast(t('update_available'));
  else if (event.status === 'not-available') showToast(t('update_not_available'));
  else if (event.status === 'progress') showToast(t('update_progress', { percent: Math.round(event.percent || 0) }));
  else if (event.status === 'downloaded') {
    pendingUpdateInfo = event;
    showToast(t('update_downloaded'));
    openUpdateReadyModal();
  } else if (event.status === 'error') {
    showToast(t('update_error', { message: event.message || 'unknown' }));
  }
}

function openLibraryModal() {
  const custom = getCustomSnippets();
  const customList = custom.length ? `
    <label class="field-label">Seus snippets</label>
    <div class="export-grid">
      ${custom.map(snippet => `
        <button class="export-btn" onclick="insertCustomSnippet('${escHtml(snippet.id)}')">
          <span class="ext">${escHtml(snippet.name || 'Snippet')}</span>
          <span class="desc">${escHtml(snippet.mode || 'custom')}</span>
        </button>`).join('')}
    </div>` : '<div class="modal-sub">Nenhum snippet personalizado ainda.</div>';
  openModal(`
    <div class="modal-title">Bibliotecas e snippets</div>
    <div class="modal-sub">Insira blocos prontos com libs e estruturas comuns para codigo.</div>
    <div class="export-grid">
      <button class="export-btn" onclick="insertLibrarySnippet('react')"><span class="ext">React</span><span class="desc">Componente funcional</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('express')"><span class="ext">Express</span><span class="desc">Servidor basico</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('axios')"><span class="ext">Axios</span><span class="desc">Requisicao HTTP</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('fetch')"><span class="ext">Fetch</span><span class="desc">API nativa</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('tailwind')"><span class="ext">Tailwind</span><span class="desc">HTML inicial</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('python')"><span class="ext">Requests</span><span class="desc">Python HTTP</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('sql')"><span class="ext">SQL</span><span class="desc">Consulta base</span></button>
      <button class="export-btn" onclick="insertLibrarySnippet('html')"><span class="ext">HTML/CSS/JS</span><span class="desc">Starter web</span></button>
    </div>
    ${customList}
    <label class="field-label">Novo snippet</label>
    <div class="snippet-form">
      <div class="snippet-form-row">
        <input id="custom-snippet-name" class="field-control" placeholder="Nome do snippet">
        <input id="custom-snippet-mode" class="field-control" placeholder="Modo" value="javascript">
      </div>
      <textarea id="custom-snippet-code" class="field-control snippet-code-input" placeholder="Cole o codigo aqui"></textarea>
      <div class="modal-actions">
        <button class="modal-close" onclick="addCustomSnippet()">Adicionar</button>
        <button class="modal-close" onclick="openSnippetManager()">Gerenciar</button>
        <button class="modal-close" onclick="closeModal()">Fechar</button>
      </div>
    </div>
  `);
}

function insertLibrarySnippet(type) {
  const snippets = {
    react: {
      mode: 'react',
      fence: 'javascript',
      code: "import { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Cliques: {count}\n    </button>\n  );\n}"
    },
    express: {
      mode: 'javascript',
      fence: 'javascript',
      code: "import express from 'express';\n\nconst app = express();\napp.use(express.json());\n\napp.get('/health', (_req, res) => {\n  res.json({ ok: true });\n});\n\napp.listen(3000, () => {\n  console.log('API online em http://localhost:3000');\n});"
    },
    axios: {
      mode: 'javascript',
      fence: 'javascript',
      code: "import axios from 'axios';\n\nasync function loadUsers() {\n  const { data } = await axios.get('https://api.example.com/users');\n  return data;\n}"
    },
    fetch: {
      mode: 'javascript',
      fence: 'javascript',
      code: "async function loadUsers() {\n  const response = await fetch('https://api.example.com/users');\n  if (!response.ok) throw new Error('Falha ao buscar usuarios');\n  return response.json();\n}"
    },
    tailwind: {
      mode: 'html',
      fence: 'html',
      code: "<script src=\"https://cdn.tailwindcss.com\"></script>\n<main class=\"min-h-screen bg-zinc-950 text-zinc-100 grid place-items-center\">\n  <section class=\"rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl\">\n    <h1 class=\"text-3xl font-bold\">NovaPad</h1>\n    <p class=\"mt-3 text-zinc-400\">Layout inicial com Tailwind.</p>\n  </section>\n</main>"
    },
    python: {
      mode: 'python',
      fence: 'python',
      code: "import requests\n\nresponse = requests.get('https://api.example.com/users', timeout=10)\nresponse.raise_for_status()\nprint(response.json())"
    },
    sql: {
      mode: 'sql',
      fence: 'sql',
      code: "SELECT id, name, email\nFROM users\nWHERE active = 1\nORDER BY created_at DESC\nLIMIT 20;"
    },
    html: {
      mode: 'html',
      fence: 'html',
      code: "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>NovaPad Starter</title>\n  <style>\n    body { font-family: system-ui; background: #111; color: #f5f5f5; }\n    .card { max-width: 640px; margin: 48px auto; padding: 24px; border: 1px solid #333; border-radius: 16px; }\n  </style>\n</head>\n<body>\n  <div class=\"card\">\n    <h1>Projeto inicial</h1>\n    <p>Bloco base com HTML, CSS e JS.</p>\n  </div>\n  <script>\n    console.log('Starter carregado');\n  </script>\n</body>\n</html>"
    },
  };
  const snippet = snippets[type];
  if (!snippet) return;
  const currentValue = getEditorValue();
  const noteIsEmpty = !currentValue.trim();
  const currentMode = String(settings.editor_mode || 'markdown').toLowerCase();
  const shouldInsertRaw = noteIsEmpty || currentMode === 'text' || currentMode === snippet.mode || currentMode === 'js' && snippet.mode === 'javascript';
  if (shouldInsertRaw) {
    persistEditorMode(snippet.mode);
    insertAtCursor((currentValue.trim() ? '\n' : '') + snippet.code + '\n');
    showToast('Snippet inserido com modo ' + snippet.mode);
  } else {
    insertAtCursor('\n```' + snippet.fence + '\n' + snippet.code + '\n```\n');
    showToast('Snippet inserido em bloco Markdown');
  }
  codeEditor?.refresh();
  focusEditor();
  closeModal();
}

function insertSnippetObject(snippet, keepModalOpen = false) {
  if (!snippet?.code) return;
  const currentValue = getEditorValue();
  const noteIsEmpty = !currentValue.trim();
  const mode = String(snippet.mode || 'javascript').toLowerCase();
  const fence = snippet.fence || mode;
  const currentMode = String(settings.editor_mode || 'markdown').toLowerCase();
  const shouldInsertRaw = noteIsEmpty || currentMode === 'text' || currentMode === mode || currentMode === 'js' && mode === 'javascript';
  if (shouldInsertRaw) {
    persistEditorMode(mode);
    insertAtCursor((currentValue.trim() ? '\n' : '') + snippet.code + '\n');
    showToast('Snippet inserido com modo ' + mode);
  } else {
    insertAtCursor('\n```' + fence + '\n' + snippet.code + '\n```\n');
    showToast('Snippet inserido em bloco Markdown');
  }
  codeEditor?.refresh();
  focusEditor();
  if (!keepModalOpen) closeModal();
}

function insertCustomSnippet(id, keepModalOpen = false) {
  const snippet = getCustomSnippets().find(item => String(item.id) === String(id));
  if (!snippet) return showToast('Snippet nao encontrado');
  insertSnippetObject(snippet, keepModalOpen);
}

function addCustomSnippet() {
  if (!Array.isArray(settings.custom_snippets)) settings.custom_snippets = [];
  const name = String($('custom-snippet-name')?.value || '').trim().replace(/[<>"'`]/g, '').slice(0, 40);
  const mode = String($('custom-snippet-mode')?.value || 'javascript').trim().replace(/[^\w+#.-]/g, '').slice(0, 20) || 'javascript';
  const code = String($('custom-snippet-code')?.value || '').trim();
  if (!name) return showToast('Informe o nome do snippet');
  if (!code) return showToast('Cole o codigo do snippet');
  settings.custom_snippets.push({ id: String(Date.now()), name, mode, fence: mode, code });
  window.api.settings.save(settings);
  openLibraryModal();
  showToast('Snippet criado');
}

function openSnippetManager() {
  const snippets = getCustomSnippets();
  const rows = snippets.length ? snippets.map(snippet => `
    <div class="tag-row">
      <div>
        <b>${escHtml(snippet.name || 'Snippet')}</b>
        <div class="version-preview">${escHtml(snippet.mode || 'custom')} - ${String(snippet.code || '').split(/\r?\n/).length} linhas</div>
      </div>
      <span class="tag-icon-preview">S</span>
      <span class="tag-swatch" style="background:var(--accent)"></span>
      <button class="modal-close btn-danger" onclick="deleteCustomSnippet('${escHtml(snippet.id)}')">Remover</button>
    </div>`).join('') : '<div class="modal-sub">Nenhum snippet personalizado ainda.</div>';
  openModal(`
    <div class="modal-title">Snippets personalizados</div>
    <div class="modal-sub">Remova snippets que voce nao usa mais.</div>
    ${rows}
    <div class="modal-actions">
      <button class="modal-close" onclick="openLibraryModal()">Voltar</button>
      <button class="modal-close" onclick="closeModal()">Fechar</button>
    </div>
  `);
}

function deleteCustomSnippet(id) {
  settings.custom_snippets = getCustomSnippets().filter(item => String(item.id) !== String(id));
  window.api.settings.save(settings);
  openSnippetManager();
  showToast('Snippet removido');
}

// ────────────────────────────────────────────────────────────
function enterFocus() {
  focusMode = true;
  if (codeEditor) codeEditor.getWrapperElement().classList.add('focus-mode');
  sidebar.classList.add('hidden');
  $('note-header').style.display = 'none';
  focusBar.style.display = 'flex';
  $('statusbar').style.display = 'none';
  minimap.style.display = 'none';
  if ($('internal-links-panel')) $('internal-links-panel').classList.add('hidden');
  $('btn-focus').classList.add('active');
  if (codeEditor) codeEditor.refresh();
  syncResizeHandles();
  updateStats();
}

function exitFocus() {
  focusMode = false;
  if (codeEditor) codeEditor.getWrapperElement().classList.remove('focus-mode');
  sidebar.classList.remove('hidden');
  $('note-header').style.display = 'flex';
  focusBar.style.display = 'none';
  $('statusbar').style.display = 'flex';
  minimap.style.display = settings.minimap === false ? 'none' : 'block';
  setInternalLinksPanelVisible(settings.internal_links_visible !== false, false);
  $('btn-focus').classList.remove('active');
  if (codeEditor) codeEditor.refresh();
  syncResizeHandles();
}

// ────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = $('toast');
  t.textContent = repairText(msg);
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2000);
}

// ────────────────────────────────────────────────────────────
function openModal(html) {
  modalBox.style.width = '';
  modalBox.style.maxWidth = '';
  modalBox.style.padding = '';
  modalBox.innerHTML = repairText(html);
  modalOverlay.classList.remove('hidden');
}
function closeModal() {
  modalOverlay.classList.add('hidden');
  modalBox.style.width = '';
  modalBox.style.maxWidth = '';
  modalBox.style.padding = '';
  modalBox.innerHTML = '';
}

function getCommandItems() {
  const base = [
    { id: 'new-note', title: 'Nova nota', sub: 'Cria uma nota em branco', key: 'Ctrl+N', run: () => $('btn-new-note').click() },
    { id: 'today', title: 'Painel Hoje', sub: 'Recentes, fixadas e lembretes', key: 'Hoje', run: openTodayPanel },
    { id: 'compact', title: 'Nota compacta', sub: 'Abre captura rapida', key: 'Ctrl+F6', run: toggleCompactNote },
    { id: 'ocr-image', title: 'OCR de imagem', sub: 'Extrai texto de foto ou print', key: 'OCR', run: openImageOcrModal },
    { id: 'ocr-pdf', title: 'OCR de PDF', sub: 'Extrai texto de PDF escaneado', key: 'PDF', run: openPdfOcrModal },
    { id: 'export', title: 'Exportar nota', sub: 'Exporta a nota atual', key: 'Ctrl+E', run: openExportModal },
    { id: 'import', title: 'Importar documento', sub: 'Cria nota a partir de arquivo', key: 'Import', run: openImportModal },
    { id: 'tags', title: 'Tags personalizadas', sub: 'Criar e remover tags coloridas', key: 'Tags', run: openTagsManager },
    { id: 'library', title: 'Snippets personalizados', sub: 'Biblioteca de codigo e snippets', key: 'Ctrl+Shift+L', run: openLibraryModal },
    { id: 'auto-title', title: 'Gerar titulo automatico', sub: 'Cria titulo pela selecao ou conteudo', key: 'Titulo', run: generateAutomaticTitle },
    { id: 'clarity', title: 'Corrigir clareza', sub: 'Revisa selecao ou nota localmente', key: 'Texto', run: improveSelectedText },
    { id: 'settings', title: 'Configuracoes', sub: 'Fonte, idioma, backup e updates', key: 'App', run: openSettingsModal },
    { id: 'backup', title: 'Backup agora', sub: 'Cria uma copia na pasta configurada', key: 'Backup', run: runBackupNow },
    { id: 'preview', title: 'Alternar preview', sub: 'Mostra ou esconde preview Markdown', key: 'Split', run: togglePreview },
    { id: 'focus', title: 'Modo foco', sub: 'Entra ou sai do modo foco', key: 'F11', run: () => focusMode ? exitFocus() : enterFocus() },
  ];
  const noteItems = notes
    .filter(note => !note.deletedAt)
    .slice()
    .sort((a, b) => new Date(parseBrDate(b.modified)) - new Date(parseBrDate(a.modified)))
    .slice(0, 25)
    .map(note => ({
      id: 'note-' + note.id,
      title: note.title || 'Sem titulo',
      sub: 'Abrir nota ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ' + (note.workspace || 'General'),
      key: note.tag || '',
      run: () => selectNote(note.id),
    }));
  return [...base, ...noteItems];
}

function openCommandPalette() {
  commandPaletteItems = getCommandItems();
  openModal(`
    <div class="command-palette">
      <input id="command-search" class="command-search" placeholder="Digite um comando ou nome de nota..." autocomplete="off">
      <div id="command-list" class="command-list"></div>
    </div>
  `);
  modalBox.style.width = 'min(760px, calc(100vw - 48px))';
  modalBox.style.padding = '0';
  const input = $('command-search');
  input.addEventListener('input', renderCommandPaletteList);
  input.addEventListener('keydown', handleCommandPaletteKey);
  renderCommandPaletteList();
  input.focus();
}

function renderCommandPaletteList() {
  const q = ($('command-search')?.value || '').trim().toLowerCase();
  const list = $('command-list');
  if (!list) return;
  const filtered = commandPaletteItems.filter(item => !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.key.toLowerCase().includes(q)).slice(0, 18);
  list.innerHTML = filtered.length ? filtered.map((item, index) => `
    <button class="command-item ${index === 0 ? 'active' : ''}" data-command-id="${escHtml(item.id)}">
      <span><span class="command-item-title">${escHtml(item.title)}</span><span class="command-item-sub">${escHtml(item.sub)}</span></span>
      <span class="command-kbd">${escHtml(item.key || 'Enter')}</span>
    </button>`).join('') : '<div class="command-item"><span><span class="command-item-title">Nada encontrado</span><span class="command-item-sub">Tente outro termo</span></span></div>';
  list.querySelectorAll('[data-command-id]').forEach(button => {
    button.onclick = () => runCommandPaletteAction(button.dataset.commandId);
  });
}

function handleCommandPaletteKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const id = $('command-list')?.querySelector('[data-command-id]')?.dataset?.commandId;
    if (id) runCommandPaletteAction(id);
  }
}

function runCommandPaletteAction(id) {
  const item = commandPaletteItems.find(command => command.id === id);
  if (!item) return;
  closeModal();
  item.run();
}

function getPendingTasks(note) {
  return String(note.content || '')
    .split(/\r?\n/)
    .filter(line => /^\s*\[ \]/.test(line))
    .map(line => line.replace(/^\s*\[ \]\s*/, '').trim())
    .filter(Boolean);
}

function openNoteFromPanel(id) {
  closeModal();
  selectNote(Number(id));
}

function renderTodayNoteButton(note, extra = '') {
  return `<button class="today-note" onclick="openNoteFromPanel(${Number(note.id)})">${escHtml(note.title || 'Sem titulo')}<small>${escHtml(extra || getNotePreviewText(note) || note.modified || '')}</small></button>`;
}

function openTodayPanel() {
  const active = notes.filter(note => !note.deletedAt);
  const recent = active.slice().sort((a, b) => new Date(parseBrDate(b.modified)) - new Date(parseBrDate(a.modified))).slice(0, 5);
  const pinned = active.filter(note => note.pinned).slice(0, 5);
  const reminders = active.filter(note => note.reminderAt && !note.reminderDone).sort((a, b) => new Date(a.reminderAt) - new Date(b.reminderAt)).slice(0, 5);
  const tasks = active.flatMap(note => getPendingTasks(note).slice(0, 2).map(task => ({ note, task }))).slice(0, 6);
  const empty = '<div class="version-preview">Nada por aqui.</div>';
  openModal(`
    <div class="modal-title">Painel Hoje</div>
    <div class="modal-sub">Um resumo rapido do que merece sua atencao agora.</div>
    <div class="today-grid">
      <div class="today-card"><h3>Recentes</h3>${recent.map(note => renderTodayNoteButton(note, note.modified)).join('') || empty}</div>
      <div class="today-card"><h3>Fixadas</h3>${pinned.map(note => renderTodayNoteButton(note, note.modified)).join('') || empty}</div>
      <div class="today-card"><h3>Lembretes</h3>${reminders.map(note => renderTodayNoteButton(note, formatReminder(note.reminderAt))).join('') || empty}</div>
      <div class="today-card"><h3>Tarefas</h3>${tasks.map(item => renderTodayNoteButton(item.note, item.task)).join('') || empty}</div>
    </div>
    <div class="modal-actions" style="margin-top:14px;">
      <button class="modal-close" onclick="openCommandPalette()">Abrir comandos</button>
      <button class="modal-close" onclick="closeModal()">Fechar</button>
    </div>
  `);
  modalBox.style.width = 'min(840px, calc(100vw - 48px))';
}

// ────────────────────────────────────────────────────────────
function legacyOpenSettingsModal(startTab = 'appearance') {
  const fontOptions = buildEditorFontOptions();
  openModal(`
// ────────────────────────────────────────────────────────────
    <div class="modal-sub">Personalize a escrita e a leitura das suas notas.</div>
    <label class="field-label">Tipo de fonte</label>
    <select id="settings-font-family" class="field-control">${fontOptions}</select>
    <div id="settings-font-custom-wrap" style="display:${settings.font_family === '__custom__' ? 'block' : 'none'}">
      <label class="field-label">Fonte personalizada</label>
      <input id="settings-font-custom" class="field-control" type="text" value="${escHtml(settings.font_family_custom || '')}" placeholder='Ex: "IBM Plex Serif", Georgia, serif'>
      <div class="settings-row-help">Use uma lista CSS de fontes. O app vai aplicar a primeira que estiver disponivel.</div>
    </div>
    <label class="field-label">Tamanho da fonte: <span id="font-size-value">${settings.font_size || 14}px</span></label>
    <input id="settings-font-size" class="field-control" type="range" min="12" max="28" value="${settings.font_size || 14}">
    <label class="check-row"><input id="settings-minimap" type="checkbox" ${settings.minimap === false ? '' : 'checked'}> Mostrar minimap em textos longos</label>
    <button class="modal-close" onclick="saveVisualSettings()">Salvar</button>
  `);
  const sizeInput = $('settings-font-size');
  sizeInput.oninput = () => $('font-size-value').textContent = sizeInput.value + 'px';
  const fontSelect = $('settings-font-family');
  const customWrap = $('settings-font-custom-wrap');
  const syncCustomFont = () => {
    if (customWrap) customWrap.style.display = fontSelect?.value === '__custom__' ? 'block' : 'none';
  };
  if (fontSelect) fontSelect.onchange = syncCustomFont;
  syncCustomFont();
}

function legacySaveVisualSettings() {
  settings.font_family = $('settings-font-family').value;
  settings.font_family_custom = $('settings-font-custom')?.value || settings.font_family_custom || '';
  settings.font_size = Number($('settings-font-size').value);
  settings.minimap = $('settings-minimap').checked;
  applyEditorSettings();
  minimap.style.display = settings.minimap ? 'block' : 'none';
  applyLayoutSettings();
  updateMinimap();
  window.api.settings.save(settings);
  closeModal();
  showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Visual atualizado');
}

function openSettingsModal(startTab = 'appearance') {
  const modes = ['markdown', 'javascript', 'typescript', 'json', 'html', 'css', 'python', 'sql', 'text'];
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'pt-BR', label: 'Portugues (Brasil)' },
  ];
  const fontOptions = buildEditorFontOptions();
  const modeOptions = modes.map(mode => '<option value="' + mode + '" ' + ((settings.editor_mode || 'markdown') === mode ? 'selected' : '') + '>' + mode + '</option>').join('');
  const languageOptions = languages.map(item => '<option value="' + item.value + '" ' + ((settings.language || 'en') === item.value ? 'selected' : '') + '>' + item.label + '</option>').join('');
  const autoSaveDelay = clamp(Number(settings.auto_save_delay) || 1500, 500, 10000);
  const backupInterval = clamp(Number(settings.backup_interval_ms) || 300000, 60000, 3600000);
  const dataPath = escHtml(appInfo?.userDataPath || 'Pasta de dados indisponivel');
  const updateUrl = escHtml(settings.update_url || '');
  const backupFolder = escHtml(settings.backup_folder || '');
  const richPresence = settings.discord_rich_presence || {};
  const currentTheme = getThemeKey();
  const customTheme = settings.custom_theme && typeof settings.custom_theme === 'object' ? settings.custom_theme : {};
  const customSource = getThemePreset('custom');
  const customValue = name => escHtml(customTheme[name] || customSource.vars[name] || '');
  const customFont = escHtml(customTheme.editorFont || '');
  const themeCards = THEME_ORDER.map(key => {
    const preset = THEME_PRESETS[key];
    const vars = getThemePreset(key).vars;
    return `
      <button class="theme-card ${currentTheme === key ? 'active' : ''}" onclick="selectThemePreset('${key}')">
        <span class="theme-card-head"><b>${escHtml(preset.label)}</b><span>${escHtml(preset.icon)}</span></span>
        <span class="theme-card-hint">${escHtml(preset.hint)}</span>
        <span class="theme-swatch-row">
          <i class="theme-swatch" style="background:${escHtml(vars.bg)}"></i>
          <i class="theme-swatch" style="background:${escHtml(vars.panel)}"></i>
          <i class="theme-swatch" style="background:${escHtml(vars.accent)}"></i>
          <i class="theme-swatch" style="background:${escHtml(vars.accent2)}"></i>
        </span>
      </button>
    `;
  }).join('');
  openModal(`
    <div class="settings-game">
      <aside class="settings-game-nav">
        <div class="settings-game-title">Options</div>
        <div class="settings-game-sub">NovaPad settings</div>
        <button class="settings-tab-btn active" data-settings-tab="appearance">Aparencia <span>01</span></button>
        <button class="settings-tab-btn" data-settings-tab="editor">Editor <span>02</span></button>
        <button class="settings-tab-btn" data-settings-tab="plugins">Plugins <span>03</span></button>
        <button class="settings-tab-btn" data-settings-tab="export">Exportacao <span>04</span></button>
        <button class="settings-tab-btn" data-settings-tab="shortcuts">Atalhos <span>05</span></button>
        <button class="settings-tab-btn" data-settings-tab="account">Conta <span>06</span></button>
        <button class="settings-tab-btn" data-settings-tab="data">Dados <span>07</span></button>
      </aside>
      <section class="settings-game-body">
        <div class="settings-game-header">
          <h2 id="settings-page-title">Geral</h2>
          <p id="settings-page-sub">Idioma, comportamento, conta e sincronizacao do app.</p>
        </div>
        <div class="settings-pages">
          <div class="settings-page active" data-settings-page="appearance">
            <div class="settings-row">
              <div class="settings-row-title">${t('language')}</div>
              <div class="settings-row-help">Idioma padrao da interface.</div>
              <select id="settings-language" class="field-control">${languageOptions}</select>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Aparencia</div>
              <div class="settings-row-help">Use o menu Visual para tema, cor da nota e tags.</div>
              <button class="modal-close" onclick="openTagsManager()">Gerenciar tags</button>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Presets de tema</div>
              <div class="settings-row-help">Escolha um visual pronto para mudar a personalidade do NovaPad.</div>
              <div class="theme-grid">${themeCards}</div>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Custom completo</div>
              <div class="settings-row-help">Ajuste suas cores, selecione o tema Custom e salve.</div>
              <div class="custom-theme-grid">
                <label class="field-label">Fundo<input id="custom-theme-bg" class="field-control color-control" type="color" value="${customValue('bg')}"></label>
                <label class="field-label">Sidebar<input id="custom-theme-sidebar" class="field-control color-control" type="color" value="${customValue('sidebar')}"></label>
                <label class="field-label">Painel<input id="custom-theme-panel" class="field-control color-control" type="color" value="${customValue('panel')}"></label>
                <label class="field-label">Campo<input id="custom-theme-panel2" class="field-control color-control" type="color" value="${customValue('panel2')}"></label>
                <label class="field-label">Texto<input id="custom-theme-text" class="field-control color-control" type="color" value="${customValue('text')}"></label>
                <label class="field-label">Borda<input id="custom-theme-border" class="field-control color-control" type="color" value="${customValue('border')}"></label>
                <label class="field-label">Principal<input id="custom-theme-accent" class="field-control color-control" type="color" value="${customValue('accent')}"></label>
                <label class="field-label">Secundaria<input id="custom-theme-accent2" class="field-control color-control" type="color" value="${customValue('accent2')}"></label>
              </div>
              <label class="field-label">Fonte do editor no Custom</label>
              <input id="custom-theme-editor-font" class="field-control" type="text" value="${customFont}" placeholder="DM Mono, Georgia, Inter...">
              <label class="check-row"><input id="custom-theme-dark" type="checkbox" ${customTheme.dark === false ? '' : 'checked'}> Custom usa editor escuro</label>
            </div>
          </div>
          <div class="settings-page" data-settings-page="editor">
            <div class="settings-row">
              <div class="settings-row-title">${t('font_family')}</div>
              <select id="settings-font-family" class="field-control">${fontOptions}</select>
              <div id="settings-font-custom-wrap" style="display:${settings.font_family === '__custom__' ? 'block' : 'none'}; margin-top:10px;">
                <div class="settings-row-help">Escolha uma fonte pronta ou use uma stack personalizada.</div>
                <input id="settings-font-custom" class="field-control" type="text" value="${escHtml(settings.font_family_custom || '')}" placeholder='Ex: "IBM Plex Serif", Georgia, serif'>
              </div>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">${t('editor_mode')}</div>
              <select id="settings-editor-mode" class="field-control">${modeOptions}</select>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">${t('font_size')}: <span id="font-size-value">${settings.font_size || 14}px</span></div>
              <input id="settings-font-size" class="field-control" type="range" min="12" max="28" value="${settings.font_size || 14}">
            </div>
            <div class="settings-row">
              <label class="check-row"><input id="settings-minimap" type="checkbox" ${settings.minimap === false ? '' : 'checked'}> ${t('show_minimap')}</label>
            </div>
          </div>
          <div class="settings-page" data-settings-page="plugins">
            <div class="settings-row">
              <div class="settings-row-title">Plugins e extensoes</div>
              <div class="settings-row-help">Acesse recursos extras sem sair do fluxo de escrita.</div>
              <div class="modal-actions">
                <button class="modal-close" onclick="openLibraryModal()">Snippets</button>
                <button class="modal-close" onclick="openCommandPalette()">Comandos</button>
              </div>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Discord Rich Presence</div>
              <div class="settings-row-help">Mostra o tempo aberto do NovaPad no Discord sem expor conteudo.</div>
              <label class="check-row"><input id="settings-discord-rpc-enabled" type="checkbox" ${richPresence.enabled === false ? '' : 'checked'}> Ativar presença no Discord</label>
              <label class="check-row"><input id="settings-discord-rpc-note" type="checkbox" ${richPresence.showCurrentNote ? 'checked' : ''}> Mostrar nome da nota atual</label>
              <label class="check-row"><input id="settings-discord-rpc-workspace" type="checkbox" ${richPresence.showCurrentWorkspace ? 'checked' : ''}> Mostrar workspace atual</label>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">OCR</div>
              <div class="settings-row-help">Transforme imagens e PDFs escaneados em notas editaveis.</div>
              <div class="modal-actions">
                <button class="modal-close" onclick="openImageOcrModal()">OCR imagem</button>
                <button class="modal-close" onclick="openPdfOcrModal()">OCR PDF</button>
              </div>
            </div>
          </div>
          <div class="settings-page" data-settings-page="account">
            <div class="settings-row">
              <div class="settings-row-title">Sessao e sincronizacao</div>
              <div class="settings-row-help">Informacoes da conta conectada ao NovaPad.</div>
              <div class="account-summary">
                <div class="account-status-card" id="card-session">
                  <span class="account-status-label">Sessao</span>
                  <div id="account-session-status" class="account-status-value">Sem sessao</div>
                </div>
                <div class="account-status-card" id="card-license">
                  <span class="account-status-label">Licenca</span>
                  <div id="account-license-status" class="account-status-value">-</div>
                </div>
                <div class="account-status-card" id="card-sync">
                  <span class="account-status-label">Sincronizacao</span>
                  <div id="account-sync-status" class="account-status-value">-</div>
                </div>
              </div>
            </div>
            <div class="settings-row" id="account-logged-in-section" style="display:none;">
              <div class="settings-row-title">Conta conectada</div>
              <div class="account-user-card">
                <div class="account-user-avatar" id="account-avatar-initials">?</div>
                <div class="account-user-info">
                  <div class="account-user-name" id="account-display-name">-</div>
                  <div class="account-user-email" id="account-display-email">-</div>
                  <div class="account-user-plan" id="account-display-plan"></div>
                </div>
              </div>
              <div class="modal-actions" style="margin-top:14px;">
                <button class="modal-close" style="background:var(--danger);color:#fff;" onclick="logoutAccountFromModal()">Encerrar sessao</button>
              </div>
            </div>
            <div class="settings-row" id="account-login-section">
              <div class="settings-row-title">Acesso</div>
              <div class="settings-row-help">Use seu email e senha para entrar. O cadastro novo fica apenas na tela inicial.</div>
              <div class="auth-grid">
                <input id="account-email" class="field-control" type="email" placeholder="Email" autocomplete="email">
                <input id="account-password" class="field-control" type="password" placeholder="Senha" autocomplete="current-password">
              </div>
              <div class="modal-actions">
                <button class="modal-close" onclick="loginAccountFromModal()">Entrar</button>
                <button class="modal-close" onclick="logoutAccountFromModal()" style="background:var(--panel2);border:1px solid var(--border);color:var(--text);">Sair</button>
              </div>
              <div class="account-feedback" id="account-feedback">Pronto para entrar.</div>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Licenca</div>
              <div class="settings-row-help">Cole sua chave para ativar a versao Pro e liberar recursos extras.</div>
              <div class="license-grid">
                <input id="license-key-input" class="field-control" type="text" placeholder="Chave de licenca">
              </div>
              <div class="modal-actions">
                <button class="modal-close" onclick="activateLicenseFromModal()">Ativar licenca</button>
                <button class="modal-close" onclick="verifyLicenseFromModal()">Verificar online</button>
              </div>
            </div>
          </div>
          <div class="settings-page" data-settings-page="export">
            <div class="settings-row">
              <div class="settings-row-title">Importacao e exportacao</div>
              <div class="settings-row-help">Use estes atalhos para entrar e sair com arquivos rapidamente.</div>
              <div class="modal-actions">
                <button class="modal-close" onclick="openImportModal()">Importar</button>
                <button class="modal-close" onclick="openExportModal()">Exportar</button>
              </div>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Backup automatico</div>
              <label class="check-row"><input id="settings-auto-backup" type="checkbox" ${settings.auto_backup ? 'checked' : ''}> Salvar copia em uma pasta escolhida</label>
              <input id="settings-backup-folder" class="field-control" type="text" value="${backupFolder}" placeholder="Escolha uma pasta para backup" readonly>
              <label class="field-label">Intervalo do backup: <span id="backup-interval-value">${Math.round(backupInterval / 60000)} min</span></label>
              <input id="settings-backup-interval" class="field-control" type="range" min="60000" max="3600000" step="60000" value="${backupInterval}">
              <div class="modal-actions">
                <button class="modal-close" onclick="chooseBackupFolder()">Escolher pasta</button>
                <button class="modal-close" onclick="runBackupNow()">Backup agora</button>
              </div>
            </div>
          </div>
          <div class="settings-page" data-settings-page="shortcuts">
            <div class="settings-row">
              <div class="settings-row-title">Atalhos principais</div>
              <div class="shortcut-list">
                <span>Nova nota <b>Ctrl+N</b></span>
                <span>Salvar <b>Ctrl+S</b></span>
                <span>Exportar <b>Ctrl+E</b></span>
                <span>Comandos <b>Ctrl+K</b></span>
                <span>Sidebar <b>Ctrl+B</b></span>
                <span>Foco <b>F11</b></span>
              </div>
            </div>
          </div>
          <div class="settings-page" data-settings-page="save">
            <div class="settings-row">
              <label class="check-row"><input id="settings-auto-save" type="checkbox" ${settings.auto_save === false ? '' : 'checked'}> ${t('auto_save_label')}</label>
              <label class="field-label">${t('auto_save_interval')}: <span id="auto-save-delay-value">${autoSaveDelay} ms</span></label>
              <input id="settings-auto-save-delay" class="field-control" type="range" min="500" max="10000" step="250" value="${autoSaveDelay}">
            </div>
            <div class="settings-row">
              <div class="settings-row-title">Backup automatico</div>
              <label class="check-row"><input id="settings-auto-backup" type="checkbox" ${settings.auto_backup ? 'checked' : ''}> Salvar copia em uma pasta escolhida</label>
              <input id="settings-backup-folder" class="field-control" type="text" value="${backupFolder}" placeholder="Escolha uma pasta para backup" readonly>
              <label class="field-label">Intervalo do backup: <span id="backup-interval-value">${Math.round(backupInterval / 60000)} min</span></label>
              <input id="settings-backup-interval" class="field-control" type="range" min="60000" max="3600000" step="60000" value="${backupInterval}">
              <div class="modal-actions">
                <button class="modal-close" onclick="chooseBackupFolder()">Escolher pasta</button>
                <button class="modal-close" onclick="runBackupNow()">Backup agora</button>
              </div>
            </div>
          </div>
          <div class="settings-page" data-settings-page="updates">
            <div class="settings-row">
              <div class="settings-row-title">${t('update_url')}</div>
              <div class="settings-row-help">${t('update_url_help')}</div>
              <input id="settings-update-url" class="field-control" type="text" value="${updateUrl}" placeholder="https://seu-servidor.com/novapad/">
            </div>
            <div class="settings-row">
              <label class="check-row"><input id="settings-auto-update" type="checkbox" ${settings.auto_update === false ? '' : 'checked'}> ${t('auto_update')}</label>
              <button class="modal-close" onclick="checkForAppUpdates(true)">${t('check_updates')}</button>
            </div>
          </div>
          <div class="settings-page" data-settings-page="data">
            <div class="settings-row">
              <div class="settings-row-title">${t('current_version')}</div>
              <input class="field-control" type="text" value="${escHtml(appInfo?.appVersion || '1.0.0')}" readonly>
            </div>
            <div class="settings-row">
              <div class="settings-row-title">${t('local_data_folder')}</div>
              <input class="field-control" type="text" value="${dataPath}" readonly>
              <div class="modal-actions">
                <button class="modal-close" onclick="openDataFolder()">${t('open_folder')}</button>
                <button class="modal-close" onclick="flushSave(activeNoteId); showToast(t('saved_now'))">${t('save_now')}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="settings-game-footer">
          <button class="modal-close" onclick="closeModal()">Cancelar</button>
          <button class="modal-close" onclick="openCommandPalette()">Comandos</button>
          <button class="modal-close" onclick="saveVisualSettings()">${t('save_settings')}</button>
        </div>
      </section>
    </div>
  `);
  modalBox.style.width = 'min(900px, calc(100vw - 48px))';
  modalBox.style.padding = '0';
  const sizeInput = $('settings-font-size');
  sizeInput.oninput = () => $('font-size-value').textContent = sizeInput.value + 'px';
  const delayInput = $('settings-auto-save-delay');
  delayInput.oninput = () => $('auto-save-delay-value').textContent = delayInput.value + ' ms';
  const backupInput = $('settings-backup-interval');
  if (backupInput) backupInput.oninput = () => $('backup-interval-value').textContent = Math.round(Number(backupInput.value) / 60000) + ' min';
  initSettingsTabs(startTab);
  if (startTab === 'account') refreshAccountPanel().catch(() => {});
}

function activateSettingsTab(tab) {
  const target = document.querySelector(`[data-settings-tab="${tab}"]`) || document.querySelector('[data-settings-tab]');
  if (target) target.click();
}

function initSettingsTabs(startTab = 'appearance') {
  const copy = {
    appearance: ['Aparencia', 'Tema, idioma, tags e cores.'],
    editor: ['Editor', 'Fonte, linguagem e leitura.'],
    plugins: ['Plugins', 'Extensoes, snippets e OCR.'],
    export: ['Exportacao', 'Importar, exportar e backup.'],
    shortcuts: ['Atalhos', 'Comandos rapidos do NovaPad.'],
    account: ['Conta', 'Login, licenca e sincronizacao.'],
    save: ['Salvamento', 'Auto-save e backup local.'],
    updates: ['Updates', 'Atualizacao online do NovaPad.'],
    data: ['Dados', 'Versao, pasta local e salvamento manual.'],
  };
  document.querySelectorAll('[data-settings-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.settingsTab;
      document.querySelectorAll('[data-settings-tab]').forEach(node => node.classList.toggle('active', node === button));
      document.querySelectorAll('[data-settings-page]').forEach(page => page.classList.toggle('active', page.dataset.settingsPage === tab));
      if ($('settings-page-title')) $('settings-page-title').textContent = copy[tab]?.[0] || 'Options';
      if ($('settings-page-sub')) $('settings-page-sub').textContent = copy[tab]?.[1] || '';
    });
  });
  activateSettingsTab(startTab);
}

function openAccountModal() {
  openSettingsModal('account');
}

function applyLicensePreset(mode = 'development') {
  const nextMode = mode === 'production' ? 'production' : 'development';
  const defaults = getLicenseConnectionDefaults(nextMode);
  const modeInput = $('license-mode-select');
  const serverUrlInput = $('license-server-url');
  const appKeyInput = $('license-app-key');
  if (modeInput) modeInput.value = nextMode;
  if (serverUrlInput) {
    serverUrlInput.value = defaults.serverUrl;
    serverUrlInput.placeholder = nextMode === 'production' ? 'https://seu-dominio.com/licenca' : 'http://localhost:3333';
  }
  if (appKeyInput) {
    appKeyInput.value = defaults.appKey;
    appKeyInput.placeholder = nextMode === 'production' ? 'Chave secreta do servidor' : 'novapad-dev-key';
  }
  setAccountFeedback(nextMode === 'production'
    ? 'Modo producao pronto. Defina a URL e a App key do seu servidor.'
    : 'Modo dev pronto. O servidor local e a chave padrao foram preenchidos.',
  '');
}

function resetLicenseConnectionFromModal() {
  applyLicensePreset(getLicenseEnvironmentMode());
  showToast('ConexÃƒÆ’Ã‚Â£o restaurada');
}

function openAdminHelpModal() {
  openModal(`
    <div class="modal-title">Ferramenta admin separada</div>
    <div class="modal-sub">A geracao de licencas e App key agora fica fora do NovaPad principal.</div>
    <div class="settings-row">
      <div class="settings-row-title">Ordem certa</div>
      <div class="settings-row-help">
        1. Gere uma licenca no Admin. Ela deve comecar com <b>NP-</b>.<br>
        2. Copie a App key do Admin para o campo <b>App key</b>, nao para o campo de licenca.<br>
        3. Rode o servidor com <b>npm run server</b> e use a URL <b>http://localhost:3333</b>.<br>
        4. O Admin e o servidor precisam usar o mesmo banco <b>server/data/licenses.sqlite3</b>.
      </div>
    </div>
    <button class="modal-close" onclick="closeModal()">Entendi</button>
  `);
}

async function copyGeneratedLicenseKey() {
  const value = $('license-key-input')?.value.trim() || '';
  if (!value) {
    setAccountFeedback('Gere uma chave antes de copiar.', 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
// ────────────────────────────────────────────────────────────
    showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Chave copiada');
  } catch {
// ────────────────────────────────────────────────────────────
    showToast('Ã¢Å“â€” Copie manualmente');
  }
}

async function generateLicenseFromModal() {
  openAdminHelpModal();
  return;
  const bridge = getNovaPadBridge();
// ────────────────────────────────────────────────────────────
  const payload = {};
  const result = null;
  if (!result?.licenseKey) {
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
    return;
  }
  const generatedKey = result.licenseKey;
  const licenseInfo = result.license?.plan ? `${String(result.license.plan).toUpperCase()} · ${result.license.status || 'active'}` : 'Gerada';
  setAccountFeedback(`Chave gerada: ${licenseInfo}.`, 'ok');
  showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Chave gerada');
}

async function saveVisualSettings() {
  const preservedSession = currentSession;
  const activeSettingsTab = document.querySelector('[data-settings-page].active')?.dataset?.settingsPage || null;
  settings.language = $('settings-language')?.value || settings.language;
  settings.font_family = $('settings-font-family')?.value || settings.font_family;
  settings.font_family_custom = $('settings-font-custom')?.value || settings.font_family_custom || '';
  settings.editor_mode = $('settings-editor-mode')?.value || settings.editor_mode;
  settings.font_size = Number($('settings-font-size')?.value || settings.font_size || 14);
  settings.minimap = $('settings-minimap') ? $('settings-minimap').checked : settings.minimap;
  settings.auto_save = $('settings-auto-save') ? $('settings-auto-save').checked : settings.auto_save;
  settings.auto_save_delay = clamp(Number($('settings-auto-save-delay')?.value) || settings.auto_save_delay || 1500, 500, 10000);
  settings.update_url = $('settings-update-url')?.value.trim() || settings.update_url || '';
  settings.auto_update = $('settings-auto-update') ? $('settings-auto-update').checked : settings.auto_update;
  settings.auto_backup = $('settings-auto-backup')?.checked || false;
  settings.backup_folder = $('settings-backup-folder')?.value || settings.backup_folder || '';
  settings.backup_interval_ms = clamp(Number($('settings-backup-interval')?.value) || 300000, 60000, 3600000);
  settings.discord_rich_presence = {
    enabled: $('settings-discord-rpc-enabled') ? $('settings-discord-rpc-enabled').checked : (settings.discord_rich_presence?.enabled !== false),
    showCurrentNote: $('settings-discord-rpc-note') ? $('settings-discord-rpc-note').checked : Boolean(settings.discord_rich_presence?.showCurrentNote),
    showCurrentWorkspace: $('settings-discord-rpc-workspace') ? $('settings-discord-rpc-workspace').checked : Boolean(settings.discord_rich_presence?.showCurrentWorkspace),
  };
  if ($('custom-theme-bg')) {
    settings.custom_theme = readCustomThemeSettings();
  }
  clearTimeout(autoSaveTimer);
  applyLocale();
  applyTheme();
  minimap.style.display = settings.minimap ? 'block' : 'none';
  applyLayoutSettings();
  updateMinimap();
  await window.api.settings.save(settings).catch(() => null);
  if (preservedSession?.user) {
    currentSession = preservedSession;
    cacheSession(preservedSession);
  }
  if (activeSettingsTab === 'account') {
    await refreshAccountPanel({ allowCurrentFallback: true }).catch(() => {});
  }
  emitPluginEvent('settings:changed', { settings: { ...settings } });
  syncDiscordPresence();
  closeModal();
  showToast(t('settings_updated'));
}

function setAccountFeedback(message, type = '') {
  const node = $('account-feedback');
  if (!node) return;
  node.className = ['account-feedback', type].filter(Boolean).join(' ');
  node.textContent = repairText(message);
}

function setAccountMetric(id, value) {
  const node = $(id);
  if (node) node.textContent = value;
}

function licenseStatusText(license) {
  if (!license) return 'Sem licenÃƒÆ’Ã‚Â§a';
  const plan = String(license.license?.plan || license.plan || 'free').toUpperCase();
  const status = String(license.license?.status || license.status || 'active');
  return `${plan} Ãƒâ€šÃ‚Â· ${status}`;
}

async function refreshAccountPanel({ allowCurrentFallback = true } = {}) {
  const bridge = getNovaPadBridge();
  const extra = getSettingsExtra();
  const mode = getLicenseEnvironmentMode(extra);
  const defaults = getLicenseConnectionDefaults(mode);
  const serverUrl = extra.licenseServerUrl || defaults.serverUrl;
  const appKey = extra.licenseAppKey || defaults.appKey;

  const serverUrlInput = $('license-server-url');
  const appKeyInput = $('license-app-key');
  const modeInput = $('license-mode-select');
  if (modeInput) modeInput.value = mode;
  if (serverUrlInput) serverUrlInput.value = serverUrl;
  if (appKeyInput) appKeyInput.value = appKey;
  if (serverUrlInput) serverUrlInput.placeholder = mode === 'production' ? 'https://seu-dominio.com/licenca' : 'http://localhost:3333';
  if (appKeyInput) appKeyInput.placeholder = mode === 'production' ? 'Chave secreta do servidor' : 'novapad-dev-key';

  syncAccountPanelVisibility(currentSession);
  setAccountMetric('account-session-status', currentSession?.user ? `${currentSession.user.name || 'Usuario'} - ${currentSession.user.email || '-'}` : 'Sem sessao');

  if (!bridge?.auth) {
    setAccountFeedback('Sistema de conta indisponivel.', 'error');
    setAccountMetric('account-session-status', currentSession?.user ? `${currentSession.user.name || 'Usuario'} - ${currentSession.user.email || '-'}` : 'Indisponivel');
    setAccountMetric('account-license-status', '-');
    setAccountMetric('account-sync-status', '-');
    return;
  }

  const { session: activeSession, source } = await resolveRendererSession({ allowCurrentFallback, bridge });

  if (!activeSession?.user) {
    currentSession = null;
    clearCachedSession();
    syncAccountPanelVisibility(null);
    setAccountFeedback('Entre com sua conta para continuar.', '');
    setAccountMetric('account-session-status', 'Sem sessao');
    setAccountMetric('account-license-status', 'Desconectado');
    setAccountMetric('account-sync-status', 'Pausado');
    setAccountMetric('account-license-plan', '-');
    setAccountMetric('account-license-state', '-');
    setAccountMetric('account-offline-state', '-');
    setAccountMetric('account-device-count', '-');
    return;
  }

  currentSession = activeSession;
  if (source !== 'memory') cacheSession(activeSession);
  const license = unwrapBridgeResult(await bridge.license?.get?.().catch(() => null), activeSession.license || null);
  const sync = unwrapBridgeResult(await bridge.sync?.status?.().catch(() => null), null);
  const sessionWithLicense = { ...activeSession, license };

  setAccountFeedback(`Sessao ativa como ${activeSession.user.name || activeSession.user.email}.`, 'ok');
  setAccountMetric('account-session-status', `${activeSession.user.name || 'Usuario'} - ${activeSession.user.email || '-'}`);
  setAccountMetric('account-license-status', licenseStatusText(license));
  setAccountMetric('account-sync-status', sync ? (sync.online ? `Online - ${sync.pending || 0} pendentes` : 'Offline') : '-');
  setAccountMetric('account-license-plan', String(license?.license?.plan || license?.plan || 'free').toUpperCase());
  await refreshVersionBadge(license);
  setAccountMetric('account-license-state', String(license?.license?.status || license?.status || 'active'));
  setAccountMetric('account-offline-state', license?.canUseOffline ? 'Liberado' : 'Bloqueado');
  setAccountMetric('account-device-count', String(license?.deviceCount ?? '-'));
  syncAccountPanelVisibility(sessionWithLicense);
}

async function registerAccountFromModal() {
  const bridge = getNovaPadBridge();
  if (!bridge) return showToast('Bridge de conta indisponÃƒÂ­vel');
  const name = $('account-name')?.value.trim();
  const email = $('account-email')?.value.trim();
  const password = $('account-password')?.value;
  const passwordConfirm = $('account-password-confirm')?.value;
  if (!name) {
    setAccountFeedback('Informe seu nome.', 'error');
    showToast('Ã¢Å“â€” Informe seu nome');
    return;
  }
  if (!isValidEmail(email)) {
    setAccountFeedback('Informe um email vÃƒÂ¡lido.', 'error');
    showToast('Ã¢Å“â€” Email invÃƒÂ¡lido');
    return;
  }
  if (!password) {
    setAccountFeedback('Informe uma senha.', 'error');
    showToast('Ã¢Å“â€” Informe uma senha');
    return;
  }
  if (password !== passwordConfirm) {
    setAccountFeedback('As senhas nÃƒÂ£o conferem.', 'error');
    showToast('Ã¢Å“â€” As senhas nÃƒÂ£o conferem');
    return;
  }
  const result = unwrapBridgeResult(await bridge.auth.register({ name, email, password, remember: true }).catch(() => null), null);
  if (!result) {
    setAccountFeedback('NÃƒÂ£o foi possÃƒÂ­vel criar a conta.', 'error');
    showToast('Ã¢Å“â€” NÃƒÂ£o foi possÃƒÂ­vel criar a conta');
    return;
  }
  setAccountFeedback(`Conta criada para ${result.user?.name || email}.`, 'ok');
  if ($('account-password-confirm')) $('account-password-confirm').value = '';
  currentSession = result;
  cacheSession(result);
  setAuthGateVisible(false);
  showToast('Ã¢Å“â€œ Conta criada');
  syncAccountPanelVisibility(result);
  await refreshAccountPanel();
}

async function loginAccountFromModal() {
  const bridge = getNovaPadBridge();
  if (!bridge) return showToast('Bridge de conta indisponÃƒÂ­vel');
  const email = $('account-email')?.value.trim();
  const password = $('account-password')?.value;
  if (!isValidEmail(email)) {
    setAccountFeedback('Informe um email vÃƒÂ¡lido.', 'error');
    showToast('Ã¢Å“â€” Email invÃƒÂ¡lido');
    return;
  }
  if (!password) {
    setAccountFeedback('Informe a senha.', 'error');
    showToast('Ã¢Å“â€” Informe uma senha');
    return;
  }
  const result = unwrapBridgeResult(await bridge.auth.login({ email, password, remember: true }).catch(() => null), null);
  if (!result) {
    setAccountFeedback('Falha ao entrar. Confirme email e senha.', 'error');
    showToast('Ã¢Å“â€” Falha ao entrar');
    return;
  }
  setAccountFeedback(`Bem-vindo, ${result.user?.name || email}.`, 'ok');
  currentSession = result;
  cacheSession(result);
  setAuthGateVisible(false);
  showToast('Ã¢Å“â€œ Login realizado');
  syncAccountPanelVisibility(result);
  await refreshAccountPanel();
}

function syncAccountPanelVisibility(session) {
  const loggedIn = Boolean(session?.user);
  const loginSection = $('account-login-section');
  const loggedSection = $('account-logged-in-section');
  const sessionCard = $('card-session');

  if (loginSection) loginSection.style.display = loggedIn ? 'none' : 'block';
  if (loggedSection) loggedSection.style.display = loggedIn ? 'block' : 'none';

  if (loggedIn) {
    const user = session.user;
    setAccountMetric('account-session-status', `${user.name || 'Usuario'} - ${user.email || '-'}`);
    const initials = (user.name || user.email || '?')
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('') || '?';
    if ($('account-avatar-initials')) $('account-avatar-initials').textContent = initials;
    if ($('account-display-name')) $('account-display-name').textContent = user.name || 'Sem nome';
    if ($('account-display-email')) $('account-display-email').textContent = user.email || '-';
    if ($('account-display-plan')) {
      const plan = session.license?.license?.plan || session.license?.plan || user.plan || 'free';
      $('account-display-plan').textContent = plan !== 'free' ? plan.toUpperCase() : '';
    }
    if (sessionCard) {
      sessionCard.style.borderColor = 'var(--accent)';
      sessionCard.style.background = 'color-mix(in srgb, var(--accent) 8%, var(--sidebar))';
    }
  } else {
    setAccountMetric('account-session-status', 'Sem sessao');
    if (sessionCard) {
      sessionCard.style.borderColor = '';
      sessionCard.style.background = '';
    }
  }
}
async function logoutAccountFromModal() {
  const bridge = getNovaPadBridge();
  if (!bridge) return showToast('Bridge de conta indisponÃƒÂ­vel');
  const result = unwrapBridgeResult(await bridge.auth.logout({}).catch(() => null), null);
  if (!result) {
    setAccountFeedback('NÃƒÂ£o foi possÃƒÂ­vel sair da conta.', 'error');
    showToast('Ã¢Å“â€” NÃƒÂ£o foi possÃƒÂ­vel sair');
    return;
  }
  setAccountFeedback('SessÃƒÂ£o encerrada.', '');
  currentSession = null;
  clearCachedSession();
  setAuthGateVisible(true);
  showToast('Ã¢Å“â€œ SessÃƒÂ£o encerrada');
  syncAccountPanelVisibility(currentSession);
  await refreshAccountPanel();
}

async function activateLicenseFromModal() {
  const bridge = getNovaPadBridge();
// ────────────────────────────────────────────────────────────
  const licenseKey = $('license-key-input')?.value.trim();
  if (!licenseKey) {
    setAccountFeedback('Cole uma chave de licenÃƒÆ’Ã‚Â§a antes de ativar.', 'error');
    return;
  }
  if (!/^NP-[A-Z0-9_-]+/i.test(licenseKey) && licenseKey !== 'NOVAPAD-DEMO-1234') {
    setAccountFeedback('Essa chave nao parece uma licenca. Licencas do Admin comecam com NP-. App key vai no terceiro campo.', 'error');
    return;
  }
  const response = await bridge.license.activate({ licenseKey }).catch(error => ({ success: false, error: error?.message }));
  const result = unwrapBridgeResult(response, null);
  if (!result) {
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
    return;
  }
  setAccountFeedback(`LicenÃƒÆ’Ã‚Â§a ativada: ${licenseStatusText(result)}.`, 'ok');
// ────────────────────────────────────────────────────────────
  await refreshAccountPanel();
}

async function verifyLicenseFromModal() {
  const bridge = getNovaPadBridge();
// ────────────────────────────────────────────────────────────
  const response = await bridge.license.verifyOnline().catch(error => ({ success: false, error: error?.message }));
  const result = unwrapBridgeResult(response, null);
  if (!result) {
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
    return;
  }
  setAccountFeedback('LicenÃƒÆ’Ã‚Â§a verificada online.', 'ok');
// ────────────────────────────────────────────────────────────
  await refreshAccountPanel();
}

async function saveLicenseConnectionFromModal() {
  const bridge = getNovaPadBridge();
// ────────────────────────────────────────────────────────────
  const mode = getLicenseEnvironmentMode({
    licenseMode: $('license-mode-select')?.value || getSettingsExtra().licenseMode,
  });
  const serverUrl = $('license-server-url')?.value.trim() || '';
  const appKey = $('license-app-key')?.value.trim() || '';
  const nextSettings = {
    ...settings,
    extra: {
      ...getSettingsExtra(),
      licenseMode: mode,
      licenseServerUrl: serverUrl,
      licenseAppKey: appKey,
    },
  };
  const result = unwrapBridgeResult(await bridge.settings.save(nextSettings).catch(() => null), null);
  if (!result) {
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
    return;
  }
  settings.extra = nextSettings.extra;
  setAccountFeedback('ConexÃƒÆ’Ã‚Â£o salva.', 'ok');
// ────────────────────────────────────────────────────────────
  await refreshAccountPanel();
}

async function chooseBackupFolder() {
  const folder = await window.api.backup?.chooseFolder?.();
  if (!folder) return;
  settings.backup_folder = folder;
  const input = $('settings-backup-folder');
  if (input) input.value = folder;
  showToast('Pasta de backup selecionada');
}

async function runBackupNow() {
  if ($('settings-backup-folder')) settings.backup_folder = $('settings-backup-folder').value || settings.backup_folder || '';
  if ($('settings-auto-backup')) settings.auto_backup = $('settings-auto-backup').checked;
  if ($('settings-backup-interval')) settings.backup_interval_ms = clamp(Number($('settings-backup-interval').value) || 300000, 60000, 3600000);
  await window.api.settings.save(settings);
  const result = await window.api.backup?.runNow?.(notes);
  showToast(result?.ok ? 'Backup criado' : 'Escolha uma pasta de backup primeiro');
}

function openDataFolder() {
  if (!appInfo?.userDataPath) return;
  window.api.app.openPath(appInfo.userDataPath);
}

function openColorModal() {
  const note = getNote(activeNoteId);
  if (!note) return;
  const colors = ['#6EE7B7','#38BDF8','#FCD34D','#FCA5A5','#C4B5FD','#FDA4AF','#86EFAC','#FB923C','#E879F9','#A3E635'];
  const buttons = colors.map(color => '<button class="color-option ' + (note.accentColor === color ? 'selected' : '') + '" style="background:' + color + '" onclick="setNoteColor(\'' + color + '\')"></button>').join('');
  openModal(`
// ────────────────────────────────────────────────────────────
    <div class="modal-sub">Escolha uma cor de destaque para esta nota.</div>
    <div class="color-grid">${buttons}</div>
    <label class="field-label">Cor personalizada</label>
    <input id="custom-note-color" class="field-control" type="color" value="${note.accentColor || '#6EE7B7'}">
    <button class="modal-close" onclick="setNoteColor($('custom-note-color').value)">Aplicar cor</button>
  `);
}

function setNoteColor(color) {
  const note = getNote(activeNoteId);
  if (!note) return;
  note.accentColor = color;
  applyNoteAppearance(note);
  window.api.notes.save(notes);
  renderNotesList();
  closeModal();
  showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Cor da nota atualizada');
}

// ────────────────────────────────────────────────────────────
function updateMinimap() {
  if (!minimapContent) return;
  if (settings.minimap === false || focusMode) {
    minimap.style.display = 'none';
    syncResizeHandles();
    return;
  }
  minimap.style.display = 'block';
  syncResizeHandles();
  const text = getEditorValue();
  const lines = text.split('\n');
  minimapContent.innerHTML = lines.map(line => {
    const cls = line.startsWith('#') ? 'mini-line heading' : (line.trim() ? 'mini-line' : 'mini-line empty');
    return '<div class="' + cls + '">' + (escHtml(line.slice(0, 80)) || '&nbsp;') + '</div>';
  }).join('');
  syncMinimap();
}

function syncMinimap() {
  if (!minimap || !minimapContent || settings.minimap === false) return;
  const ratio = getEditorScrollRatio();
  minimapContent.scrollTop = ratio * Math.max(1, minimapContent.scrollHeight - minimapContent.clientHeight);
}

function jumpFromMinimap(e) {
  const rect = minimapContent.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
  setEditorScrollRatio(ratio);
}

// ────────────────────────────────────────────────────────────
function splitSlides(note) {
  const raw = (note.content || '').trim();
  if (!raw) return [{ title: note.title, body: 'Sem conteÃƒÆ’Ã‚Âºdo ainda.' }];
  const chunks = raw.split(/\n(?=#\s+)/g).filter(Boolean);
  const source = chunks.length > 1 ? chunks : raw.split(/\n\s*---\s*\n|\n{3,}/g).filter(Boolean);
  return source.map((chunk, i) => {
    const lines = chunk.trim().split('\n');
    const first = lines[0] || '';
    const hasTitle = first.startsWith('# ');
    return {
      title: hasTitle ? first.replace(/^#\s+/, '') : (note.title + (source.length > 1 ? ' ' + (i + 1) : '')).trim(),
      body: (hasTitle ? lines.slice(1) : lines).join('\n').trim() || '—'
    };
  });
}

let presentationSlides = [];
let presentationIndex = 0;

function openPresentation() {
  const note = getNote(activeNoteId);
  if (!note) return showToast('ÃƒÂ¢Ã…Â¡Ã‚Â  Selecione uma nota');
  if (isDirty) flushSave(activeNoteId);
  closeToolbarMenus();
  closeNoteContextMenu();
  closeModal();
  presentationSlides = splitSlides(note);
  presentationIndex = 0;
  renderPresentation();
  document.body.classList.add('presenting');
  $('presentation-overlay').classList.remove('hidden');
}

function closePresentation() {
  $('presentation-overlay').classList.add('hidden');
  document.body.classList.remove('presenting');
}

function renderPresentation() {
  const note = getNote(activeNoteId);
  if (!presentationSlides.length) presentationSlides = splitSlides(note || { title: 'Sem titulo', content: '' });
  presentationIndex = clamp(presentationIndex, 0, Math.max(0, presentationSlides.length - 1));
  const slide = presentationSlides[presentationIndex] || { title: '', body: '' };
  $('presentation-title').textContent = slide.title;
    $('presentation-body').innerHTML = repairText(renderPresentationBody(slide.body));
  /*
    $('presentation-body').innerHTML = repairText(slide.body).split('\n').map(line => {
    if (line.startsWith('- ')) return '<li>' + escHtml(line.slice(2)) + '</li>';
    if (line.startsWith('[ ]')) return '<li>☐ ' + escHtml(line.slice(3).trim()) + '</li>';
    if (line.startsWith('[x]')) return '<li class="done">ÃƒÂ¢Ã‹Å“Ã¢â‚¬Ëœ ' + escHtml(line.slice(3).trim()) + '</li>';
    if (line.startsWith('## ')) return '<h2>' + escHtml(line.slice(3)) + '</h2>';
    return line.trim() ? '<p>' + escHtml(line) + '</p>' : '<br>';
  }).join('');
  */
  $('presentation-count').textContent = (presentationIndex + 1) + ' / ' + presentationSlides.length;
  $('presentation-overlay').style.setProperty('--presentation-accent', note?.accentColor || 'var(--accent)');
  $('btn-prev-slide').disabled = presentationIndex <= 0;
  $('btn-next-slide').disabled = presentationIndex >= presentationSlides.length - 1;
  const progress = $('presentation-progress');
  if (progress) progress.style.width = Math.round(((presentationIndex + 1) / Math.max(1, presentationSlides.length)) * 100) + '%';
}

function nextSlide() { if (presentationIndex < presentationSlides.length - 1) { presentationIndex++; renderPresentation(); } }
function prevSlide() { if (presentationIndex > 0) { presentationIndex--; renderPresentation(); } }

function renderPresentationBody(body) {
  const source = String(body || '').trim();
  if (!source) return '<p>Sem conteudo ainda.</p>';
  const codeBlocks = [];
  let safe = escHtml(source).replace(/```([a-zA-Z0-9+#._-]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push('<pre><code>' + code + '</code></pre>');
    return '@@CODE' + index + '@@';
  });
  const lines = safe.split(/\r?\n/);
  const html = [];
  let list = [];
  const flushList = () => {
    if (!list.length) return;
    html.push('<ul>' + list.join('') + '</ul>');
    list = [];
  };
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
    } else if (/^@@CODE\d+@@$/.test(trimmed)) {
      flushList();
      html.push(trimmed);
    } else if (/^##\s+/.test(trimmed)) {
      flushList();
      html.push('<h2>' + trimmed.replace(/^##\s+/, '') + '</h2>');
    } else if (/^[-*]\s+/.test(trimmed)) {
      list.push('<li>' + trimmed.replace(/^[-*]\s+/, '') + '</li>');
    } else if (/^\[ \]\s*/.test(trimmed)) {
      list.push('<li>' + trimmed.replace(/^\[ \]\s*/, '') + '</li>');
    } else if (/^\[x\]\s*/i.test(trimmed)) {
      list.push('<li class="done">' + trimmed.replace(/^\[x\]\s*/i, '') + '</li>');
    } else {
      flushList();
      html.push('<p>' + trimmed.replace(/`([^`]+)`/g, '<code>$1</code>') + '</p>');
    }
  });
  flushList();
  return html.join('').replace(/@@CODE(\d+)@@/g, (_, index) => codeBlocks[Number(index)] || '');
}

function firstSlide() {
  presentationIndex = 0;
  renderPresentation();
}

function lastSlide() {
  presentationIndex = Math.max(0, presentationSlides.length - 1);
  renderPresentation();
}


// ────────────────────────────────────────────────────────────
function migrateData() {
  if (!Array.isArray(settings.workspaces) || !settings.workspaces.length) settings.workspaces = ['General'];
  if (!settings.currentWorkspace) settings.currentWorkspace = settings.workspaces[0] || 'General';
  if (typeof settings.auto_save !== 'boolean') settings.auto_save = true;
  if (!settings.auto_save_delay) settings.auto_save_delay = 1500;
  if (!settings.editor_mode) settings.editor_mode = 'markdown';
  if (!settings.theme_preset) settings.theme_preset = settings.dark_mode === false ? 'minimal' : 'midnight';
  if (!THEME_PRESETS[settings.theme_preset]) settings.theme_preset = 'midnight';
  if (!settings.custom_theme || typeof settings.custom_theme !== 'object') settings.custom_theme = {};
  if (!settings.language) settings.language = 'en';
  if (typeof settings.auto_update !== 'boolean') settings.auto_update = true;
  if (typeof settings.update_url !== 'string') settings.update_url = '';
  if (!Array.isArray(settings.custom_tags)) settings.custom_tags = [];
  if (!Array.isArray(settings.custom_snippets)) settings.custom_snippets = [];
  if (typeof settings.backup_folder !== 'string') settings.backup_folder = '';
  if (typeof settings.auto_backup !== 'boolean') settings.auto_backup = false;
  if (!settings.backup_interval_ms) settings.backup_interval_ms = 300000;
  if (!settings.discord_rich_presence || typeof settings.discord_rich_presence !== 'object') {
    settings.discord_rich_presence = { enabled: true, showCurrentNote: false, showCurrentWorkspace: false };
  }
  if (typeof settings.discord_rich_presence.enabled !== 'boolean') settings.discord_rich_presence.enabled = true;
  if (typeof settings.discord_rich_presence.showCurrentNote !== 'boolean') settings.discord_rich_presence.showCurrentNote = false;
  if (typeof settings.discord_rich_presence.showCurrentWorkspace !== 'boolean') settings.discord_rich_presence.showCurrentWorkspace = false;
  let changed = false;
  notes.forEach(n => {
    if (!n.workspace) n.workspace = settings.currentWorkspace || 'General';
    if (typeof n.pinned !== 'boolean') n.pinned = false;
    if (typeof n.favorite !== 'boolean') n.favorite = false;
    if (!('deletedAt' in n)) n.deletedAt = null;
    if (!('reminderAt' in n)) n.reminderAt = null;
    if (!('reminderDone' in n)) n.reminderDone = false;
    if (!Array.isArray(n.images)) n.images = [];
    if (compactInlineImages(n)) changed = true;
  });
  if (changed) window.api.notes.save(notes);
}
function purgeOldTrash() {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const before = notes.length;
  notes = notes.filter(n => !n.deletedAt || new Date(n.deletedAt).getTime() > cutoff);
  if (notes.length !== before) window.api.notes.save(notes);
}
function renderWorkspaces() {
  if (!workspaceSelect) return;
  workspaceSelect.innerHTML = settings.workspaces.map(w => '<option value="' + escHtml(w) + '" ' + (w === settings.currentWorkspace ? 'selected' : '') + '>' + escHtml(w) + '</option>').join('');
}
function openWorkspaceModal() {
  const list = settings.workspaces.map(w => '<div class="version-item"><b>' + escHtml(w) + '</b><div class="version-preview">' + notes.filter(n => (n.workspace || 'General') === w && !n.deletedAt).length + ' notas ativas</div></div>').join('');
  openModal('<div class="modal-title">Pastas / Workspaces</div><div class="modal-sub">Agrupe notas por projeto, como Minecraft Mod ou Gods Game.</div>' + list + '<label class="field-label">Novo workspace</label><input id="new-workspace-name" class="field-control" placeholder="Ex: Minecraft Mod"><div class="modal-actions"><button class="modal-close" onclick="addWorkspace()">Adicionar</button><button class="modal-close" onclick="closeModal()">Fechar</button></div>');
}
function addWorkspace() {
  const name = $('new-workspace-name').value.trim();
  if (!name) return;
  if (!settings.workspaces.includes(name)) settings.workspaces.push(name);
  settings.currentWorkspace = name;
  window.api.settings.save(settings);
  renderWorkspaces(); renderNotesList(); closeModal(); showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Workspace criado');
}
function openMoveWorkspaceModal() {
  const note = getNote(activeNoteId);
  if (!note) return;
  const options = (settings.workspaces || ['General']).map(workspace =>
    '<option value="' + escHtml(workspace) + '" ' + ((note.workspace || 'General') === workspace ? 'selected' : '') + '>' + escHtml(workspace) + '</option>'
  ).join('');
  openModal(`
    <div class="modal-title">Mover para workspace</div>
    <div class="modal-sub">Escolha onde esta nota deve ficar organizada.</div>
    <select id="move-workspace-select" class="field-control">${options}</select>
    <div class="modal-actions">
      <button class="modal-close" onclick="moveActiveToWorkspace()">Mover</button>
      <button class="modal-close" onclick="closeModal()">Cancelar</button>
    </div>
  `);
}

function moveActiveToWorkspace() {
  const note = getNote(activeNoteId);
  const workspace = $('move-workspace-select')?.value;
  if (!note || !workspace) return;
  note.workspace = workspace;
  note.modified = nowStr();
  settings.currentWorkspace = workspace;
  notesView = 'active';
  window.api.notes.save(notes);
  window.api.settings.save(settings);
  renderWorkspaces();
  renderNotesList();
  selectNote(note.id);
  closeModal();
  showToast('Nota movida para ' + workspace);
}

function toggleNoteFlag(id, action) {
  const note = getNote(id); if (!note) return;
  if (action === 'pin') note.pinned = !note.pinned;
  if (action === 'fav') note.favorite = !note.favorite;
  window.api.notes.save(notes);
  updateHeaderNoteActions(note);
  renderNotesList();
}

function moveNoteToSidebarSection(id, targetId) {
  const note = getNote(Number(id));
  if (!note || !targetId) return;
  if (targetId === 'favorites') {
    note.favorite = true;
    note.deletedAt = null;
    showToast('Nota adicionada as favoritas');
  } else if (targetId === 'pinned') {
    note.pinned = true;
    note.deletedAt = null;
    showToast('Nota fixada');
  } else if (targetId === 'trash') {
    note.deletedAt = new Date().toISOString();
    showToast('Nota enviada para lixeira');
  } else if (targetId === 'notes') {
    note.deletedAt = null;
    showToast('Nota movida para Notas');
  } else {
    return;
  }
  note.modified = nowStr();
  window.api.notes.save(notes);
  updateHeaderNoteActions(note);
  renderNotesList();
}

function moveActiveToTrash() {
  const note = getNote(activeNoteId); if (!note) return;
  if (note.deletedAt) { note.deletedAt = null; showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Nota restaurada'); }
  else { note.deletedAt = new Date().toISOString(); showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Nota enviada para lixeira por 30 dias'); }
  window.api.notes.save(notes); renderNotesList();
  const next = filteredNotes()[0]; if (next) selectNote(next.id);
  emitPluginEvent('note:trash-changed', {
    noteId: note.id,
    title: note.title,
    deleted: Boolean(note.deletedAt),
  });
}
function parseBrDate(str) {
  const m = String(str || '').match(/(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2})/);
  return m ? (m[3] + '-' + m[2] + '-' + m[1] + 'T' + m[4] + ':' + m[5] + ':00') : 0;
}

// ────────────────────────────────────────────────────────────
function togglePreview() {
  previewVisible = !previewVisible;
  editorArea.classList.toggle('split', previewVisible);
  $('btn-preview').classList.toggle('active', previewVisible);
  syncResizeHandles();
  updatePreview();
}

function closeToolbarMenus(hideFormattingToolbar = true) {
  document.querySelectorAll('[data-menu]').forEach(menu => menu.classList.remove('open'));
  if (hideFormattingToolbar) hideSelectionToolbar();
}

function toggleToolbarMenu(menu) {
  const shouldOpen = !menu.classList.contains('open');
  closeToolbarMenus();
  if (shouldOpen) menu.classList.add('open');
}
function updatePreview() {
  const note = getNote(activeNoteId);
  const content = note ? resolveNoteImageTokens(note) : getEditorValue();
  if (previewPane) previewPane.innerHTML = renderMarkdown(content);
  renderInternalLinksPanel();
}

function normalizeWikiTitle(title) {
  return String(title || '').replace(/\s+/g, ' ').trim();
}

function normalizeWikiTitleKey(title) {
  return normalizeWikiTitle(title).toLocaleLowerCase('pt-BR');
}

function extractWikiLinks(content) {
  const cleanContent = String(content || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '');
  const found = [];
  const seen = new Set();
  cleanContent.replace(/\[\[([^\]\n]+)\]\]/g, (_, rawTitle) => {
    const title = normalizeWikiTitle(rawTitle);
    const key = normalizeWikiTitleKey(title);
    if (title && !seen.has(key)) {
      seen.add(key);
      found.push(title);
    }
    return '';
  });
  return found;
}

function findNoteByTitle(title) {
  const target = normalizeWikiTitleKey(title);
  if (!target) return null;
  return notes.find(note => normalizeWikiTitleKey(note.title) === target) || null;
}

function openOrCreateLinkedNote(title) {
  const cleanTitle = normalizeWikiTitle(title);
  if (!cleanTitle) return null;
  let note = findNoteByTitle(cleanTitle);
  if (!note) {
    note = createNote(cleanTitle, activeTag || 'pessoal', '# ' + cleanTitle + '\n\n');
    notes.unshift(note);
    window.api.notes.save(notes);
    renderWorkspaces();
    renderNotesList();
    showToast(t('linked_note_created'));
  } else if (note.deletedAt) {
    note.deletedAt = null;
    window.api.notes.save(notes);
    showToast(t('linked_note_restored'));
  }
  notesView = 'active';
  closeModal();
  selectNote(note.id);
  return note;
}

function openWikiLink(encodedTitle) {
  openOrCreateLinkedNote(decodeURIComponent(String(encodedTitle || '')));
}

function getBacklinks(noteTitle) {
  const target = normalizeWikiTitleKey(noteTitle);
  if (!target) return [];
  return notes.filter(note =>
    !note.deletedAt &&
    normalizeWikiTitleKey(note.title) !== target &&
    extractWikiLinks(note.content).some(link => normalizeWikiTitleKey(link) === target)
  );
}

function decodeHtmlText(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = String(value || '');
  return textarea.value;
}

function renderInternalLinks(content) {
  return String(content || '').replace(/\[\[([^\]\n]+)\]\]/g, (_, rawTitle) => {
    const title = normalizeWikiTitle(decodeHtmlText(rawTitle));
    if (!title) return '';
    const exists = Boolean(findNoteByTitle(title));
    const className = exists ? 'wiki-link' : 'wiki-link missing';
    return `<button class="${className}" onclick="openWikiLink('${encodeURIComponent(title)}')" title="${escHtml(t('link_open_create'))}">${escHtml(title)}</button>`;
  });
}

function renderLinkButton(title, kind = 'out') {
  const note = findNoteByTitle(title);
  const hint = note ? (kind === 'back' ? t('link_hint_back') : t('link_hint_open')) : t('link_hint_create');
  return `<button class="internal-link-chip ${note ? '' : 'missing'}" onclick="openWikiLink('${encodeURIComponent(title)}')" title="${escHtml(t('link_open_create'))}"><span>${escHtml(title)}</span><small>${escHtml(hint)}</small></button>`;
}

function renderConnectionGraph(note, outgoing, backlinks) {
  const nodes = new Map();
  outgoing.forEach(title => nodes.set(normalizeWikiTitleKey(title), { title, kind: findNoteByTitle(title) ? 'out' : 'missing' }));
  backlinks.forEach(item => nodes.set(normalizeWikiTitleKey(item.title), { title: item.title, kind: 'back' }));
  const nodeList = [...nodes.values()].slice(0, 10);
  if (!nodeList.length) return `<div class="internal-empty">${escHtml(t('graph_empty'))}</div>`;
  const edges = [
    ...outgoing.slice(0, 6).map(title => `<span>${escHtml(note.title)} -> ${escHtml(title)}</span>`),
    ...backlinks.slice(0, 6).map(item => `<span>${escHtml(item.title)} -> ${escHtml(note.title)}</span>`),
  ].join('');
  return `
    <div class="links-graph">
      <div class="graph-center">${escHtml(note.title || t('current_note'))}</div>
      <div class="graph-nodes">${nodeList.map(item => `<button class="graph-node ${item.kind}" onclick="openWikiLink('${encodeURIComponent(item.title)}')">${escHtml(item.title)}</button>`).join('')}</div>
      <div class="graph-edges">${edges}</div>
    </div>
  `;
}

function renderInternalLinksPanel() {
  const panel = $('internal-links-panel');
  if (!panel) return;
  panel.classList.toggle('hidden', settings.internal_links_visible === false);
  $('btn-internal-links')?.classList.toggle('active', settings.internal_links_visible !== false);
  if (settings.internal_links_visible === false) return;
  const note = getNote(activeNoteId);
  if (!note) {
    panel.innerHTML = `<div class="links-panel-title"><span>${escHtml(t('internal_links_title'))}</span><button class="links-panel-close" onclick="toggleInternalLinksPanel()" title="Ocultar">x</button></div><div class="internal-empty">${escHtml(t('select_note'))}</div>`;
    return;
  }
  const currentContent = activeNoteId === note.id ? getEditorValue() : note.content;
  const outgoing = extractWikiLinks(currentContent);
  const backlinks = getBacklinks(note.title);
  const outgoingEmpty = `<div class="internal-empty">${escHtml(t('internal_link_help'))}<br>${escHtml(t('link_click_help'))}</div>`;
  const backlinksEmpty = `<div class="internal-empty">${escHtml(t('backlinks_empty'))}</div>`;
  panel.innerHTML = `
    <div class="links-panel-title"><span>${escHtml(t('internal_links_title'))}</span><button class="links-panel-close" onclick="toggleInternalLinksPanel()" title="Ocultar">x</button></div>
    <div class="internal-links-legend">
      <div><code>[[Nome]]</code> = link interno</div>
      <div>clicar = abrir ou criar nota</div>
      <div>backlinks = quem aponta pra voce</div>
      <div>grafo = mapa das ideias</div>
    </div>
    <section class="links-panel-section">
      <h3>${escHtml(t('internal_link_section'))} <span>${outgoing.length}</span></h3>
      <div class="internal-link-list">${outgoing.map(title => renderLinkButton(title, 'out')).join('') || outgoingEmpty}</div>
    </section>
    <section class="links-panel-section">
      <h3>${escHtml(t('backlinks_title'))} <span>${backlinks.length}</span></h3>
      <div class="internal-link-list">${backlinks.map(item => renderLinkButton(item.title, 'back')).join('') || backlinksEmpty}</div>
    </section>
    <section class="links-panel-section">
      <h3>${escHtml(t('graph_title'))}</h3>
      ${renderConnectionGraph(note, outgoing, backlinks)}
    </section>
  `;
}

function renderChecklist(content, tokenStore = createTokenStore()) {
  let index = 0;
  return String(content || '').replace(/^(\s*[-*]\s+)\[( |x|X)\]\s*(.*)$/gm, (_, prefix, mark, text) => {
    const checked = /x/i.test(mark);
    const html = `
      <label class="checklist-item" data-checklist-index="${index}" data-checklist-checked="${checked ? '1' : '0'}">
        <input type="checkbox" data-checklist-index="${index}" ${checked ? 'checked' : ''}>
        <span class="checklist-text">${text || ''}</span>
      </label>`;
    index += 1;
    return tokenStore.stash(html);
  });
}

function updateChecklistInEditor(nextContent) {
  const content = String(nextContent || '');
  const note = getNote(activeNoteId);
  if (note) note.content = content;
  setEditorValue(content);
  if (!codeEditor) refreshEditorPreviewState();
}

function toggleChecklistItem(index) {
  const source = getEditorValue();
  const lines = String(source || '').split('\n');
  let checklistIndex = 0;
  let changed = false;
  const next = lines.map(line => {
    const match = line.match(/^(\s*[-*]\s+)\[( |x|X)\](\s+.*)$/);
    if (!match) return line;
    if (checklistIndex++ !== index) return line;
    changed = true;
    const checked = !/x/i.test(match[2]);
    return `${match[1]}[${checked ? 'x' : ' '}]${match[3]}`;
  }).join('\n');
  if (!changed) return false;
  updateChecklistInEditor(next);
  return true;
}

function renderMarkdown(md) {
  const tokenStore = createTokenStore();
  md = String(md || '').replace(/```([a-zA-Z0-9+#._-]*)\n?([\s\S]*?)```/g, (_, lang, code) => tokenStore.stash(renderCodeFence(code, lang)));
  md = escHtml(md);
  md = md.replace(/`([^`]+)`/g, (_, code) => tokenStore.stash(`<code>${code}</code>`));
  md = renderInternalLinks(md);
  const checklistStore = createTokenStore('@@CHK');
  md = renderChecklist(md, checklistStore);
  md = md.replace(/```([a-zA-Z0-9+#._-]*)\n?([\s\S]*?)```/g, (_, lang, code) => renderCodeFence(code, lang));
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>');
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img alt="${escHtml(alt)}" src="${escHtml(resolveMarkdownImageSource(src))}">`);
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');
  md = md.replace(/^(\|.+\|\n\|[-:| ]+\|\n(?:\|.*\|\n?)*)/gm, block => markdownTable(block));
  md = md.replace(/^(?:- |\* )(.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  const html = md.split(/\n{2,}/).map(block => /<h\d|<ul|@@TOK|@@CHK|<blockquote|<table|<img/.test(block) ? block : '<p>' + block.replace(/\n/g,'<br>') + '</p>').join('');
  return tokenStore.restore(checklistStore.restore(html));
}
function markdownTable(block) {
  const rows = block.trim().split('\n').filter((_,i)=>i!==1).map(r => r.split('|').slice(1,-1).map(c=>c.trim()));
  return '<table>' + rows.map((r,i)=>'<tr>' + r.map(c => i===0 ? '<th>'+c+'</th>' : '<td>'+c+'</td>').join('') + '</tr>').join('') + '</table>';
}
function openTemplateModal() {
// ────────────────────────────────────────────────────────────
}
function applyTemplate(type) {
  const templates = {
// ────────────────────────────────────────────────────────────
    brainstorm: '# Brainstorm\n\nObjetivo: \n\n## Ideias livres\n- \n\n## Melhores caminhos\n- \n\n## PrÃƒÆ’Ã‚Â³ximo teste\n[ ] ',
    bug: '# Bug report\n\n## Resumo\n\n## Passos para reproduzir\n1. \n2. \n\n## Resultado esperado\n\n## Resultado atual\n\n## EvidÃƒÆ’Ã‚Âªncias\n'
  };
  insertAtCursor(templates[type] || ''); closeModal(); showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Template inserido');
}
function openTableModal() {
  openModal('<div class="modal-title">Inserir tabela</div><label class="field-label">Colunas</label><input id="table-cols" class="field-control" type="number" min="1" max="8" value="3"><label class="field-label">Linhas</label><input id="table-rows" class="field-control" type="number" min="1" max="12" value="3"><button class="modal-close" onclick="insertTableFromModal()">Inserir</button>');
}
function insertTableFromModal() {
  const cols = Math.max(1, Math.min(8, Number($('table-cols').value || 3)));
  const rows = Math.max(1, Math.min(12, Number($('table-rows').value || 3)));
  let out = '\n|' + Array.from({length:cols},(_,i)=>' Coluna ' + (i+1) + ' ').join('|') + '|\n|' + Array.from({length:cols},()=> '---').join('|') + '|\n';
  for (let r=0; r<rows; r++) out += '|' + Array.from({length:cols},()=> ' ').join('|') + '|\n';
  insertAtCursor(out); closeModal(); showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Tabela inserida');
}
function getEditorSelectionText() {
  if (codeEditor) return codeEditor.getSelection() || '';
  const start = editor.selectionStart || 0;
  const end = editor.selectionEnd || 0;
  return String(editor.value || '').slice(start, end);
}

function replaceEditorSelectionOrDocument(text) {
  const nextText = String(text || '');
  if (codeEditor && codeEditor.somethingSelected()) {
    codeEditor.replaceSelection(nextText, 'around');
    editor.value = codeEditor.getValue();
  } else if (codeEditor) {
    setEditorValue(nextText, true);
  } else {
    const start = editor.selectionStart || 0;
    const end = editor.selectionEnd || 0;
    if (start !== end) {
      editor.value = editor.value.slice(0, start) + nextText + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = start + nextText.length;
    } else {
      editor.value = nextText;
    }
  }
  updateStats();
  updateMinimap();
  updatePreview();
  renderEditorMedia();
  scheduleSave();
  focusEditor();
}

function improveTextClarity(text) {
  const replacements = {
    vc: 'voce',
    pq: 'porque',
    q: 'que',
    tbm: 'tambem',
    msm: 'mesmo',
    n: 'nao',
    casas: 'casas',
    kasa: 'casa',
  };
  const dictionary = {
    abreviacoes: replacements,
    comuns: {
      kasas: 'casas',
      casaas: 'casas',
      escreivir: 'escrevi',
      escrevir: 'escrevi',
      ortografiaa: 'ortografia',
    },
  };
  let out = String(text || '').replace(/\r\n/g, '\n');
  out = out.replace(/[ \t]+/g, ' ');
  out = out.replace(/\s+([,.;:!?])/g, '$1');
  out = out.replace(/([,.;:!?])([^\s\n])/g, '$1 $2');
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/\b(vc|pq|q|tbm|msm|n)\b/gi, match => replacements[match.toLowerCase()] || match);
  out = out.replace(/\b[\p{L}]+\b/gu, word => {
    const lower = word.toLowerCase();
    if (dictionary.comuns[lower]) return matchWordCase(word, dictionary.comuns[lower]);
    if (lower.startsWith('k') && lower.length > 1) {
      return matchWordCase(word, 'c' + lower.slice(1));
    }
    return word;
  });
  out = out.replace(/(^|[.!?]\s+)([a-z])/g, (_, start, letter) => start + letter.toUpperCase());
  return out.trim();
}

function matchWordCase(source, target) {
  if (!source) return target;
  if (source === source.toUpperCase()) return String(target).toUpperCase();
  if (source[0] === source[0].toUpperCase()) return String(target).charAt(0).toUpperCase() + String(target).slice(1);
  return target;
}

function improveSelectedText() {
  const selected = getEditorSelectionText();
  const source = selected || getEditorValue();
  if (!source.trim()) return showToast('Nada para revisar');
  const improved = improveTextClarity(source);
  replaceEditorSelectionOrDocument(improved);
  showToast(selected ? 'Selecao revisada' : 'Nota revisada');
}

function generateTitleFromText(text) {
  const lines = String(text || '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\r?\n/)
    .map(line => line.replace(/^#+\s*/, '').replace(/^[-*]\s+/, '').replace(/^\[[ x]\]\s*/i, '').trim())
    .filter(Boolean);
  const first = lines[0] || 'Sem titulo';
  return first
    .replace(/[`*_~>#|[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'Sem titulo';
}

function generateAutomaticTitle() {
  const note = getNote(activeNoteId);
  if (!note) return showToast('Selecione uma nota');
  const title = generateTitleFromText(getEditorSelectionText() || getEditorValue());
  noteTitleInput.value = title;
  note.title = title;
  tbFilename.textContent = title;
  window.api.notes.save(notes);
  renderNotesList();
  showToast('Titulo gerado');
}
function detectInitialColorValue() {
  const selected = getEditorSelectionText().trim();
  const rgbaSelected = selected.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i);
  if (rgbaSelected) {
    const r = Math.max(0, Math.min(255, Number(rgbaSelected[1])));
    const g = Math.max(0, Math.min(255, Number(rgbaSelected[2])));
    const b = Math.max(0, Math.min(255, Number(rgbaSelected[3])));
    const alpha = rgbaSelected[4] == null ? 1 : Math.max(0, Math.min(1, Number(rgbaSelected[4])));
    return {
      color: '#' + [r, g, b].map(value => value.toString(16).padStart(2, '0')).join(''),
      alpha,
    };
  }
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(selected)) return selected.length === 4
    ? { color: '#' + selected[1] + selected[1] + selected[2] + selected[2] + selected[3] + selected[3], alpha: 1 }
    : { color: selected, alpha: 1 };
  const match = String(getEditorValue() || '').match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
  if (match) return match[0].length === 4
    ? { color: '#' + match[0][1] + match[0][1] + match[0][2] + match[0][2] + match[0][3] + match[0][3], alpha: 1 }
    : { color: match[0], alpha: 1 };
  return { color: '#f5f3ea', alpha: 1 };
}
function formatColorValue(hex, format, alpha = 1) {
  const normalized = String(hex || '#ffffff').toLowerCase();
  if (format === 'hex') return normalized;
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!rgb) return normalized;
  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);
  if (format === 'rgba') return `rgba(${r}, ${g}, ${b}, ${Number(alpha).toFixed(2).replace(/0+$/,'').replace(/\.$/, '')})`;
  if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`;
  return normalized;
}
function syncEditorColorPreview() {
  const color = $('editor-color-value')?.value || '#f5f3ea';
  const format = $('editor-color-format')?.value || 'hex';
  const alpha = Number($('editor-color-alpha')?.value || 100) / 100;
  const output = formatColorValue(color, format, alpha);
  const preview = $('editor-color-output');
  const chip = $('editor-color-chip');
  const alphaValue = $('editor-color-alpha-value');
  if (preview) preview.value = output;
  if (chip) chip.style.background = formatColorValue(color, 'rgba', alpha);
  if (alphaValue) alphaValue.textContent = Math.round(alpha * 100) + '%';
}
function applyPresetEditorColor(color) {
  const picker = $('editor-color-value');
  if (!picker) return;
  picker.value = color;
  syncEditorColorPreview();
}
function openEditorColorPicker() {
  const presets = ['#f5f3ea','#ffffff','#000000','#f0c400','#6ee7b7','#38bdf8','#f87171','#fca5a5','#c4b5fd','#fb923c','#e879f9','#a3e635','#2d2d30','#141418','#1a1a20'];
  const presetButtons = presets.map(color => `<button class="color-option" style="background:${color}" onclick="applyPresetEditorColor('${color}')"></button>`).join('');
  const initialState = detectInitialColorValue();
  openModal(`
    <div class="modal-title">${currentLanguage() === 'pt-BR' ? 'Seletor de cor' : 'Color picker'}</div>
    <div class="modal-sub">${currentLanguage() === 'pt-BR' ? 'Escolha uma cor visualmente e insira no editor sem decorar codigos.' : 'Pick a color visually and insert it into the editor without memorizing color codes.'}</div>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Cor' : 'Color'}</label>
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
      <input id="editor-color-value" class="field-control" type="color" value="${initialState.color}" style="height:46px;padding:6px;cursor:pointer;">
      <div id="editor-color-chip" style="width:46px;height:46px;border-radius:12px;border:1px solid var(--border);background:${initialState.color};flex-shrink:0;"></div>
      <select id="editor-color-format" class="field-control" style="max-width:120px;">
        <option value="hex">HEX</option>
        <option value="rgb">RGB</option>
        <option value="rgba">RGBA</option>
      </select>
    </div>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Opacidade' : 'Opacity'}: <span id="editor-color-alpha-value">${Math.round(initialState.alpha * 100)}%</span></label>
    <input id="editor-color-alpha" class="field-control" type="range" min="0" max="100" step="1" value="${Math.round(initialState.alpha * 100)}">
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Paleta rapida' : 'Quick palette'}</label>
    <div class="color-grid">${presetButtons}</div>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Valor que vai entrar no texto' : 'Value to insert into the text'}</label>
    <input id="editor-color-output" class="field-control" type="text" readonly>
    <div class="modal-actions">
      <button class="modal-close" onclick="closeModal()">${currentLanguage() === 'pt-BR' ? 'Cancelar' : 'Cancel'}</button>
      <button class="modal-close" onclick="insertEditorColorValue()">${currentLanguage() === 'pt-BR' ? 'Inserir cor' : 'Insert color'}</button>
    </div>
  `);
  $('editor-color-value').addEventListener('input', syncEditorColorPreview);
  $('editor-color-format').addEventListener('change', syncEditorColorPreview);
  $('editor-color-alpha').addEventListener('input', syncEditorColorPreview);
  syncEditorColorPreview();
}
function insertEditorColorValue() {
  const output = $('editor-color-output')?.value || '';
  if (!output) return;
  insertAtCursor(output);
  closeModal();
  showToast(currentLanguage() === 'pt-BR' ? 'Cor inserida no editor' : 'Color inserted into the editor');
}
function insertAtCursor(text) {
  if (codeEditor) {
    codeEditor.replaceSelection(String(text || ''), 'around');
    editor.value = codeEditor.getValue();
    updateStats();
    updateMinimap();
    updatePreview();
    renderEditorMedia();
    scheduleSave();
  } else {
    const start = editor.selectionStart || 0, end = editor.selectionEnd || 0;
    editor.value = editor.value.slice(0,start) + text + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + text.length;
    syncEditorPlaceholder();
    updateStats(); updateMinimap(); updatePreview(); renderEditorMedia(); scheduleSave();
  }
  focusEditor();
}

function insertImageAtCursor(imageMarkdown) {
  insertAtCursor(imageMarkdown);
}

function getImageFromClipboard(event) {
  const clipboard = event?.clipboardData || event?.originalEvent?.clipboardData;
  if (!clipboard) return null;
  const items = Array.from(clipboard.items || []);
  for (const item of items) {
    if (item.kind === 'file' && item.type && item.type.startsWith('image/')) {
      const file = item.getAsFile?.();
      if (file) return file;
    }
  }
  const files = Array.from(clipboard.files || []);
  return files.find(file => file && file.type && file.type.startsWith('image/')) || null;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Failed to read image data'));
    reader.readAsDataURL(file);
  });
}

function getPastedImageExt(file) {
  const mime = String(file?.type || '').toLowerCase();
  const extFromName = String(file?.name || '').toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || '';
  const byMime = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return byMime[mime] || (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(extFromName) ? extFromName : '.png');
}

async function savePastedImage(file) {
  if (!file) return null;
  const rawName = String(file.name || 'imagem').replace(/\.[^.]+$/, '').trim();
  const safeName = rawName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'imagem';
  const ext = getPastedImageExt(file);
  const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
  let result = null;
  try {
    result = await window.api.images?.savePasted?.({
      name: `${safeName}${ext}`,
      mimeType: file.type || 'image/png',
      bytes,
    });
  } catch (_) {
    result = null;
  }
  if (result?.ok && result.relativePath) {
    return { ok: true, markdown: `![${safeName}](${result.relativePath})`, source: result.relativePath };
  }
  const dataUrl = await readFileAsDataUrl(file);
  return { ok: true, markdown: `![${safeName}](${dataUrl})`, source: dataUrl, fallback: true };
}

async function insertImageFile(file, { notify = true } = {}) {
  const saved = await savePastedImage(file);
  if (!saved?.ok || !saved.markdown) return false;
  insertImageAtCursor(saved.markdown);
  renderEditorMedia();
  if (notify) showToast(t('image_inserted'));
  return true;
}

// ────────────────────────────────────────────────────────────
async function handlePasteImage(event) {
  const file = getImageFromClipboard(event);
  if (!file) return false;
  event.preventDefault();
  event.stopPropagation();
  try {
    const inserted = await insertImageFile(file);
    if (!inserted) showToast(t('image_paste_failed'));
    return inserted;
  } catch (_) {
    showToast(t('image_paste_failed'));
    return false;
  }
}

async function handleImageDrop(e) {
  e.preventDefault();
  const files = [...(e.dataTransfer.files || [])].filter(f => f.type.startsWith('image/'));
  if (!files.length) return;
  let inserted = 0;
  for (const file of files) {
    if (await insertImageFile(file, { notify: false })) inserted += 1;
  }
  if (inserted) showToast(t('image_inserted'));
  else showToast(t('image_paste_failed'));
}

function updatePreview() {
  const note = getNote(activeNoteId);
  const content = note ? resolveNoteImageTokens(note) : getEditorValue();
  if (previewPane) previewPane.innerHTML = renderMarkdown(content);
  renderInternalLinksPanel();
}

async function handleImageDrop(e) {
  e.preventDefault();
  const files = [...(e.dataTransfer.files || [])].filter(f => f.type.startsWith('image/'));
  if (!files.length) return;
  let inserted = 0;
  for (const file of files) {
    if (await insertImageFile(file, { notify: false })) inserted += 1;
  }
  if (inserted) showToast(t('image_inserted'));
  else showToast(t('image_paste_failed'));
}
function openReminderModal() {
  const note = getNote(activeNoteId); if (!note) return;
  const val = note.reminderAt ? note.reminderAt.slice(0,16) : '';
// ────────────────────────────────────────────────────────────
}
function saveReminder() {
  const note = getNote(activeNoteId); if (!note) return;
  note.reminderAt = $('reminder-at').value || null; note.reminderDone = false;
  window.api.notes.save(notes); selectNote(note.id); closeModal(); showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Lembrete salvo');
}
function clearReminder() {
  const note = getNote(activeNoteId); if (!note) return;
  note.reminderAt = null; note.reminderDone = false;
  window.api.notes.save(notes); selectNote(note.id); closeModal(); showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Lembrete removido');
}
function requestNotificationPermission() { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); }
function checkReminders() {
  const now = Date.now();
  notes.forEach(n => {
    if (n.reminderAt && !n.reminderDone && new Date(n.reminderAt).getTime() <= now && !n.deletedAt) {
      n.reminderDone = true;
      if ('Notification' in window && Notification.permission === 'granted') new Notification('NovaPad lembrete', { body: n.title });
      else showToast('⏰ Lembrete: ' + n.title);
    }
  });
  window.api.notes.save(notes);
}
function formatReminder(v) { return new Date(v).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }); }


// -- Import ------------------------------------------------------------
function openImportModal() {
  const formats = [
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
  ];
  const btns = formats.map(f => 
    '<button class="export-btn" onclick="doImport(\'' + f.ext + '\')">' +
      '<span class="ext">' + f.icon + ' ' + f.ext + '</span>' +
      '<span class="desc">' + f.label + '</span>' +
    '</button>').join('');
  openModal(
    '<div class="modal-title">ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Å“ Importar documento</div>' +
    '<div class="modal-sub">Escolha o mesmo tipo de arquivo que o NovaPad exporta. O conteÃƒÆ’Ã‚Âºdo vira uma nova nota.</div>' +
    '<div class="export-grid">' + btns + '</div>' +
    '<div class="modal-actions"><button class="modal-close" onclick="openImageOcrModal()">OCR de imagem</button><button class="modal-close" onclick="openPdfOcrModal()">OCR de PDF</button></div>' +
    '<button class="modal-close" onclick="closeModal()">Fechar</button>'
  );
}

function openImageOcrModal() {
  imageOcrSession = null;
  openModal(`
    <div class="modal-title">${currentLanguage() === 'pt-BR' ? 'Extrair texto da imagem' : 'Extract text from image'}</div>
    <div class="modal-sub">${currentLanguage() === 'pt-BR' ? 'Leia texto impresso de uma foto ou print e transforme em nota editavel.' : 'Read printed text from a photo or screenshot and turn it into an editable note.'}</div>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Idioma do OCR' : 'OCR language'}</label>
    <select id="ocr-language" class="field-control">
      <option value="por">${currentLanguage() === 'pt-BR' ? 'Portugues' : 'Portuguese'}</option>
      <option value="eng">English</option>
      <option value="por+eng">${currentLanguage() === 'pt-BR' ? 'Portugues + English' : 'Portuguese + English'}</option>
    </select>
    <div class="modal-sub" style="margin:8px 0 0;">${currentLanguage() === 'pt-BR' ? 'O texto vai passar por uma limpeza automatica para reduzir quebras ruins e espacos extras.' : 'The text will go through automatic cleanup to reduce bad line breaks and extra spaces.'}</div>
    <label class="check-row"><input id="ocr-attach-image" type="checkbox" checked> ${currentLanguage() === 'pt-BR' ? 'Anexar a imagem na nota criada' : 'Attach the image to the created note'}</label>
    <div class="field-label">${currentLanguage() === 'pt-BR' ? 'Progresso' : 'Progress'}</div>
    <div id="ocr-progress-text" class="field-control" style="min-height:42px;display:flex;align-items:center;">${currentLanguage() === 'pt-BR' ? 'Aguardando imagem...' : 'Waiting for an image...'}</div>
    <div class="modal-actions">
      <button class="modal-close" onclick="closeModal()">${currentLanguage() === 'pt-BR' ? 'Cancelar' : 'Cancel'}</button>
      <button class="modal-close" onclick="chooseImageForOcr()">${currentLanguage() === 'pt-BR' ? 'Escolher imagem' : 'Choose image'}</button>
    </div>
  `);
}

function syncImageOcrSessionOptions() {
  if (!imageOcrSession) imageOcrSession = {};
  imageOcrSession.language = $('ocr-language')?.value || imageOcrSession.language || 'por';
  imageOcrSession.attachImage = $('ocr-attach-image')?.checked !== false;
}

function loadImageForCrop(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(currentLanguage() === 'pt-BR' ? 'Nao consegui abrir a imagem.' : 'Failed to open the image.'));
    img.src = dataUrl;
  });
}

async function chooseImageForOcr() {
  syncImageOcrSessionOptions();
  const filters = [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'] }];
  const filePath = await window.api.import.dialog({ filters });
  if (!filePath) return;
  try {
    setOcrProgress(currentLanguage() === 'pt-BR' ? 'Carregando imagem...' : 'Loading image...');
    const imageFile = await window.api.import.readImageData({ filePath });
    const image = await loadImageForCrop(imageFile.dataUrl);
    imageOcrSession = {
      ...imageOcrSession,
      file: imageFile,
      image,
      dataUrl: imageFile.dataUrl,
      naturalWidth: image.naturalWidth || image.width,
      naturalHeight: image.naturalHeight || image.height,
      selection: null,
      dragging: false,
    };
    openImageCropModal();
  } catch (error) {
    showToast(currentLanguage() === 'pt-BR' ? 'Falha ao carregar a imagem' : 'Failed to load image');
    setOcrProgress((currentLanguage() === 'pt-BR' ? 'Erro ao abrir imagem: ' : 'Image open error: ') + (error?.message || String(error)));
  }
}

function openImageCropModal() {
  if (!imageOcrSession?.image) return;
  openModal(`
    <div class="modal-title">${currentLanguage() === 'pt-BR' ? 'Recorte para OCR' : 'Crop before OCR'}</div>
    <div class="modal-sub">${currentLanguage() === 'pt-BR' ? 'Arraste na imagem para selecionar so a area que deve virar texto.' : 'Drag over the image to select only the area that should become text.'}</div>
    <div class="ocr-crop-shell">
      <div class="ocr-crop-toolbar">
        <div>
          <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Idioma do OCR' : 'OCR language'}</label>
          <select id="ocr-language" class="field-control">
            <option value="por" ${imageOcrSession.language === 'por' ? 'selected' : ''}>${currentLanguage() === 'pt-BR' ? 'Portugues' : 'Portuguese'}</option>
            <option value="eng" ${imageOcrSession.language === 'eng' ? 'selected' : ''}>English</option>
            <option value="por+eng" ${imageOcrSession.language === 'por+eng' ? 'selected' : ''}>${currentLanguage() === 'pt-BR' ? 'Portugues + English' : 'Portuguese + English'}</option>
          </select>
        </div>
        <div>
          <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Anexo na nota' : 'Attach to note'}</label>
          <label class="check-row"><input id="ocr-attach-image" type="checkbox" ${imageOcrSession.attachImage === false ? '' : 'checked'}> ${currentLanguage() === 'pt-BR' ? 'Anexar a area usada no OCR' : 'Attach the OCR crop to the note'}</label>
        </div>
      </div>
      <div class="ocr-crop-stage">
        <div class="ocr-crop-canvas-wrap">
          <canvas id="ocr-crop-canvas" class="ocr-crop-canvas"></canvas>
        </div>
        <div class="ocr-crop-meta">
          <span id="ocr-crop-size">${currentLanguage() === 'pt-BR' ? 'Sem recorte selecionado' : 'No crop selected'}</span>
          <span>${imageOcrSession.naturalWidth} x ${imageOcrSession.naturalHeight}px</span>
        </div>
        <div class="ocr-crop-hint">${currentLanguage() === 'pt-BR' ? 'Dica: se nao selecionar nada, o OCR usa a imagem inteira.' : 'Tip: if you do not select anything, OCR uses the full image.'}</div>
      </div>
      <div class="field-label">${currentLanguage() === 'pt-BR' ? 'Progresso' : 'Progress'}</div>
      <div id="ocr-progress-text" class="field-control" style="min-height:42px;display:flex;align-items:center;">${currentLanguage() === 'pt-BR' ? 'Selecione uma area e inicie o OCR.' : 'Select an area and start OCR.'}</div>
      <div class="ocr-crop-actions">
        <button class="modal-close secondary" onclick="openImageOcrModal()">${currentLanguage() === 'pt-BR' ? 'Voltar' : 'Back'}</button>
        <button class="modal-close secondary" onclick="chooseImageForOcr()">${currentLanguage() === 'pt-BR' ? 'Trocar imagem' : 'Change image'}</button>
        <button class="modal-close secondary" onclick="clearImageOcrSelection()">${currentLanguage() === 'pt-BR' ? 'Imagem inteira' : 'Use full image'}</button>
        <button class="modal-close" onclick="startImageOcrImport()">${currentLanguage() === 'pt-BR' ? 'Iniciar OCR' : 'Start OCR'}</button>
      </div>
    </div>
  `);
  modalBox.style.width = 'min(920px, calc(100vw - 48px))';
  attachImageCropCanvas();
  updateImageCropMeta();
}

function attachImageCropCanvas() {
  const canvas = $('ocr-crop-canvas');
  if (!canvas || !imageOcrSession?.image) return;
  const wrap = canvas.parentElement;
  const maxWidth = Math.min(820, Math.max(320, (wrap?.clientWidth || 820) - 2));
  const maxHeight = 420;
  const scale = Math.min(maxWidth / imageOcrSession.naturalWidth, maxHeight / imageOcrSession.naturalHeight, 1);
  imageOcrSession.displayScale = scale;
  canvas.width = Math.max(1, Math.round(imageOcrSession.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(imageOcrSession.naturalHeight * scale));

  const pointer = event => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(canvas.width, event.clientX - rect.left)),
      y: Math.max(0, Math.min(canvas.height, event.clientY - rect.top)),
    };
  };

  const finishSelection = () => {
    if (!imageOcrSession?.dragging) return;
    imageOcrSession.dragging = false;
    imageOcrSession.selection = normalizeCropRect(imageOcrSession.selection);
    if (imageOcrSession.selection && (imageOcrSession.selection.w < 8 || imageOcrSession.selection.h < 8)) {
      imageOcrSession.selection = null;
    }
    redrawImageCropCanvas();
    updateImageCropMeta();
  };

  canvas.onmousedown = event => {
    if (event.button !== 0) return;
    const point = pointer(event);
    imageOcrSession.dragging = true;
    imageOcrSession.selection = { x: point.x, y: point.y, w: 0, h: 0 };
    redrawImageCropCanvas();
  };
  canvas.onmousemove = event => {
    if (!imageOcrSession?.dragging || !imageOcrSession.selection) return;
    const point = pointer(event);
    imageOcrSession.selection.w = point.x - imageOcrSession.selection.x;
    imageOcrSession.selection.h = point.y - imageOcrSession.selection.y;
    redrawImageCropCanvas();
    updateImageCropMeta();
  };
  canvas.onmouseup = finishSelection;
  canvas.onmouseleave = finishSelection;
  redrawImageCropCanvas();
}

function normalizeCropRect(rect) {
  if (!rect) return null;
  const x = rect.w < 0 ? rect.x + rect.w : rect.x;
  const y = rect.h < 0 ? rect.y + rect.h : rect.y;
  return { x, y, w: Math.abs(rect.w), h: Math.abs(rect.h) };
}

function redrawImageCropCanvas() {
  const canvas = $('ocr-crop-canvas');
  if (!canvas || !imageOcrSession?.image) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageOcrSession.image, 0, 0, canvas.width, canvas.height);
  const rect = normalizeCropRect(imageOcrSession.selection);
  if (!rect) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeStyle = '#65f0b5';
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x + 1, rect.y + 1, Math.max(0, rect.w - 2), Math.max(0, rect.h - 2));
  ctx.fillStyle = 'rgba(101,240,181,0.18)';
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function updateImageCropMeta() {
  const node = $('ocr-crop-size');
  if (!node || !imageOcrSession) return;
  const rect = normalizeCropRect(imageOcrSession.selection);
  if (!rect) {
    node.textContent = currentLanguage() === 'pt-BR' ? 'Sem recorte selecionado' : 'No crop selected';
    return;
  }
  const scale = imageOcrSession.displayScale || 1;
  const width = Math.max(1, Math.round(rect.w / scale));
  const height = Math.max(1, Math.round(rect.h / scale));
  node.textContent = (currentLanguage() === 'pt-BR' ? 'Area selecionada: ' : 'Selected area: ') + `${width} x ${height}px`;
}

function clearImageOcrSelection() {
  if (!imageOcrSession) return;
  imageOcrSession.selection = null;
  redrawImageCropCanvas();
  updateImageCropMeta();
  setOcrProgress(currentLanguage() === 'pt-BR' ? 'A imagem inteira sera usada no OCR.' : 'The full image will be used for OCR.');
}

function buildImageOcrDataUrl() {
  if (!imageOcrSession?.image) return null;
  const rect = normalizeCropRect(imageOcrSession.selection);
  if (!rect) return imageOcrSession.dataUrl;
  const scale = imageOcrSession.displayScale || 1;
  const sx = Math.max(0, Math.round(rect.x / scale));
  const sy = Math.max(0, Math.round(rect.y / scale));
  const sw = Math.max(1, Math.round(rect.w / scale));
  const sh = Math.max(1, Math.round(rect.h / scale));
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = sw;
  cropCanvas.height = sh;
  cropCanvas.getContext('2d').drawImage(imageOcrSession.image, sx, sy, sw, sh, 0, 0, sw, sh);
  return cropCanvas.toDataURL('image/png');
}

function openPdfOcrModal() {
  openModal(`
    <div class="modal-title">${currentLanguage() === 'pt-BR' ? 'Extrair texto de PDF escaneado' : 'Extract text from scanned PDF'}</div>
    <div class="modal-sub">${currentLanguage() === 'pt-BR' ? 'Converte paginas escaneadas de um PDF em texto editavel usando OCR local.' : 'Converts scanned PDF pages into editable text using local OCR.'}</div>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Idioma do OCR' : 'OCR language'}</label>
    <select id="ocr-language" class="field-control">
      <option value="por">${currentLanguage() === 'pt-BR' ? 'Portugues' : 'Portuguese'}</option>
      <option value="eng">English</option>
      <option value="por+eng">${currentLanguage() === 'pt-BR' ? 'Portugues + English' : 'Portuguese + English'}</option>
    </select>
    <div class="modal-sub" style="margin:8px 0 0;">${currentLanguage() === 'pt-BR' ? 'O texto vai passar por limpeza automatica depois do OCR.' : 'The text will go through automatic cleanup after OCR.'}</div>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Escala de leitura' : 'Render scale'}</label>
    <select id="pdf-ocr-scale" class="field-control">
      <option value="1.5">1.5x</option>
      <option value="2" selected>2x</option>
      <option value="2.5">2.5x</option>
    </select>
    <label class="field-label">${currentLanguage() === 'pt-BR' ? 'Paginas para ler' : 'Pages to read'}</label>
    <input id="pdf-ocr-pages" class="field-control" placeholder="${currentLanguage() === 'pt-BR' ? 'Todas ou 1,3,5-8' : 'All or 1,3,5-8'}" value="">
    <label class="check-row"><input id="pdf-ocr-attach-thumbs" type="checkbox" checked> ${currentLanguage() === 'pt-BR' ? 'Anexar miniaturas das paginas na nota criada' : 'Attach page thumbnails to the created note'}</label>
    <div class="field-label">${currentLanguage() === 'pt-BR' ? 'Progresso' : 'Progress'}</div>
    <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin:0 0 8px;">
      <div id="ocr-progress-bar" style="height:100%;width:0;background:linear-gradient(90deg,#65f0b5,#4da3ff);transition:width .18s ease;"></div>
    </div>
    <div id="ocr-progress-text" class="field-control" style="min-height:42px;display:flex;align-items:center;">${currentLanguage() === 'pt-BR' ? 'Aguardando PDF...' : 'Waiting for a PDF...'}</div>
    <div class="modal-actions">
      <button class="modal-close" onclick="closeModal()">${currentLanguage() === 'pt-BR' ? 'Cancelar' : 'Cancel'}</button>
      <button class="modal-close" onclick="startPdfOcrImport()">${currentLanguage() === 'pt-BR' ? 'Escolher PDF' : 'Choose PDF'}</button>
    </div>
  `);
}

function setOcrProgress(text, percent = null) {
  const node = $('ocr-progress-text');
  if (node) node.textContent = text;
  const bar = $('ocr-progress-bar');
  if (bar && percent != null) {
    const value = Math.max(0, Math.min(100, Number(percent) || 0));
    bar.style.width = value + '%';
  }
}

function cleanOcrText(rawText) {
  const lines = String(rawText || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map(line => line.trim());

  const cleaned = [];
  for (const line of lines) {
    if (!line) {
      if (cleaned[cleaned.length - 1] !== '') cleaned.push('');
      continue;
    }

    const isBullet = /^([-*?]|[0-9]+[.)])\s+/.test(line);
    const currentLooksContinuation = !isBullet && /^[a-z?-?0-9(]/i.test(line);
    const previous = cleaned[cleaned.length - 1] || '';
    const previousLooksOpen = previous && !/[.!?:;)]$/.test(previous);
    const previousIsShort = previous.length > 0 && previous.length < 48;
    const previousHasHyphenBreak = /-$/.test(previous);

    if (previous && previous !== '' && currentLooksContinuation && (previousHasHyphenBreak || (previousLooksOpen && previousIsShort))) {
      cleaned[cleaned.length - 1] = previousHasHyphenBreak
        ? previous.slice(0, -1) + line
        : previous + ' ' + line;
      continue;
    }

    cleaned.push(line);
  }

  return cleaned
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

function makePdfThumbnailDataUrl(sourceCanvas, maxWidth = 440) {
  const width = sourceCanvas.width || 1;
  const height = sourceCanvas.height || 1;
  const scale = Math.min(1, maxWidth / width);
  const thumb = document.createElement('canvas');
  thumb.width = Math.max(1, Math.round(width * scale));
  thumb.height = Math.max(1, Math.round(height * scale));
  const ctx = thumb.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0, thumb.width, thumb.height);
  return thumb.toDataURL('image/jpeg', 0.88);
}

async function startImageOcrImport() {
  if (!window.Tesseract) {
    showToast(currentLanguage() === 'pt-BR' ? 'OCR indisponivel no momento' : 'OCR is not available right now');
    return;
  }
  if (!imageOcrSession?.file || !imageOcrSession?.image) {
    showToast(currentLanguage() === 'pt-BR' ? 'Escolha uma imagem primeiro' : 'Choose an image first');
    return;
  }
  syncImageOcrSessionOptions();
  const language = imageOcrSession.language || 'por';
  const attachImage = imageOcrSession.attachImage !== false;
  try {
    const sourceDataUrl = buildImageOcrDataUrl();
    setOcrProgress(currentLanguage() === 'pt-BR' ? 'Preparando area para OCR...' : 'Preparing crop for OCR...');
    const result = await window.Tesseract.recognize(sourceDataUrl, language, {
      logger: message => {
        if (message.status === 'recognizing text') {
          const percent = Math.round((message.progress || 0) * 100);
          setOcrProgress((currentLanguage() === 'pt-BR' ? 'Lendo texto da imagem: ' : 'Reading text from image: ') + percent + '%');
        } else if (message.status) {
          setOcrProgress(message.status);
        }
      },
    });
    setOcrProgress(currentLanguage() === 'pt-BR' ? 'Organizando texto reconhecido...' : 'Cleaning recognized text...');
    const recognizedText = cleanOcrText(result?.data?.text || '');
    if (!recognizedText) {
      setOcrProgress(currentLanguage() === 'pt-BR' ? 'Nenhum texto encontrado na imagem.' : 'No text was found in the image.');
      return;
    }
    const firstLine = recognizedText.split(/\r?\n/).find(Boolean) || imageOcrSession.file.title || 'OCR import';
    const note = createNote(firstLine.slice(0, 60), 'pessoal', recognizedText);
    if (attachImage) {
      const imageId = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      note.images = [{ id: imageId, name: imageOcrSession.file.name || (imageOcrSession.file.title + '.png'), dataUrl: sourceDataUrl }];
      note.content = `![${note.images[0].name}](${imageToken(imageId)})\n\n${recognizedText}`;
    }
    note.modified = nowStr();
    notes.unshift(note);
    window.api.notes.save(notes);
    imageOcrSession = null;
    closeModal();
    renderNotesList();
    selectNote(note.id);
    showToast(currentLanguage() === 'pt-BR' ? 'Texto extraido da imagem' : 'Text extracted from image');
  } catch (error) {
    setOcrProgress((currentLanguage() === 'pt-BR' ? 'Erro no OCR: ' : 'OCR error: ') + (error?.message || String(error)));
    showToast(currentLanguage() === 'pt-BR' ? 'Falha ao ler a imagem' : 'Failed to read image');
  }
}

async function loadPdfJsLib() {
  const pdfjs = await import('../node_modules/pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs';
  return pdfjs;
}

async function startPdfOcrImport() {
  if (!window.Tesseract) {
    showToast(currentLanguage() === 'pt-BR' ? 'OCR indisponivel no momento' : 'OCR is not available right now');
    return;
  }
  const filters = [{ name: 'PDF', extensions: ['pdf'] }];
  const filePath = await window.api.import.dialog({ filters });
  if (!filePath) return;
  const language = $('ocr-language')?.value || 'por';
  const scale = Number($('pdf-ocr-scale')?.value || 2);
  const selectedPagesInput = $('pdf-ocr-pages')?.value || '';
  const attachThumbs = $('pdf-ocr-attach-thumbs')?.checked !== false;
  try {
    setOcrProgress(currentLanguage() === 'pt-BR' ? 'Carregando PDF...' : 'Loading PDF...', 2);
    const pdfFile = await window.api.import.readBinary({ filePath });
    const pdfjs = await loadPdfJsLib();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfFile.bytes) }).promise;
    const selectedPages = parsePdfPageSelection(selectedPagesInput, pdf.numPages);
    const pageBlocks = [];
    const noteImages = [];
    for (let index = 0; index < selectedPages.length; index++) {
      const pageNumber = selectedPages[index];
      const basePercent = (index / selectedPages.length) * 100;
      setOcrProgress((currentLanguage() === 'pt-BR' ? 'Renderizando pagina ' : 'Rendering page ') + pageNumber + '/' + pdf.numPages, basePercent);
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png');
      let thumbTokenLine = '';
      if (attachThumbs) {
        const imageId = 'pdf-' + Date.now() + '-' + pageNumber + '-' + Math.random().toString(36).slice(2, 7);
        const imageName = `${pdfFile.title || 'pdf'}-page-${pageNumber}.jpg`;
        noteImages.push({ id: imageId, name: imageName, dataUrl: makePdfThumbnailDataUrl(canvas) });
        thumbTokenLine = `![${imageName}](${imageToken(imageId)})\n\n`;
      }
      const result = await window.Tesseract.recognize(dataUrl, language, {
        logger: message => {
          if (message.status === 'recognizing text') {
            const percent = Math.round((message.progress || 0) * 100);
            const overall = ((index + ((message.progress || 0))) / selectedPages.length) * 100;
            setOcrProgress((currentLanguage() === 'pt-BR'
              ? `Lendo pagina ${pageNumber}/${pdf.numPages} (${index + 1}/${selectedPages.length}): `
              : `Reading page ${pageNumber}/${pdf.numPages} (${index + 1}/${selectedPages.length}): `) + percent + '%', overall);
          } else if (message.status) {
            setOcrProgress(message.status, basePercent);
          }
        },
      });
      setOcrProgress(currentLanguage() === 'pt-BR'
        ? `Organizando texto da pagina ${pageNumber}/${pdf.numPages}...`
        : `Cleaning text from page ${pageNumber}/${pdf.numPages}...`, ((index + 1) / selectedPages.length) * 100);
      const cleaned = cleanOcrText(result?.data?.text || '');
      if (cleaned || thumbTokenLine) {
        pageBlocks.push(`## ${currentLanguage() === 'pt-BR' ? 'Pagina' : 'Page'} ${pageNumber}\n\n${thumbTokenLine}${cleaned}`.trim());
      }
    }
    const recognizedText = pageBlocks.join('\n\n').trim();
    if (!recognizedText) {
      setOcrProgress(currentLanguage() === 'pt-BR' ? 'Nenhum texto encontrado no PDF.' : 'No text was found in the PDF.', 100);
      return;
    }
    setOcrProgress(currentLanguage() === 'pt-BR' ? 'Criando nota...' : 'Creating note...', 100);
    const note = createNote((pdfFile.title || 'PDF OCR').slice(0, 60), 'pessoal', recognizedText);
    if (noteImages.length) note.images = noteImages;
    note.modified = nowStr();
    notes.unshift(note);
    window.api.notes.save(notes);
    closeModal();
    renderNotesList();
    selectNote(note.id);
    showToast(currentLanguage() === 'pt-BR' ? 'Texto extraido do PDF' : 'Text extracted from PDF');
  } catch (error) {
    setOcrProgress((currentLanguage() === 'pt-BR' ? 'Erro no OCR do PDF: ' : 'PDF OCR error: ') + (error?.message || String(error)));
    showToast(currentLanguage() === 'pt-BR' ? 'Falha ao ler o PDF' : 'Failed to read PDF');
  }
}

async function doImport(ext) {
  const labels = {
    '.txt': 'Texto Plano', '.md': 'Markdown', '.docx': 'Word', '.pdf': 'PDF',
    '.xlsx': 'Excel', '.json': 'JSON', '.csv': 'CSV', '.html': 'HTML'
  };
  const filters = [{ name: labels[ext] || ext.toUpperCase().replace('.', ''), extensions: [ext.replace('.', '')] }];
  const filePath = await window.api.import.dialog({ filters });
  if (!filePath) return;
  try {
    const imported = await window.api.import.read({ filePath });
    const note = createNote(imported.title || 'Nota importada', imported.tag || 'pessoal', imported.content || '');
    note.importedFrom = imported.ext || ext;
    note.modified = nowStr();
    notes.unshift(note);
    window.api.notes.save(notes);
    closeModal();
    renderNotesList();
    selectNote(note.id);
    showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Documento importado');
  } catch (e) {
    showToast('Ã¢Å“â€” Erro ao importar: ' + e.message);
  }
}

// ────────────────────────────────────────────────────────────
function openExportModal() {
  const note = getNote(activeNoteId);
  if (!note) return showToast('ÃƒÂ¢Ã…Â¡Ã‚Â  Selecione uma nota');
  const formats = [
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
  ];
  const btns = formats.map(f => `
    <button class="export-btn" onclick="doExport('${f.ext}')">
      <span class="ext">${f.icon} ${f.ext}</span>
      <span class="desc">${f.label}</span>
    </button>`).join('');
  openModal(`
    <div class="modal-title">ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Ëœ Exportar Nota</div>
// ────────────────────────────────────────────────────────────
    <div class="export-grid">${btns}</div>
    <button class="modal-close" onclick="closeModal()">Fechar</button>
  `);
}

async function doExport(ext) {
  const note = getNote(activeNoteId);
  if (!note) return;
  const safeName = note.title.replace(/[^\p{L}\p{N}\s_-]/gu, '').trim() || 'nota';
  const filters = [{ name: ext.toUpperCase().replace('.',''), extensions: [ext.replace('.','')] }];
  const filePath = await window.api.export.dialog({ defaultName: safeName + ext, filters });
  if (!filePath) return;

  try {
    switch (ext) {
      case '.txt':  await exportTxt(note, filePath); break;
      case '.md':   await exportMd(note, filePath);  break;
      case '.json': await exportJson(note, filePath); break;
      case '.csv':  await exportCsv(note, filePath);  break;
      case '.html': await exportHtml(note, filePath); break;
      case '.docx': await exportDocx(note, filePath); break;
      case '.xlsx': await exportXlsx(note, filePath); break;
      case '.pdf':  await exportPdf(note, filePath);  break;
    }
    closeModal();
    showToast(`ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Exportado como ${ext}`);
  } catch(e) {
    showToast('Ã¢Å“â€” Erro ao exportar: ' + e.message);
  }
}

async function exportTxt(note, path) {
  const body = resolveNoteImageTokens(note, note.content);
  const content = `${note.title}\n${'='.repeat(note.title.length)}\nTag: ${note.tag} | Criado: ${note.created} | Modificado: ${note.modified}\n\n${body}`;
  await window.api.export.write({ filePath: path, content });
}

async function exportMd(note, path) {
  let c = resolveNoteImageTokens(note, note.content).replace(/^\[ \]/gm, '- [ ]').replace(/^\[x\]/gm, '- [x]');
  const content = `# ${note.title}\n\n> **Tag:** ${note.tag} | **Criado:** ${note.created} | **Modificado:** ${note.modified}\n\n---\n\n${c}`;
  await window.api.export.write({ filePath: path, content });
}

async function exportJson(note, path) {
  const resolvedContent = resolveNoteImageTokens(note, note.content);
  const data = {
    novapad_export: true,
    exported_at: new Date().toISOString(),
    note: {
      title: note.title, tag: note.tag,
      created: note.created, modified: note.modified,
      word_count: note.content.trim().split(/\s+/).length,
      char_count: note.content.length,
      content: resolvedContent,
      lines: resolvedContent.split('\n'),
    }
  };
  await window.api.export.write({ filePath: path, content: JSON.stringify(data, null, 2) });
}

async function exportCsv(note, path) {
  const rows = [['#', 'Tipo', 'Conteudo']];
  resolveNoteImageTokens(note, note.content).split('\n').forEach((line, i) => {
    let tipo = 'Texto';
    let content = line;
    if (line.startsWith('[ ]')) { tipo = 'Tarefa'; content = line.slice(3).trim(); }
    else if (line.startsWith('[x]')) { tipo = 'Concluida'; content = line.slice(3).trim(); }
    else if (line.startsWith('-')) { tipo = 'Lista'; }
    else if (line.startsWith('#')) { tipo = 'Titulo'; }
    rows.push([i + 1, tipo, content]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  await window.api.export.write({ filePath: path, content: '\uFEFF' + csv });
}

async function exportHtml(note, path) {
  const tc = getTagMeta(note.tag);
  let body = resolveNoteImageTokens(note, note.content)
    .split('\n')
    .map(line => {
      if (line.startsWith('[ ]')) return `<li class="task open">☐ ${escHtml(line.slice(3).trim())}</li>`;
      if (line.startsWith('[x]')) return `<li class="task done">ÃƒÂ¢Ã‹Å“Ã¢â‚¬Ëœ ${escHtml(line.slice(3).trim())}</li>`;
      if (line.startsWith('- ')) return `<li>${escHtml(line.slice(2))}</li>`;
      if (line.startsWith('# ')) return `<h1>${escHtml(line.slice(2))}</h1>`;
      if (line.startsWith('## ')) return `<h2>${escHtml(line.slice(3))}</h2>`;
      if (!line.trim()) return '<br>';
      return `<p>${escHtml(line)}</p>`;
    }).join('\n');

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${escHtml(note.title)}</title>
<style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:0 24px;color:#1a1a20;line-height:1.8}
h1{font-size:2em;margin-bottom:4px}h2{font-size:1.4em}.meta{color:#888;font-size:.9em;margin-bottom:24px}
hr{border:none;border-top:1px solid #ddd;margin:24px 0}.tag{display:inline-block;background:${tc.bg}33;color:${tc.bg};padding:2px 12px;border-radius:99px;font-size:.85em}
.task{list-style:none;margin:4px 0}.done{color:#22c55e;text-decoration:line-through}li{margin:4px 0}
</style></head><body>
<h1>${escHtml(note.title)}</h1>
<p class="meta"><span class="tag">${note.tag}</span> &nbsp; Criado: ${note.created} Ãƒâ€šÃ‚Â· Modificado: ${note.modified}</p>
<hr>${body}</body></html>`;
  await window.api.export.write({ filePath: path, content: html });
}

// DOCX export (pure JS - no external lib)
async function exportDocx(note, path) {
  // Build minimal OOXML docx in-memory
  const lines = note.content.split('\n');
  const paras = lines.map(line => {
    let text = line, style = 'Normal', color = null, strike = false;
    if (line.startsWith('[ ]')) { text = '☐ ' + line.slice(3).trim(); color = 'FCD34D'; }
    else if (line.startsWith('[x]')) { text = 'ÃƒÂ¢Ã‹Å“Ã¢â‚¬Ëœ ' + line.slice(3).trim(); color = '22C55E'; strike = true; }
    else if (line.startsWith('# ')) { text = line.slice(2); style = 'Heading1'; }
    else if (line.startsWith('## ')) { text = line.slice(3); style = 'Heading2'; }

    const rPr = [
      color ? `<w:color w:val="${color}"/>` : '',
      strike ? '<w:strike/>' : '',
    ].join('');

    return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r>${rPr ? `<w:rPr>${rPr}</w:rPr>` : ''}<w:t xml:space="preserve">${xmlEsc(text)}</w:t></w:r></w:p>`;
  });

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>${xmlEsc(note.title)}</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="18"/></w:rPr><w:t>Tag: ${xmlEsc(note.tag)} | Criado: ${xmlEsc(note.created)} | Modificado: ${xmlEsc(note.modified)}</w:t></w:r></w:p>
<w:p/>
${paras.join('\n')}
</w:body></w:document>`;

  const zip = await buildDocx(docXml);
  await window.api.export.writeBinary({ filePath: path, buffer: Array.from(zip) });
}

// XLSX export (pure JS OOXML)
async function exportXlsx(note, path) {
  const lines = note.content.split('\n');
  const rows = [
    sharedStr => `<row r="1"><c r="A1" t="inlineStr" s="2"><is><t>${xmlEsc(note.title)}</t></is></c></row>`,
    sharedStr => `<row r="2"><c r="A2" t="inlineStr" s="3"><is><t>Tag: ${xmlEsc(note.tag)} | ${xmlEsc(note.created)}</t></is></c></row>`,
    sharedStr => `<row r="3"><c r="A3" t="inlineStr"><is><t></t></is></c></row>`,
    sharedStr => `<row r="4"><c r="A4" t="inlineStr" s="4"><is><t>#</t></is></c><c r="B4" t="inlineStr" s="4"><is><t>ConteÃƒÆ’Ã‚Âºdo</t></is></c><c r="C4" t="inlineStr" s="4"><is><t>Tipo</t></is></c></row>`,
  ];

  lines.forEach((line, i) => {
    const rowNum = i + 5;
    let tipo = 'Texto', content = line;
    if (line.startsWith('[ ]'))  { tipo = 'Tarefa';    content = line.slice(3).trim(); }
    else if (line.startsWith('[x]')) { tipo = 'ConcluÃƒÆ’Ã‚Â­da'; content = line.slice(3).trim(); }
    else if (line.startsWith('-')) tipo = 'Lista';
    else if (line.startsWith('#')) tipo = 'TÃƒÆ’Ã‚Â­tulo';
    rows.push(() => `<row r="${rowNum}"><c r="A${rowNum}" t="inlineStr"><is><t>${i+1}</t></is></c><c r="B${rowNum}" t="inlineStr"><is><t>${xmlEsc(content)}</t></is></c><c r="C${rowNum}" t="inlineStr"><is><t>${xmlEsc(tipo)}</t></is></c></row>`);
  });

  const sheetXml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${rows.map(f => f()).join('\n')}</sheetData>
<cols><col min="1" max="1" width="6"/><col min="2" max="2" width="60"/><col min="3" max="3" width="14"/></cols>
</worksheet>`;

  const zip = await buildXlsx(sheetXml);
  await window.api.export.writeBinary({ filePath: path, buffer: Array.from(zip) });
}

// PDF export (pure JS - manual PDF generation)
async function exportPdf(note, path) {
  const lines = note.content.split('\n');
  let y = 750;
  const margin = 60;
  const pageH = 842;
  const pageW = 595;
  const lineH = 18;
  let pdfContent = '';

  function addText(text, x, size, bold, color) {
    const r = parseInt(color?.slice(0,2)||'1A',16)/255;
    const g = parseInt(color?.slice(2,4)||'1A',16)/255;
    const b = parseInt(color?.slice(4,6)||'20',16)/255;
    pdfContent += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg\n`;
    pdfContent += `BT /${bold?'Helvetica-Bold':'Helvetica'} ${size} Tf ${x} ${y} Td (${pdfEsc(text)}) Tj ET\n`;
  }

  // Title
  addText(note.title, margin, 20, true, '1A1A20');
  y -= 28;
  addText(`Tag: ${note.tag}  |  ${note.created}  |  ${note.modified}`, margin, 9, false, '888888');
  y -= 14;
  pdfContent += `0.85 0.85 0.85 RG 1 w ${margin} ${y} m ${pageW - margin} ${y} l S\n`;
  y -= 20;

  for (const line of lines) {
    if (y < 60) { y = 780; } // simple page break
    if (!line.trim()) { y -= lineH / 2; continue; }
    if (line.startsWith('[ ]')) {
      addText('☐  ' + line.slice(3).trim(), margin, 11, false, '1A1814');
    } else if (line.startsWith('[x]')) {
      addText('ÃƒÂ¢Ã‹Å“Ã¢â‚¬Ëœ  ' + line.slice(3).trim(), margin, 11, false, '22C55E');
    } else if (line.startsWith('# ')) {
      addText(line.slice(2), margin, 16, true, '1A1814');
      y -= 4;
    } else if (line.startsWith('## ')) {
      addText(line.slice(3), margin, 13, true, '1A1814');
    } else {
      // wrap long lines
      const words = line.split(' ');
      let currentLine = '';
      for (const word of words) {
        if ((currentLine + ' ' + word).length > 80) {
          addText(currentLine, margin, 11, false, '1A1814');
          y -= lineH;
          currentLine = word;
          if (y < 60) { y = 780; }
        } else {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        }
      }
      if (currentLine) { addText(currentLine, margin, 11, false, '1A1814'); }
    }
    y -= lineH;
  }

  const pdfStr = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 ${pageW} ${pageH}]/Parent 2 0 R/Resources<</Font<</Helvetica<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>/Helvetica-Bold<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>>>>>/Contents 4 0 R>>endobj
4 0 obj<</Length ${pdfContent.length}>>
stream
${pdfContent}
endstream
endobj
xref
0 5
0000000000 65535 f 
trailer<</Size 5/Root 1 0 R>>
startxref
9
%%EOF`;

  await window.api.export.write({ filePath: path, content: pdfStr });
}

// ────────────────────────────────────────────────────────────
async function buildDocx(docXml) {
  const files = {
    '[Content_Types].xml': `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    '_rels/.rels': `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    'word/document.xml': docXml,
    'word/_rels/document.xml.rels': `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`,
  };
  return buildZip(files);
}

async function buildXlsx(sheetXml) {
  const files = {
    '[Content_Types].xml': `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/></Types>`,
    '_rels/.rels': `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    'xl/workbook.xml': `<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="NovaPad" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    'xl/_rels/workbook.xml.rels': `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
    'xl/worksheets/sheet1.xml': sheetXml,
  };
  return buildZip(files);
}

function buildZip(files) {
  // Minimal ZIP implementation
  const enc = new TextEncoder();
  const parts = [];
  const centralDir = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = enc.encode(name);
    const dataBytes = enc.encode(content);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);
    view.setUint32(0, 0x04034b50, true); // signature
    view.setUint16(4, 20, true);  // version needed
    view.setUint16(6, 0, true);   // flags
    view.setUint16(8, 0, true);   // compression (store)
    view.setUint16(10, 0, true);  // mod time
    view.setUint16(12, 0, true);  // mod date
    const crc = crc32(dataBytes);
    view.setUint32(14, crc, true);
    view.setUint32(18, dataBytes.length, true);
    view.setUint32(22, dataBytes.length, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true); cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true); cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true); cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true); cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);

    parts.push(localHeader, dataBytes);
    centralDir.push(central);
    offset += localHeader.length + dataBytes.length;
  }

  const centralBytes = concat(centralDir);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
  ev.setUint16(8, centralDir.length, true);
  ev.setUint16(10, centralDir.length, true);
  ev.setUint32(12, centralBytes.length, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return concat([...parts, centralBytes, eocd]);
}

function concat(arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const a of arrays) { out.set(a, pos); pos += a.length; }
  return out;
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ────────────────────────────────────────────────────────────
function openVersionsModal() {
  const note = getNote(activeNoteId);
  if (!note) return showToast('? Selecione uma nota');
  const vers = note.versions || [];
  const list = vers.length === 0
    ? '<div class="version-item"><div class="version-preview">Nenhuma vers?o salva ainda.</div></div>'
    : vers.map((v, i) => `
        <div class="version-item" onclick="restoreVersion(${i})">
          <div class="version-date">${escHtml(v.date || '')}</div>
          <div class="version-preview">${escHtml(String(v.content || '').slice(0, 80))}...</div>
        </div>`).join('');
  openModal(`
    <div class="modal-title">Hist?rico de vers?es</div>
    <div class="modal-sub">Clique em uma vers?o para restaurar</div>
    <div class="versions-list">${list}</div>
    <button class="modal-close" onclick="closeModal()">Fechar</button>
  `);
}
function restoreVersion(index) {
  const note = getNote(activeNoteId);
  if (!note || !note.versions[index]) return;
  setEditorValue(note.versions[index].content || '', true);
  scheduleSave();
  closeModal();
// ────────────────────────────────────────────────────────────
}

// ────────────────────────────────────────────────────────────
function openTagModal() {
  const note = getNote(activeNoteId);
  if (!note) return;
  const opts = getAllTags().map(tag => {
    const tc = getTagMeta(tag);
    return `<button class="tag-option ${note.tag === tag ? 'selected' : ''}"
      style="background:${tc.bg}33;color:${tc.bg};border-color:${note.tag===tag?tc.bg:'transparent'}"
      onclick="setNoteTag(decodeURIComponent('${encodeURIComponent(tag)}'))">${escHtml(formatTagLabel(tag))}</button>`;
  }).join('');
  openModal(`
// ────────────────────────────────────────────────────────────
    <div class="modal-sub">Escolha a categoria da nota:</div>
    <div class="tag-grid">${opts}</div>
    <button class="modal-close" onclick="openTagsManager()">Gerenciar tags</button>
    <button class="modal-close" onclick="closeModal()">Cancelar</button>
  `);
}

function setNoteTag(tag) {
  const note = getNote(activeNoteId);
  if (!note) return;
  note.tag = tag;
  const tc = getTagMeta(tag);
  btnChangeTag.textContent = formatTagLabel(tag);
  btnChangeTag.style.background = tc.bg + '33';
  btnChangeTag.style.color = tc.bg;
  window.api.notes.save(notes);
  renderNotesList();
  closeModal();
  showToast('ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Tag alterada');
}

// ────────────────────────────────────────────────────────────
function openTagsManager() {
  const rows = getAllTags().map(tag => {
    const tc = getTagMeta(tag);
    const isDefault = Object.prototype.hasOwnProperty.call(TAG_COLORS, tag);
    return `
      <div class="tag-row">
        <div>
          <b>${escHtml(formatTagLabel(tag))}</b>
          <div class="version-preview">${notes.filter(note => note.tag === tag && !note.deletedAt).length} notas</div>
        </div>
        <span class="tag-icon-preview">${escHtml(tc.icon || '-')}</span>
        <span class="tag-swatch" style="background:${tc.bg}"></span>
        ${isDefault ? '<span class="version-preview">padrao</span>' : `<button class="modal-close btn-danger" onclick="deleteCustomTag(decodeURIComponent('${encodeURIComponent(tag)}'))">Remover</button>`}
      </div>`;
  }).join('');
  openModal(`
    <div class="modal-title">Tags personalizadas</div>
    <div class="modal-sub">Crie categorias com cor propria para organizar suas notas.</div>
    ${rows}
    <label class="field-label">Nova tag</label>
    <div class="tag-create-grid">
      <input id="new-tag-name" class="field-control" placeholder="Ex: clientes">
      <input id="new-tag-icon" class="field-control" placeholder="Icone" maxlength="3">
      <input id="new-tag-color" class="field-control" type="color" value="#6ee7b7" style="height:44px;padding:5px;">
    </div>
    <div class="modal-actions">
      <button class="modal-close" onclick="addCustomTag()">Adicionar tag</button>
      <button class="modal-close" onclick="closeModal()">Fechar</button>
    </div>
  `);
}

function addCustomTag() {
  const name = normalizeTagName($('new-tag-name')?.value).replace(/[<>"'`]/g, '');
  const icon = normalizeTagIcon($('new-tag-icon')?.value);
  const bg = $('new-tag-color')?.value || '#6ee7b7';
  if (!name) return showToast('Informe o nome da tag');
  if (getAllTags().some(tag => tag.toLowerCase() === name.toLowerCase())) return showToast('Essa tag ja existe');
  settings.custom_tags.push({ name, bg, icon, text: '#0E0E12' });
  window.api.settings.save(settings);
  renderTagsBar();
  renderNotesList();
  openTagsManager();
  showToast('Tag criada');
}

function deleteCustomTag(tag) {
  settings.custom_tags = getCustomTags().filter(item => normalizeTagName(item.name) !== tag);
  notes.forEach(note => { if (note.tag === tag) note.tag = 'pessoal'; });
  if (activeTag === tag) activeTag = null;
  window.api.settings.save(settings);
  window.api.notes.save(notes);
  renderTagsBar();
  renderNotesList();
  openTagsManager();
  showToast('Tag removida');
}

function escHtml(str) {
  return repairText(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function xmlEsc(str) {
  return repairText(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function pdfEsc(str) {
  return repairText(str).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E]/g,' ');
}

function moveActiveToTrash() {
  const selected = filteredNotes().filter(note => selectedNoteIds.has(note.id));
  if (selected.length) {
    const restoreMode = notesView === 'trash';
    selected.forEach(note => {
      note.deletedAt = restoreMode ? null : new Date().toISOString();
    });
    selectedNoteIds.clear();
    window.api.notes.save(notes);
    renderNotesList();
    const next = filteredNotes()[0];
    if (next) selectNote(next.id);
    showToast(restoreMode ? `${selected.length} notas restauradas` : `${selected.length} notas enviadas para lixeira`);
    emitPluginEvent('note:trash-changed', {
      bulk: true,
      count: selected.length,
      restored: restoreMode,
    });
    return;
  }
  const note = getNote(activeNoteId);
  if (!note) return;
  if (note.deletedAt) {
    note.deletedAt = null;
    showToast('Nota restaurada');
  } else {
    note.deletedAt = new Date().toISOString();
    showToast('Nota enviada para lixeira por 30 dias');
  }
  window.api.notes.save(notes);
  renderNotesList();
  const next = filteredNotes()[0];
  if (next) selectNote(next.id);
  emitPluginEvent('note:trash-changed', {
    noteId: note.id,
    title: note.title,
    deleted: Boolean(note.deletedAt),
  });
}

let activeResize = null;

function beginPaneResize(type, event) {
  event.preventDefault();
  activeResize = { type };
  document.body.classList.add('resizing-panels');
}

function handlePaneResize(event) {
  if (!activeResize) return;
  if (activeResize.type === 'sidebar') {
    const left = appShell?.getBoundingClientRect().left || 0;
    settings.sidebar_width = clamp(event.clientX - left, 280, 380);
  } else if (activeResize.type === 'preview') {
    if (!previewVisible) return;
    const rect = editorArea.getBoundingClientRect();
    const minimapWidth = (settings.minimap === false || focusMode) ? 0 : clamp(Number(settings.minimap_width) || 120, 80, 220);
    const nextWidth = rect.right - event.clientX - minimapWidth - 6;
    settings.preview_width = clamp(nextWidth, 280, Math.max(320, rect.width - minimapWidth - 240));
  } else if (activeResize.type === 'minimap') {
    if (settings.minimap === false || focusMode) return;
    const rect = editorArea.getBoundingClientRect();
    settings.minimap_width = clamp(rect.right - event.clientX, 80, 220);
  }
  applyLayoutSettings();
}

function endPaneResize() {
  if (!activeResize) return;
  activeResize = null;
  document.body.classList.remove('resizing-panels');
  window.api.settings.save(settings);
}

// ────────────────────────────────────────────────────────────
minimapContent.addEventListener('click', jumpFromMinimap);
editorMediaBar?.addEventListener('click', e => {
  const imageId = e.target?.dataset?.imageRemove;
  if (imageId) removeImageFromActiveNote(imageId);
});
previewPane?.addEventListener('change', e => {
  const target = e.target?.closest?.('[data-checklist-index]');
  if (!target) return;
  e.preventDefault();
  toggleChecklistItem(Number(target.dataset.checklistIndex));
});
sidebarResizer?.addEventListener('mousedown', e => beginPaneResize('sidebar', e));
previewResizer?.addEventListener('mousedown', e => beginPaneResize('preview', e));
minimapResizer?.addEventListener('mousedown', e => beginPaneResize('minimap', e));
document.addEventListener('mousemove', handlePaneResize);
document.addEventListener('mouseup', endPaneResize);
editor?.addEventListener('input', requestSlashCommandSync);
editor?.addEventListener('keyup', requestSlashCommandSync);
workspaceSelect.addEventListener('change', () => { settings.currentWorkspace = workspaceSelect.value; notesView = 'active'; window.api.settings.save(settings); renderNotesList(); const first = filteredNotes()[0]; if (first) selectNote(first.id); else syncDiscordPresence(); });
noteTitleInput.addEventListener('input', scheduleSave);

$('btn-new-note').onclick = () => {
  notesView = 'active';
  const note = createNote();
  notes.unshift(note);
  window.api.notes.save(notes);
  renderNotesList();
  selectNote(note.id);
  emitPluginEvent('note:created', {
    noteId: note.id,
    title: note.title,
    tag: note.tag,
    workspace: note.workspace || 'General',
    source: 'new-note-button',
  });
};

searchInput.addEventListener('input', renderNotesList);
selectionToolbar?.addEventListener('mousedown', e => e.preventDefault());
selectionToolbar?.addEventListener('click', e => {
  const action = e.target.closest('[data-format-act]')?.dataset?.formatAct;
  if (!action) return;
  e.preventDefault();
  applySelectionFormatting(action);
});
slashCommandMenu?.addEventListener('mousedown', e => e.preventDefault());
slashCommandMenu?.addEventListener('click', e => {
  const id = e.target.closest('[data-slash-id]')?.dataset?.slashId;
  if (!id) return;
  e.preventDefault();
  runSlashCommand(id);
});
document.addEventListener('selectionchange', requestSelectionToolbarSync);
window.addEventListener('resize', requestSelectionToolbarSync);
window.addEventListener('scroll', requestSelectionToolbarSync, true);
compactNoteInput?.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    saveCompactNote();
  }
});
compactNoteInput?.addEventListener('mouseup', requestSelectionToolbarSync);
compactNoteInput?.addEventListener('keyup', requestSelectionToolbarSync);
compactNoteInput?.addEventListener('focus', requestSelectionToolbarSync);
compactNoteInput?.addEventListener('blur', () => scheduleSelectionToolbarSync(80));
compactNoteHandle?.addEventListener('mousedown', beginCompactNoteDrag);

$('btn-save-compact-note')?.addEventListener('click', saveCompactNote);
$('btn-clear-compact-note')?.addEventListener('click', clearCompactNote);
$('btn-close-compact-note')?.addEventListener('click', closeCompactNote);

menuTriggers.forEach(trigger => {
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    toggleToolbarMenu(trigger.closest('[data-menu]'));
  });
});

document.addEventListener('click', e => {
  if (isToolbarTarget(e.target)) return;
  if (!slashCommandMenu?.contains(e.target)) closeSlashMenu();
  const codeWrapper = codeEditor?.getWrapperElement?.();
  const clickedEditor = Boolean(codeWrapper?.contains(e.target) || e.target === compactNoteInput);
  if (!clickedEditor) hideSelectionToolbar();
  if (!e.target.closest('[data-menu]')) closeToolbarMenus(false);
  if (!e.target.closest('#note-context-menu')) closeNoteContextMenu();
});
document.addEventListener('mousemove', handleCompactNoteDrag);
document.addEventListener('mouseup', endCompactNoteDrag);
noteContextMenu?.addEventListener('click', e => {
  const action = e.target.closest('[data-context-act]')?.dataset?.contextAct;
  if (!action || !contextNoteId) return;
  e.stopPropagation();
  handleNoteContextAction(action, contextNoteId);
});

$('btn-toggle-sidebar').onclick = () => { toggleNovaSidebar(); closeToolbarMenus(); };
$('btn-today').onclick = () => { openTodayPanel(); closeToolbarMenus(); };
$('btn-command-palette').onclick = () => { openCommandPalette(); closeToolbarMenus(); };
$('btn-focus').onclick = () => { focusMode ? exitFocus() : enterFocus(); closeToolbarMenus(); };
$('btn-compact-note').onclick = () => { toggleCompactNote(); closeToolbarMenus(); };
$('btn-exit-focus').onclick = exitFocus;
$('btn-theme').onclick = () => { toggleTheme(); closeToolbarMenus(); };
$('btn-import').onclick = () => { openImportModal(); closeToolbarMenus(); };
$('btn-export').onclick = () => { openExportModal(); closeToolbarMenus(); };
$('btn-versions').onclick = () => { openVersionsModal(); closeToolbarMenus(); };
$('btn-settings').onclick = () => { openSettingsModal(); closeToolbarMenus(); };
$('btn-account').onclick = () => { openAccountModal(); closeToolbarMenus(); };
$('btn-note-color').onclick = () => { openColorModal(); closeToolbarMenus(); };
$('btn-tags-manager').onclick = () => { openTagsManager(); closeToolbarMenus(); };
$('btn-preview').onclick = () => { togglePreview(); closeToolbarMenus(); };
$('btn-internal-links').onclick = () => { toggleInternalLinksPanel(); closeToolbarMenus(false); };
$('btn-find-note').onclick = () => { openFindReplaceBar(false); closeToolbarMenus(false); };
$('btn-replace-note').onclick = () => { openFindReplaceBar(true); closeToolbarMenus(false); };
$('btn-template').onclick = () => { openTemplateModal(); closeToolbarMenus(); };
$('btn-library').onclick = () => { openLibraryModal(); closeToolbarMenus(); };
$('btn-auto-title').onclick = () => { generateAutomaticTitle(); closeToolbarMenus(); };
$('btn-clarity').onclick = () => { improveSelectedText(); closeToolbarMenus(); };
$('btn-table').onclick = () => { openTableModal(); closeToolbarMenus(); };
$('btn-editor-color').onclick = () => { openEditorColorPicker(); closeToolbarMenus(); };
$('btn-reminder').onclick = () => { openReminderModal(); closeToolbarMenus(); };
$('btn-delete-note').onclick = () => { moveActiveToTrash(); closeToolbarMenus(); };
$('btn-workspaces').onclick = openWorkspaceModal;
$('btn-favorites-filter').onclick = () => { notesView = notesView === 'favorites' ? 'active' : 'favorites'; renderNotesList(); };
$('btn-trash-filter').onclick = () => { notesView = notesView === 'trash' ? 'active' : 'trash'; renderNotesList(); };
$('btn-presentation').onclick = () => { openPresentation(); closeToolbarMenus(); };
$('btn-close-presentation').onclick = closePresentation;
$('btn-next-slide').onclick = nextSlide;
$('btn-prev-slide').onclick = prevSlide;
$('btn-change-tag').onclick = openTagModal;

$('btn-stats').onclick = () => {
  statsVisible = !statsVisible;
  statsPanel.style.display = statsVisible ? 'flex' : 'none';
  $('btn-stats').classList.toggle('active', statsVisible);
  updateStats();
  closeToolbarMenus();
};

modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

$('btn-min').onclick = () => window.api.window.minimize();
$('btn-max').onclick = () => window.api.window.maximize();
$('btn-close').onclick = () => { if (isDirty) flushSave(activeNoteId); window.api.window.close(); };

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  const slashOpen = Boolean(slashCommandState && slashCommandMenu && !slashCommandMenu.classList.contains('hidden'));
  if (document.body.classList.contains('auth-locked')) {
    return;
  }
  if (slashOpen) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSlashSelection(1); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveSlashSelection(-1); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const active = slashCommandState.commands[slashCommandState.activeIndex || 0];
      if (active) insertSlashCommand(active.type);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSlashMenu();
      return;
    }
  }
  if (e.key === 'Escape') { closeToolbarMenus(); closeNoteContextMenu(); closeSlashMenu(); }
  if (e.ctrlKey && e.key.toLowerCase() === 'f') { e.preventDefault(); openFindReplaceBar(false); }
  if (e.ctrlKey && e.key.toLowerCase() === 'g') { e.preventDefault(); openFindReplaceBar(true); }
  if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); openCommandPalette(); }
  if (e.ctrlKey && e.key === 'F6') { e.preventDefault(); toggleCompactNote(); }
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); flushSave(activeNoteId); }
  if (e.ctrlKey && e.key === 'e') { e.preventDefault(); openExportModal(); }
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') { e.preventDefault(); openLibraryModal(); }
  if (e.ctrlKey && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleNovaSidebar(); }
  if (e.ctrlKey && e.key === 'n') { e.preventDefault(); $('btn-new-note').click(); }
  if (e.ctrlKey && e.key === 'p') { e.preventDefault(); openPresentation(); }
  if (!$('presentation-overlay').classList.contains('hidden')) {
    if (e.key === 'Escape') closePresentation();
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    if (e.key === 'Home') { e.preventDefault(); firstSlide(); }
    if (e.key === 'End') { e.preventDefault(); lastSlide(); }
  }
  if (e.key === 'F11') { e.preventDefault(); focusMode ? exitFocus() : enterFocus(); }
});

// Expose globals for inline onclick
window.doImport = doImport;
window.doExport = doExport;
window.openCommandPalette = openCommandPalette;
window.setNotesView = setNotesView;
window.openSettingsModal = openSettingsModal;
window.openAccountModal = openAccountModal;
window.syncAccountPanelVisibility = syncAccountPanelVisibility;
window.loginAccountFromModal = loginAccountFromModal;
window.logoutAccountFromModal = logoutAccountFromModal;
window.registerAccountFromModal = registerAccountFromModal;
window.openAdminHelpModal = openAdminHelpModal;
window.openWorkspaceModal = openWorkspaceModal;
window.syncResizeHandles = syncResizeHandles;
window.moveNoteToSidebarSection = moveNoteToSidebarSection;
window.runCommandPaletteAction = runCommandPaletteAction;
window.openTodayPanel = openTodayPanel;
window.openNoteFromPanel = openNoteFromPanel;
window.openWikiLink = openWikiLink;
window.extractWikiLinks = extractWikiLinks;
window.findNoteByTitle = findNoteByTitle;
window.openOrCreateLinkedNote = openOrCreateLinkedNote;
window.getBacklinks = getBacklinks;
window.renderInternalLinks = renderInternalLinks;
window.toggleInternalLinksPanel = toggleInternalLinksPanel;
window.openFindReplaceBar = openFindReplaceBar;
window.openTagsManager = openTagsManager;
window.addCustomTag = addCustomTag;
window.deleteCustomTag = deleteCustomTag;
window.chooseBackupFolder = chooseBackupFolder;
window.runBackupNow = runBackupNow;
window.openImageOcrModal = openImageOcrModal;
window.chooseImageForOcr = chooseImageForOcr;
window.clearImageOcrSelection = clearImageOcrSelection;
window.startImageOcrImport = startImageOcrImport;
window.openPdfOcrModal = openPdfOcrModal;
window.startPdfOcrImport = startPdfOcrImport;
window.closeModal = closeModal;
window.restoreVersion = restoreVersion;
window.setNoteTag = setNoteTag;
window.saveVisualSettings = saveVisualSettings;
window.openDataFolder = openDataFolder;
window.setNoteColor = setNoteColor;
window.addWorkspace = addWorkspace;
window.moveActiveToWorkspace = moveActiveToWorkspace;
window.applyTemplate = applyTemplate;
window.insertLibrarySnippet = insertLibrarySnippet;
window.insertCustomSnippet = insertCustomSnippet;
window.addCustomSnippet = addCustomSnippet;
window.openSnippetManager = openSnippetManager;
window.deleteCustomSnippet = deleteCustomSnippet;
window.insertTableFromModal = insertTableFromModal;
window.applyPresetEditorColor = applyPresetEditorColor;
window.insertEditorColorValue = insertEditorColorValue;
window.copyPreviewCode = copyPreviewCode;
window.selectThemePreset = selectThemePreset;
window.improveSelectedText = improveSelectedText;
window.generateAutomaticTitle = generateAutomaticTitle;
window.saveReminder = saveReminder;
window.clearReminder = clearReminder;
window.checkForAppUpdates = checkForAppUpdates;
window.installDownloadedUpdate = installDownloadedUpdate;
window.t = t;

// Start
init();
