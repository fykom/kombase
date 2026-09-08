import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { Icons } from '@/components/icons';
import { siteConfig } from '@/site';

const githubLink: LinkItemType = {
  external: true,
  icon: <Icons.gitHub className="size-4" />,
  text: 'Github',
  type: 'icon',
  url: siteConfig.links.github,
};

const baseOptions: BaseLayoutProps = {
  links: [
    {
      text: 'Docs',
      url: '/docs',
    },
    githubLink,
  ],
  nav: {
    title: (
      <>
        <Icons.logo className="size-4" />
        <span className="in-[.uwu]:hidden font-medium in-[header]:text-[15px]">
          {siteConfig.name}
        </span>
      </>
    ),
  },
};

export const docsOptions: Omit<DocsLayoutProps, 'tree'> = {
  ...baseOptions,
  links: [githubLink],
  sidebar: { defaultOpenLevel: 1 },
};
