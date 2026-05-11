import { rehypeCode } from 'fumadocs-core/mdx-plugins';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import z from 'zod';
import { remarkComponent } from './app/lib/remark-component';

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [
      [
        rehypeCode,
        {
          inline: 'tailing-curly-colon',
          themes: {
            dark: 'github-dark',
            light: 'github-light',
          },
        },
      ],
    ],
    remarkPlugins: [remarkComponent, [remarkAutoTypeTable]],
  },
});

export const docs = defineDocs({
  dir: 'app/content',
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: pageSchema.extend({
      base: z.enum(['radix', 'base']).optional(),
      date: z.coerce.string().optional(),
      links: z
        .object({
          api: z.string().optional(),
          doc: z.string().optional(),
        })
        .optional(),
      preview: z.boolean().optional(),
    }),
  },
});
