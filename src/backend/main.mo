import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type PatientId = Principal;
  type DoctorId = Principal;
  type FamilyId = Principal;
  type VitalId = Nat;
  type MedicationId = Nat;
  type AppointmentId = Nat;
  type AlertId = Nat;
  type HomeNurseRequestId = Nat;

  public type UserRole = {
    #patient;
    #doctor;
    #familyMember : PatientId; // Family member with access to specific patient
  };

  public type UserProfile = {
    name : Text;
    role : UserRole;
  };

  public type PatientProfile = {
    name : Text;
    age : Nat;
    medicalHistory : Text;
    primaryDoctor : ?DoctorId;
    connectedDevices : [Text];
  };

  public type DoctorProfile = {
    name : Text;
    specialty : Text;
  };

  public type FamilyMemberProfile = {
    name : Text;
    relationship : Text;
  };

  public type VitalsReading = {
    heartRate : Nat;
    bloodPressure : Text; // "120/80"
    temperature : Float;
    timestamp : Time.Time;
  };

  public type MedicationReminder = {
    id : MedicationId;
    name : Text;
    dosage : Text;
    frequency : Text;
    nextDue : Time.Time;
  };

  public type Appointment = {
    id : AppointmentId;
    doctor : DoctorId;
    dateTime : Time.Time;
    reason : Text;
  };

  public type Alert = {
    id : AlertId;
    patient : PatientId;
    message : Text;
    timestamp : Time.Time;
    alertType : { #emergency; #medication; #vitals };
  };

  public type HomeNurseRequest = {
    id : HomeNurseRequestId;
    patient : PatientId;
    dateTime : Time.Time;
    details : Text;
  };

  // State maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let patients = Map.empty<PatientId, PatientProfile>();
  let doctors = Map.empty<DoctorId, DoctorProfile>();
  let familyAccess = Map.empty<PatientId, List.List<FamilyId>>(); // Patient -> List of family members with access

  let vitalsReadings = Map.empty<PatientId, List.List<VitalsReading>>();
  let medicationReminders = Map.empty<PatientId, List.List<MedicationReminder>>();
  let appointments = Map.empty<PatientId, List.List<Appointment>>();
  let alerts = Map.empty<PatientId, List.List<Alert>>();
  let homeNurseRequests = Map.empty<PatientId, List.List<HomeNurseRequest>>();

  var nextMedicationId = 1;
  var nextAppointmentId = 1;
  var nextAlertId = 1;
  var nextHomeNurseRequestId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper functions for authorization
  func isPatient(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#patient) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isDoctor(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#doctor) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isDoctorForPatient(doctor : Principal, patient : PatientId) : Bool {
    switch (patients.get(patient)) {
      case (?profile) {
        switch (profile.primaryDoctor) {
          case (?primaryDoc) { Principal.equal(primaryDoc, doctor) };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };

  func hasFamilyAccess(familyMember : Principal, patient : PatientId) : Bool {
    switch (familyAccess.get(patient)) {
      case (?familyList) {
        familyList.any(func(fm) { Principal.equal(fm, familyMember) });
      };
      case (null) { false };
    };
  };

  func canAccessPatientData(caller : Principal, patient : PatientId) : Bool {
    // Patient can access their own data
    if (Principal.equal(caller, patient)) {
      return true;
    };
    // Doctor can access their patient's data
    if (isDoctor(caller) and isDoctorForPatient(caller, patient)) {
      return true;
    };
    // Family member with granted access can view data
    if (hasFamilyAccess(caller, patient)) {
      return true;
    };
    // Admin can access all data
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    false;
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Patient Profile Management
  public shared ({ caller }) func savePatientProfile(profile : PatientProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can save patient profiles");
    };
    patients.add(caller, profile);
  };

  public query ({ caller }) func getPatientProfile(patient : PatientId) : async ?PatientProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    if (not canAccessPatientData(caller, patient)) {
      Runtime.trap("Unauthorized: Cannot access this patient's profile");
    };
    patients.get(patient);
  };

  // Doctor Profile Management
  public shared ({ caller }) func saveDoctorProfile(profile : DoctorProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can save doctor profiles");
    };
    doctors.add(caller, profile);
  };

  public query ({ caller }) func getDoctorProfile(doctor : DoctorId) : async ?DoctorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    doctors.get(doctor);
  };

  // Vitals Reading Management
  public shared ({ caller }) func addVitalsReading(reading : VitalsReading) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add vitals readings");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can add vitals readings");
    };
    let existingReadings = switch (vitalsReadings.get(caller)) {
      case (null) { List.empty<VitalsReading>() };
      case (?readings) { readings };
    };
    existingReadings.add(reading);
    vitalsReadings.add(caller, existingReadings);
  };

  public query ({ caller }) func getVitalsReadings(patient : PatientId) : async [VitalsReading] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view vitals");
    };
    if (not canAccessPatientData(caller, patient)) {
      Runtime.trap("Unauthorized: Cannot access this patient's vitals");
    };
    switch (vitalsReadings.get(patient)) {
      case (null) { [] };
      case (?readings) { readings.toArray() };
    };
  };

  // Medication Management
  public shared ({ caller }) func addMedicationReminder(reminder : MedicationReminder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add medication reminders");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can add medication reminders");
    };
    let newReminder = { reminder with id = nextMedicationId };
    nextMedicationId += 1;
    let existingReminders = switch (medicationReminders.get(caller)) {
      case (null) { List.empty<MedicationReminder>() };
      case (?reminders) { reminders };
    };
    existingReminders.add(newReminder);
    medicationReminders.add(caller, existingReminders);
  };

  public shared ({ caller }) func updateMedicationReminder(patient : PatientId, medicationId : MedicationId, reminder : MedicationReminder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update medication reminders");
    };
    // Patient can update their own, or their doctor can update
    if (not (Principal.equal(caller, patient) or (isDoctor(caller) and isDoctorForPatient(caller, patient)))) {
      Runtime.trap("Unauthorized: Can only update your own medications or your patient's medications");
    };
    switch (medicationReminders.get(patient)) {
      case (null) { Runtime.trap("No medications found for this patient") };
      case (?reminders) {
        let updatedReminders = reminders.map<MedicationReminder, MedicationReminder>(
          func(r : MedicationReminder) : MedicationReminder {
            if (r.id == medicationId) {
              { reminder with id = medicationId };
            } else {
              r;
            };
          }
        );
        medicationReminders.add(patient, updatedReminders);
      };
    };
  };

  public shared ({ caller }) func deleteMedicationReminder(patient : PatientId, medicationId : MedicationId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete medication reminders");
    };
    // Patient can delete their own, or their doctor can delete
    if (not (Principal.equal(caller, patient) or (isDoctor(caller) and isDoctorForPatient(caller, patient)))) {
      Runtime.trap("Unauthorized: Can only delete your own medications or your patient's medications");
    };
    switch (medicationReminders.get(patient)) {
      case (null) { () };
      case (?reminders) {
        let filteredReminders = reminders.filter(
          func(r : MedicationReminder) : Bool { r.id != medicationId }
        );
        medicationReminders.add(patient, filteredReminders);
      };
    };
  };

  public query ({ caller }) func getMedicationReminders(patient : PatientId) : async [MedicationReminder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view medication reminders");
    };
    if (not canAccessPatientData(caller, patient)) {
      Runtime.trap("Unauthorized: Cannot access this patient's medications");
    };
    switch (medicationReminders.get(patient)) {
      case (null) { [] };
      case (?reminders) { reminders.toArray() };
    };
  };

  // Appointment Management
  public shared ({ caller }) func addAppointment(appointment : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add appointments");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can add appointments");
    };
    let newAppointment = { appointment with id = nextAppointmentId };
    nextAppointmentId += 1;
    let existingAppointments = switch (appointments.get(caller)) {
      case (null) { List.empty<Appointment>() };
      case (?apps) { apps };
    };
    existingAppointments.add(newAppointment);
    appointments.add(caller, existingAppointments);
  };

  public shared ({ caller }) func updateAppointment(patient : PatientId, appointmentId : AppointmentId, appointment : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update appointments");
    };
    // Patient can update their own, or their doctor can update
    if (not (Principal.equal(caller, patient) or (isDoctor(caller) and isDoctorForPatient(caller, patient)))) {
      Runtime.trap("Unauthorized: Can only update your own appointments or your patient's appointments");
    };
    switch (appointments.get(patient)) {
      case (null) { Runtime.trap("No appointments found for this patient") };
      case (?apps) {
        let updatedAppointments = apps.map<Appointment, Appointment>(
          func(a : Appointment) : Appointment {
            if (a.id == appointmentId) {
              { appointment with id = appointmentId };
            } else {
              a;
            };
          }
        );
        appointments.add(patient, updatedAppointments);
      };
    };
  };

  public shared ({ caller }) func deleteAppointment(patient : PatientId, appointmentId : AppointmentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete appointments");
    };
    // Patient can delete their own, or their doctor can delete
    if (not (Principal.equal(caller, patient) or (isDoctor(caller) and isDoctorForPatient(caller, patient)))) {
      Runtime.trap("Unauthorized: Can only delete your own appointments or your patient's appointments");
    };
    switch (appointments.get(patient)) {
      case (null) { () };
      case (?apps) {
        let filteredAppointments = apps.filter(
          func(a : Appointment) : Bool { a.id != appointmentId }
        );
        appointments.add(patient, filteredAppointments);
      };
    };
  };

  public query ({ caller }) func getAppointments(patient : PatientId) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view appointments");
    };
    if (not canAccessPatientData(caller, patient)) {
      Runtime.trap("Unauthorized: Cannot access this patient's appointments");
    };
    switch (appointments.get(patient)) {
      case (null) { [] };
      case (?apps) { apps.toArray() };
    };
  };

  // Emergency Alerts
  public shared ({ caller }) func sendEmergencyAlert(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send emergency alerts");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can send emergency alerts");
    };
    let newAlert = {
      id = nextAlertId;
      patient = caller;
      message;
      timestamp = Time.now();
      alertType = #emergency;
    };
    nextAlertId += 1;
    let existingAlerts = switch (alerts.get(caller)) {
      case (null) { List.empty<Alert>() };
      case (?alrts) { alrts };
    };
    existingAlerts.add(newAlert);
    alerts.add(caller, existingAlerts);
  };

  public query ({ caller }) func getAlerts(patient : PatientId) : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view alerts");
    };
    if (not canAccessPatientData(caller, patient)) {
      Runtime.trap("Unauthorized: Cannot access this patient's alerts");
    };
    switch (alerts.get(patient)) {
      case (null) { [] };
      case (?alrts) { alrts.toArray() };
    };
  };

  // Family Member Access
  public shared ({ caller }) func grantFamilyAccess(familyMemberId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can grant family access");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can grant family access");
    };
    let existingFamily = switch (familyAccess.get(caller)) {
      case (null) { List.empty<FamilyId>() };
      case (?family) { family };
    };
    // Check if already granted
    let alreadyGranted = existingFamily.any(func(fm) { Principal.equal(fm, familyMemberId) });
    if (not alreadyGranted) {
      existingFamily.add(familyMemberId);
      familyAccess.add(caller, existingFamily);
    };
  };

  public shared ({ caller }) func revokeFamilyAccess(familyMemberId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can revoke family access");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can revoke family access");
    };
    switch (familyAccess.get(caller)) {
      case (null) { () };
      case (?family) {
        let filteredFamily = family.filter(
          func(fm) {
            not Principal.equal(fm, familyMemberId);
          }
        );
        familyAccess.add(caller, filteredFamily);
      };
    };
  };

  public query ({ caller }) func getFamilyAccess(patient : PatientId) : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view family access");
    };
    // Only the patient or their doctor can view who has family access
    if (not (Principal.equal(caller, patient) or (isDoctor(caller) and isDoctorForPatient(caller, patient)) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Cannot view this patient's family access list");
    };
    switch (familyAccess.get(patient)) {
      case (null) { [] };
      case (?family) { family.toArray() };
    };
  };

  public shared ({ caller }) func addHomeNurseRequest(request : HomeNurseRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add home nurse requests");
    };
    if (not isPatient(caller)) {
      Runtime.trap("Unauthorized: Only patients can add home nurse requests");
    };
    let newRequest = { request with id = nextHomeNurseRequestId; patient = caller };
    nextHomeNurseRequestId += 1;
    let existingRequests = switch (homeNurseRequests.get(caller)) {
      case (null) { List.empty<HomeNurseRequest>() };
      case (?reqs) { reqs };
    };
    existingRequests.add(newRequest);
    homeNurseRequests.add(caller, existingRequests);
  };

  public query ({ caller }) func getHomeNurseRequests(patient : PatientId) : async [HomeNurseRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view home nurse requests");
    };
    // Patient can view their own, or their doctor can view
    if (not (Principal.equal(caller, patient) or (isDoctor(caller) and isDoctorForPatient(caller, patient)) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Cannot access this patient's home nurse requests");
    };
    switch (homeNurseRequests.get(patient)) {
      case (null) { [] };
      case (?reqs) { reqs.toArray() };
    };
  };

  // Doctor Dashboard - View all patients
  public query ({ caller }) func getAllPatients() : async [(PatientId, PatientProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view patients");
    };
    if (not (isDoctor(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only doctors can view all patients");
    };
    patients.toArray();
  };

  // Doctor Dashboard - Get patients assigned to this doctor
  public query ({ caller }) func getMyPatients() : async [(PatientId, PatientProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view patients");
    };
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can view their patients");
    };
    let allPatients = patients.toArray();
    allPatients.filter<(PatientId, PatientProfile)>(
      func((patientId, profile) : (PatientId, PatientProfile)) : Bool {
        switch (profile.primaryDoctor) {
          case (?doc) { Principal.equal(doc, caller) };
          case (null) { false };
        };
      }
    );
  };

  // Doctor Dashboard - Get all alerts for doctor's patients
  public query ({ caller }) func getMyPatientsAlerts() : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view alerts");
    };
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can view patient alerts");
    };
    let allAlerts = alerts.toArray();
    let doctorAlerts = List.empty<Alert>();
    for ((patientId, alertList) in allAlerts.values()) {
      if (isDoctorForPatient(caller, patientId)) {
        let alertsArray = alertList.toArray();
        for (alert in alertsArray.values()) {
          doctorAlerts.add(alert);
        };
      };
    };
    doctorAlerts.toArray();
  };
};
