(() => {
  const theme = new URLSearchParams(window.location.search).get('theme');
  document.documentElement.dataset.theme = ['editorial', 'minimal', 'dark'].includes(theme) ? theme : 'editorial';
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-preview-link]').forEach(link => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      url.searchParams.set('theme', document.documentElement.dataset.theme);
      link.href = url.href;
    });
  });
})();
