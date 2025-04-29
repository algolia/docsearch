import { marked, type Token } from 'marked';
import React, { memo, useMemo, type FC } from 'react';

function parseMarkdownIntoHTMLBlocks(md: string): string[] {
  const tokens = marked.lexer(md);
  return tokens.map((token: Token) =>
    marked.parser([token], {
      gfm: true,
      breaks: true,
    }),
  );
}

const HTMLBlock: FC<{ html: string; key: string }> = ({ html, key }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} key={key} />
);

const MemoizedHTMLBlock = memo(HTMLBlock, (prev, next) => prev.html === next.html);
MemoizedHTMLBlock.displayName = 'MemoizedHTMLBlock';

export const MemoizedMarkdown = memo(({ content, id }: { content: string; id: string }) => {
  const htmlBlocks = useMemo(() => parseMarkdownIntoHTMLBlocks(content), [content]);

  return (
    <div className="DocSearch-Markdown-Content">
      {htmlBlocks.map((html, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <MemoizedHTMLBlock key={`${id}-block-${i}`} html={html} />
      ))}
    </div>
  );
});
MemoizedMarkdown.displayName = 'MemoizedMarkdown';
