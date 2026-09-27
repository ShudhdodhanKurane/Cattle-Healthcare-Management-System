require('dotenv').config();

const app = require('./app');
const { connectDatabase } = require('./config/database');

const port = Number(process.env.PORT) || 5000;

async function startServer() {
	if (process.env.MONGODB_URI) {
		await connectDatabase();
	} else {
		console.warn('MONGODB_URI is not set; starting without a database connection.');
	}

	return app.listen(port, () => {
		console.log(`API server listening on port ${port}`);
	});
}

if (require.main === module) {
	startServer().catch((error) => {
		console.error('Failed to start the API server:', error.message);
		process.exitCode = 1;
	});
}

module.exports = { startServer };
