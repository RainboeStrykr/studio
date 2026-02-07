'use client';

import {
  Bookmark,
  Clapperboard,
  Compass,
  Sparkles,
  Home,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '../icons';

const menuItems = [
  { href: '/', label: 'Discover', icon: Compass },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { href: '/recommendations', label: 'For You', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold">
            Showboxd
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                tooltip={{ children: label }}
              >
                <Link href={href}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
