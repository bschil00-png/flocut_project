"use client";

import { Editor } from "@tiptap/react";
import { LucideIcon } from "lucide-react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  X,
  Type, // 텍스트 컬러용 아이콘
} from "lucide-react";
import { useState } from "react";

type FullPageToolbarProps = {
  editor: Editor | null;
};

// 텍스트 컬러 프리셋
const TEXT_COLORS = [
  { label: "기본", color: "inherit" },
  { label: "빨강", color: "#e5484d" },
  { label: "파랑", color: "#2563eb" },
  { label: "초록", color: "#16a34a" },
  { label: "보라", color: "#7c3aed" },
  { label: "회색", color: "#6b7280" },
];

// 형광펜 멀티 컬러 프리셋
const HIGHLIGHTS = [
  { label: "노랑", color: "#fff3a0" },
  { label: "초록", color: "#d2f4c5" },
  { label: "파랑", color: "#dbeafe" },
  { label: "핑크", color: "#fce7f3" },
];

export default function FullPageToolbar({ editor }: FullPageToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);

  if (!editor) return null;

  const handleSetLink = () => {
    const url = linkUrl.trim();
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const toggleHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  // 텍스트 컬러 적용 함수
  const applyTextColor = (color: string) => {
    if (color === "inherit") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <div className="border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
      <div className="flex flex-wrap items-center gap-1 px-4 py-2 overflow-x-auto custom-scrollbar-hide">
        <ToolButton
          icon={Undo}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="실행 취소 (Ctrl+Z)"
        />
        <ToolButton
          icon={Redo}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="다시 실행 (Ctrl+Shift+Z)"
        />

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <ToolButton
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="굵게 (Ctrl+B)"
        />
        <ToolButton
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="기울임 (Ctrl+I)"
        />
        <ToolButton
          icon={UnderlineIcon}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="밑줄 (Ctrl+U)"
        />

        {/* 텍스트 컬러 버튼 */}
        <ToolButton
          icon={Type}
          onClick={() => {
            setShowTextColor(!showTextColor);
            setShowHighlight(false);
            setShowLinkInput(false);
          }}
          active={showTextColor}
          title="글자 색상"
        />

        {/* 형광펜 버튼 (멀티 컬러 대응) */}
        <ToolButton
          icon={Highlighter}
          onClick={() => {
            setShowHighlight(!showHighlight);
            setShowTextColor(false);
            setShowLinkInput(false);
          }}
          active={editor.isActive("highlight") || showHighlight}
          title="형광펜 (Ctrl/Cmd+Shift+H)"
        />

        <ToolButton
          icon={Strikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="취소선"
        />
        <ToolButton
          icon={Code}
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="코드 (Ctrl+E)"
        />

        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1" />

        <ToolButton
          icon={Heading1}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="제목 1"
        />
        <ToolButton
          icon={Heading2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="제목 2"
        />
        <ToolButton
          icon={Heading3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="제목 3"
        />

        <div className="w-px h-6 bg-border-light dark:border-dark mx-1" />

        <ToolButton
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="글머리 기호"
        />
        <ToolButton
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="번호 매기기"
        />
        <ToolButton
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="인용"
        />

        <div className="w-px h-6 bg-border-light dark:border-dark mx-1" />

        <ToolButton icon={AlignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} />
        <ToolButton icon={AlignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} />
        <ToolButton icon={AlignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} />

        <div className="w-px h-6 bg-border-light dark:border-dark mx-1" />

        <ToolButton
          icon={LinkIcon}
          onClick={() => {
            setShowLinkInput((v) => !v);
            setShowHighlight(false);
            setShowTextColor(false);
          }}
          active={editor.isActive("link") || showLinkInput}
          title="링크"
        />

        <ToolButton
          icon={Minus}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="구분선"
        />
      </div>

      {/* 텍스트 컬러 팔레트 패널 */}
      {showTextColor && (
        <div className="px-4 py-2 border-t border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-input/50 flex items-center gap-2 animate-fadeIn">
          <div className="flex gap-1.5">
            {TEXT_COLORS.map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => applyTextColor(c.color)}
                className="w-6 h-6 rounded border border-border-light dark:border-border-dark flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: c.color === "inherit" ? "transparent" : c.color }}
                title={c.label}
              >
                {c.color === "inherit" && <X size={12} className="text-text-muted-light" />}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowTextColor(false)}
            className="ml-auto p-1.5 hover:bg-surface-light dark:hover:bg-surface-input rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 하이라이트 팔레트 */}
      {showHighlight && (
        <div className="px-4 py-2 border-t border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-input/50 flex items-center gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            {HIGHLIGHTS.map((h) => (
              <button
                key={h.color}
                type="button"
                onClick={() => toggleHighlight(h.color)}
                className="w-6 h-6 rounded border border-border-light dark:border-border-dark transition-transform hover:scale-110"
                style={{ backgroundColor: h.color }}
                title={h.label}
              />
            ))}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlight(false);
              }}
              className="ml-2 px-2 py-1 text-xs rounded border border-border-light dark:border-border-dark hover:bg-white/60 dark:hover:bg-surface-dark/50 transition-colors"
            >
              제거
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowHighlight(false)}
            className="ml-auto p-1.5 hover:bg-surface-light dark:hover:bg-surface-input rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 링크 입력 패널 */}
      {showLinkInput && (
        <div className="px-4 py-3 border-t border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-input/50 animate-fadeIn">
          <div className="flex items-center gap-2 max-w-lg">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
              className="flex-1 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark text-sm outline-none focus:ring-2 focus:ring-accent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetLink();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setShowLinkInput(false);
                }
              }}
            />
            <button
              type="button"
              onClick={handleSetLink}
              disabled={!linkUrl.trim()}
              className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              확인
            </button>

            {editor.isActive("link") && (
              <button
                type="button"
                onClick={handleRemoveLink}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                제거
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="p-1.5 rounded-lg hover:bg-surface-light dark:hover:bg-surface-input transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const ToolButton = ({
                      icon: Icon,
                      onClick,
                      active,
                      disabled,
                      title,
                    }: {
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? "bg-accent text-white"
        : "hover:bg-surface-light dark:hover:bg-surface-input text-text-primary-light dark:text-text-primary-dark"
    }`}
  >
    <Icon size={18} />
  </button>
);