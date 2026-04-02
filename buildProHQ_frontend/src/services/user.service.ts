import { db } from "@/services/mockDb";
import type {
  ManagerUsersListItem,
  ManagerUsersListQuery,
  PaginatedResult,
  User,
} from "@/types/domain";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 80));

const initialsFromName = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const userService = {
  async getUsers(): Promise<User[]> {
    await wait();
    return [...db.users];
  },
  async getUserById(id: number): Promise<User | null> {
    await wait();
    return db.users.find((user) => user.id === id) ?? null;
  },
  async getManagerUsersList(
    query: ManagerUsersListQuery,
  ): Promise<PaginatedResult<ManagerUsersListItem>> {
    await wait();

    const search = query.search.trim().toLowerCase();
    const filtered = db.users.filter((user) => {
      if (query.role && user.role !== query.role) return false;
      if (
        search &&
        !`${user.name} ${user.email} ${user.role} ${user.initials}`.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });

    const itemsWithCount: ManagerUsersListItem[] = filtered.map((user) => ({
      ...user,
      openTasks: db.tasks.filter((task) => task.user === user.initials).length,
    }));

    const total = itemsWithCount.length;
    const pageSize = query.pageSize;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(query.page, 1), pages);
    const start = (page - 1) * pageSize;

    return {
      items: itemsWithCount.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    };
  },
  async createUser(payload: Omit<User, "id" | "initials">): Promise<User> {
    await wait();
    const created: User = {
      ...payload,
      id: db.nextUserId++,
      initials: initialsFromName(payload.name),
    };
    db.users.push(created);
    return created;
  },
  async updateUser(id: number, payload: Partial<User>): Promise<User | null> {
    await wait();
    const idx = db.users.findIndex((user) => user.id === id);
    if (idx < 0) return null;
    const current = db.users[idx];
    const next: User = {
      ...current,
      ...payload,
      initials: payload.name ? initialsFromName(payload.name) : current.initials,
    };
    db.users[idx] = next;
    return next;
  },
  async deleteUser(id: number): Promise<void> {
    await wait();
    db.users = db.users.filter((user) => user.id !== id);
  },
};
