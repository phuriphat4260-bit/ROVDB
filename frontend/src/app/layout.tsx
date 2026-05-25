import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export const metadata = {
  title: 'ARENA OF VALOR DB',
  description: 'Hero Gallery for RoV',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@700&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen flex antialiased overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64 min-h-screen relative">
          <TopNav />
          <main className="flex-1 p-4 md:p-12 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
