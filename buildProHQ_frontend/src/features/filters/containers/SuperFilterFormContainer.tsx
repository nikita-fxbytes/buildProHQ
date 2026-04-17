"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projectsApi, type ProjectListItem } from "@/services/projectsApi.service";
import { projectFiltersApi } from "@/services/projectFiltersApi.service";
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
  return out.slice(0, 200);
}

export function SuperFilterFormContainer(props: { mode: SuperFilterFormMode; filterCategoryId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [hasSubFilters, setHasSubFilters] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [subsCsv, setSubsCsv] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const projs = await projectsApi.search({ page: 1, limit: 100 });
      setProjects(projs.items);
      if (props.mode === "edit" && props.filterCategoryId) {
        const d = await projectFiltersApi.getById(props.filterCategoryId);
        setProjectIds(Array.isArray(d.projectIds) ? d.projectIds : d.projectId ? [d.projectId] : []);
        setName(d.name);
        setHasSubFilters(d.hasSubFilters);
        setIsMultiSelect(d.isMultiSelect);
        setSubsCsv((d.subFilters ?? []).map((s) => s.name).join(", "));
      }
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
    } finally {
      setLoading(false);
    }
  }, [props.filterCategoryId, props.mode]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async () => {
    const nameTrim = name.trim();
    const subNames = dedupeCsv(subsCsv);
    if (!projectIds.length) {
      appToast.error("Please select at least one project.");
      return;
    }
    if (nameTrim.length < 1) {
      appToast.error("Filter name is required.");
      return;
    }
    if (hasSubFilters && !subNames.length) {
      appToast.error("Add at least one sub-filter name.");
      return;
    }
    if (!hasSubFilters && subNames.length) {
      appToast.error("Remove sub-filter names when not using sub-filters.");
      return;
    }

    try {
      setSaving(true);
      if (props.mode === "create") {
        await projectFiltersApi.create({
          name: nameTrim,
          projectIds,
          hasSubFilters,
          isMultiSelect: hasSubFilters ? isMultiSelect : false,
          subFilterNames: hasSubFilters ? subNames : undefined,
        });
      } else if (props.filterCategoryId) {
        await projectFiltersApi.update(props.filterCategoryId, {
          name: nameTrim,
          hasSubFilters,
          isMultiSelect: hasSubFilters ? isMultiSelect : false,
          subFilterNames: hasSubFilters ? subNames : [],
        });
      }
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
      name={name}
      setName={setName}
      hasSubFilters={hasSubFilters}
      setHasSubFilters={setHasSubFilters}
      isMultiSelect={isMultiSelect}
      setIsMultiSelect={setIsMultiSelect}
      subsCsv={subsCsv}
      setSubsCsv={setSubsCsv}
      onCancel={() => router.push(ROUTES.SUPER_FILTERS)}
      onSubmit={onSubmit}
    />
  );
}
