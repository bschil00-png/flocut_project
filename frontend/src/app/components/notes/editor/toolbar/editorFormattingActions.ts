import { Editor } from "@tiptap/react";

export function getFormattingActions(editor: Editor) {
  return {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    strike: () => editor.chain().focus().toggleStrike().run(),
    code: () => editor.chain().focus().toggleCode().run(),

    h1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    h2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    h3: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),

    bullet: () => editor.chain().focus().toggleBulletList().run(),
    ordered: () => editor.chain().focus().toggleOrderedList().run(),
    quote: () => editor.chain().focus().toggleBlockquote().run(),

    alignLeft: () => editor.chain().focus().setTextAlign("left").run(),
    alignCenter: () => editor.chain().focus().setTextAlign("center").run(),
    alignRight: () => editor.chain().focus().setTextAlign("right").run(),

    highlight: () =>
      editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run(),

    hr: () => editor.chain().focus().setHorizontalRule().run(),

    setColor: (color: string) =>
      editor.chain().focus().setColor(color).run(),
  };
}
