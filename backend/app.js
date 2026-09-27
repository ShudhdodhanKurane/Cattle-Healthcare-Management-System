require('dotenv').config();

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
	: '*';

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		status: 'ok',
		timestamp: new Date().toISOString()
	});
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
