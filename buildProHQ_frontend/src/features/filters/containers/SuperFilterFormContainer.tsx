"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { lookupsApi, type FilterCategoryApi, type FilterOptionApi } from "@/services/lookupsApi.service";
import { projectsApi, type ProjectListItem } from "@/services/projectsApi.service";
import { filtersApi } from "@/services/filtersApi.service";
import { appToast } from "@/utils/toast";
import { MESSAGES } from "@/constants/messages";
import { getApiErrorMessage } from "@/services/apiError";
import { SuperFilterFormView } from "@/components/filters/SuperFilterFormView";
import { ROUTES } from "@/constants/routes";

export type SuperFilterFormMode = "create" | "edit";

function dedupeCsv(input: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of input.split(",")) {
    const t = raw.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.slice(0, 100);
}

export function SuperFilterFormContainer(props: { mode: SuperFilterFormMode; filterCategoryId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [categories, setCategories] = useState<FilterCategoryApi[]>([]);
  const [options, setOptions] = useState<FilterOptionApi[]>([]);

  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [projectIdReadOnly, setProjectIdReadOnly] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [subsCsv, setSubsCsv] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [projs, cats, opts] = await Promise.all([
        projectsApi.search({ page: 1, limit: 100 }),
        lookupsApi.getFilterCategories(),
        lookupsApi.getFilterOptions(),
      ]);
      setProjects(projs.items);
      setCategories(cats);
      setOptions(opts);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (props.mode !== "edit") return;
    const id = props.filterCategoryId ?? "";
    if (!id) return;
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setCategoryName(cat.name);
    setProjectIdReadOnly(cat.projectId ?? null);
    setProjectIds(cat.projectId ? [cat.projectId] : []);
    const subNames = options.filter((o) => o.filterCategoryId === id).map((o) => o.name);
    setSubsCsv(subNames.join(", "));
  }, [categories, options, props.filterCategoryId, props.mode]);

  const projectNameReadOnly = useMemo(() => {
    if (!projectIdReadOnly) return "Global";
    return projects.find((p) => p.id === projectIdReadOnly)?.name ?? "—";
  }, [projectIdReadOnly, projects]);

  const onSubmit = async () => {
    const name = categoryName.trim();
    const subFilterNames = dedupeCsv(subsCsv);

    if (props.mode === "create") {
      if (projectIds.length === 0) {
        appToast.error("Please select at least one project.");
        return;
      }
      if (name.length < 2) {
        appToast.error(MESSAGES.filter.validation.categoryMinLength);
        return;
      }
    }

    try {
      setSaving(true);
      await filtersApi.saveFilter({
        filterCategoryId: props.mode === "edit" ? props.filterCategoryId : undefined,
        filterCategoryName: props.mode === "create" ? name : undefined,
        subFilterNames: subFilterNames.length ? subFilterNames : undefined,
        projectIds: props.mode === "create" ? projectIds : undefined,
      });
      appToast.success(MESSAGES.filter.saved);
      router.push(ROUTES.SUPER_FILTERS);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SuperFilterFormView
      mode={props.mode}
      loading={loading}
      saving={saving}
      projects={projects}
      projectIds={projectIds}
      setProjectIds={setProjectIds}
      projectNameReadOnly={projectNameReadOnly}
      categoryName={categoryName}
      setCategoryName={setCategoryName}
      subsCsv={subsCsv}
      setSubsCsv={setSubsCsv}
      onCancel={() => router.push(ROUTES.SUPER_FILTERS)}
      onSubmit={onSubmit}
    />
  );
}

