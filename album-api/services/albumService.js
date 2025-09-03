const Album = require('../models/Album');

// In-memory storage for albums
let albums = [];
let nextId = 1;

// Sample data
const sampleAlbums = [
    {
        title: "Thriller",
        artist: "Michael Jackson",
        genre: "Pop",
        releaseYear: 1982,
        duration: 42,
        tracks: [
            "Wanna Be Startin' Somethin'",
            "Baby Be Mine",
            "The Girl Is Mine",
            "Thriller",
            "Beat It",
            "Billie Jean",
            "Human Nature",
            "P.Y.T. (Pretty Young Thing)",
            "The Lady in My Life"
        ]
    },
    {
        title: "Back in Black",
        artist: "AC/DC",
        genre: "Rock",
        releaseYear: 1980,
        duration: 42,
        tracks: [
            "Hells Bells",
            "Shoot to Thrill",
            "What Do You Do for Money Honey",
            "Given the Dog a Bone",
            "Let Me Put My Love into You",
            "Back in Black",
            "You Shook Me All Night Long",
            "Have a Drink on Me",
            "Shake a Leg",
            "Rock and Roll Ain't Noise Pollution"
        ]
    },
    {
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        genre: "Progressive Rock",
        releaseYear: 1973,
        duration: 43,
        tracks: [
            "Speak to Me",
            "Breathe",
            "On the Run",
            "Time",
            "The Great Gig in the Sky",
            "Money",
            "Us and Them",
            "Any Colour You Like",
            "Brain Damage",
            "Eclipse"
        ]
    },
    {
        title: "Rumours",
        artist: "Fleetwood Mac",
        genre: "Rock",
        releaseYear: 1977,
        duration: 40,
        tracks: [
            "Second Hand News",
            "Dreams",
            "Never Going Back Again",
            "Don't Stop",
            "Go Your Own Way",
            "Songbird",
            "The Chain",
            "You Make Loving Fun",
            "I Don't Want to Know",
            "Oh Daddy",
            "Gold Dust Woman"
        ]
    },
    {
        title: "Abbey Road",
        artist: "The Beatles",
        genre: "Rock",
        releaseYear: 1969,
        duration: 47,
        tracks: [
            "Come Together",
            "Something",
            "Maxwell's Silver Hammer",
            "Oh! Darling",
            "Octopus's Garden",
            "I Want You (She's So Heavy)",
            "Here Comes the Sun",
            "Because",
            "You Never Give Me Your Money",
            "Sun King",
            "Mean Mr. Mustard",
            "Polythene Pam",
            "She Came in Through the Bathroom Window",
            "Golden Slumbers",
            "Carry That Weight",
            "The End",
            "Her Majesty"
        ]
    }
];

class AlbumService {
    constructor() {
        this.initializeSampleData();
    }

    // Initialize with sample data
    initializeSampleData() {
        albums = [];
        nextId = 1;
        
        sampleAlbums.forEach(albumData => {
            const album = new Album(
                nextId++,
                albumData.title,
                albumData.artist,
                albumData.genre,
                albumData.releaseYear,
                albumData.duration,
                albumData.tracks
            );
            albums.push(album);
        });
    }

    // Get all albums with optional filtering
    getAllAlbums(filters = {}) {
        let filteredAlbums = [...albums];

        // Filter by artist
        if (filters.artist) {
            filteredAlbums = filteredAlbums.filter(album => 
                album.artist.toLowerCase().includes(filters.artist.toLowerCase())
            );
        }

        // Filter by genre
        if (filters.genre) {
            filteredAlbums = filteredAlbums.filter(album => 
                album.genre.toLowerCase().includes(filters.genre.toLowerCase())
            );
        }

        // Filter by release year
        if (filters.year) {
            filteredAlbums = filteredAlbums.filter(album => 
                album.releaseYear === parseInt(filters.year)
            );
        }

        // Sort if requested
        if (filters.sortBy) {
            filteredAlbums.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'title':
                        return a.title.localeCompare(b.title);
                    case 'artist':
                        return a.artist.localeCompare(b.artist);
                    case 'year':
                        return filters.sortOrder === 'desc' ? b.releaseYear - a.releaseYear : a.releaseYear - b.releaseYear;
                    default:
                        return 0;
                }
            });
        }

        return filteredAlbums;
    }

    // Get album by ID
    getAlbumById(id) {
        return albums.find(album => album.id === parseInt(id));
    }

    // Create new album
    createAlbum(albumData) {
        const album = new Album(
            nextId++,
            albumData.title,
            albumData.artist,
            albumData.genre,
            albumData.releaseYear,
            albumData.duration,
            albumData.tracks || []
        );
        albums.push(album);
        return album;
    }

    // Update album
    updateAlbum(id, albumData) {
        const album = this.getAlbumById(id);
        if (!album) {
            return null;
        }
        album.update(albumData);
        return album;
    }

    // Delete album
    deleteAlbum(id) {
        const index = albums.findIndex(album => album.id === parseInt(id));
        if (index === -1) {
            return false;
        }
        albums.splice(index, 1);
        return true;
    }

    // Get statistics
    getStatistics() {
        return {
            totalAlbums: albums.length,
            genres: [...new Set(albums.map(album => album.genre))].sort(),
            artists: [...new Set(albums.map(album => album.artist))].sort(),
            averageDuration: albums.length > 0 
                ? Math.round(albums.reduce((sum, album) => sum + album.duration, 0) / albums.length)
                : 0,
            newestAlbum: albums.length > 0 
                ? Math.max(...albums.map(album => album.releaseYear))
                : null,
            oldestAlbum: albums.length > 0 
                ? Math.min(...albums.map(album => album.releaseYear))
                : null
        };
    }

    // Clear all albums (useful for testing)
    clearAll() {
        albums = [];
        nextId = 1;
    }
}

module.exports = new AlbumService();
