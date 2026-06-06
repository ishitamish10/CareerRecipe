/**
 * Fixed, animated gradient-mesh background that sits behind all content.
 * Three blurred blobs drift slowly; a faint grid + grain add depth.
 */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* drifting color blobs */}
      <div
        className="absolute -left-[10%] -top-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-50 blur-[110px]"
        style={{
          background: "radial-gradient(circle at 30% 30%, var(--primary), transparent 60%)",
          animation: "float-blob 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-15%] top-[5%] h-[50vmax] w-[50vmax] rounded-full opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--accent), transparent 60%)",
          animation: "float-blob 26s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[20%] h-[45vmax] w-[45vmax] rounded-full opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--primary-2), transparent 60%)",
          animation: "float-blob 30s ease-in-out infinite",
        }}
      />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 80%)",
        }}
      />
    </div>
  );
}
