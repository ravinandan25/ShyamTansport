// Colour themes for the whole app, each with a light and a dark variant.
// Change ACTIVE_PALETTE to switch the app to another palette.
//
// primary: brand (logo tiles, invoices, outline buttons, splash background)
// secondary: main actions (buttons, quotations, "Add item")
// tertiary: third accent (Documents)
// screen/card/input/border/text/muted/faint: neutrals; danger: errors
//
// The splash background (light primary) is also set natively in
// android/app/src/main/res/values/colors.xml and ios LaunchScreen.storyboard.
export const palettes = {
  mauve: {
    light: {
      primary: '#6D6875',
      secondary: '#E5989B',
      tertiary: '#B5838D',
      screen: '#FFF5F0',
      card: '#FFFFFF',
      input: '#FFF8F5',
      border: '#F1E2DB',
      text: '#2E2A33',
      muted: '#7A7480',
      faint: '#9A94A0',
      danger: '#C0392B',
    },
    dark: {
      primary: '#9A93A3',
      secondary: '#E5989B',
      tertiary: '#C99AA4',
      screen: '#1A1619',
      card: '#241F23',
      input: '#1F1B1E',
      border: '#3A3238',
      text: '#F1E9EC',
      muted: '#B3A8B0',
      faint: '#857A82',
      danger: '#F28B82',
    },
  },
  navy: {
    light: {
      primary: '#1E3A5F',
      secondary: '#0D9488',
      tertiary: '#64748B',
      screen: '#F4F6F9',
      card: '#FFFFFF',
      input: '#F8FAFC',
      border: '#E2E8F0',
      text: '#0F172A',
      muted: '#64748B',
      faint: '#94A3B8',
      danger: '#C0392B',
    },
    dark: {
      primary: '#4A7AB0',
      secondary: '#14B8A6',
      tertiary: '#94A3B8',
      screen: '#0B1220',
      card: '#131C2E',
      input: '#0F1726',
      border: '#24324A',
      text: '#E5E9F0',
      muted: '#94A3B8',
      faint: '#64748B',
      danger: '#F28B82',
    },
  },
  indigo: {
    light: {
      primary: '#312E81',
      secondary: '#4F46E5',
      tertiary: '#7C3AED',
      screen: '#F5F6FA',
      card: '#FFFFFF',
      input: '#F9FAFB',
      border: '#E4E7EE',
      text: '#111827',
      muted: '#6B7280',
      faint: '#9CA3AF',
      danger: '#C0392B',
    },
    dark: {
      primary: '#6366F1',
      secondary: '#818CF8',
      tertiary: '#A78BFA',
      screen: '#0E0F1A',
      card: '#171929',
      input: '#121423',
      border: '#2A2D45',
      text: '#E7E8F2',
      muted: '#A1A5B8',
      faint: '#6E7290',
      danger: '#F28B82',
    },
  },
  // Taken from the peacock feather on the PDF letterhead.
  peacock: {
    light: {
      primary: '#0B4F6C',
      secondary: '#0F8B8D',
      tertiary: '#B8892E',
      screen: '#F3F7F8',
      card: '#FFFFFF',
      input: '#F7FAFB',
      border: '#DDE7EA',
      text: '#0E2A33',
      muted: '#5B7078',
      faint: '#8FA3AA',
      danger: '#C0392B',
    },
    dark: {
      primary: '#2C8DB0',
      secondary: '#17A9AB',
      tertiary: '#D9AE57',
      screen: '#0A1519',
      card: '#122229',
      input: '#0E1C21',
      border: '#203640',
      text: '#E3EEF1',
      muted: '#9DB3BA',
      faint: '#6F878F',
      danger: '#F28B82',
    },
  },
};

export const ACTIVE_PALETTE = 'peacock';

export const palette = palettes[ACTIVE_PALETTE];
