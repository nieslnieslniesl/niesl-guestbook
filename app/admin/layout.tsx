import '../globals.css';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen grid-bg">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="rainbow-border">
            <div className="inner">
              <header className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-black">Admin Dashboard</h1>
                  <p className="font-semibold text-sm">
                    Moderate the chaos. Approve the sparkle.
                  </p>
                </div>
                <a
                  className="text-sm font-bold underline"
                  href="/api/auth/logout"
                >
                  Logout
                </a>
              </header>
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

