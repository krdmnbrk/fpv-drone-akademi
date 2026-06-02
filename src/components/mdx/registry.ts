import type { MDXComponents } from 'mdx/types';
import { Callout } from './Callout';
import { KeyTerm } from './KeyTerm';
import { PartHighlight } from './PartHighlight';
import { DemoPlaceholder } from './DemoPlaceholder';

/** The only custom components allowed in lesson MDX. */
export const mdxComponents: MDXComponents = {
  Callout,
  KeyTerm,
  PartHighlight,
  DemoPlaceholder,
};
