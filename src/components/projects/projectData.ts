import aitrafficimg from '../../assets/aitrafficnavigator.png';
import cryptocurrencytracker from '../../assets/cryptocurrency tracker.jpg';
import personalfinancetracker from '../../assets/personal-finance-tracker.png';
import portfolioimage from '../../assets/portfolioimagecover.avif';
export type Project = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  date: string;
  summary: string;
  description: string;
  highlights: string[];
  tech: string[];
  image: string;
  imageAlt: string;
  status?: string;
  githubUrl?: string;
  demoUrl?: string;
};

// Swap these temporary dog-image URLs for real project screenshots when ready.
// Add each project's GitHub / live-demo URL here; the interface will reveal the links automatically.
export const projects: Project[] = [
  {
    id: 'traffic-navigator',
    number: '01',
    title: 'AI Traffic Navigator',
    shortTitle: 'Traffic Navigator',
    category: 'Full-stack · Cloud deployed',
    date: 'FEB 2026',
    summary: 'Every route tells a story. See the traffic before it happens.',
    githubUrl: 'https://github.com/vivekpatric/traffic_analyser_fullstack',
    demoUrl: 'https://traffic-analyzer-4yy5.vercel.app/',
    description:
      'A traffic-aware navigation platform built for comparing routes, reading live heatmaps and anticipating congestion before it becomes a delay.',
    highlights: [
      'Destination-based forecasts estimate congestion up to 10 minutes ahead.',
      'JWT-authenticated Spring Boot APIs use HTTP-only cookies for session protection.',
      'Route-history analytics reduced redundant API calls by 35%.',
    ],
    tech: ['React.js', 'Spring Boot', 'PostgreSQL', 'Mapbox GL JS', 'Docker', 'JWT'],
    image:
      aitrafficimg,
    imageAlt: 'Temporary dog-photo placeholder for the AI Traffic Navigator project',
  },
  {
    id: 'crypto-tracker',
    number: '02',
    title: 'Cryptocurrency Tracker',
    shortTitle: 'Crypto Tracker',
    category: 'Real-time data · Market analytics',
    date: 'JAN 2025',
    summary: 'A live pulse on the market, from price movement to portfolio history.',
    githubUrl:'https://github.com/vivekpatric/crypto-tracker-fullstack',
    description:
      'A market-monitoring platform that turns external crypto feeds into an at-a-glance live dashboard with portfolio, transaction and analytics views.',
    highlights: [
      'WebSocket updates keep visible price information moving in real time.',
      'Spring Boot REST APIs manage portfolios and transaction history.',
      'Responsive dashboards use dynamic charts and lightweight motion.',
    ],
    tech: ['React.js', 'Spring Boot', 'WebSocket', 'REST APIs', 'JavaScript'],
    image:
      cryptocurrencytracker,
    imageAlt: 'Temporary dog-photo placeholder for the Cryptocurrency Tracker project',
  },
  {
    id: 'finance-tracker',
    number: '03',
    title: 'Personal Finance Tracker',
    shortTitle: 'Finance Tracker',
    category: 'Personal finance · Data visualisation',
    date: 'SEP 2023',
    summary: 'Make money easier to understand, one well-designed dashboard at a time.',
    githubUrl:'https://github.com/vivekpatric/personal-finance-tracker',
    demoUrl: 'https://personal-financetracker-patric.netlify.app/',
    description:
      'A personal finance application designed to make everyday money management clearer through intuitive summaries, live data updates and flexible CSV workflows.',
    highlights: [
      'Firebase provides secure data storage and real-time updates.',
      'Ant Design components shape the dashboard and financial visualisations.',
      'PapaParse supports importing and exporting financial records as CSV.',
    ],
    tech: ['React.js', 'Firebase', 'Ant Design', 'PapaParse', 'JavaScript'],
    image:
      personalfinancetracker,
    imageAlt: 'Temporary dog-photo placeholder for the Personal Finance Tracker project',
  },
];

export const featuredProjects: Project[] = [
  projects[0],
  projects[1],
  projects[2],
  {
    id: 'fluid-cursor-lab',
    number: '04',
    title: 'Fluid Cursor Lab',
    shortTitle: 'Fluid Cursor Lab',
    category: 'Creative coding · In progress',
    date: 'EXPERIMENT 01',
    summary: 'A playground for liquid motion, responsive trails and expressive interactions.',
    description:
      'An ongoing creative-coding exploration around fluid cursor simulations, motion feel and the small details that make an interface feel alive.',
    highlights: [
      'GPU-friendly experiments with pointer-driven motion and colour.',
      'GSAP and Three.js ideas for transitions and interactive depth.',
      'An evolving sandbox rather than a finished client project.',
    ],
    tech: ['React', 'TypeScript', 'WebGL', 'GSAP', 'Three.js'],
    image:
      portfolioimage,
    imageAlt: 'Temporary dog-photo placeholder for the Fluid Cursor Lab experiment',
    status: 'IN PROGRESS',
  },
];
