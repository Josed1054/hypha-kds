import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ListOrdered,
  PlusSquare,
  Rows3,
  UtensilsCrossed,
  type LucideIcon
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type SidebarNavTone = 'light' | 'dark';

interface NavItem {
  to: '/main' | '/dashboard' | '/new-order' | '/all-in-one';
  label: string;
  description: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  closeOnNavigate?: boolean;
  tone?: SidebarNavTone;
}

const navItems: NavItem[] = [
  {
    to: '/main',
    label: 'Main View',
    description: 'Read-only board',
    icon: Rows3
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Chef status controls',
    icon: LayoutDashboard
  },
  {
    to: '/new-order',
    label: 'New Order',
    description: 'Create test orders',
    icon: PlusSquare
  },
  {
    to: '/all-in-one',
    label: 'All-in-One',
    description: 'Create and manage',
    icon: ListOrdered
  }
];

const SidebarNav = ({ closeOnNavigate = false, tone = 'light' }: SidebarNavProps): JSX.Element => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname
  });
  const isDark = tone === 'dark';

  return (
    <nav className="flex flex-col gap-2" aria-label="View navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.to;

        const linkNode = (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors',
              isDark ? 'hover:border-blue-300/30 hover:bg-slate-800/70' : 'hover:border-primary/20 hover:bg-primary/10',
              isActive
                ? isDark
                  ? 'border-blue-400/50 bg-blue-500/15'
                  : 'border-primary/30 bg-primary/15'
                : 'bg-transparent'
            )}
          >
            <Icon
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0 transition-colors',
                isDark
                  ? isActive
                    ? 'text-blue-200'
                    : 'text-slate-400 group-hover:text-blue-300'
                  : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary'
              )}
            />
            <span className="flex flex-col">
              <span
                className={cn(
                  'text-sm font-medium',
                  isDark ? (isActive ? 'text-white' : 'text-slate-100') : isActive ? 'text-foreground' : 'text-foreground/90'
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  'text-xs',
                  isDark ? (isActive ? 'text-slate-300' : 'text-slate-400') : 'text-muted-foreground'
                )}
              >
                {item.description}
              </span>
            </span>
          </Link>
        );

        if (closeOnNavigate) {
          return (
            <SheetClose asChild key={item.to}>
              {linkNode}
            </SheetClose>
          );
        }

        return linkNode;
      })}
    </nav>
  );
};

export const AppSidebar = (): JSX.Element => {
  return (
    <aside className="hidden border-r border-slate-300/70 bg-slate-900/95 px-4 py-6 text-slate-100 lg:block">
      <div className="mb-4 flex items-center gap-2">
        <UtensilsCrossed className="h-5 w-5 text-blue-300" />
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Hypha KDS</h1>
          <p className="text-xs text-slate-300">Fullstack interaction views</p>
        </div>
      </div>
      <Separator className="mb-4 bg-slate-700" />
      <SidebarNav tone="dark" />
    </aside>
  );
};

export const AppSidebarSheetContent = (): JSX.Element => {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Navigation</SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />
      <SidebarNav closeOnNavigate />
    </>
  );
};
