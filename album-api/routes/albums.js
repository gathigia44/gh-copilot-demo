const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const albumService = require('../services/albumService');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Validation rules for album creation/update
const albumValidationRules = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('artist')
        .trim()
        .notEmpty()
        .withMessage('Artist is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Artist must be between 1 and 100 characters'),
    body('genre')
        .trim()
        .notEmpty()
        .withMessage('Genre is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Genre must be between 1 and 50 characters'),
    body('releaseYear')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Release year must be a valid year between 1900 and next year'),
    body('duration')
        .isFloat({ min: 0.1 })
        .withMessage('Duration must be a positive number (in minutes)'),
    body('tracks')
        .optional()
        .isArray()
        .withMessage('Tracks must be an array')
        .custom((tracks) => {
            if (tracks && tracks.length > 0) {
                for (const track of tracks) {
                    if (typeof track !== 'string' || track.trim().length === 0) {
                        throw new Error('Each track must be a non-empty string');
                    }
                }
            }
            return true;
        })
];

// GET /albums - List all albums with optional filtering
router.get('/', [
    query('artist').optional().trim(),
    query('genre').optional().trim(),
    query('year').optional().isInt({ min: 1900 }).withMessage('Year must be a valid integer'),
    query('sortBy').optional().isIn(['title', 'artist', 'year']).withMessage('Sort by must be title, artist, or year'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    handleValidationErrors
], (req, res) => {
    try {
        const filters = {
            artist: req.query.artist,
            genre: req.query.genre,
            year: req.query.year,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder || 'asc'
        };

        const albums = albumService.getAllAlbums(filters);
        
        res.json({
            success: true,
            data: albums,
            count: albums.length,
            message: 'Albums retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve albums',
            error: error.message
        });
    }
});

// GET /albums/stats - Get album statistics
router.get('/stats', (req, res) => {
    try {
        const stats = albumService.getStatistics();
        res.json({
            success: true,
            data: stats,
            message: 'Statistics retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve statistics',
            error: error.message
        });
    }
});

// GET /albums/:id - Get album by ID
router.get('/:id', [
    param('id').isInt({ min: 1 }).withMessage('Album ID must be a positive integer'),
    handleValidationErrors
], (req, res) => {
    try {
        const album = albumService.getAlbumById(req.params.id);
        
        if (!album) {
            return res.status(404).json({
                success: false,
                message: 'Album not found'
            });
        }

        res.json({
            success: true,
            data: album,
            message: 'Album retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve album',
            error: error.message
        });
    }
});

// POST /albums - Create new album
router.post('/', [
    ...albumValidationRules,
    handleValidationErrors
], (req, res) => {
    try {
        const albumData = {
            title: req.body.title.trim(),
            artist: req.body.artist.trim(),
            genre: req.body.genre.trim(),
            releaseYear: parseInt(req.body.releaseYear),
            duration: parseFloat(req.body.duration),
            tracks: req.body.tracks || []
        };

        const album = albumService.createAlbum(albumData);
        
        res.status(201).json({
            success: true,
            data: album,
            message: 'Album created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create album',
            error: error.message
        });
    }
});

// PUT /albums/:id - Update album
router.put('/:id', [
    param('id').isInt({ min: 1 }).withMessage('Album ID must be a positive integer'),
    ...albumValidationRules,
    handleValidationErrors
], (req, res) => {
    try {
        const albumData = {
            title: req.body.title.trim(),
            artist: req.body.artist.trim(),
            genre: req.body.genre.trim(),
            releaseYear: parseInt(req.body.releaseYear),
            duration: parseFloat(req.body.duration),
            tracks: req.body.tracks || []
        };

        const album = albumService.updateAlbum(req.params.id, albumData);
        
        if (!album) {
            return res.status(404).json({
                success: false,
                message: 'Album not found'
            });
        }

        res.json({
            success: true,
            data: album,
            message: 'Album updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update album',
            error: error.message
        });
    }
});

// DELETE /albums/:id - Delete album
router.delete('/:id', [
    param('id').isInt({ min: 1 }).withMessage('Album ID must be a positive integer'),
    handleValidationErrors
], (req, res) => {
    try {
        const deleted = albumService.deleteAlbum(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Album not found'
            });
        }

        res.json({
            success: true,
            message: 'Album deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete album',
            error: error.message
        });
    }
});

module.exports = router;
