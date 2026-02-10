# Specification

## Summary
**Goal:** Deliver an MVP of SmartCare Connect for post-discharge remote patient monitoring with Internet Identity login, role-based dashboards, core health tracking, alerts, and a consistent non-blue/purple visual theme.

**Planned changes:**
- Add Internet Identity sign-in with first-login role selection (Patient, Doctor/Clinician, Family Member) and role-based routing/guarded dashboard access.
- Implement backend Motoko data models + persistence for users/profiles, patient-doctor links, family access grants, vitals readings, medication reminders, follow-up appointments, emergency alerts, notification events, and home nurse booking requests.
- Build Patient dashboard: profile summary/edit, configurable connected devices list, manual vitals entry (BP, glucose, SpO2, heart rate), upcoming medication reminders and appointments, and SOS button creating an emergency alert event.
- Build Doctor/Clinician dashboard: patient roster, patient detail view with vitals timeline/table (and/or simple chart), alerts feed (SOS + abnormal vitals), and ability to mark alerts/review booking requests as reviewed.
- Implement backend abnormal-vitals threshold rules (configurable per patient with defaults) that create abnormal-vitals notification events on save.
- Add medication reminders + follow-up appointments CRUD (patient), surfaced as upcoming items; doctor can view these items read-only on patient detail.
- Add Family Member read-only access via patient-managed grants: family dashboard listing granted patients and read-only patient status (recent vitals, alerts, upcoming reminders/appointments).
- Add Patient home nurse booking request form and doctor view of submitted requests.
- Add an in-app Health Q&A chatbot UI backed by a curated FAQ/guided prompts (no external AI), including a prominent “not medical advice” disclaimer and safe fallback for unknown questions.
- Apply a coherent, distinct visual theme (typography, colors, spacing, cards, alert states) avoiding a blue/purple primary palette.
- Add and use generated static brand/UI imagery (logo, landing hero/banner, vitals icons) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can sign in with Internet Identity, pick their role, and access a role-appropriate dashboard to record/view vitals, manage reminders and appointments, trigger/view alerts (including abnormal vitals), manage family access, request a home nurse, and use a basic in-app health Q&A with disclaimers—within a consistent SmartCare Connect visual theme.
