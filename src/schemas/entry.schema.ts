import { z } from 'zod';

const CATEGORIES = ['blocks', 'items', 'equipment', 'monsters', 'animals'] as const;

export const EntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(CATEGORIES),
  image: z.string().min(1),
  audio: z.string().min(1),
  sound: z.string().min(1),
  displayText: z.string().min(1),
  audioText: z.string().min(1),
  fact: z.string().min(1),
  parentTip: z.string().min(1),
  audioDuration: z.number().positive(),
});

export const CategorySchema = z.object({
  id: z.enum(CATEGORIES),
  name: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export type Entry = z.infer<typeof EntrySchema>;
export type Category = z.infer<typeof CategorySchema>;
