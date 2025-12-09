export default function LoginPage() {
  return (
    <html lang="en">
      <body className="min-h-screen grid-bg flex items-center justify-center">
        <div className="rainbow-border max-w-md w-full mx-4">
          <div className="inner space-y-4">
            <h1 className="text-3xl font-black text-center">Admin Login</h1>
            <form
              action="/api/auth/login"
              method="POST"
              className="space-y-3"
            >
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input"
                required
              />
              <button
                type="submit"
                className="sparkle bg-gradient-to-r from-[#ff5db1] to-[#6ae3ff] w-full py-3 rounded-full font-bold text-lg border-2 border-white/70"
              >
                Enter the glitter realm
              </button>
            </form>
            <p className="text-center text-sm font-semibold">
              Protected by env var ADMIN_PASSWORD
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

