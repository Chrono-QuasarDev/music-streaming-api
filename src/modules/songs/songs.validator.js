import z4 from "zod/v4";

export const songSchema = z4.object({
  title: z4.string().trim().min(2).max(100),
  albumName: z4.string().trim().min(2).max(100),
  genre: z4.string().trim().min(2).max(50),
  trackNumber: z4.coerce.number().int().min(1),
  releaseDate: z4.coerce.date().max(new Date(), { message: "Release date cannot be in the future" })
});