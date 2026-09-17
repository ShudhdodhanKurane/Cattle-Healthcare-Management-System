document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
	button.addEventListener('click', () => document.querySelector(button.dataset.menuToggle)?.classList.toggle('open'));
});
