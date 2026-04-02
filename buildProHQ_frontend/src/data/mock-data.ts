import type { CompletedTask, FilterCategory, Task, User } from "@/types/domain";

export const mockTasks: Task[] = [
  { id: 1, level: "L10", trade: "Painter", desc: "Finish wall painting - north side", days: 11, user: "RG" },
  { id: 2, level: "L2", trade: "Plasterer", desc: "Patch ceiling cracks in bedroom 3", days: 5, user: "JA" },
  { id: 3, level: "L5", trade: "Electrician", desc: "Fix wiring in hallway junction box", days: 5, user: "RG" },
  { id: 4, level: "L1", trade: "Plumber", desc: "Install tap in master ensuite", days: 5, user: "PA" },
  { id: 5, level: "L3", trade: "Painter", desc: "Sand and prime all interior doors", days: 3, user: "RG" },
  { id: 6, level: "L7", trade: "Electrician", desc: "Install recessed light fittings kitchen", days: 8, user: "JA" },
];
export const mockCompletedTasks: CompletedTask[] = [];
export const mockUsers: User[] = [
  { id: 1, name: "Rob Gar", email: "rob@buildpro.com", role: "User", initials: "RG" },
  { id: 2, name: "Jarrod Ala", email: "jarrod@buildpro.com", role: "User", initials: "JA" },
  { id: 3, name: "Peter Alexander", email: "peter@buildpro.com", role: "Management", initials: "PA" },
  { id: 4, name: "Sam Painter", email: "sam@buildpro.com", role: "Trade", initials: "SP", trade: "Painter" },
  { id: 5, name: "Ed Sparks", email: "ed@buildpro.com", role: "Trade", initials: "ES", trade: "Electrician" },
];
export const mockFilters: FilterCategory[] = [
  { name: "Trade", subs: ["Electrician", "Plasterer", "Plumber", "Painter"] },
  { name: "Level", subs: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"] },
];
