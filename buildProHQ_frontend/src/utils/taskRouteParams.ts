/** Route segment for Nest `uuid v4` validation (GET/PATCH `/v1/tasks/:id`). */
export function isUuidV4(id: string | undefined | null): id is string {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export function taskIdFromParams(param: string | string[] | undefined): string {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param[0]) return param[0];
  return "";
}
