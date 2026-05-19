const $ = id => document.getElementById(id);

let state = null;
let licenses = [];
let selectedId = null;

const presets = {
  free: { status: 'active', validityDays: '', maxDevices: 1, features: { sync: false, export_pdf: false, themes: false, ai_assist: false } },
  trial: { status: 'trial', validityDays: 14, maxDevices: 1, features: { sync: true, export_pdf: true, themes: true, ai_assist: false } },
  pro: { status: 'active', validityDays: 365, maxDevices: 3, features: { sync: true, export_pdf: true, themes: true, ai_assist: false } },
  lifetime: { status: 'active', validityDays: '', maxDevices: 5, features: { sync: true, export_pdf: true, themes: true, ai_assist: false } },
};

function unwrap(result) {
  if (!result?.ok) throw new Error(result?.error || 'Falha inesperada');
  return result.data;
}

function toast(message) {
  const node = $('toast');
  node.textContent = message;
  node.classList.remove('hidden');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.add('hidden'), 2600);
}

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('pt-BR');
  } catch {
    return value;
  }
}

function formatCompactDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function featurePayloadFromForm(prefix = 'feature') {
  return {
    sync: Boolean($(`${prefix}-sync`)?.checked),
    export_pdf: Boolean($(`${prefix}-export-pdf`)?.checked),
    themes: Boolean($(`${prefix}-themes`)?.checked),
    ai_assist: Boolean($(`${prefix}-ai-assist`)?.checked),
  };
}

function applyPreset() {
  const plan = $('plan').value;
  const preset = presets[plan] || presets.trial;
  $('status').value = preset.status;
  $('validity-days').value = preset.validityDays;
  $('max-devices').value = preset.maxDevices;
  $('feature-sync').checked = preset.features.sync;
  $('feature-export-pdf').checked = preset.features.export_pdf;
  $('feature-themes').checked = preset.features.themes;
  $('feature-ai-assist').checked = preset.features.ai_assist;
}

async function loadState() {
  state = unwrap(await window.adminApi.getState());
  $('db-path').textContent = state.dbPath;
  if (state.startupError) toast(`Aviso: ${state.startupError}`);
  $('metric-licenses').textContent = state.summary.licenses;
  $('metric-active').textContent = state.summary.active;
  $('metric-revoked').textContent = state.summary.revoked;
  $('metric-devices').textContent = state.summary.devices;
  $('app-key').value = state.appKey || '';
  $('app-key-path').value = state.appKeyPath || '';
}

async function loadLicenses() {
  licenses = unwrap(await window.adminApi.listLicenses({ query: $('search').value }));
  renderLicenses();
}

