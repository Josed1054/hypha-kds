import { Outlet } from '@tanstack/react-router';
import { UtensilsCrossed } from 'lucide-react';
import { OrdersProvider } from '@/contexts/orders-context';
import { AppSidebar, AppSidebarSheetContent } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';

const App = (): JSX.Element => {
  return (
    <OrdersProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200">
        <div className="mx-auto grid min-h-screen max-w-[1800px] grid-cols-1 lg:grid-cols-[280px_1fr]">
          <AppSidebar />

          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-300/70 bg-background/90 px-4 backdrop-blur lg:hidden">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Hypha KDS</span>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <AppSidebarSheetContent />
                </SheetContent>
              </Sheet>
            </header>

            <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </OrdersProvider>
  );
};

export default App;
