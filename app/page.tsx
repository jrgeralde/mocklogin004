//app/page.tsx

'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/lib/auth-client';

export default function Login() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const loginBtnRef = useRef<HTMLButtonElement>(null);

  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const handleLogin = async () => {
    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    const result = await loginAction(username, password);

    if (result.success) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    } else {
      setMessage(result.message || 'Login failed');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        {!isLoggedIn ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-center text-2xl font-bold text-gray-800">Mock Login</h2>

            <input
              ref={usernameRef}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              type="text"
              placeholder="Username"
              className="w-full rounded border border-gray-300 p-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <input
              ref={passwordRef}
              onKeyDown={(e) => handleKeyDown(e, loginBtnRef)}
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 p-2 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <button
              ref={loginBtnRef}
              onClick={handleLogin}
              className="w-full rounded bg-blue-600 p-2 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
            >
              Login
            </button>

            {message && (
              <p className="mt-2 text-center text-sm font-medium text-red-500">
                {message}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">
              {message}
            </h2>

          </div>
        )}
      </div>
    </main>
  );
}
