import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type HomeNurseRequestId = bigint;
export type Time = bigint;
export interface VitalsReading {
    temperature: number;
    bloodPressure: string;
    heartRate: bigint;
    timestamp: Time;
}
export type MedicationId = bigint;
export interface DoctorProfile {
    name: string;
    specialty: string;
}
export type UserRole = {
    __kind__: "patient";
    patient: null;
} | {
    __kind__: "doctor";
    doctor: null;
} | {
    __kind__: "familyMember";
    familyMember: PatientId;
};
export interface MedicationReminder {
    id: MedicationId;
    dosage: string;
    name: string;
    nextDue: Time;
    frequency: string;
}
export type DoctorId = Principal;
export type AppointmentId = bigint;
export type PatientId = Principal;
export type AlertId = bigint;
export interface HomeNurseRequest {
    id: HomeNurseRequestId;
    patient: PatientId;
    details: string;
    dateTime: Time;
}
export interface PatientProfile {
    age: bigint;
    name: string;
    connectedDevices: Array<string>;
    medicalHistory: string;
    primaryDoctor?: DoctorId;
}
export interface Appointment {
    id: AppointmentId;
    doctor: DoctorId;
    dateTime: Time;
    reason: string;
}
export interface Alert {
    id: AlertId;
    patient: PatientId;
    alertType: Variant_emergency_medication_vitals;
    message: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
    role: UserRole;
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_emergency_medication_vitals {
    emergency = "emergency",
    medication = "medication",
    vitals = "vitals"
}
export interface backendInterface {
    addAppointment(appointment: Appointment): Promise<void>;
    addHomeNurseRequest(request: HomeNurseRequest): Promise<void>;
    addMedicationReminder(reminder: MedicationReminder): Promise<void>;
    addVitalsReading(reading: VitalsReading): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    deleteAppointment(patient: PatientId, appointmentId: AppointmentId): Promise<void>;
    deleteMedicationReminder(patient: PatientId, medicationId: MedicationId): Promise<void>;
    getAlerts(patient: PatientId): Promise<Array<Alert>>;
    getAllPatients(): Promise<Array<[PatientId, PatientProfile]>>;
    getAppointments(patient: PatientId): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getDoctorProfile(doctor: DoctorId): Promise<DoctorProfile | null>;
    getFamilyAccess(patient: PatientId): Promise<Array<Principal>>;
    getHomeNurseRequests(patient: PatientId): Promise<Array<HomeNurseRequest>>;
    getMedicationReminders(patient: PatientId): Promise<Array<MedicationReminder>>;
    getMyPatients(): Promise<Array<[PatientId, PatientProfile]>>;
    getMyPatientsAlerts(): Promise<Array<Alert>>;
    getPatientProfile(patient: PatientId): Promise<PatientProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVitalsReadings(patient: PatientId): Promise<Array<VitalsReading>>;
    grantFamilyAccess(familyMemberId: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    revokeFamilyAccess(familyMemberId: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDoctorProfile(profile: DoctorProfile): Promise<void>;
    savePatientProfile(profile: PatientProfile): Promise<void>;
    sendEmergencyAlert(message: string): Promise<void>;
    updateAppointment(patient: PatientId, appointmentId: AppointmentId, appointment: Appointment): Promise<void>;
    updateMedicationReminder(patient: PatientId, medicationId: MedicationId, reminder: MedicationReminder): Promise<void>;
}
