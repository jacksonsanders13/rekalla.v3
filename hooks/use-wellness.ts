"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toDateKey } from "@/lib/utils";
import type { WellnessEntry } from "@/types";

const wellnessKey = (userId: string) => ["wellness", userId];

/** Wellness entries for the past `days` days, oldest first. */
export function useWellnessEntries(userId: string, days = 30) {
  return useQuery({
    queryKey: [...wellnessKey(userId), days],
    queryFn: async (): Promise<WellnessEntry[]> => {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("wellness_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("entry_date", toDateKey(since))
        .order("entry_date");
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveWellnessEntry(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      entryDate: string;
      mood: number | null;
      sleepHours: number | null;
      energy: number | null;
      notes: string | null;
    }) => {
      const supabase = createClient();
      const { error } = await supabase.from("wellness_entries").upsert(
        {
          user_id: userId,
          entry_date: input.entryDate,
          mood: input.mood,
          sleep_hours: input.sleepHours,
          energy: input.energy,
          notes: input.notes,
        },
        { onConflict: "user_id,entry_date" },
      );
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: wellnessKey(userId) }),
  });
}
