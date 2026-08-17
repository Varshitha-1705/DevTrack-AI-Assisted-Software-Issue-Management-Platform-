# 🛠️ DevTrack

**DevTrack — AI-Assisted Software Issue & Support Management Platform**

DevTrack is a centralized software issue management platform designed to simplify the reporting, triaging, assignment, tracking, and resolution of software issues and support tickets.

The platform leverages **AI-assisted issue triaging** to analyze issue descriptions and suggest:

- Issue Category
- Severity
- Priority
- Responsible Engineering Team

Support engineers can validate AI recommendations, assign tickets, update issue status, and monitor operational metrics through a dashboard.

DevTrack helps software teams improve issue resolution efficiency, reduce manual triaging effort, and gain visibility into operational support workflows.

---

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
</p>

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [System Architecture](#system-architecture)
- [AI Triage Pipeline](#ai-triage-pipeline)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Features](#features)
- [Ticket Lifecycle](#ticket-lifecycle)
- [Dashboard Metrics](#dashboard-metrics)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [Future Enhancements](#future-enhancements)
- [Deployment](#deployment)

---

# Problem Statement

Software teams often receive a large number of software defects, bug reports, and support tickets that require:

- Manual classification
- Priority assignment
- Severity analysis
- Team assignment
- Status tracking

Traditional support processes involve repetitive manual work, which can result in:

- Slow issue triaging
- Delayed defect resolution
- Inefficient assignment
- Poor operational visibility
- SLA breaches
- Difficulty tracking support metrics

As the number of software issues grows, support teams require intelligent systems that can assist in issue analysis and streamline support workflows.

---

# Our Solution

DevTrack provides a centralized software issue management platform with AI-assisted triaging capabilities.

| Feature | Description |
|----------|-------------|
| User Authentication | Secure login and role-based access |
| Issue Reporting | Create software support tickets |
| AI Triage | AI suggests category, severity, priority, and team |
| Validation | Engineers verify AI recommendations |
| Ticket Assignment | Assign issues to teams or engineers |
| Status Tracking | Track issue lifecycle |
| Resolution Notes | Document issue fixes |
| Dashboard | Monitor operational metrics |
| SLA Tracking | Identify overdue issues |

---

# System Architecture

```text
                     ┌────────────────────┐
                     │       User         │
                     │ Developer / Support│
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ React + TypeScript │
                     │     Frontend       │
                     └─────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                     ┌────────────────────┐
                     │ Node.js + Express  │
                     │      Backend       │
                     └─────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
      ┌────────────┐    ┌────────────┐    ┌────────────┐
      │ MongoDB    │    │ Gemini AI │    │ JWT Auth   │
      │ Database   │    │ API        │    │ RBAC       │
      └────────────┘    └────────────┘    └────────────┘
```

---

# AI Triage Pipeline

DevTrack uses AI to assist support engineers during the initial issue analysis stage.

## Step 1: User Reports an Issue

Example:

```text
Customer API returns HTTP 500 error when retrieving customer details.
```

---

## Step 2: AI Analysis

The issue description is sent to Gemini AI.

AI returns:

```text
Category: Backend
Severity: High
Priority: P1
Suggested Team: Backend Engineering
```

---

## Step 3: Human Validation

Support engineers can:

- Accept AI recommendations
- Modify AI suggestions
- Assign tickets

AI acts as an assistant, while engineers make final decisions.

---

# Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| React.js | UI Development |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | API Communication |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST APIs |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| dotenv | Environment Variables |
| CORS | Cross-Origin Support |

---

## AI & DevOps

| Technology | Purpose |
|------------|----------|
| Google Gemini API | AI Triaging |
| Postman | API Testing |
| Git | Version Control |
| GitHub | Repository |
| GitHub Actions | CI/CD |

---

# Project Structure

```text
DevTrack/
│
├── README.md
├── .gitignore
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreateTicket.tsx
│   │   │   ├── TicketList.tsx
│   │   │   └── TicketDetails.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    │
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    ├── middleware/
    ├── models/
    │   ├── User.js
    │   └── Ticket.js
    │
    ├── routes/
    ├── services/
    │   └── aiTriage.js
    │
    ├── server.js
    ├── package.json
    └── .env
```

---

# Database Design

## User Collection

```text
User
├── name
├── email
├── password
├── role
└── createdAt
```

Roles:

```text
DEVELOPER
SUPPORT_ENGINEER
ADMIN
```

---

## Ticket Collection

```text
Ticket
├── ticketId
├── title
├── description
├── component
├── category
├── severity
├── priority
├── status
├── assignedTeam
├── assignedTo
├── createdBy
├── aiAnalysis
├── resolutionNotes
├── slaBreached
├── createdAt
└── updatedAt
```

---

# Features

## Authentication

- User Registration
- Secure Login
- JWT Authentication
- Role-Based Access Control

---

## Ticket Management

- Create Ticket
- Edit Ticket
- View Ticket
- Assign Ticket
- Update Status
- Add Resolution Notes

---

## AI Triage

AI suggests:

- Category
- Severity
- Priority
- Team

Example:

```text
Issue:
API returns HTTP 500

AI Suggestion:
Category: Backend
Severity: High
Priority: P1
Team: Backend Engineering
```

---

# Ticket Lifecycle

```text
OPEN
   ↓
TRIAGED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
RESOLVED
   ↓
CLOSED
```

---

# Dashboard Metrics

DevTrack provides operational visibility through:

- Total Tickets
- Open Tickets
- Critical Issues
- In Progress
- Resolved
- Closed
- SLA Breached

Example:

```text
Total Tickets: 52
Open: 12
Critical: 5
Resolved: 26
SLA Breached: 3
```

---

# API Reference

## Authentication

| Method | Endpoint |
|----------|------------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Tickets

| Method | Endpoint |
|----------|------------|
| POST | /api/tickets |
| GET | /api/tickets |
| GET | /api/tickets/:id |
| PUT | /api/tickets/:id |
| DELETE | /api/tickets/:id |

---

## AI

| Method | Endpoint |
|----------|------------|
| POST | /api/tickets/:id/triage |

---

## Dashboard

| Method | Endpoint |
|----------|------------|
| GET | /api/dashboard/metrics |

---

# Getting Started

## Prerequisites

- Node.js 18+
- npm
- MongoDB
- Git
- Gemini API Key

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/DevTrack.git
cd DevTrack
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_api_key
```

Start backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

---

## Frontend

```env
VITE_API_URL=http://localhost:5000
```

---

# Authentication Flow

```text
User
  │
  ▼
Register
  │
  ▼
MongoDB
  │
  ▼
Password Hashing (bcrypt)
  │
  ▼
Login
  │
  ▼
JWT Generated
  │
  ▼
Token Stored
  │
  ▼
Authenticated User
```

---

# Future Enhancements

- Email notifications
- Real-time ticket updates
- File attachments
- Advanced SLA engine
- AI-generated resolution suggestions
- Chatbot integration
- Mobile application
- Multi-team workflows
- Audit logs
- Analytics dashboard

---

# Deployment

```text
                  ┌─────────────┐
                  │    User     │
                  └──────┬──────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Vercel Frontend │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Render Backend  │
                └──────┬──────────┘
                       │
            ┌──────────┼──────────┐
            ▼                     ▼
      ┌──────────┐        ┌──────────┐
      │ MongoDB  │        │ Gemini   │
      │ Atlas    │        │ API      │
      └──────────┘        └──────────┘
```

---

# Built by Varshitha

**DevTrack — Smarter Issue Management with AI.**
