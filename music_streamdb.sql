CREATE TYPE enum_users_role AS ENUM ('listener', 'artist', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY NOT NULL,
  username varchar(50) UNIQUE NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  role enum_users_role DEFAULT 'listener',
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artist_profiles (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  bio varchar(1000) NOT NULL,
  profile_picture_url varchar(2048) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY NOT NULL,
  title varchar(255) NOT NULL,
  artist_id uuid NOT NULL REFERENCES artist_profiles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  album_name varchar(255) NOT NULL,
  track_number integer NOT NULL,
  duration_ms integer NOT NULL,
  file_path varchar(2048) NOT NULL UNIQUE,
  genre varchar NOT NULL,
  release_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_song_constraint UNIQUE (title, artist_id)
);

CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playlists_songs (
  id uuid PRIMARY KEY NOT NULL,
  playlist_id uuid NOT NULL REFERENCES playlists (id) ON UPDATE CASCADE ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs (id) ON UPDATE CASCADE ON DELETE CASCADE,
  added_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT playlists_songs_playlist_id_song_id_unique UNIQUE (playlist_id, song_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY NOT NULL,
  artist_id uuid NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  follower_id uuid NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  followed_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT follows_artist_id_follower_id_unique UNIQUE (artist_id, follower_id)
);
