import React from 'react';
import { ThemeProvider } from './ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
