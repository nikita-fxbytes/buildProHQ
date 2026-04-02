"use client";

import { TradeCompletedView } from "@/components/trade/TradeCompletedView";
import { useTradeCompletedController } from "@/features/trade/hooks/useTradeCompletedController";

export function TradeCompletedContainer() {
  const controller = useTradeCompletedController();
  return <TradeCompletedView {...controller} />;
}

