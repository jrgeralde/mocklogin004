'use client';

import Header, { Footer } from './headerfooter';
import React from 'react';
import LoginPageGuard from '@/components/LoginPageGuard';
import SessionTimeoutWrapper from '@/components/SessionTimeoutWrapper';
import { logoutAction } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleTimeoutLogout = async () => {
    await logoutAction();
    router.push('/');
  };

  return (
    <LoginPageGuard>
      <SessionTimeoutWrapper
        timeoutMinutes={.25}   // normal value 15 minutes
        countdownSeconds={10}   // normal value 60 seconds
        onLogout={handleTimeoutLogout}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16 pb-16">
            {children}
          </main>
          <Footer />
        </div>
      </SessionTimeoutWrapper>
    </LoginPageGuard>
  );
}
