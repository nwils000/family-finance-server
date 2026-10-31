import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.kidkapital',
  appName: 'Kid Kapital',
  webDir: 'dist',
  plugins: {
    SplashScreen: { launchShowDuration: 800, backgroundColor: '#FFF8EC', showSpinner: false },
    Keyboard: { resize: 'body' },
  },
};

export default config;
