# Hypha KDS Challenge (Full-Stack)

Kitchen Display System (KDS) demo built with:
- Backend: Node.js + Express + Apollo GraphQL + TypeScript + MongoDB + GraphQL subscriptions (`graphql-ws`)
- Frontend: React + TypeScript + Apollo Client + TanStack Router + Tailwind CSS v4 + shadcn/ui
- Infra: Docker + Docker Compose

## Project Structure

```text
hypha-kds-challenge/
├── backend/
│   ├── src/
│   │   ├── graphql/
│   │   │   ├── resolvers/
│   │   │   └── schema.graphql
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── generated/
│   │   ├── pubsub.ts
│   │   └── server.ts
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── graphql/
│   │   ├── generated/
│   │   └── lib/
│   └── Dockerfile
├── codegen.ts
├── docker-compose.prod.yml
├── docker-compose.yml
└── package.json
```

## Functional Highlights

- `Order` data model with enum status: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- GraphQL operations:
  - `getOrders`
  - `createOrder`
  - `updateOrderStatus`
  - `orderUpdated` subscription (emits on create + status updates)
- Service-layer validation:
  - Rejects empty/blank `items`
  - Enforces valid status transitions (`PENDING -> IN_PROGRESS -> COMPLETED`)
- Frontend dashboard with 3 columns and mutation buttons on cards
- Frontend multi-view shell:
  - `/main` (read-only board)
  - `/dashboard` (status update controls)
  - `/new-order` (order input)
  - `/all-in-one` (input + live interactive board)
- Real-time UI updates from GraphQL subscriptions
- Optimistic UI for `updateOrderStatus`
- Jest tests for `createOrder` resolver and status transition service logic

## Local Development

### Prerequisites
- Node.js 20+
- npm 10+
- MongoDB running locally (or use Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure env files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Generate GraphQL types

```bash
npm run codegen
```

### 4. Run backend + frontend

```bash
npm run dev
```

### URLs
- Frontend: [http://localhost:5173](http://localhost:5173)
- Frontend routes:
  - [http://localhost:5173/main](http://localhost:5173/main)
  - [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
  - [http://localhost:5173/new-order](http://localhost:5173/new-order)
  - [http://localhost:5173/all-in-one](http://localhost:5173/all-in-one)
- GraphQL HTTP endpoint: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- GraphQL WS endpoint: `ws://localhost:4000/graphql`

## Podman Compose Modes

### Development Mode (hot reload, default)

First run:

```bash
podman-compose up --build
```

Subsequent runs:

```bash
podman-compose up
```

### Production-like Mode (immutable images)

```bash
podman-compose -f docker-compose.prod.yml up --build
```

Ports in both modes:
- Frontend: `5173`
- Backend: `4000`
- MongoDB: `27017`

Behavior notes:
- Source changes in `backend/src` and `frontend/src` auto-apply in development mode (no image rebuild needed).
- Changes to `package.json`, `.env`, or `VITE_*` values require container restart:
  - `podman-compose restart backend frontend`
- Dockerfile or base image changes still require rebuild:
  - `podman-compose up --build`

## GraphQL Examples

### Create Order

```graphql
mutation CreateOrder {
  createOrder(input: { items: ["Burger", "Fries"] }) {
    id
    items
    status
    createdAt
  }
}
```

### Get Orders

```graphql
query GetOrders {
  getOrders {
    id
    items
    status
    createdAt
  }
}
```

### Update Order Status

```graphql
mutation UpdateStatus {
  updateOrderStatus(input: { id: "<ORDER_ID>", status: IN_PROGRESS }) {
    id
    status
  }
}
```

### Subscribe to Updates

```graphql
subscription OrderUpdated {
  orderUpdated {
    id
    items
    status
    createdAt
  }
}
```

## Tests

Run backend tests:

```bash
npm run test
```

Covered scenarios:
- `createOrder` success path
- `createOrder` rejects empty `items`
- `createOrder` rejects whitespace-only items
- `createOrder` defaults status to `PENDING`
- Service transition rules:
  - Reject `PENDING -> COMPLETED`
  - Accept `PENDING -> IN_PROGRESS -> COMPLETED`

## Architecture Notes

Backend is intentionally layered:
1. GraphQL schema (`schema.graphql`)
2. Resolver layer (`graphql/resolvers/*`)
3. Service layer (`services/orderService.ts`)
4. Model layer (`models/Order.ts`)

This keeps business validation out of resolver files and makes the domain logic testable.

## Type Safety Notes

- Root `codegen.ts` is configured to generate:
  - Backend resolver typings to `backend/src/generated/graphql.ts`
  - Frontend operation typings to `frontend/src/generated/graphql.ts`
- In this environment, package registry access may be restricted. If so, run `npm install` + `npm run codegen` in a networked environment to regenerate the files.
