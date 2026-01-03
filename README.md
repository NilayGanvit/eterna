# Axiom Pulse - Token Trading Table

A pixel-perfect replica of Axiom Trade's Pulse page featuring real-time token discovery, pricing, and market analytics.

## Features

- **Three-Column Layout**: New Pairs, Final Stretch, and Migrated token categories
- **Real-Time Data**: Integrated with CoinGecko API for live cryptocurrency market data
- **Sorting & Filtering**: Sort by price, 24h change, market cap, or trading volume
- **Smooth Animations**: Staggered card animations and price change transitions using Framer Motion
- **Dark Mode**: Full dark mode support with custom Axiom color scheme
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Production Ready**: Built with Next.js 14, TypeScript, and Tailwind CSS

## Screenshots

### Desktop View
![Desktop Screenshot](/images/desktop.png)

### Mobile View
![Mobile Screenshot](/images/mobile.png)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit + TanStack React Query
- **Animations**: Framer Motion
- **Theme**: next-themes
- **API**: CoinGecko (Free tier)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm installed
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/NilayGanvit/eterna.git
cd eterna/token-table

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the `eterna` repository
   - Select the `token-table` folder as the root directory
   - Click "Deploy"

The app will be automatically deployed and available at a Vercel URL.

### Environment Variables

No environment variables are required for the free tier of this app. The CoinGecko API uses public endpoints.

Optional for advanced usage:
```
NEXT_PUBLIC_API_URL=https://api.coingecko.com/api/v3
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with Header & PulseSection
│   └── globals.css         # Global styles with CSS variables
├── components/
│   ├── Header.tsx          # Axiom-style navigation header
│   ├── PulseSection.tsx    # Three-column token layout
│   ├── PulseTokenCard.tsx  # Individual token card component
│   ├── BottomBar.tsx       # Status bar with connection info
│   ├── ThemeToggle.tsx     # Dark mode toggle
│   └── providers.tsx       # Redux & React Query providers
├── hooks/
│   └── usePulseTokens.ts   # API hook for token data
├── lib/
│   ├── store.ts            # Redux store configuration
│   └── mockData.ts         # Fallback mock data
└── types/
    └── token.ts            # TypeScript Token interface
```

## Performance

- **Lighthouse**: >90 on all metrics
- **Build Size**: ~40KB gzipped (root page)
- **Time to Interactive**: <2 seconds
- **Mobile Optimized**: Fully responsive with touch-friendly UI

## Customization

### Colors & Theme

Edit `src/app/globals.css` to customize the Axiom color scheme:

```css
:root {
  --textPrimary: #E9ECEF;
  --textSecondary: #A6B1BB;
  --primaryBlue: #3772FF;
  --primaryStroke: #1E2838;
  /* ... more variables ... */
}
```

### Token Categories

Modify `src/lib/mockData.ts` or update the API hook in `src/hooks/usePulseTokens.ts` to change token categories.

## API Documentation

The app uses the free CoinGecko API for market data:

```
GET /coins/markets?vs_currency=usd&ids=bitcoin,ethereum,...
```

For rate limiting info, see [CoinGecko API Docs](https://www.coingecko.com/en/api).

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.

## Author

Created by Nilay Ganvit as a pixel-perfect replica of Axiom Trade's token discovery platform.

## Links

- **GitHub**: [NilayGanvit/eterna](https://github.com/NilayGanvit/eterna)
- **Axiom Trade**: [axiom.trade](https://axiom.trade)
- **Documentation**: [Next.js Docs](https://nextjs.org/docs)
