"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { useTableSort } from "@/hooks/use-table-sort";
import { getApiErrorMessage } from "@/services/apiError";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { projectsApi, type ProjectListItem, type SearchProjectsBody } from "@/services/projectsApi.service";
import { appToast } from "@/utils/toast";
import { createProjectSchema, type CreateProjectFormValues } from "@/schemas/project.schema";
import type { SuperProjectsSortPreset } from "@/features/projects/super-admin/SuperProjectsHtmlView";

type SortKey = Extract<NonNullable<SearchProjectsBody["sortBy"]>, "name" | "members">;

export function useSuperProjectsListController() {
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ProjectListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { sortKey, sortDirection, toggleSort, setSortKey, setSortDirection } = useTableSort<SortKey>("name", "asc");

  const reqIdRef = useRef(0);

  const load = useCallback(
    async (opts?: { pageOverride?: number; searchOverride?: string; sortKeyOverride?: SortKey | null; sortDirectionOverride?: "asc" | "desc" }) => {
      const reqId = (reqIdRef.current += 1);
      setLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const effectiveSearch = (opts?.searchOverride ?? search).trim();
        const effectiveSortKey = opts?.sortKeyOverride ?? sortKey;
        const effectiveSortDirection = opts?.sortDirectionOverride ?? sortDirection;

        const body: SearchProjectsBody = {
          page: queryPage,
          limit: pageSize,
          search: effectiveSearch || undefined,
          sortBy: effectiveSortKey ?? undefined,
          sortOrder: effectiveSortDirection ?? undefined,
        };
        const res = await projectsApi.search(body);
        if (reqId !== reqIdRef.current) return;
        setRows(res.items);
        setTotal(res.meta.total);
      } catch (e) {
        if (reqId !== reqIdRef.current) return;
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setRows([]);
        setTotal(0);
      } finally {
        if (reqId !== reqIdRef.current) return;
        setLoading(false);
      }
    },
    [page, pageSize, search, sortDirection, sortKey],
  );

  // Debounced search + sort changes reset page to 1.
  useEffect(() => {
    const t = setTimeout(() => {
      void load({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortKey, sortDirection]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const initialLoading = useMemo(() => loading && rows.length === 0, [loading, rows.length]);

  // Delete project confirmation
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<ProjectListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openDelete = (project: ProjectListItem) => {
    setDeleteProject(project);
    setDeleteOpen(true);
  };
  const closeDelete = useCallback(() => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteProject(null);
  }, [deleting]);
  const confirmDelete = useCallback(async () => {
    if (!deleteProject) return;
    setDeleting(true);
    try {
      await projectsApi.remove(deleteProject.id);
      appToast.success("Project deleted.");
      setRows((prev) => prev.filter((p) => p.id !== deleteProject.id));
      setTotal((t) => Math.max(0, t - 1));
      closeDelete();
      await load();
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
    } finally {
      setDeleting(false);
    }
  }, [closeDelete, deleteProject, load]);

  // Create project modal
  const [createOpen, setCreateOpen] = useState(false);
  const createForm = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", code: "" },
    mode: "onChange",
  });
  const [creating, setCreating] = useState(false);

  const openCreate = () => {
    createForm.reset({ name: "", code: "" });
    setCreateOpen(true);
  };
  const closeCreate = () => setCreateOpen(false);

  const submitCreate = createForm.handleSubmit(async (values) => {
    setCreating(true);
    try {
      await projectsApi.create({
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
      });
      appToast.success("Project created.");
      setCreateOpen(false);
      await load({ pageOverride: 1 });
      setPage(1);
    } catch (e) {
      const msg = getApiErrorMessage(e, MESSAGES.common.saveFailed);
      if (msg.toLowerCase().includes("name already exists")) {
        createForm.setError("name", { type: "server", message: msg });
        return;
      }
      appToast.error(msg);
    } finally {
      setCreating(false);
    }
  });

  const [manageOpen, setManageOpen] = useState(false);
  const [manageProjectId, setManageProjectId] = useState<string | null>(null);
  const [membersRole, setMembersRole] = useState<"manager" | "trade_user" | "field_user">("manager"); // active tab
  const [usersSearch, setUsersSearch] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const usersPageSize = 10;
  const [usersSortKey, setUsersSortKey] = useState<"name" | "email">("name");
  const [usersSortDirection, setUsersSortDirection] = useState<"asc" | "desc">("asc");
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [usersMeta, setUsersMeta] = useState<{ page: number; limit: number; total: number; totalPages: number }>({
    page: 1,
    limit: usersPageSize,
    total: 0,
    totalPages: 1,
  });
  const [assignedUserIds, setAssignedUserIds] = useState<Set<string>>(() => new Set());
  const assignedReqIdRef = useRef(0);
  const assignedListReqIdRef = useRef(0);
  const [assignedListLoading, setAssignedListLoading] = useState(false);
  const [assignedMembers, setAssignedMembers] = useState<
    Array<{
      userId: string;
      fullName: string;
      email: string;
      roleCode: string;
    }>
  >([]);
  const [assignedMembersTotal, setAssignedMembersTotal] = useState(0);
  const [assignedMembersPage, setAssignedMembersPage] = useState(1);
  const assignedMembersPageSize = 6;
  const [assignedMembersSearch, setAssignedMembersSearch] = useState("");
  const [assignedMembersRole, setAssignedMembersRole] = useState<"all" | "manager" | "trade_user" | "field_user">("all");
  const usersReqIdRef = useRef(0);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [availableLoading, setAvailableLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserListItem[]>([]);
  type AssignOption = { value: string; label: string };
  const [selectedAssignUsers, setSelectedAssignUsers] = useState<AssignOption[]>([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const availableReqIdRef = useRef(0);

  const openManage = (projectId: string) => {
    setManageProjectId(projectId);
    setMembersRole("manager");
    setUsersSearch("");
    setUsersPage(1);
    setUsersSortKey("name");
    setUsersSortDirection("asc");
    // Clear assigned state immediately so buttons don't appear incorrectly disabled
    // while the assigned-members request is in flight.
    setAssignedUserIds(new Set());
    setAssignedMembersSearch("");
    setAssignedMembersRole("all");
    setAssignedMembersPage(1);
    setSelectedAssignUsers([]);
    setAssignOpen(false);
    setAssignSearch("");
    setManageOpen(true);
  };
  const closeManage = () => {
    // Invalidate in-flight requests tied to the modal.
    assignedReqIdRef.current += 1;
    usersReqIdRef.current += 1;
    availableReqIdRef.current += 1;
    setManageOpen(false);
  };

  const manageProject = useMemo(() => {
    if (!manageProjectId) return null;
    return rows.find((p) => p.id === manageProjectId) ?? null;
  }, [manageProjectId, rows]);

  const loadAssignedUserIds = useCallback(
    async (projectId: string) => {
      const reqId = (assignedReqIdRef.current += 1);
      try {
        const all = new Set<string>();
        // Pull all assigned members in pages. Keep this independent of user list interactions.
        const limit = 100;
        let page = 1;
        // Safety cap to avoid infinite loops if meta is missing.
        for (let guard = 0; guard < 25; guard += 1) {
          const res = await projectsApi.listMembersGet(projectId, { page, limit });
          if (reqId !== assignedReqIdRef.current) return;
          for (const m of res.items) all.add(m.userId);
          const totalPages = res.meta.totalPages || 1;
          if (page >= totalPages) break;
          page += 1;
        }
        if (reqId !== assignedReqIdRef.current) return;
        setAssignedUserIds(all);
      } catch (e) {
        if (reqId !== assignedReqIdRef.current) return;
        const msg = getApiErrorMessage(e, MESSAGES.common.somethingWrong);
        appToast.error(msg.includes("greater than 100") ? "Maximum 100 records allowed per request" : msg);
        setAssignedUserIds(new Set());
      }
    },
    [],
  );

  const loadAssignedMembersList = useCallback(
    async (projectId: string, query: { page: number }) => {
      const reqId = (assignedListReqIdRef.current += 1);
      setAssignedListLoading(true);
      try {
        const res = await projectsApi.listMembersGet(projectId, {
          page: query.page,
          limit: assignedMembersPageSize,
          search: assignedMembersSearch.trim() || undefined,
          role: assignedMembersRole === "all" ? undefined : assignedMembersRole,
        });
        if (reqId !== assignedListReqIdRef.current) return;
        setAssignedMembers(
          res.items.map((m) => ({
            userId: m.userId,
            fullName: m.fullName,
            email: m.email,
            roleCode: m.roleCode,
          })),
        );
        setAssignedMembersTotal(res.meta.total);
      } catch (e) {
        if (reqId !== assignedListReqIdRef.current) return;
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setAssignedMembers([]);
        setAssignedMembersTotal(0);
      } finally {
        if (reqId !== assignedListReqIdRef.current) return;
        setAssignedListLoading(false);
      }
    },
    [assignedMembersPageSize, assignedMembersRole, assignedMembersSearch],
  );

  const loadTabUsers = useCallback(
    async (query: { page: number; search: string; role: typeof membersRole; sortKey: "name" | "email"; sortDirection: "asc" | "desc" }) => {
      const reqId = (usersReqIdRef.current += 1);
      setUsersLoading(true);
      try {
        const role = query.role === "manager" ? "Management" : query.role === "trade_user" ? "Trade" : "User";
        const res = await usersApi.search({
          page: query.page,
          limit: usersPageSize,
          role,
          search: query.search.trim() || undefined,
          sortBy: query.sortKey,
          sortOrder: query.sortDirection,
        });
        if (reqId !== usersReqIdRef.current) return;
        setUsers(res.items.filter((u) => !u.is_super_admin));
        setUsersMeta(res.meta);
      } catch (e) {
        if (reqId !== usersReqIdRef.current) return;
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setUsers([]);
        setUsersMeta({ page: 1, limit: usersPageSize, total: 0, totalPages: 1 });
      } finally {
        if (reqId !== usersReqIdRef.current) return;
        setUsersLoading(false);
      }
    },
    [usersPageSize],
  );

  // When modal opens / project changes, refresh assigned ids and first page.
  useEffect(() => {
    if (!manageOpen || !manageProjectId) return;
    void loadAssignedUserIds(manageProjectId);
    void loadAssignedMembersList(manageProjectId, { page: 1 });
    setAssignedMembersPage(1);
    void loadTabUsers({
      page: 1,
      search: usersSearch,
      role: membersRole,
      sortKey: usersSortKey,
      sortDirection: usersSortDirection,
    });
    setUsersPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageOpen, manageProjectId]);

  useEffect(() => {
    if (!manageOpen || !manageProjectId) return;
    void loadAssignedMembersList(manageProjectId, { page: assignedMembersPage });
  }, [manageOpen, manageProjectId, assignedMembersPage, loadAssignedMembersList]);

  useEffect(() => {
    if (!manageOpen || !manageProjectId) return;
    const t = setTimeout(() => {
      void loadAssignedMembersList(manageProjectId, { page: 1 });
      setAssignedMembersPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [manageOpen, manageProjectId, assignedMembersSearch, assignedMembersRole, loadAssignedMembersList]);

  // Tab changes should refetch immediately and clear stale rows.
  useEffect(() => {
    if (!manageOpen || !manageProjectId) return;
    setUsers([]);
    setUsersMeta({ page: 1, limit: usersPageSize, total: 0, totalPages: 1 });
    setUsersPage(1);
    void loadTabUsers({
      page: 1,
      search: usersSearch,
      role: membersRole,
      sortKey: usersSortKey,
      sortDirection: usersSortDirection,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersRole]);

  // Debounced refresh on search/sort changes. Resets page to 1.
  useEffect(() => {
    if (!manageOpen || !manageProjectId) return;
    const t = setTimeout(() => {
      void loadTabUsers({
        page: 1,
        search: usersSearch,
        role: membersRole,
        sortKey: usersSortKey,
        sortDirection: usersSortDirection,
      });
      setUsersPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [manageOpen, manageProjectId, usersSearch, usersSortKey, usersSortDirection, loadTabUsers, membersRole]);

  // Page changes load immediately.
  useEffect(() => {
    if (!manageOpen || !manageProjectId) return;
    void loadTabUsers({
      page: usersPage,
      search: usersSearch,
      role: membersRole,
      sortKey: usersSortKey,
      sortDirection: usersSortDirection,
    });
  }, [manageOpen, manageProjectId, usersPage, membersRole, usersSearch, usersSortKey, usersSortDirection, loadTabUsers]);

  const openAssign = () => {
    if (!manageProjectId) return;
    setAssignSearch("");
    setSelectedAssignUsers([]);
    setAssignOpen(true);
  };

  const closeAssign = () => {
    availableReqIdRef.current += 1;
    setSelectedAssignUsers([]);
    setAssignOpen(false);
  };

  const loadAvailableUsers = useCallback(
    async (query: { search: string }) => {
      if (!manageProjectId) return;
      const reqId = (availableReqIdRef.current += 1);
      setAvailableLoading(true);
      try {
        const res = await usersApi.search({
          page: 1,
          limit: 50,
          search: query.search.trim() || undefined,
          sortBy: "name",
          sortOrder: "asc",
        });
        if (reqId !== availableReqIdRef.current) return;
        setAvailableUsers(res.items.filter((u) => !u.is_super_admin));
      } catch (e) {
        if (reqId !== availableReqIdRef.current) return;
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setAvailableUsers([]);
      } finally {
        if (reqId !== availableReqIdRef.current) return;
        setAvailableLoading(false);
      }
    },
    [manageProjectId],
  );

  useEffect(() => {
    if (!assignOpen) return;
    const t = setTimeout(() => {
      void loadAvailableUsers({ search: assignSearch });
    }, 250);
    return () => clearTimeout(t);
  }, [assignOpen, assignSearch, membersRole, loadAvailableUsers]);

  const assignUsers = useCallback(
    async (userIds: string[]) => {
      if (!manageProjectId) return;
      setAssignSubmitting(true);
      try {
        await projectsApi.assignMember(manageProjectId, { userIds });
        setAssignedUserIds((prev) => {
          const next = new Set(prev);
          for (const id of userIds) next.add(id);
          return next;
        });
        // Optimistic counters on the project row (keeps UI consistent in modal header).
        setRows((prev) =>
          prev.map((p) => {
            if (p.id !== manageProjectId) return p;
            const next: ProjectListItem = { ...p };
            next.membersTotal = (next.membersTotal ?? 0) + userIds.length;
            if (membersRole === "manager") next.membersManagers = (next.membersManagers ?? 0) + userIds.length;
            if (membersRole === "trade_user") next.membersTrades = (next.membersTrades ?? 0) + userIds.length;
            if (membersRole === "field_user") next.membersField = (next.membersField ?? 0) + userIds.length;
            return next;
          }),
        );
        appToast.success("Users assigned.");
        setSelectedAssignUsers([]);
        setAssignOpen(false);
        await loadAssignedUserIds(manageProjectId);
        await loadAssignedMembersList(manageProjectId, { page: 1 });
        setAssignedMembersPage(1);
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setAssignSubmitting(false);
      }
    },
    [loadAssignedMembersList, loadAssignedUserIds, manageProjectId, membersRole],
  );

  const unassign = useCallback(
    async (userId: string) => {
      if (!manageProjectId) return;
      setAssigningUserId(userId);
      try {
        await projectsApi.unassignMember(manageProjectId, userId);
        setAssignedUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        setRows((prev) =>
          prev.map((p) => {
            if (p.id !== manageProjectId) return p;
            const next: ProjectListItem = { ...p };
            next.membersTotal = Math.max(0, (next.membersTotal ?? 0) - 1);
            if (membersRole === "manager") next.membersManagers = Math.max(0, (next.membersManagers ?? 0) - 1);
            if (membersRole === "trade_user") next.membersTrades = Math.max(0, (next.membersTrades ?? 0) - 1);
            if (membersRole === "field_user") next.membersField = Math.max(0, (next.membersField ?? 0) - 1);
            return next;
          }),
        );
        appToast.success("User removed.");
        await loadAssignedUserIds(manageProjectId);
        await loadAssignedMembersList(manageProjectId, { page: assignedMembersPage });
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setAssigningUserId(null);
      }
    },
    [assignedMembersPage, loadAssignedMembersList, loadAssignedUserIds, manageProjectId, membersRole],
  );

  return {
    loading,
    initialLoading,
    rows,
    total,
    page,
    pageSize,
    search,
    setSearch: (v: string) => setSearch(v),
    sortKey,
    sortDirection,
    onSortColumn: (col: SortKey) => {
      toggleSort(col);
      setPage(1);
    },
    setPage,

    sortPreset: (sortKey === "members"
      ? sortDirection === "desc"
        ? "mostUsers"
        : "leastUsers"
      : sortDirection === "desc"
        ? "nameDesc"
        : "nameAsc") as SuperProjectsSortPreset,
    setSortPreset: (preset: SuperProjectsSortPreset) => {
      if (preset === "mostUsers") {
        setSortKey("members");
        setSortDirection("desc");
      } else if (preset === "leastUsers") {
        setSortKey("members");
        setSortDirection("asc");
      } else if (preset === "nameDesc") {
        setSortKey("name");
        setSortDirection("desc");
      } else {
        setSortKey("name");
        setSortDirection("asc");
      }
      setPage(1);
    },

    delete: {
      open: deleteOpen,
      project: deleteProject,
      deleting,
      openModal: openDelete,
      closeModal: closeDelete,
      confirm: confirmDelete,
    },

    create: {
      open: createOpen,
      openModal: openCreate,
      closeModal: closeCreate,
      form: createForm,
      submit: submitCreate,
      submitting: creating,
    },
    manage: {
      open: manageOpen,
      openModal: openManage,
      closeModal: closeManage,
      project: manageProject,
      membersRole,
      setMembersRole: (v: typeof membersRole) => {
        setMembersRole(v);
        setUsersPage(1);
        setUsers([]);
        setUsersMeta({ page: 1, limit: usersPageSize, total: 0, totalPages: 1 });
      },
      usersLoading,
      users,
      usersMeta,
      usersSearch,
      setUsersSearch: (v: string) => {
        setUsersSearch(v);
        setUsersPage(1);
      },
      usersPage,
      setUsersPage,
      usersPageSize,
      usersSortKey,
      usersSortDirection,
      setUsersSort: (key: "name" | "email") => {
        setUsersSortKey((prev) => {
          if (prev !== key) {
            setUsersSortDirection("asc");
            return key;
          }
          setUsersSortDirection((d) => (d === "asc" ? "desc" : "asc"));
          return prev;
        });
        setUsersPage(1);
      },
      assignedUserIds,
      assignedListLoading,
      assignedMembers,
      assignedMembersTotal,
      assignedMembersPage,
      assignedMembersPageSize,
      setAssignedMembersPage,
      assignedMembersSearch,
      setAssignedMembersSearch: (v: string) => {
        setAssignedMembersSearch(v);
        setAssignedMembersPage(1);
      },
      assignedMembersRole,
      setAssignedMembersRole: (v: typeof assignedMembersRole) => {
        setAssignedMembersRole(v);
        setAssignedMembersPage(1);
      },
      assigningUserId,
      openAssign,
      closeAssign,
      assignOpen,
      assignSearch,
      setAssignSearch,
      availableLoading,
      availableUsers,
      selectedAssignUsers,
      setSelectedAssignUsers,
      assignSubmitting,
      assignSelected: async () => {
        if (!manageProjectId) return;
        const toAssign = selectedAssignUsers.map((o) => o.value).filter((id) => !assignedUserIds.has(id));
        if (toAssign.length === 0) return;
        await assignUsers(toAssign);
      },
      unassign,
    },
  };
}

