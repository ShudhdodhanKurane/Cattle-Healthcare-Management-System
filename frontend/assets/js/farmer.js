(() => {
  const page = document.body.dataset.page;
  const sidebar = document.querySelector('.sidebar');
  const menuButton = document.querySelector('.menu-button');
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');
  if (menuButton && sidebar) menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.querySelectorAll('[data-today]').forEach((node) => {
    node.textContent = new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date());
  });
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const notice = form.querySelector('.form-notice');
      if (notice) notice.textContent = 'Saved locally. Connect this form to the API when the farmer service is enabled.';
    });
  });
})();
