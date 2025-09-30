export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-6xl font-bold tracking-tight">Dreamy</h1>
      {children}
    </main>
  );
}
