"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { useTableSort } from "@/hooks/use-table-sort";
import { getApiErrorMessage } from "@/services/apiError";
import {
  projectsApi,
  type ProjectListItem,
  type ProjectMemberListItem,
  type SearchProjectsBody,
  type SearchProjectMembersBody,
} from "@/services/projectsApi.service";
import { appToast } from "@/utils/toast";
import { createProjectSchema, type CreateProjectFormValues } from "@/schemas/project.schema";
import { usersApi, type UserListItem } from "@/services/usersApi.service";

type SortKey = Extract<NonNullable<SearchProjectsBody["sortBy"]>, "name" | "members">;
type MemberRoleFilter = "all" | "manager" | "trade_user" | "field_user";

export function useSuperProjectsController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ProjectListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { sortKey, sortDirection, toggleSort } = useTableSort<SortKey>("name", "asc");

  const [createOpen, setCreateOpen] = useState(false);
  const createForm = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", code: "" },
    mode: "onChange",
  });

  const loadProjects = useCallback(
    async (opts?: { pageOverride?: number }) => {
      setLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const body: SearchProjectsBody = {
          page: queryPage,
          limit: pageSize,
          search: search.trim() || undefined,
          sortBy: sortKey ?? undefined,
          sortOrder: sortDirection ?? undefined,
        };
        const res = await projectsApi.search(body);
        setRows(res.items);
        setTotal(res.meta.total);
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search, sortDirection, sortKey],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      loadProjects({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortKey, sortDirection, pageSize]);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openCreate = () => {
    createForm.reset({ name: "", code: "" });
    setCreateOpen(true);
  };

  const closeCreate = () => setCreateOpen(false);

  const submitCreate = createForm.handleSubmit(async (values) => {
    try {
      await projectsApi.create({
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
      });
      appToast.success("Project created.");
      setCreateOpen(false);
      await loadProjects({ pageOverride: 1 });
      setPage(1);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    }
  });

  const initialLoading = useMemo(() => loading && rows.length === 0, [loading, rows.length]);

  const [manageOpen, setManageOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectListItem | null>(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [members, setMembers] = useState<ProjectMemberListItem[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const membersPageSize = 12;
  const [membersSearch, setMembersSearch] = useState("");
  const [membersRole, setMembersRole] = useState<MemberRoleFilter>("all");

  const [availableLoading, setAvailableLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserListItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [assignOpen, setAssignOpen] = useState(false);

  const loadMembers = useCallback(
    async (projectId: string, opts?: { pageOverride?: number }) => {
      setMembersLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? membersPage;
        const body: SearchProjectMembersBody = {
          page: queryPage,
          limit: membersPageSize,
          search: membersSearch.trim() || undefined,
          role: membersRole === "all" ? undefined : membersRole,
        };
        const res = await projectsApi.listMembers(projectId, body);
        setMembers(res.items);
        setMembersTotal(res.meta.total);
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setMembers([]);
        setMembersTotal(0);
      } finally {
        setMembersLoading(false);
      }
    },
    [membersPage, membersPageSize, membersRole, membersSearch],
  );

  const loadAvailableUsers = useCallback(
    async (projectId: string) => {
      setAvailableLoading(true);
      try {
        const res = await usersApi.search({
          page: 1,
          limit: 100,
          search: membersSearch.trim() || undefined,
          sortBy: "name",
          sortOrder: "asc",
        });
        const assigned = new Set(members.map((m) => m.userId));
        const filtered = res.items.filter((u) => !assigned.has(u.id));
        setAvailableUsers(filtered);
        if (filtered.length > 0) {
          setSelectedUserId(filtered[0]!.id);
        } else {
          setSelectedUserId("");
        }
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
        setAvailableUsers([]);
        setSelectedUserId("");
      } finally {
        setAvailableLoading(false);
      }
    },
    [members, membersSearch],
  );

  const openManage = (project: ProjectListItem) => {
    setActiveProject(project);
    setMembersPage(1);
    setMembersSearch("");
    setMembersRole("all");
    setManageOpen(true);
  };

  const closeManage = () => {
    setManageOpen(false);
    setActiveProject(null);
    setMembers([]);
    setMembersTotal(0);
    setAvailableUsers([]);
    setSelectedUserId("");
    setAssignOpen(false);
  };

  const openAssign = () => setAssignOpen(true);
  const closeAssign = () => setAssignOpen(false);

  useEffect(() => {
    if (!manageOpen || !activeProject) return;
    void loadMembers(activeProject.id, { pageOverride: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageOpen, activeProject?.id]);

  useEffect(() => {
    if (!manageOpen || !activeProject) return;
    const t = setTimeout(() => {
      void loadMembers(activeProject.id, { pageOverride: 1 });
      setMembersPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersSearch, membersRole]);

  useEffect(() => {
    if (!manageOpen || !activeProject) return;
    void loadMembers(activeProject.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersPage]);

  useEffect(() => {
    if (!manageOpen || !activeProject) return;
    void loadAvailableUsers(activeProject.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageOpen, activeProject?.id, members.length]);

  const assignSelected = useCallback(async () => {
    if (!activeProject) return;
    if (!selectedUserId) {
      appToast.info("No available users to assign.");
      return;
    }
    try {
      await projectsApi.assignMember(activeProject.id, { userId: selectedUserId });
      appToast.success("User assigned.");
      await loadMembers(activeProject.id, { pageOverride: 1 });
      setMembersPage(1);
      await loadProjects();
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    }
  }, [activeProject, loadMembers, loadProjects, selectedUserId]);

  const unassign = useCallback(
    async (userId: string) => {
      if (!activeProject) return;
      try {
        await projectsApi.unassignMember(activeProject.id, userId);
        appToast.success("User removed from project.");
        await loadMembers(activeProject.id);
        await loadProjects();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      }
    },
    [activeProject, loadMembers, loadProjects],
  );

  useEffect(() => {
    if (!manageOpen || !activeProject) return;
    const updated = rows.find((r) => r.id === activeProject.id);
    if (updated) {
      setActiveProject(updated);
    }
  }, [rows, manageOpen, activeProject]);

  return {
    loading,
    initialLoading,
    rows,
    total,
    page,
    pageSize,
    search,
    sortKey,
    sortDirection,
    onSortColumn: (key: SortKey) => {
      toggleSort(key);
      setPage(1);
    },
    onSearchChange: setSearch,
    onPageChange: setPage,
    reload: loadProjects,
    create: {
      open: createOpen,
      openModal: openCreate,
      closeModal: closeCreate,
      form: createForm,
      submit: submitCreate,
      submitting: createForm.formState.isSubmitting,
    },
    manage: {
      open: manageOpen,
      openModal: openManage,
      closeModal: closeManage,
      project: activeProject,
      membersLoading,
      members,
      membersTotal,
      membersPage,
      membersPageSize,
      membersSearch,
      membersRole,
      setMembersSearch,
      setMembersRole,
      setMembersPage,
      availableLoading,
      availableUsers,
      selectedUserId,
      setSelectedUserId,
      assignSelected,
      unassign,
      assignOpen,
      openAssign,
      closeAssign,
    },
  };
}

