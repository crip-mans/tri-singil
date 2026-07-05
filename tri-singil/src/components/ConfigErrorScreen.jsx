// Deliberately styled inline, not with Tailwind classes — this screen must
// still render clearly even if something else in the build pipeline is broken.
function ConfigErrorScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '32rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Tri-Singil isn't configured yet
        </h1>
        <p style={{ color: '#4b5563', lineHeight: 1.5 }}>
          <code>VITE_SUPABASE_URL</code> and/or <code>VITE_SUPABASE_ANON_KEY</code> are
          missing or invalid (the URL must start with <code>https://</code>).
          Set them in your <code>.env</code> file (local) or your Vercel project's
          Environment Variables (production), then reload the page.
        </p>
      </div>
    </div>
  )
}

export default ConfigErrorScreen
