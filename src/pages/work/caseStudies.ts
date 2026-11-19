/**
 * Case-study copy for the Work page, keyed by project id (see projectData.ts).
 * Everything is written from the resume. Edit any line that doesn't match how you really built it:
 * the page renders whatever is here, so an honest edit is always safe.
 */
export type Audience = { who: string; need: string; how: string };
export type Step = { title: string; text: string };
export type Layer = { tag: string; title: string; items: string[] };
export type Decision = { question: string; choice: string; why: string };
export type Outcome = { to?: number; suffix?: string; text?: string; label: string };

export type CaseStudy = {
  id: string;
  kicker: string;
  problem: string;
  meta: { label: string; value: string }[];
  audience: Audience[];
  goals: string[];
  steps: Step[];
  layers: Layer[];
  decisions: Decision[];
  outcomes: Outcome[];
  next: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'traffic-navigator',
    kicker: 'Traffic-aware navigation',
    problem:
      'A map app tells you how bad traffic is right now. It rarely tells you how bad it will be by the time you get there. I wanted one screen that compares routes side by side, paints congestion as a live heatmap and looks ten minutes ahead, so a driver can leave a little earlier or take another road before the delay exists.',
    meta: [
      { label: 'Type', value: 'Full-stack web app' },
      { label: 'Delivery', value: 'Docker, cloud deployed' },
      { label: 'Security', value: 'JWT in HTTP-only cookies' },
    ],
    audience: [
      {
        who: 'Daily commuters',
        need: 'Choose between two or three routes before leaving the house.',
        how: 'Routes are compared side by side, with congestion drawn as a heatmap instead of a number.',
      },
      {
        who: 'People on a deadline',
        need: 'Know about a jam before it forms: airport runs, interviews, appointments.',
        how: 'Destination-based forecasts look 10 minutes ahead and raise route alerts.',
      },
      {
        who: 'Repeat travellers',
        need: 'Open the app and see the trip they take every week, without starting over.',
        how: 'Route history is stored and reused, which also removes redundant API calls.',
      },
    ],
    goals: [
      'Compare several routes at once',
      'Show congestion visually, not as raw numbers',
      'Warn before a delay starts',
      'Keep every session secure',
      'Never waste a third-party API call',
    ],
    steps: [
      {
        title: 'Start from the decision the user makes',
        text: 'The real question is "leave now, or later, and which road?". Every part of the screen has to help answer it, so the map, the route list and the alerts all read from one shared state.',
      },
      {
        title: 'Separate live data from reusable data',
        text: 'Traffic changes every minute, but saved destinations and past trips barely change at all. Treating them differently means only the live part ever has to reach an external service.',
      },
      {
        title: 'Model the data in PostgreSQL',
        text: 'Users, saved destinations and route history. Route history is both a feature (quick reuse) and the raw material for the analytics step later on.',
      },
      {
        title: 'Design the API, then lock it down',
        text: 'Spring Boot REST endpoints sit behind JWT authentication. The token travels in an HTTP-only cookie, so scripts running in the page can never read it.',
      },
      {
        title: 'Add prediction, then cut redundant calls',
        text: 'The destination-based forecast produces the 10-minute congestion view and route alerts. An analytics pass over stored route history stops the app asking for things it already knows, which cut redundant API calls by 35%.',
      },
      {
        title: 'Package it so it runs anywhere',
        text: 'The backend is containerised with Docker, so it behaves the same on my laptop and in the cloud. The app is deployed on cloud platforms with a managed PostgreSQL database.',
      },
    ],
    layers: [
      { tag: 'Browser', title: 'Client', items: ['React.js interface', 'Mapbox GL JS map', 'Route comparison panel', 'Heatmap layer'] },
      { tag: 'Server', title: 'API', items: ['Spring Boot REST', 'JWT + HTTP-only cookie', 'Forecast + alerts'] },
      { tag: 'Storage', title: 'Data', items: ['PostgreSQL', 'Users', 'Route history', 'Analytics'] },
      { tag: 'Platform', title: 'Delivery', items: ['Docker container', 'Cloud deployment'] },
    ],
    decisions: [
      {
        question: 'Where should the login token live?',
        choice: 'In an HTTP-only cookie.',
        why: 'Scripts in the page cannot read it, which removes a whole class of token-theft bugs. The trade-off is configuring credentialed requests between the frontend and the API.',
      },
      {
        question: 'How do I keep third-party calls under control?',
        choice: 'Store route history and reuse it.',
        why: 'A repeated trip does not need a fresh lookup. This is where the 35% reduction in redundant calls comes from.',
      },
      {
        question: 'How far ahead should the forecast look?',
        choice: 'Ten minutes, per destination.',
        why: 'Short enough to stay believable, long enough to change a decision. Forecasting further out would have promised more than the data could back up.',
      },
    ],
    outcomes: [
      { to: 10, suffix: ' min', label: 'Congestion forecast window' },
      { to: 35, suffix: '%', label: 'Fewer redundant API calls' },
      { text: 'JWT', label: 'HTTP-only cookie sessions' },
    ],
    next: [
      'Push notifications for route alerts, so they reach people who are not looking at the app.',
      'Automated tests around the authentication and forecast flows.',
      'A published architecture diagram and API reference alongside the repository.',
    ],
  },
  {
    id: 'crypto-tracker',
    kicker: 'Real-time market monitoring',
    problem:
      'Crypto prices move every second, and a dashboard that needs a refresh button is already out of date. I wanted one place to watch live prices, keep a portfolio, and read transaction history and market analytics without ever leaving the page.',
    meta: [
      { label: 'Type', value: 'Full-stack dashboard' },
      { label: 'Live data', value: 'WebSocket price updates' },
      { label: 'Backend', value: 'Spring Boot REST APIs' },
    ],
    audience: [
      {
        who: 'Newer investors',
        need: 'See what they hold and how it is moving, without reading a trading terminal.',
        how: 'A clear portfolio view with charts that explain movement at a glance.',
      },
      {
        who: 'Active watchers',
        need: 'Prices as they change, not as they were a minute ago.',
        how: 'A WebSocket stream pushes updates the moment they arrive.',
      },
      {
        who: 'Anyone keeping records',
        need: 'Remember what was bought or sold, and when.',
        how: 'Transaction history and portfolio analytics are one tap from the dashboard.',
      },
    ],
    goals: [
      'Prices update without a refresh',
      'Portfolio and transactions are saved',
      'Dashboards stay readable on a phone',
      'Charts move, but never nag',
    ],
    steps: [
      {
        title: 'Decide what really has to be live',
        text: 'Only prices need to move continuously. Portfolio edits and history lookups are ordinary requests, so they do not need a permanent connection.',
      },
      {
        title: 'Pick the right transport for each job',
        text: 'A WebSocket carries the price stream. REST carries everything else: portfolios, transactions and analytics. Two transports, each doing what it is best at.',
      },
      {
        title: 'Bring the market data in once',
        text: 'External cryptocurrency APIs supply the raw market data. Fetching it in one place and pushing it onward keeps the interface simple: it listens to one stream, in one shape.',
      },
      {
        title: 'Build the REST surface',
        text: 'Spring Boot endpoints for portfolio management, transaction history and market analytics. Each one maps to a screen the user actually opens.',
      },
      {
        title: 'Design the dashboard around attention',
        text: 'Responsive layouts, dynamic charts and light animation. Movement tells you something changed; restraint stops it becoming noise.',
      },
    ],
    layers: [
      { tag: 'Browser', title: 'Client', items: ['React.js dashboards', 'Dynamic charts', 'WebSocket client'] },
      { tag: 'Stream', title: 'Live channel', items: ['WebSocket price updates'] },
      { tag: 'Server', title: 'API', items: ['Spring Boot REST', 'Portfolio', 'Transactions', 'Analytics'] },
      { tag: 'Feeds', title: 'Market data', items: ['External cryptocurrency APIs'] },
    ],
    decisions: [
      {
        question: 'Poll the server, or push from it?',
        choice: 'Push, over a WebSocket.',
        why: 'Polling asks the same question over and over. A WebSocket sends data only when something changes, and it feels live because it is.',
      },
      {
        question: 'One transport for everything?',
        choice: 'No. REST for records, WebSocket for the stream.',
        why: 'Saving a transaction is a request with an answer. A price feed is a conversation that never ends. Each fits a different tool.',
      },
      {
        question: 'How do I keep a constantly moving screen calm?',
        choice: 'Animate only what changed.',
        why: 'If everything moves, nothing stands out. Small, targeted motion keeps the page readable while still feeling alive.',
      },
    ],
    outcomes: [
      { text: 'Live', label: 'Prices pushed over WebSocket' },
      { to: 3, label: 'API areas: portfolio, transactions, analytics' },
      { to: 2, label: 'Transports, each used for what it does best' },
    ],
    next: [
      'Reconnect and backfill logic, so a dropped connection never leaves a gap in the charts.',
      'Price alerts the user can set per coin.',
      'Automated tests around the portfolio and transaction endpoints.',
    ],
  },
  {
    id: 'finance-tracker',
    kicker: 'Personal finance, made readable',
    problem:
      'Most people do not need another finance app. They need their own numbers to make sense. I wanted a dashboard that turns raw transactions into clear summaries, updates as the data changes, and still lets people bring their spreadsheets in and take them out again as CSV.',
    meta: [
      { label: 'Type', value: 'Front-end application' },
      { label: 'Data', value: 'Firebase, real-time' },
      { label: 'Import / export', value: 'CSV with PapaParse' },
    ],
    audience: [
      {
        who: 'Students and first-time budgeters',
        need: 'Understand where the month went without learning accounting.',
        how: 'Plain summaries and visual dashboards instead of long tables.',
      },
      {
        who: 'Spreadsheet people',
        need: 'Keep using the records they already have.',
        how: 'CSV import and export mean the app fits their existing workflow instead of replacing it.',
      },
      {
        who: 'Anyone who wants a quick monthly picture',
        need: 'Open it, glance, close it.',
        how: 'Live updates mean the dashboard is already correct when they arrive.',
      },
    ],
    goals: [
      'Make the numbers easy to read',
      'Store data securely',
      'Update the moment data changes',
      'Move records in and out as CSV',
    ],
    steps: [
      {
        title: 'Start from the questions people ask',
        text: '"Where did my money go?" and "Am I on track?" decide the screens. Features that do not help answer one of those did not make it in.',
      },
      {
        title: 'Choose a backend-light architecture',
        text: 'Firebase provides secure data storage and real-time updates, so the app can focus on the experience instead of running a server.',
      },
      {
        title: 'Keep the records simple',
        text: 'A small, flat record shape makes every summary, chart and CSV row come from the same source of truth.',
      },
      {
        title: 'Visualise with Ant Design',
        text: 'Ant Design components give the dashboards a consistent, accessible foundation, so my time went into the financial visualisations instead of re-building buttons and tables.',
      },
      {
        title: 'Make the data portable',
        text: 'PapaParse handles CSV import and export, so a user is never locked in. Their data goes where they want it.',
      },
    ],
    layers: [
      { tag: 'Browser', title: 'Interface', items: ['React.js', 'Ant Design dashboards', 'Financial charts'] },
      { tag: 'Cloud', title: 'Data layer', items: ['Firebase storage', 'Real-time updates', 'Secure access'] },
      { tag: 'Files', title: 'Portability', items: ['PapaParse', 'CSV import', 'CSV export'] },
    ],
    decisions: [
      {
        question: 'Build a backend, or use Firebase?',
        choice: 'Firebase.',
        why: 'Secure storage and real-time sync without a server to maintain. The trade-off is being tied to the Firebase data model.',
      },
      {
        question: 'Why CSV at all?',
        choice: 'Because people already live in spreadsheets.',
        why: 'Import means no one has to retype their records, and export means they can always leave with their data.',
      },
      {
        question: 'Hand-built UI, or a component library?',
        choice: 'Ant Design.',
        why: 'Consistent, tested building blocks for dashboards, which left more time for the part that matters: making the numbers clear.',
      },
    ],
    outcomes: [
      { text: 'CSV', label: 'Import and export of records' },
      { text: 'Real-time', label: 'Live updates through Firebase' },
      { text: '2023', label: 'Where this portfolio begins' },
    ],
    next: [
      'Budget targets and category limits, with a visual warning when one is close.',
      'Recurring transactions, so regular bills enter themselves.',
      'Automated tests around the CSV import edge cases.',
    ],
  },
];
