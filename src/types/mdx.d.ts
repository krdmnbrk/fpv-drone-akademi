declare module '*.mdx' {
  import type { ComponentType } from 'react';

  /** Exposed by remark-mdx-frontmatter; shape validated by the content loader. */
  export const frontmatter: Record<string, unknown>;

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
