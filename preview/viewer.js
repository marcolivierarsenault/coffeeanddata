(() => {
  const form = document.querySelector('.controls');
  const frame = document.querySelector('#preview');
  const stage = document.querySelector('.stage');
  const direction = document.querySelector('#direction');
  const openPage = document.querySelector('#open-page');
  const descriptions = {
    editorial: 'Warm paper, forest green, generous spacing and serif headings. A personal engineering notebook.',
    minimal: 'Cool neutrals, restrained blue, compact spacing and sans-serif headings. A precise, practical technical blog.',
    dark: 'Charcoal, mint accents and high-contrast code. A technical notebook with a more distinctive evening mood.',
  };
  const names = { editorial: 'Warm editorial', minimal: 'Minimal technical', dark: 'Dark technical' };
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme');
  if (Object.hasOwnProperty.call(descriptions, theme)) {
    form.querySelector('input[value="' + theme + '"]').checked = true;
  }
  if (params.get('page') === 'article') form.elements.page.value = 'article';
  if (params.get('viewport') === 'mobile') form.elements.viewport.value = 'mobile';
  const update = () => {
    const data = new FormData(form);
    const chosen = data.get('theme');
    const page = data.get('page');
    const mobile = data.get('viewport') === 'mobile';
    const url = page + '.html?theme=' + chosen;
    frame.src = url;
    frame.title = names[chosen] + ' ' + (page === 'article' ? 'technical article' : 'homepage') + ' preview';
    stage.classList.toggle('mobile', mobile);
    direction.textContent = descriptions[chosen];
    openPage.href = url;
  };
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  update();
})();
