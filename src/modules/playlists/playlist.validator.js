import z from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(2).max(255)
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(2).max(255)
});

export const playlistIdSchema = z.object({
  id: z.uuid()
});

export const songIdSchema = z.object({
  songId: z.uuid()
});