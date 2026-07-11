"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

/** A resolved link plus the person on the other side. */
export interface LinkedPerson {
  relationshipId: string;
  profile: Profile;
}

const patientsKey = (caregiverId: string) => ["my-patients", caregiverId];
const caregiversKey = (patientId: string) => ["my-caregivers", patientId];

/** People a caregiver looks after (active links). */
export function useMyPatients(caregiverId: string) {
  return useQuery({
    queryKey: patientsKey(caregiverId),
    queryFn: async (): Promise<LinkedPerson[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("care_relationships")
        .select("id, patient_id, profiles!care_relationships_patient_id_fkey(*)")
        .eq("caregiver_id", caregiverId)
        .eq("status", "active")
        .order("created_at");
      if (error) throw error;
      return (data ?? [])
        .filter((row) => row.profiles)
        .map((row) => ({
          relationshipId: row.id,
          profile: row.profiles as unknown as Profile,
        }));
    },
  });
}

/** Caregivers a patient has connected (active links). */
export function useMyCaregivers(patientId: string) {
  return useQuery({
    queryKey: caregiversKey(patientId),
    queryFn: async (): Promise<LinkedPerson[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("care_relationships")
        .select("id, caregiver_id, profiles!care_relationships_caregiver_id_fkey(*)")
        .eq("patient_id", patientId)
        .eq("status", "active")
        .order("created_at");
      if (error) throw error;
      return (data ?? [])
        .filter((row) => row.profiles)
        .map((row) => ({
          relationshipId: row.id,
          profile: row.profiles as unknown as Profile,
        }));
    },
  });
}

/** A caregiver links to a patient by entering the patient's connect code. */
export function useConnectWithCode(caregiverId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string): Promise<Profile> => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("connect_with_code", { code });
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: patientsKey(caregiverId) }),
  });
}

/** Either side ends a relationship. */
export function useEndRelationship(currentUserId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (relationshipId: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("care_relationships")
        .update({ status: "revoked" })
        .eq("id", relationshipId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsKey(currentUserId) });
      queryClient.invalidateQueries({ queryKey: caregiversKey(currentUserId) });
    },
  });
}
