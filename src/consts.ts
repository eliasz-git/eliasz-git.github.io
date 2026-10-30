export const SITE = {
  title: 'tundra-node',
  name: 'Elias Zeiner',
  author: 'Elias Zeiner',
  email: 'eliaspublic@icloud.com',
  url: 'https://eliasz.codeberg.page',
  codeberg: 'https://codeberg.org/eliasz',
  linkedin: 'https://www.linkedin.com/in/eliaszeiner',
  description:
    'Privacy tools, homelab projects, cybersecurity notes, and open source software.',
  defaultVariant: 'dark',
};

export const OG_IMAGE = `${SITE.url}/og.png`;

export function canonical(path: string) {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE.url}${clean}/`;
}
