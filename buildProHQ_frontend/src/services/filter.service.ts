import type { FilterCategory } from "@/types/domain";
import { FILTER_KEYS } from "@/constants/filters";
import { db } from "@/services/mockDb";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 80));

const ensureCategory = (name: string) => {
  const existing = db.filters.find((filter) => filter.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;
  const created: FilterCategory = { name, subs: [] };
  db.filters.push(created);
  return created;
};

export const filterService = {
  async getFilters(): Promise<FilterCategory[]> {
    await wait();
    return db.filters.map((filter) => ({
      ...filter,
      subs: [...filter.subs],
    }));
  },
  async addFilter(name: string, subs: string[]): Promise<void> {
    await wait();
    const cleanName = name.trim();
    if (!cleanName) return;
    const cleanSubs = subs.map((sub) => sub.trim()).filter(Boolean);
    const category = ensureCategory(cleanName);
    cleanSubs.forEach((sub) => {
      if (!category.subs.includes(sub)) category.subs.push(sub);
    });
  },
  async addLevel(level: string): Promise<void> {
    await wait();
    const value = level.trim();
    if (!value) return;
    const category = ensureCategory(FILTER_KEYS.LEVEL);
    if (!category.subs.includes(value)) category.subs.push(value);
  },
  async addTrade(trade: string): Promise<void> {
    await wait();
    const value = trade.trim();
    if (!value) return;
    const category = ensureCategory(FILTER_KEYS.TRADE);
    if (!category.subs.includes(value)) category.subs.push(value);
  },
  async addSubFilter(name: string, value: string): Promise<void> {
    await wait();
    const sub = value.trim();
    if (!sub) return;
    const category = ensureCategory(name.trim());
    if (!category.subs.includes(sub)) category.subs.push(sub);
  },
  async deleteFilter(name: string): Promise<void> {
    await wait();
    db.filters = db.filters.filter((filter) => filter.name !== name);
  },
  async deleteSubFilter(name: string, sub: string): Promise<void> {
    await wait();
    const category = db.filters.find((filter) => filter.name === name);
    if (!category) return;
    category.subs = category.subs.filter((entry) => entry !== sub);
  },
  async addOrUpdateFilter(name: string, subs: string[]): Promise<void> {
    await this.addFilter(name, subs);
  },
  async quickAddSubFilter(category: string, value: string): Promise<void> {
    if (category === FILTER_KEYS.LEVEL) {
      await this.addLevel(value);
      return;
    }
    if (category === FILTER_KEYS.TRADE) {
      await this.addTrade(value);
      return;
    }
    await this.addSubFilter(category, value);
  },
};
