export const site = {
  name: 'Coffee and Data',
  url: 'https://coffeeanddata.ca',
  author: 'Marc-Olivier Arsenault',
  // Homepage tagline, homepage search/social description and RSS description.
  description: 'Notes on building data systems at scale, making sense of the data they produce, and the people behind them.',
  github: 'https://github.com/marcolivierarsenault',
  linkedin: 'https://www.linkedin.com/in/marcolivierarsenault/',
  // Google Analytics 4 property (same as the Jekyll site). Only reports from productionHost,
  // so staging and local previews of the same build never send data.
  analytics: { googleId: 'G-PZTRVPSWT5', productionHost: 'coffeeanddata.ca' },
  newsletter: {
    action: 'https://coffeeanddata.us18.list-manage.com/subscribe/post?u=0d3439b2865b0b299714d7d5a&id=bed66e1b11',
    honeypot: 'b_0d3439b2865b0b299714d7d5a_bed66e1b11',
  },
} as const;
