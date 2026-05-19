const SNIPPET_ID = 'plugin-snippet-demo';

function buildSnippet() {
  return {
    id: SNIPPET_ID,
    name: 'Demo do Plugin',
    mode: 'javascript',
    fence: 'javascript',
    code: [
      "console.log('NovaPad plugin demo');",
      '',
      'function greetNovaPad() {',
      "  return 'O plugin funcionou!';",
      '}',
    ].join('\n'),
  };
}

function upsertDemoSnippet(context) {
  const settings = context.readSettings ? context.readSettings() : {};
  const snippets = Array.isArray(settings.custom_snippets) ? settings.custom_snippets.slice() : [];
  if (snippets.some(snippet => String(snippet.id) === SNIPPET_ID)) return false;
  snippets.push(buildSnippet());
  settings.custom_snippets = snippets;
  if (typeof context.saveSettings === 'function') {
    context.saveSettings(settings);
    return true;
  }
  if (typeof context.writeJson === 'function' && context.settingsPath) {
    context.writeJson(context.settingsPath, settings);
    return true;
  }
  return false;
}

function activate(context = {}) {
  return {
    handleAppStart() {
      upsertDemoSnippet(context);
    },
    handleAppClose() {
      // Nothing to clean up for this demo plugin.
    },
  };
}

module.exports = {
  activate,
};
