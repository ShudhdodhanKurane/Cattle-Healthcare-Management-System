document.querySelectorAll('form[data-auth-form]').forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const target = form.dataset.redirect;
		if (target) window.location.href = target;
	});
});
