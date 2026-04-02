"use client";

import { TradeTasksView } from "@/components/trade/TradeTasksView";
import { useTradeTasksController } from "@/features/trade/hooks/useTradeTasksController";

export function TradeTasksContainer() {
  const controller = useTradeTasksController();
  return <TradeTasksView {...controller} />;
}

