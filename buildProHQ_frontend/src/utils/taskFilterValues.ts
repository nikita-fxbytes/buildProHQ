export type TaskFilterValueForm = {
  filterId: string;
  subFilterIds?: string[];
  textValue?: string | null;
};

/** Merge one filter's value into the taskFilterValues array (omit empty). */
export function upsertTaskFilterValue(
  current: TaskFilterValueForm[],
  filterId: string,
  next: { subFilterIds?: string[]; textValue?: string | null | undefined },
): TaskFilterValueForm[] {
  const rest = current.filter((x) => x.filterId !== filterId);
  const subs = Array.from(new Set((next.subFilterIds ?? []).filter(Boolean)));
  const tv = (next.textValue ?? "").trim();
  const hasSubs = subs.length > 0;
  const hasText = Boolean(tv);
  if (!hasSubs && !hasText) return rest;
  return [...rest, { filterId, ...(hasSubs ? { subFilterIds: subs } : {}), ...(hasText ? { textValue: tv } : {}) }];
}

export function getTaskFilterValueForFilter(
  values: TaskFilterValueForm[] | undefined,
  filterId: string,
): TaskFilterValueForm | undefined {
  return (values ?? []).find((v) => v.filterId === filterId);
}
