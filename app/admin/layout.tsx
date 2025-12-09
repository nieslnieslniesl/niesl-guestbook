export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="rainbow-border">
          <div className="inner">
            <header className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-black">Admin</h1>
              </div>
              <a
                className="text-sm font-bold underline"
                href="/api/auth/logout"
              >
                Uitloggen
              </a>
            </header>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

