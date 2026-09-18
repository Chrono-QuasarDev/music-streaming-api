CREATE TYPE user_role AS ENUM ('listener', 'artist', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY NOT NULL,
  username varchar(50) UNIQUE NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  role user_role DEFAULT 'listener',
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artist_profiles (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL,
  bio varchar(1000) NOT NULL,
  profile_picture_url varchar(2048) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY NOT NULL,
  title varchar(255) NOT NULL,
  artist_id uuid NOT NULL,
  album_name varchar(255) NOT NULL,
  track_number integer NOT NULL,
  duration_ms integer NOT NULL,
  file_path varchar(2048) NOT NULL,
  genre varchar NOT NULL,
  release_date date NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  name varchar(255) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playlists_songs (
  id uuid PRIMARY KEY NOT NULL,
  playlist_id uuid NOT NULL,
  song_id uuid NOT NULL,
  added_at timestamp DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (playlist_id, song_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY NOT NULL,
  artist_id uuid NOT NULL,
  follower_id uuid NOT NULL,
  followed_at timestamp DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (artist_id, follower_id)
);

ALTER TABLE artist_profiles ADD FOREIGN KEY (user_id) REFERENCES users (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE songs ADD FOREIGN KEY (artist_id) REFERENCES artist_profiles (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE playlists ADD FOREIGN KEY (user_id) REFERENCES users (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE playlists_songs ADD FOREIGN KEY (playlist_id) REFERENCES playlists (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE playlists_songs ADD FOREIGN KEY (song_id) REFERENCES songs (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE follows ADD FOREIGN KEY (artist_id) REFERENCES artist_profiles (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE follows ADD FOREIGN KEY (follower_id) REFERENCES users (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE playlists ADD CONSTRAINT playlists_user_id_name_unique UNIQUE (user_id, name);