function renderLicenses() {
  const list = $('license-list');
  if (!licenses.length) {
    list.innerHTML = '<div class="empty-table">Nenhuma licenca encontrada.</div>';
    return;
  }

  list.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th class="row-number">#</th>
          <th style="width: 260px;">Conta</th>
          <th style="width: 120px;">Plano</th>
          <th style="width: 130px;">Status</th>
          <th style="width: 120px;">Devices</th>
          <th style="width: 150px;">Expira</th>
          <th style="width: 150px;">Atualizada</th>
          <th style="width: 260px;">Licenca</th>
        </tr>
      </thead>
      <tbody>
        ${licenses.map((item, index) => `
          <tr class="data-row ${item.id === selectedId ? 'active' : ''}" data-id="${escapeHtml(item.id)}">
            <td class="row-number">${index + 1}</td>
            <td>
              <div class="cell-main">
                <strong>${escapeHtml(item.user_id || 'Sem usuario')}</strong>
                <small>${escapeHtml(item.id)}</small>
              </div>
            </td>
            <td><span class="pill ${escapeHtml(item.plan)}">${escapeHtml(item.plan)}</span></td>
            <td><span class="pill ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span></td>
            <td>${escapeHtml(item.device_count)}/${escapeHtml(item.max_devices)}</td>
            <td>${escapeHtml(formatCompactDate(item.expires_at))}</td>
            <td>${escapeHtml(formatCompactDate(item.updated_at))}</td>
            <td class="mono">${escapeHtml(item.id)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  list.querySelectorAll('[data-id]').forEach(row => {
    row.onclick = () => selectLicense(row.dataset.id);
  });
}

async function selectLicense(id) {
  selectedId = id;
  renderLicenses();
  const license = unwrap(await window.adminApi.getLicense({ id }));
  const devices = unwrap(await window.adminApi.listDevices({ licenseId: id }));
  renderDetails(license, devices);
}

function featureChecked(license, key) {
  return license.features?.find(item => item.featureKey === key)?.enabled ? 'checked' : '';
}

function renderDetails(license, devices) {
  $('details').className = 'details';
  $('details').innerHTML = `
    <div class="details-grid">
      <label>User ID<input id="edit-user-id" value="${license.user_id || ''}"></label>
      <label>Plano
        <select id="edit-plan">
          ${Object.keys(presets).map(plan => `<option value="${plan}" ${license.plan === plan ? 'selected' : ''}>${plan}</option>`).join('')}
        </select>
      </label>
      <label>Status
        <select id="edit-status">
          ${['active', 'trial', 'expired', 'revoked'].map(status => `<option value="${status}" ${license.status === status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </label>
      <label>Max devices<input id="edit-max-devices" type="number" min="1" value="${license.max_devices || 1}"></label>
      <label class="wide">Expira em<input id="edit-expires-at" value="${license.expires_at || ''}" placeholder="ISO ou vazio"></label>
    </div>
    <div class="feature-editor">
      <label><input id="edit-feature-sync" type="checkbox" ${featureChecked(license, 'sync')}> Sync</label>
      <label><input id="edit-feature-export-pdf" type="checkbox" ${featureChecked(license, 'export_pdf')}> Export PDF</label>
      <label><input id="edit-feature-themes" type="checkbox" ${featureChecked(license, 'themes')}> Themes</label>
      <label><input id="edit-feature-ai-assist" type="checkbox" ${featureChecked(license, 'ai_assist')}> AI Assist</label>
    </div>
    <div class="details-actions">
      <button class="primary" id="save-license">Salvar licenca</button>
      <button class="danger" id="delete-license">Excluir licenca</button>
    </div>
    <div>
      <h3>Devices</h3>
      <div class="device-list">
        ${devices.map(device => `
          <div class="device-card">
            <strong>${device.device_name || 'Dispositivo'}</strong>
            <small>${device.device_fingerprint || '-'}</small>
            <small>${device.platform || '-'} · ${device.app_version || '-'} · ${device.revoked_at ? 'revogado' : 'ativo'}</small>
            <div class="device-actions">
              <button data-revoke-device="${device.id}">Revogar</button>
              <button class="danger" data-delete-device="${device.id}">Excluir</button>
            </div>
          </div>
        `).join('') || '<div class="details empty">Nenhum device ativado.</div>'}
      </div>
    </div>
  `;
  $('save-license').onclick = () => saveSelectedLicense();
  $('delete-license').onclick = () => deleteSelectedLicense();
  document.querySelectorAll('[data-revoke-device]').forEach(button => {
    button.onclick = () => revokeDevice(button.dataset.revokeDevice);
  });
  document.querySelectorAll('[data-delete-device]').forEach(button => {
    button.onclick = () => deleteDevice(button.dataset.deleteDevice);
  });
}

async function saveSelectedLicense() {
  if (!selectedId) return;
  unwrap(await window.adminApi.updateLicense({
    id: selectedId,
    userId: $('edit-user-id').value,
    plan: $('edit-plan').value,
    status: $('edit-status').value,
    maxDevices: Number($('edit-max-devices').value) || 1,
    expiresAt: $('edit-expires-at').value,
    features: featurePayloadFromForm('edit-feature'),
  }));
  toast('Licenca salva');
  await refreshAll();
  await selectLicense(selectedId);
}

async function deleteSelectedLicense() {
  if (!selectedId) return;
  if (!confirm('Excluir esta licenca e seus devices?')) return;
  unwrap(await window.adminApi.deleteLicense({ id: selectedId }));
  selectedId = null;
  $('details').className = 'details empty';
  $('details').textContent = 'Selecione uma licenca.';
  toast('Licenca excluida');
  await refreshAll();
}

async function revokeDevice(id) {
  unwrap(await window.adminApi.revokeDevice({ id }));
  toast('Device revogado');
  await selectLicense(selectedId);
  await loadState();
}

async function deleteDevice(id) {
  unwrap(await window.adminApi.deleteDevice({ id }));
  toast('Device excluido');
  await selectLicense(selectedId);
  await loadState();
}

async function createLicense(event) {
  event?.preventDefault?.();
  const output = $('generated-key');
  output.value = 'Gerando licenca...';
  try {
    const result = unwrap(await window.adminApi.createLicense({
      plan: $('plan').value,
      status: $('status').value,
      validityDays: $('validity-days').value,
      maxDevices: Number($('max-devices').value) || 1,
      userId: $('user-id').value,
      features: featurePayloadFromForm('feature'),
    }));
    output.value = result.licenseKey;
    toast('Licenca gerada e salva no banco');
    await refreshAll();
    if (result.license?.id) await selectLicense(result.license.id);
  } catch (error) {
    output.value = '';
    toast(error.message || 'Nao foi possivel gerar a licenca');
  }
}

async function refreshAll() {
  await loadState();
  await loadLicenses();
}

async function boot() {
  applyPreset();
  await refreshAll();
}

$('plan').onchange = applyPreset;
$('apply-preset').onclick = applyPreset;
$('license-form').onsubmit = createLicense;
$('add-record').onclick = () => {
  $('user-id')?.focus();
  toast('Novo registro pronto para gerar');
};
document.querySelectorAll('.view-tool').forEach(button => {
  button.onclick = () => toast(`${button.textContent.trim()} aplicado na visualizacao`);
});
$('search').oninput = () => loadLicenses().catch(error => toast(error.message));
$('refresh').onclick = () => refreshAll().catch(error => toast(error.message));
$('choose-db').onclick = async () => {
  unwrap(await window.adminApi.chooseDb());
  selectedId = null;
  await refreshAll();
  toast('Banco conectado');
};
$('use-project-data').onclick = async () => {
  unwrap(await window.adminApi.useProjectData());
  selectedId = null;
  await refreshAll();
  toast('Admin conectado ao banco do projeto');
};
$('open-db-folder').onclick = () => window.adminApi.openPath({ targetPath: state?.dbPath });
$('backup-db').onclick = async () => {
  const result = unwrap(await window.adminApi.backupDb());
  toast(`Backup criado: ${result.backupPath}`);
};
$('copy-key').onclick = async () => {
  const value = $('generated-key').value.trim();
  if (!value) return toast('Nenhuma key gerada');
  unwrap(await window.adminApi.copy({ text: value }));
  toast('Key copiada');
};
$('use-key-search').onclick = async () => {
  const value = $('generated-key').value.trim();
  if (!value) return;
  $('search').value = value;
  await loadLicenses();
};
$('generate-app-key').onclick = async () => {
  const result = unwrap(await window.adminApi.generateAppKey());
  $('app-key').value = result.appKey;
  $('app-key-path').value = result.appKeyPath;
  toast('App key gerada e salva');
};
$('save-app-key').onclick = async () => {
  unwrap(await window.adminApi.saveAppKey({ appKey: $('app-key').value, appKeyPath: $('app-key-path').value }));
  toast('App key salva');
};
$('copy-app-key').onclick = async () => {
  const value = $('app-key').value.trim();
  if (!value) return toast('App key vazia');
  unwrap(await window.adminApi.copy({ text: value }));
  toast('App key copiada');
};

boot().catch(error => toast(error.message));
