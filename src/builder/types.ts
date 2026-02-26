export type BuilderTag =
  | 'div'
  | 'p'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'a'
  | 'button'
  | 'img'
  | 'input'
  | 'textarea'
  | 'ul'
  | 'li'
  | 'section'
  | 'header'
  | 'footer'
  | 'nav'
  | 'article';

export type BuilderNode = {
  id: string;
  tag: BuilderTag;
  content: string;
  classes: string[];
  children: BuilderNode[];
};

export type TailwindClassGroup = {
  category: string;
  classes: string[];
};

