/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Route handlers under app/api provide the backend, so we run as a Node
  // server (Azure App Service / Static Web Apps hybrid). A full static export
  // (`output: 'export'`) is intentionally NOT used because it cannot host the
  // /api routes that talk to Azure Table Storage.
  images: {
    // Recipe artwork ships from /public; no remote optimization needed.
    unoptimized: true,
  },
};

export default nextConfig;
