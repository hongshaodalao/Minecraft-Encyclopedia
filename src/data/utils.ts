import entriesData from './entries.json';
import categoriesData from './categories.json';
import { EntrySchema, CategorySchema, type Entry, type Category } from '../schemas/entry.schema';

export const allEntries: Entry[] = entriesData.map((e) => EntrySchema.parse(e));
export const allCategories: Category[] = categoriesData.map((c) => CategorySchema.parse(c));
export const TOTAL_ENTRIES = allEntries.length;

export function getEntriesByCategory(categoryId: string): Entry[] {
  return allEntries.filter((e) => e.category === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return allCategories.find((c) => c.id === categoryId);
}
