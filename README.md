My very own music streaming api.

I might end up building the next spotify at this rate

## Database setup

Create the PostgreSQL database and copy `.env` from the project configuration. Then run:

```bash
npm run db:migrate
npm run seed:artists
npm run seed:songs
```

Create a playlist through the API before running `npm run seed:playlist-songs`. The playlist seeder targets the `Mood Lifter` playlist and is safe to run more than once.
