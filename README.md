My very own music streaming api.

I might end up building the next spotify at this rate

## Database setup

Create the PostgreSQL database and copy `.env` from the project configuration. Then run:

```bash
npm run db:migrate
npm run seed:catalog
```

The catalog seeder creates the artist and song records and uploads available audio files to Backblaze B2. Configure `DATABASE_URL`, `B2_ENDPOINT`, `B2_KEY_ID`, `B2_APP_KEY`, and `B2_BUCKET_NAME` in `.env` before running it. `SEED_ARTIST_PASSWORD` is optional and defaults to `artistpass`.

## Playlist song behavior

Adding a song returns the created `PlaylistSong` association record. Removing a song returns the association record that was deleted, so both operations expose the same resource shape.

The `playlists_songs.song_id` foreign key remains enforced in the database, with `CASCADE` deletion when a song is removed. The API checks that a song exists before inserting the association and returns `404 Song not found`; the database constraint remains as a final integrity safeguard.
