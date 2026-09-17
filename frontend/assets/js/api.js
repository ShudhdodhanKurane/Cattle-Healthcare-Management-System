const HerdwellApi = Object.freeze({
	baseUrl: '/api',
	async request(path, options = {}) {
		const response = await fetch(`${this.baseUrl}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
		if (!response.ok) throw new Error(`Request failed: ${response.status}`);
		return response.json();
	}
});
