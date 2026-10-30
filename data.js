// Embedded site data for the terminal site.
// Kept separate from app.js so content can be edited without touching logic.
const SITE_DATA = {
  name: 'Elias Zeiner',
  handle: 'elias',
  host: 'tundra-node',
  title: 'tundra-node',
  email: 'eliaspublic@icloud.com',
  url: 'https://eliasz.codeberg.page',
  codeberg: 'https://codeberg.org/eliasz',
  linkedin: 'https://www.linkedin.com/in/eliaszeiner',
  description: 'Privacy tools, homelab projects, cybersecurity notes, and open source software.',
  bio: 'Privacy engineer, homelabber, and open-source contributor. I build tools for I2P, NixOS systems, and secure software. Currently exploring cybersecurity and self-hosted infrastructure.',
  status: 'active',
  uptime: '47 days, 12:03:15',
  shell: 'zsh 5.9',
  kernel: '5.15.0-tundra',
  distro: 'tundraOS 7.2 (static)',
  terminal: 'kitty',
  editor: 'neovim',
  packages: '284',
  
  links: [
    { label: 'about', cmd: 'about', desc: 'who I am and what I do' },
    { label: 'projects', cmd: 'projects', desc: 'privacy tools, homelab, open source' },
    { label: 'contact', cmd: 'contact', desc: 'how to reach me' },
    { label: 'codeberg', cmd: 'codeberg', desc: 'https://codeberg.org/eliasz' },
    { label: 'linkedin', cmd: 'linkedin', desc: 'https://www.linkedin.com/in/eliaszeiner' },
    { label: 'help', cmd: 'help', desc: 'list available commands' },
    { label: 'clear', cmd: 'clear', desc: 'clear the terminal screen' }
  ],
  
  projects: [
    {
      id: 'nix-config',
      title: 'Nix Config',
      desc: 'Personal NixOS and home-manager configuration with declarative system management.',
      repo: 'https://codeberg.org/eliasz/nix-config',
      stack: ['nix', 'nixos'],
      status: 'active'
    },
    {
      id: 'cuekeeper',
      title: 'CueKeeper',
      desc: 'LAN-based theater sound cue manager. Load audio, sequence cues, trigger locally or remotely over WebSocket.',
      repo: 'https://codeberg.org/eliasz/CueKeeper',
      stack: ['python', 'websockets'],
      status: 'active'
    },
    {
      id: 'i2p-easy-manager',
      title: 'I2P Easy Manager',
      desc: 'Lightweight tool for simplified I2P network access with automated I2Pd and Firefox setup.',
      repo: 'https://codeberg.org/eliasz/i2p-easy-manager',
      stack: ['python'],
      status: 'active'
    },
    {
      id: 'nexus',
      title: 'Nexus',
      desc: 'Monorepo for two self-hosted I2P tools — a public I2P search engine and a router dashboard.',
      repo: 'https://codeberg.org/eliasz/nexus',
      stack: ['react', 'python', 'fastapi', 'docker'],
      status: 'wip'
    },
    {
      id: 'chronicle',
      title: 'Chronicle',
      desc: 'A "life operating system" desktop app for everyday users. Personal tracking in Rust with egui.',
      stack: ['rust', 'egui', 'sqlite'],
      status: 'wip'
    },
    {
      id: 'fbla-cybersecurity-2026',
      title: 'FBLA Cybersecurity Study App',
      desc: 'Interactive 100-question study app for FBLA Cybersecurity with flashcards, mock quizzes, and a progress tracker.',
      url: 'https://eliasz.codeberg.page/fbla-cybersecurity-2026/',
      repo: 'https://codeberg.org/eliasz/fbla-cybersecurity-2026',
      stack: ['react', 'typescript', 'vite', 'tailwind'],
      status: 'active',
      highlight: true
    }
  ]
};