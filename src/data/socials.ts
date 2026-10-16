export interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle: string;
  icon: 'instagram' | 'pinterest' | 'tiktok' | 'youtube' | 'telegram';
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/solacejewels',
    handle: '@solacejewels',
    icon: 'instagram',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    url: 'https://pinterest.com/solacejewels',
    handle: 'Solace Jewels Atelier',
    icon: 'pinterest',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://tiktok.com/@solacejewels',
    handle: '@solacejewels',
    icon: 'tiktok',
  },
];
