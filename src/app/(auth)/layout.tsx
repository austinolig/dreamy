export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-[80px] font-light tracking-tight leading-tight text-white">
        Dreamy
      </h1>
      {children}
    </main>
  );
}
