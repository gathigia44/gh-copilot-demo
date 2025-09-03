const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Album API Tests', () => {
    describe('GET /', () => {
        it('should return API documentation', async () => {
            const res = await request(app)
                .get('/')
                .expect(200);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('message', 'Welcome to the Album API');
            expect(res.body).to.have.property('endpoints');
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app)
                .get('/health')
                .expect(200);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('message', 'Album API is running');
            expect(res.body).to.have.property('timestamp');
            expect(res.body).to.have.property('uptime');
        });
    });

    describe('GET /api/albums', () => {
        it('should return all albums', async () => {
            const res = await request(app)
                .get('/api/albums')
                .expect(200);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            expect(res.body).to.have.property('count');
            expect(res.body.count).to.equal(res.body.data.length);
        });

        it('should filter albums by artist', async () => {
            const res = await request(app)
                .get('/api/albums?artist=Beatles')
                .expect(200);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.be.an('array');
            // Should contain only Beatles albums
            res.body.data.forEach(album => {
                expect(album.artist.toLowerCase()).to.include('beatles');
            });
        });
    });

    describe('POST /api/albums', () => {
        it('should create a new album with valid data', async () => {
            const newAlbum = {
                title: 'Test Album',
                artist: 'Test Artist',
                genre: 'Test Genre',
                releaseYear: 2023,
                duration: 40.5,
                tracks: ['Track 1', 'Track 2']
            };

            const res = await request(app)
                .post('/api/albums')
                .send(newAlbum)
                .expect(201);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('title', newAlbum.title);
            expect(res.body.data).to.have.property('artist', newAlbum.artist);
            expect(res.body.data).to.have.property('id');
        });

        it('should reject album with invalid data', async () => {
            const invalidAlbum = {
                title: '', // Empty title should fail validation
                artist: 'Test Artist',
                genre: 'Test Genre',
                releaseYear: 2023,
                duration: 40.5
            };

            const res = await request(app)
                .post('/api/albums')
                .send(invalidAlbum)
                .expect(400);
            
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('errors');
        });
    });

    describe('GET /api/albums/:id', () => {
        it('should return album by ID', async () => {
            const res = await request(app)
                .get('/api/albums/1')
                .expect(200);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('id', 1);
        });

        it('should return 404 for non-existent album', async () => {
            const res = await request(app)
                .get('/api/albums/9999')
                .expect(404);
            
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('message', 'Album not found');
        });

        it('should return 400 for invalid ID', async () => {
            const res = await request(app)
                .get('/api/albums/invalid')
                .expect(400);
            
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('errors');
        });
    });

    describe('GET /api/albums/stats', () => {
        it('should return album statistics', async () => {
            const res = await request(app)
                .get('/api/albums/stats')
                .expect(200);
            
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('totalAlbums');
            expect(res.body.data).to.have.property('genres');
            expect(res.body.data).to.have.property('averageDuration');
        });
    });

    describe('Error handling', () => {
        it('should return 404 for non-existent endpoints', async () => {
            const res = await request(app)
                .get('/api/nonexistent')
                .expect(404);
            
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('message', 'Endpoint not found');
        });
    });
});