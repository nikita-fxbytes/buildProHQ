"use client";

import { SuperFilterFormContainer } from "@/features/filters/containers/SuperFilterFormContainer";

export default function SuperEditFilterPage({ params }: { params: { id: string } }) {
  return <SuperFilterFormContainer mode="edit" filterCategoryId={params.id} />;
}

