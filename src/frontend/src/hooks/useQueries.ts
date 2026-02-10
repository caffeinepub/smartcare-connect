import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  PatientProfile, 
  DoctorProfile,
  VitalsReading,
  MedicationReminder,
  Appointment,
  Alert,
  HomeNurseRequest,
  PatientId,
  DoctorId,
  MedicationId,
  AppointmentId
} from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

// Patient Profile Queries
export function useGetPatientProfile(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PatientProfile | null>({
    queryKey: ['patientProfile', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return null;
      return actor.getPatientProfile(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useSavePatientProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: PatientProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePatientProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientProfile'] });
    }
  });
}

// Doctor Profile Queries
export function useSaveDoctorProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: DoctorProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveDoctorProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    }
  });
}

// Vitals Queries
export function useGetVitalsReadings(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VitalsReading[]>({
    queryKey: ['vitalsReadings', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getVitalsReadings(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useAddVitalsReading() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reading: VitalsReading) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVitalsReading(reading);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitalsReadings'] });
    }
  });
}

// Medication Queries
export function useGetMedicationReminders(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MedicationReminder[]>({
    queryKey: ['medicationReminders', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getMedicationReminders(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useAddMedicationReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminder: MedicationReminder) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMedicationReminder(reminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationReminders'] });
    }
  });
}

export function useUpdateMedicationReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, medicationId, reminder }: { 
      patientId: PatientId; 
      medicationId: MedicationId; 
      reminder: MedicationReminder 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMedicationReminder(patientId, medicationId, reminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationReminders'] });
    }
  });
}

export function useDeleteMedicationReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, medicationId }: { patientId: PatientId; medicationId: MedicationId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMedicationReminder(patientId, medicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationReminders'] });
    }
  });
}

// Appointment Queries
export function useGetAppointments(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getAppointments(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useAddAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAppointment(appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}

export function useUpdateAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, appointmentId, appointment }: { 
      patientId: PatientId; 
      appointmentId: AppointmentId; 
      appointment: Appointment 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAppointment(patientId, appointmentId, appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}

export function useDeleteAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, appointmentId }: { patientId: PatientId; appointmentId: AppointmentId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAppointment(patientId, appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}

// Alert Queries
export function useGetAlerts(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: ['alerts', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getAlerts(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useSendEmergencyAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendEmergencyAlert(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });
}

// Family Access Queries
export function useGetFamilyAccess(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['familyAccess', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getFamilyAccess(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useGrantFamilyAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (familyMemberId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantFamilyAccess(familyMemberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyAccess'] });
    }
  });
}

export function useRevokeFamilyAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (familyMemberId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.revokeFamilyAccess(familyMemberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyAccess'] });
    }
  });
}

// Home Nurse Request Queries
export function useGetHomeNurseRequests(patientId: PatientId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HomeNurseRequest[]>({
    queryKey: ['homeNurseRequests', patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getHomeNurseRequests(patientId);
    },
    enabled: !!actor && !actorFetching && !!patientId,
  });
}

export function useAddHomeNurseRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: HomeNurseRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addHomeNurseRequest(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeNurseRequests'] });
    }
  });
}

// Doctor Queries
export function useGetMyPatients() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[PatientId, PatientProfile][]>({
    queryKey: ['myPatients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPatients();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyPatientsAlerts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: ['myPatientsAlerts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPatientsAlerts();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}
