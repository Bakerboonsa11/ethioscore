'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  headerTitle: string;
  headerDescription?: string;
  headerActions?: ReactNode;
  notifications?: number;
  navItems: NavItem[];
  onLogout?: () => void;
}

export function DashboardLayout({
  children,
  title,
  headerTitle,
  headerDescription,
  headerActions,
  notifications,
  navItems,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={navItems} title={title} onLogout={onLogout} />
      
      <div className="flex-1 md:ml-0">
        <Header
          title={headerTitle}
          description={headerDescription}
          actions={headerActions}
          notifications={notifications}
        />
        
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
