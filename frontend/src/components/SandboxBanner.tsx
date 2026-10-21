export function SandboxBanner() {
  return (
    <div
      className="border-b border-warning/20 bg-warning-subtle px-4 py-2.5"
      role="status"
    >
      <p className="mx-auto max-w-6xl text-center text-[13px] leading-snug text-text-muted">
        <span className="font-medium text-warning">Sandbox environment.</span>{" "}
        No real money. At PayPal checkout, sign in with your sandbox{" "}
        <span className="text-text">Personal (buyer)</span> test account.
      </p>
    </div>
  );
}
