"use client";

import { use } from "react";
import { SuperFilterFormContainer } from "@/features/filters/containers/SuperFilterFormContainer";

export default function SuperEditFilterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SuperFilterFormContainer mode="edit" filterCategoryId={id} />;
}

