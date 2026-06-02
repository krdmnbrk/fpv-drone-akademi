import type { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from './registry';

/** Provides the approved custom components to all MDX lesson content. */
export function MdxProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
