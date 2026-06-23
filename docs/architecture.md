# Ecotrackify Architecture & Delivery Plan

## 1. Product Scope
Ecotrackify is a MERN web app that helps consumers and businesses measure their carbon footprint, set sustainability goals, and share eco-friendly practices. The MVP for this sprint must cover:
- Authentication with email verification + password reset
- Carbon source tracking (transport, energy, waste, custom)
- Goal management with progress tracking & reminders
- Community tips & moderation
- Dashboard with charts (per-source breakdown, goal progress)
- Notifications preferences & delivery hooks
- Business analytics workspace for aggregated employee data

## 2. Guiding Principles
- Material Design 3 via MUI; shared theme for consistent palette and typography
- Strong validation on both frontend (React Hook Form + Zod) and backend (Joi)
- Clear user feedback via snackbars, helper texts, and empty states
- Accessibility first: semantic HTML, ARIA labels, color contrast checks, focus states
- Modular mono-repo: server/ (Express) and client/ (Vite React)
- Config via .env files (sample committed), no secrets in repo

## 3. System Architecture
`
[Client SPA]
  React + Vite + MUI
  React Query for data, Zustand for lightweight UI state
  React Router for routing
        |
[REST API]
  Node + Express + MongoDB (Mongoose)
  JWT auth + refresh tokens
  Nodemailer for email confirmations
  Agenda.js for scheduled reminders
        |
[MongoDB Atlas]
  Users, EmissionEntries, Goals, Tips, Notifications, Businesses
`
Supporting services: Cloudinary (optional) for avatars, SendGrid/SMTP for mails (abstracted, mocked locally).

## 4. Data Model Snapshot
- User: name, email, hashedPassword, roles (user, usiness_admin), profile, notificationPrefs, verification + reset tokens
- EmissionEntry: userId, category enum, subType, quantity, units, calculatedCO2e, date, notes, dataSource
- Goal: userId or businessId, title, targetValue, currentValue, unit, cadence, dueDate, status, history[]
- Tip: authorId, title, body, tags[], likes[], isApproved
- Notification: userId, type, payload, read, sentAt
- Business: name, domain, admins[], employees[], resources[], aggregatedStats

## 5. API Surface (v1)
| Method | Route | Purpose |
| --- | --- | --- |
| POST | /auth/register | Register + send email |
| POST | /auth/login | Login + JWT pair |
| POST | /auth/refresh | Renew access token |
| POST | /auth/forgot | Issue reset link |
| POST | /auth/reset | Reset password |
| GET  | /users/me | Profile + dashboard stats |
| PATCH| /users/me | Update profile/preferences |
| POST | /emissions | Create entry (validates date >= today-1yr etc) |
| GET  | /emissions | List & aggregate |
| PATCH| /emissions/:id | Update |
| DELETE | /emissions/:id | Delete |
| POST | /goals | Create goal with realism checks |
| GET  | /goals | List & progress analytics |
| PATCH| /goals/:id | Update status/progress |
| POST | /tips | Submit community tip (moderated) |
| GET  | /tips | Search tips + like |
| POST | /tips/:id/like | Toggle like |
| GET  | /notifications | Notification inbox |
| PATCH| /notifications/:id/read | Mark read |
| POST | /business | Create business account |
| GET  | /business/dashboard | Aggregated analytics |

## 6. Validation & Business Rules
- Registration: strong password, MX-validated email, unique domain constraint for business invites
- Emissions: numbers >= 0, quantity upper-bounded per category, date not in future, units validated
- Goals: SMART defaults (min duration 7 days, target within realistic range of baseline), auto progress snapshots
- Tips: profanity filter + max length, flagged words blocked
- Notifications: throttle repeated reminders, user-managed quiet hours

## 7. Frontend Experience
- Pages: Landing, Auth (login/register/reset), Dashboard, Carbon Tracker, Goals, Community, Notifications, Business HQ, Settings
- Shared layout with responsive drawer + top app bar; uses ThemeProvider with custom palette
- Forms powered by React Hook Form + Zod, show inline helper texts + success snackbars
- Dashboard visuals: Recharts (Pie + Line) + stat cards
- Accessibility: skip links, focus rings, aria-live for toasts, high-contrast palette (#1B5E20 primary)

## 8. Delivery Plan
1. Bootstrap repo: server + client scaffolding, shared linting, scripts
2. Implement backend auth, emissions, goals, tips, business modules with services + tests
3. Build frontend routes/components consuming API, add Material theme + responsive design
4. Add validation, notifications, scheduled jobs, and sample seed data script
5. QA: run ESLint, unit/integration tests, mock e2e flows (w/ Thunder Client collection)

This plan will drive the implementation tracked in the TODO list.
