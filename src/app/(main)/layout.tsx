import { SiteHeader } from '@/components/layout/site-header';
import { SiteSidebar } from '@/components/layout/site-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { WatchlistProvider } from '@/contexts/watchlist-provider';
import { ProfileProvider } from '@/contexts/profile-provider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WatchlistProvider>
      <ProfileProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <SiteSidebar />
            <div className="flex flex-1 flex-col">
              <SiteHeader />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </ProfileProvider>
    </WatchlistProvider>
  );
}
