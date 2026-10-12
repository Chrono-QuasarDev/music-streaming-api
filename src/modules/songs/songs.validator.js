import z from "zod";

export const songSchema = z.object({
  title: z.string().trim().min(2).max(100),
  albumName: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  trackNumber: z.coerce.number().int().min(1),
  releaseDate: z.coerce.date().max(new Date(), { message: "Release date cannot be in the future" })
});