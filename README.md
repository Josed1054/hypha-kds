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

## Run with Docker (Primary)

### Prerequisites

- Docker Engine/Desktop
- Docker Compose plugin (`docker compose`)

### Development mode (default, hot reload)

First run:

```bash
docker-compose up --build
```

Subsequent runs:

```bash
docker-compose up
```

Stop services:

```bash
docker-compose down
```

Restart backend/frontend after dependency or env changes:

```bash
docker-compose restart backend frontend
```

This mode uses `docker-compose.yml` and applies source changes from `backend/src` and `frontend/src` without rebuilding images.

### Production-like mode (immutable images)

```bash
docker-compose -f docker-compose.prod.yml up --build
```

This mode uses `docker-compose.prod.yml` and runs immutable built images (source edits do not reflect until rebuild).

### URLs

- Frontend: [http://localhost:5173](http://localhost:5173)
- Frontend routes:
  - [http://localhost:5173/main](http://localhost:5173/main)
  - [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
  - [http://localhost:5173/new-order](http://localhost:5173/new-order)
  - [http://localhost:5173/all-in-one](http://localhost:5173/all-in-one)
- GraphQL HTTP endpoint: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- GraphQL WS endpoint: `ws://localhost:4000/graphql`

## Podman Compose (Secondary)

Use the same flow as Docker, replacing `docker compose` with `podman-compose`.

```bash
podman-compose up --build
podman-compose up
podman-compose -f docker-compose.prod.yml up --build
```

## Contributor Commands (Optional)

These are maintenance/verification commands and not required to run the app.

```bash
npm run codegen
npm run test
npm run build
```

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
