import z from 'zod';

export const updateProfileSchema = z.object({
  password: z.string().min(6).max(100),
});