import { CheckIcon, CopyIcon } from "lucide-react";
import {
  type ClassAttributes,
  type ComponentType,
  type HTMLAttributes,
  type JSX,
  useCallback,
  useState,
} from "react";
import type { ExtraProps } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const Pre:
  | keyof JSX.IntrinsicElements
  | ComponentType<
      ClassAttributes<HTMLPreElement> &
        HTMLAttributes<HTMLPreElement> &
        ExtraProps
      // eslint-disable-next-line react/prop-types
    > = ({ node, ...props }) => {
  // eslint-disable-next-line react/prop-types
  const code = node?.children[0];
  const [copied, setCopied] = useState(false);

  const copyCode = useCallback(
    async (code: string) => {
      if (copied) {
        return;
      }
      try {
        await window.navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    },
    [copied],
  );

  if (code && code.type === "element") {
    const className = (code.properties.className as string[] | undefined)?.join(
      " ",
    );
    const language = /language-(\w+)/.exec(className || "")?.[1];

    const codeString = code.children
      .map((child2) => (child2.type === "text" ? child2.value : ""))
      .join("\n");

    return (
      <div className="my-2 overflow-hidden rounded-lg border">
        <div className="bg-muted/50 flex h-10 items-center justify-between pl-4 pr-1">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm uppercase">
              {language ?? "unknown"}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => copyCode(codeString)}
              className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md [&_svg]:size-5"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
        <SyntaxHighlighter
          style={materialDark}
          language={language}
          customStyle={{
            borderRadius: "0",
            overflowX: "auto",
            fontSize: "0.9em",
            margin: 0,
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }
  return <pre {...props} />;
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        pre: Pre,
      }}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
}
