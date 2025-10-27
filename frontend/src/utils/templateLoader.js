/**
 * JobLander Template Loader
 * Dynamically loads all resume templates from /templates folder.
 * Each template is ATS-optimized and supports drag/drop customization.
 */
export async function loadTemplates() {
  const templates = {};
  // For Vite: import all raw .html files
  const modules = import.meta.glob('/templates/*.html', { as: 'raw' });

  for (const [path, loader] of Object.entries(modules)) {
    const name = path.split('/').pop().replace('.html', '');
    templates[name] = await loader();
  }
  return templates;
}

/**
 * Render template with data
 * @param {string} html - the template HTML
 * @param {object} data - key/value data fields
 */
export function renderTemplate(html, data) {
  let output = html;
  for (const [key, value] of Object.entries(data)) {
    const pattern = new RegExp('{{\\s*' + key + '\\s*}}', 'g');
    output = output.replace(pattern, value || '');
  }
  return output;
}
