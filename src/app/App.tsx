import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { queryClient } from '../lib/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}