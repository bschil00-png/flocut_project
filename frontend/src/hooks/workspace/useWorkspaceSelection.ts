"use client";

import { useState } from "react";

export function useWorkspaceSelection() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  return {
    selectedItems,
    toggleSelectItem,
    clearSelection,
  };
}
