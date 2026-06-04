import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // 5173 is occupied by ../tgl's dev stack on this host — default to 5174.
  const port = env.PORT ? parseInt(env.PORT, 10) : 5174;

  // Listen on all interfaces so the app is reachable over Tailscale
  // (IP or MagicDNS name), not just localhost — same setup as ../tgl.
  const server = {
    host: true,
    port,
    strictPort: true,
    // Allow Tailscale MagicDNS hostnames through Vite's Host-header check;
    // without this, requests to the node's name get a 403.
    // 'bluefin' = short host name; '.tailnet.internal' = this tailnet's
    // MagicDNS domain; '.ts.net' covers a standard tailnet domain too.
    allowedHosts: ['bluefin', '.tailnet.internal', '.ts.net'],
  };

  return {
    server,
    preview: server,
  };
});
