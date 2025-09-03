const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const albumRoutes = require('./routes/albums');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Album API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/api/albums', albumRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Album API',
        version: '1.0.0',
        endpoints: {
            'GET /health': 'Health check',
            'GET /api/albums': 'List all albums (with optional filtering)',
            'GET /api/albums/stats': 'Get album statistics',
            'GET /api/albums/:id': 'Get album by ID',
            'POST /api/albums': 'Create new album',
            'PUT /api/albums/:id': 'Update album',
            'DELETE /api/albums/:id': 'Delete album'
        },
        documentation: 'See README.md for detailed API documentation'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🎵 Album API server is running on port ${PORT}`);
        console.log(`📖 API documentation available at http://localhost:${PORT}`);
        console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
    });
}

module.exports = app;
