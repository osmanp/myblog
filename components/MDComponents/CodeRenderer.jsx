import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula, github,agate } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import _ from "lodash";

var styleConverter = _.cond([
  [_.matches("js"), _.constant(dracula)],
  [_.matches("javascript"), _.constant(dracula)],
  [_.matches("typescript"), _.constant(agate)],
  [_.matches("terminal"), _.constant(github)]
]);

const CodeRenderer = ({ language, showLineNumbers, value }) => {
  const _language = language || "js";
  const _showLineNumbers = showLineNumbers || false;
  return (
    <SyntaxHighlighter
      language={_language}
      style={styleConverter(_language)}
      showLineNumbers={_showLineNumbers}
    >
      {value ? value : null}
    </SyntaxHighlighter>
  );
};

export default CodeRenderer;
