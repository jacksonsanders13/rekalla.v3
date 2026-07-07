"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { VaultItem } from "@/types";
import type { TablesInsert, TablesUpdate } from "@/types/database";

const vaultKey = (userId: string) => ["vault-items", userId];

export function useVaultItems(userId: string) {
  return useQuery({
    queryKey: vaultKey(userId),
    queryFn: async (): Promise<VaultItem[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vault_items")
        .select("*")
        .eq("user_id", userId)
        .order("is_pinned", { ascending: false })
        .order("title");
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveVaultItem(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input:
        | { id?: undefined; values: TablesInsert<"vault_items"> }
        | { id: string; values: TablesUpdate<"vault_items"> },
    ) => {
      const supabase = createClient();
      if (input.id) {
        const { error } = await supabase
          .from("vault_items")
          .update(input.values)
          .eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("vault_items")
          .insert(input.values as TablesInsert<"vault_items">);
        if (error) throw error;
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vaultKey(userId) }),
  });
}

export function useDeleteVaultItem(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("vault_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vaultKey(userId) }),
  });
}
