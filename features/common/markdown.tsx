import Markdoc, { Config } from "@markdoc/markdoc";
import React from "react";

interface Props {
  content: string;
}

export const Markdown = (props: Props) => {
  const ast = Markdoc.parse(props.content);

  const content = Markdoc.transform(ast, {
    ...citationConfig,
  });

  return (
    <div className="prose prose-zinc">
      {Markdoc.renderers.react(content, React, {
        components: {},
      })}
    </div>
  );
};

export const citationConfig: Config = {
  nodes: {},
  tags: {},
};
