import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import App from '@/App';
import { AllInOneView } from '@/views/AllInOneView';
import { DashboardView } from '@/views/DashboardView';
import { MainView } from '@/views/MainView';
import { NewOrderView } from '@/views/NewOrderView';

const rootRoute = createRootRoute({
  component: App
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/main' });
  }
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main',
  component: MainView
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardView
});

const newOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-order',
  component: NewOrderView
});

const allInOneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/all-in-one',
  component: AllInOneView
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mainRoute,
  dashboardRoute,
  newOrderRoute,
  allInOneRoute
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent'
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
