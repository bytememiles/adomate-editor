import { Suspense } from 'react';
import Providers from '../providers';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <Providers>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </Providers>
  );
}
