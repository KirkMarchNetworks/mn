import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.marchnetworks.project1',
  appName: 'Project One',
  webDir: '../../dist/apps/project-one-client/browser',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'http://localhost:4200'
  },
  ios: {
    contentInset: 'automatic',
    appendUserAgent: "ios:application",
  },
};

export default config;
