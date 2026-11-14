import { parseDocument } from "htmlparser2";
import { createElement, Fragment, type ReactNode } from "react";

const blockTags = new Set([
  "p", "div", "ul", "ol", "li", "h2", "h3", "h4",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "blockquote", "br",
]);
const inlineTags = new Set(["strong", "b", "em", "i", "u"]);
const hiddenTags = new Set(["script", "style", "template", "iframe", "object", "svg", "math", "noscript"]);

type DescriptionNode = ReturnType<typeof parseDocument>["children"][number];

function plainText(node: DescriptionNode): string {
  if (node.type === "text") return node.data;
  if (node.type !== "tag" || hiddenTags.has(node.name)) return "";
  const text = node.children.map(plainText).join("");
  return blockTags.has(node.name) ? `\n${text}\n` : text;
}

export function productDescriptionText(description?: string | null): string {
  if (!description) return "";
  return parseDocument(description).children.map(plainText).join("").replace(/\s+/g, " ").trim();
}

export function productDescriptionEditorText(description?: string | null): string {
  if (!description || !/<\/?[a-z][^>]*>/i.test(description)) return description ?? "";
  return parseDocument(description).children.map(plainText).join("")
    .replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function renderNode(node: DescriptionNode, index: number): ReactNode {
  if (node.type === "text") return node.data;
  if (node.type !== "tag" || hiddenTags.has(node.name)) return null;
  if (node.name === "br") return <br key={index} />;
  const children = node.children.map(renderNode);
  if (blockTags.has(node.name) || inlineTags.has(node.name)) {
    return createElement(node.name, { key: index }, children);
  }
  return <Fragment key={index}>{children}</Fragment>;
}

export function ProductDescription({ description, fallback }: {
  description?: string | null;
  fallback: ReactNode;
}) {
  const nodes = parseDocument(description ?? "").children;
  if (!nodes.some((node) => plainText(node).trim())) return fallback;

  return (
    <div className="whitespace-pre-line break-words text-gray-600 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h2]:font-semibold [&_h3]:font-semibold [&_h4]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-3 [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6">
      {nodes.map(renderNode)}
    </div>
  );
}
