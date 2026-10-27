// All business data lives here. Edit this file instead of hunting through components.

export const site = {
  name: 'SyntaxWeb',
  title: 'SyntaxWeb – Software House',
  tagline: 'Empowering Brands. Building Futures.',
  description:
    'SyntaxWeb is a Software House that delivers powerful digital solutions to help your brand establish, grow and lead in the digital world.',
  footerBlurb:
    'SyntaxWeb is a full-service software house providing innovative digital solutions to businesses of all sizes.',
  url: 'https://www.syntaxweb.com',
  email: 'info@syntaxweb.com',
  secondaryEmail: 'hello@syntaxweb.com',
  phone: '+92 300 1234567',
  location: 'Your Business, Worldwide',
  // Paste a Google Maps "Embed a map" src URL here to replace the map placeholder.
  mapEmbedUrl: '',

  // PLACEHOLDER social URLs — replace with your real profiles.
  socials: {
    facebook: 'https://facebook.com/syntaxweb',
    instagram: 'https://instagram.com/syntaxweb',
    linkedin: 'https://linkedin.com/company/syntaxweb',
    twitter: 'https://x.com/syntaxweb',
    youtube: 'https://youtube.com/@syntaxweb',
  },

  // PLACEHOLDER numbers — replace with your real figures before launch.
  stats: [
    { label: 'Projects Delivered', value: 150, suffix: '+' },
    { label: 'Happy Clients', value: 120, suffix: '+' },
    { label: 'Years Experience', value: 8, suffix: '+' },
    { label: 'Team Members', value: 25, suffix: '+' },
  ],

  // PLACEHOLDER budget ranges for the inquiry form — adjust to your pricing.
  budgets: ['Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000 – $50,000', '$50,000+', 'Not sure yet'],

  countryCodes: [
    { code: '+92', label: 'PK +92' },
    { code: '+1', label: 'US/CA +1' },
    { code: '+44', label: 'UK +44' },
    { code: '+971', label: 'UAE +971' },
    { code: '+966', label: 'KSA +966' },
    { code: '+974', label: 'QA +974' },
    { code: '+91', label: 'IN +91' },
    { code: '+61', label: 'AU +61' },
    { code: '+49', label: 'DE +49' },
  ],

  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Process', href: '/process' },
    { label: 'Why Us', href: '/why-us' },
    { label: 'Contact', href: '/contact' },
  ],
} as const;
