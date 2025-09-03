// Album model for in-memory storage
class Album {
    constructor(id, title, artist, genre, releaseYear, duration, tracks = []) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.releaseYear = releaseYear;
        this.duration = duration; // in minutes
        this.tracks = tracks;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Update album properties
    update(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.artist !== undefined) this.artist = data.artist;
        if (data.genre !== undefined) this.genre = data.genre;
        if (data.releaseYear !== undefined) this.releaseYear = data.releaseYear;
        if (data.duration !== undefined) this.duration = data.duration;
        if (data.tracks !== undefined) this.tracks = data.tracks;
        this.updatedAt = new Date();
    }

    // Convert to JSON (exclude internal properties if needed)
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            artist: this.artist,
            genre: this.genre,
            releaseYear: this.releaseYear,
            duration: this.duration,
            tracks: this.tracks,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Album;
