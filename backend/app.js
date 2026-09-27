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
app.use((req, res, next) => {
	if (!req.body) req.body = {};
	next();
});
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		status: 'ok',
		timestamp: new Date().toISOString()
	});
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));
app.use('/api/dairy', require('./routes/dairyRoutes'));
app.use('/api/veterinarians', require('./routes/vetRoutes'));
app.use('/api/medical-stores', require('./routes/medicalStoreRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/cattle', require('./routes/cattleRoutes'));
app.use('/api/health-checks', require('./routes/healthCheckRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/milk-records', require('./routes/milkRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
