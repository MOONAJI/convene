/** @type {import('tailwindcss').Config} */
// Token dari UIUX.md Bagian 3 & 4. CRA 4 tidak membaca postcss.config.js,
// jadi Tailwind di-compile lewat CLI (lihat script `css:*` di package.json).
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D10',
        surface: '#14171B',
        'surface-2': '#1B1F24',
        border: '#272C33',
        ink: '#F2EFE9',
        muted: '#9AA0A8',
        disabled: '#5B6169',
        'role-fm': '#C9A24B',
        'role-investor': '#2FA57C',
        'role-auditor': '#5C7A99',
        'role-platform': '#6B7280',
        success: '#2FA57C',
        pending: '#D9A441',
        danger: '#C1503D',
        privacy: '#6C6FC4',
        redact: '#3A3D78',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
