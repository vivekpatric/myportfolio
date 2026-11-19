/**
 * Everything on the Profile page comes from your resume (vivekpatricresumeupdated.pdf).
 * Edit the values here; the page re-renders from them. Your phone number is deliberately left out of a public page.
 */
export const PROFILE = {
  name: 'Vivek Patric',
  location: 'Bangalore, Karnataka',
  email: 'patricleo223@gmail.com',
  github: 'https://github.com/vivekpatric',
  linkedin: 'https://www.linkedin.com/in/vivek-patric',
  resume: '/vivekpatricresumeupdated.pdf', // put the PDF in /public
  availability: 'Open to Java / Spring Boot roles',
};

/** The hero line cycles through these with a scramble effect. */
export const ROLES = ['Full Stack Developer', 'Java & Spring Boot engineer', 'React.js builder', 'API & systems thinker'];

export const HERO_LEAD =
  'Full stack developer from Bangalore. I build secure, cloud-deployed applications with Java, Spring Boot and React.js, and I sweat the details that make them feel good to use.';

export const ABOUT =
  "I like owning a feature from end to end: the React interface people touch, the Spring Boot API behind it, and the PostgreSQL, Docker and cloud setup that keeps it running. I build with REST APIs, JWT authentication and real-time data, and I care just as much about how an interface feels as how it is wired together.";

export const FACTS = [
  { label: 'Based in', value: 'Bangalore, Karnataka' },
  { label: 'Focus', value: 'Java · Spring Boot · React.js' },
  { label: 'Education', value: 'B.Tech CSE, VIT-AP' },
  { label: 'Practice', value: '100+ DSA problems on LeetCode and GfG' },
];

export type Stat = { to: number; decimals?: number; suffix?: string; label: string };
export const STATS: Stat[] = [
  { to: 3, label: 'Full projects built, front to back' },
  { to: 100, suffix: '+', label: 'DSA problems practised' },
  { to: 35, suffix: '%', label: 'Fewer redundant API calls in Traffic Navigator' },
  { to: 8.14, decimals: 2, label: 'CGPA, B.Tech in Computer Science' },
];

export type SkillGroup = { title: string; note: string; skills: string[] };
export const SKILL_GROUPS: SkillGroup[] = [
  { title: 'Languages', note: 'The foundations everything else is built on.', skills: ['Java', 'JavaScript', 'SQL'] },
  { title: 'Frontend', note: 'Interfaces that feel as considered as they function.', skills: ['React.js', 'HTML5', 'CSS3', 'Ant Design', 'Framer Motion'] },
  { title: 'Backend', note: 'Dependable services behind the screen.', skills: ['Spring Boot', 'REST APIs', 'Servlets', 'Hibernate', 'JDBC'] },
  { title: 'Databases', note: 'Storing data so it stays fast and trustworthy.', skills: ['PostgreSQL (Neon)', 'MySQL'] },
  { title: 'Tools & cloud', note: 'Shipping it, and keeping it shipped.', skills: ['Docker', 'Git', 'Mapbox GL JS', 'Render', 'Vercel'] },
  { title: 'Concepts', note: 'The thinking that outlasts any framework.', skills: ['Data Structures', 'OOP', 'JWT authentication', 'API design', 'Web security'] },
];

export type Moment = { when: string; title: string; text: string; kind: 'school' | 'project' };
export const JOURNEY: Moment[] = [
  { when: 'Mar 2016 – Apr 2018', title: "Learner's PU College", text: 'Karnataka State Board, finishing with 81%.', kind: 'school' },
  { when: 'Mar 2019 – Mar 2023', title: 'VIT-AP University', text: 'Bachelor of Technology in Computer Science and Engineering, CGPA 8.14.', kind: 'school' },
  { when: 'Sep 2023', title: 'Personal Finance Tracker', text: 'My first full project: React, Firebase, Ant Design dashboards and CSV import and export.', kind: 'project' },
  { when: 'Jan 2025', title: 'Cryptocurrency Tracker', text: 'Spring Boot REST APIs and WebSocket price updates behind a live portfolio dashboard.', kind: 'project' },
  { when: 'Feb 2026', title: 'AI Traffic Navigator', text: 'A cloud-deployed full stack system: Mapbox heatmaps, 10-minute congestion forecasts and JWT security.', kind: 'project' },
];

export const ACHIEVEMENTS = ['Practised 100+ data structure and algorithm problems on LeetCode and GfG.'];
export const CERTIFICATIONS = ['Java', 'Matlab'];

export const MARQUEE = ['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'Docker', 'JWT', 'REST APIs', 'WebSocket', 'Mapbox GL JS'];

export const BELIEF = ['Good technology should feel', 'clear, useful and a little bit magical.'];
