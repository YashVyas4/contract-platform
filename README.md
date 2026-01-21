# Contract Management Platform

A simple contract management app I built to practice **blueprint-based form generation** and **backend-enforced lifecycle rules**.

You can create a **Blueprint** (template with fields), generate a **Contract** from it, fill values, and then move the contract through a strict lifecycle (with validation handled on the backend).

---

## What this project does

- Create blueprint templates with custom fields  
- Generate contracts from those blueprints  
- Update field values until the contract is locked/revoked  
- Enforce contract lifecycle transitions safely on the backend  
- View contracts on a dashboard with filters (pending / active / signed)

---

## Tech stack

### Backend
- Node.js + Express  
- SQLite (better-sqlite3)  
- Zod for request validation  
- CORS enabled  
- Runs with nodemon during development

### Frontend
- React + Vite + TypeScript  
- Fetch-based API calls (no heavy libraries)

### Storage
- File-based SQLite DB (`server/data.db`) to keep setup simple

---

## Getting it running locally

### 1) Backend
```bash
cd server
npm install
cp env.example .env   # optional, defaults to PORT=4000
npm run dev           # start API using nodemon
# npm start           # run without reload
```

Backend runs on:
 http://localhost:4000

---

### 2) Frontend
```bash
cd client
npm install
cp env.example .env   # set VITE_API_BASE (default http://localhost:4000)
npm run dev
```

Frontend runs on:
 http://localhost:5173

> The frontend expects the backend URL from `VITE_API_BASE`.

---

## How it’s built (high-level)

- Blueprints define fields (label, type, and canvas position)
- Contracts are created from a blueprint
- Contract fields are stored per contract so the values are independent
- Backend controls status transitions (frontend can’t skip steps)

---

## API summary

Base URL: `/api`

### Blueprints
- `POST /blueprints` → create blueprint  
- `GET /blueprints` → list blueprints  
- `GET /blueprints/:id` → get blueprint  
- `PUT /blueprints/:id` → update blueprint (replaces fields)  
- `DELETE /blueprints/:id` → delete blueprint + fields  

### Contracts
- `POST /contracts` → create contract from blueprint  
- `GET /contracts?filter=pending|active|signed` → list contracts  
- `GET /contracts/:id` → contract details + allowed transitions  
- `PUT /contracts/:id/fields` → update values (blocked for Locked/Revoked)  
- `POST /contracts/:id/transition` → move lifecycle  

---

## Contract lifecycle rules

Allowed flow:
**Created → Approved → Sent → Signed → Locked**

Special rule:
- **Revoked** is allowed only from **Created** or **Sent**
- **Locked** and **Revoked** are terminal states

Backend rejects:
- invalid transitions  
- field edits after Locked/Revoked  

---

## Data model (SQLite)

- `blueprints(id, name, description, created_at, updated_at)`
- `blueprint_fields(id, blueprint_id, label, type, position_x, position_y)`
- `contracts(id, blueprint_id, name, status, created_at, updated_at)`
- `contract_fields(id, contract_id, blueprint_field_id, label, type, position_x, position_y, value)`

---

## UI flow (how to use it)

1. Create a blueprint with fields  
2. Create a contract using that blueprint  
3. Fill/update the field values  
4. Use the lifecycle buttons to move status forward  
5. View everything in the dashboard (filters + status badges)

---

## Assumptions / shortcuts I took

- No authentication (APIs are open) — kept it simple for the assignment/demo  
- Stored values as **text** in SQLite (checkbox uses `"true"`/`"false"`)  
- Updating a blueprint replaces its fields (existing contracts stay unchanged)  
- SQLite is file-based for quick setup — can be swapped with a hosted DB later

---

## Tests

No automated tests yet.

For quick validation:
- Use the UI
- Or hit endpoints using Postman/cURL

Frontend build check:
```bash
cd client
npm run build
```
