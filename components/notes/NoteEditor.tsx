"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useTheme } from "@/lib/theme-context";

type NoteEditorProps = { content: string; onChange: (value: string) => void };
type FormatAction = { label: string; title: string; syntax: string; mode: "wrap" | "linePrefix" };

const FORMAT_ACTIONS: FormatAction[] = [
  { label: "B", title: "Fett (Ctrl+B)", syntax: "**", mode: "wrap" },
  { label: "I", title: "Kursiv (Ctrl+I)", syntax: "*", mode: "wrap" },
  { label: "S", title: "Durchgestrichen", syntax: "~~", mode: "wrap" },
  { label: "H1", title: "Überschrift 1", syntax: "# ", mode: "linePrefix" },
  { label: "H2", title: "Überschrift 2", syntax: "## ", mode: "linePrefix" },
  { label: "`", title: "Code", syntax: "`", mode: "wrap" },
];

export default function NoteEditor({ content, onChange }: NoteEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDark } = useTheme();
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (!isFullscreen) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    textareaRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current || document.activeElement !== textareaRef.current) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b") { e.preventDefault(); applyFormat("**", "wrap"); }
        if (e.key === "i") { e.preventDefault(); applyFormat("*", "wrap"); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const applyFormat = (syntax: string, mode: "wrap" | "linePrefix") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    let newContent: string, newStart: number, newEnd: number;

    if (mode === "wrap") {
      const selected = content.slice(start, end);
      newContent = content.slice(0, start) + syntax + selected + syntax + content.slice(end);
      newStart = start + syntax.length;
      newEnd = end + syntax.length;
    } else {
      const lineStart = content.lastIndexOf("\n", start - 1) + 1;
      const currentLine = content.slice(lineStart);
      if (currentLine.startsWith(syntax)) {
        newContent = content.slice(0, lineStart) + content.slice(lineStart + syntax.length);
        newStart = Math.max(lineStart, start - syntax.length);
        newEnd = Math.max(lineStart, end - syntax.length);
      } else {
        newContent = content.slice(0, lineStart) + syntax + content.slice(lineStart);
        newStart = start + syntax.length;
        newEnd = end + syntax.length;
      }
    }
    onChange(newContent);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(newStart, newEnd); }, 0);
  };

  return (
    <section
      className={`flex flex-1 flex-col overflow-hidden transition-colors ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
      style={{ background: "var(--s1)" }}
    >
      {/* Toolbar */}
      <div
        className={`flex items-center justify-between px-4 py-1.5 transition-colors ${isFullscreen ? "px-12" : "md:px-8"}`}
        style={{ background: "var(--s2)", borderBottom: "1px solid var(--bd)" }}
      >
        <div className="flex items-center gap-0.5">
          {!preview && FORMAT_ACTIONS.map((action) => (
            <button key={action.label}
              onMouseDown={(e) => { e.preventDefault(); applyFormat(action.syntax, action.mode); }}
              title={action.title}
              className={`flex h-7 min-w-[28px] items-center justify-center rounded-lg px-2 text-xs transition-all hover:bg-violet-500/10 hover:text-violet-500 active:bg-violet-500/15 ${
                action.label === "B" ? "font-extrabold" :
                action.label === "I" ? "italic font-semibold" :
                action.label === "S" ? "line-through" : "font-semibold"
              }`}
              style={{ color: "var(--t3)" }}>
              {action.label}
            </button>
          ))}
          {!preview && <div className="mx-1.5 h-4 w-px" style={{ background: "var(--bd)" }} />}

          <button
            onClick={() => setPreview((v) => !v)}
            className={`flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all ${
              preview ? "bg-violet-500/15 text-violet-500 ring-1 ring-violet-500/25" : "hover:bg-violet-500/10 hover:text-violet-500"
            }`}
            style={preview ? {} : { color: "var(--t3)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {preview
                ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
              }
            </svg>
            {preview ? "Bearbeiten" : "Vorschau"}
          </button>
        </div>

        <button onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded-lg p-1.5 transition hover:bg-[var(--s4)]"
          style={{ color: "var(--t3)" }}>
          {isFullscreen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Writing area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-violet-600/[0.03] blur-3xl" />

        <div className={`relative mx-auto flex w-full flex-1 flex-col ${isFullscreen ? "max-w-3xl px-8 pt-14" : "max-w-2xl px-8 pt-12"}`}>
          {preview ? (
            content.trim()
              ? <MarkdownRenderer content={content} dark={isDark} />
              : <p className="text-[17px]" style={{ color: "var(--t4)" }}>Noch kein Inhalt zum Anzeigen.</p>
          ) : (
            <textarea ref={textareaRef} value={content} onChange={(e) => onChange(e.target.value)}
              placeholder="Schreibe deine Notiz hier…"
              className="flex-1 resize-none bg-transparent font-[var(--font-geist-sans)] text-[17px] leading-[1.9] caret-violet-500 outline-none selection:bg-violet-500/20"
              style={{ color: "var(--t1)" }}
              // @ts-expect-error CSS custom property for placeholder
              placeholderStyle={{ color: "var(--t4)" }}
            />
          )}
        </div>

        {/* Placeholder color via global style workaround */}
        <style>{`textarea::placeholder { color: var(--t4); }`}</style>

        {/* Footer stats */}
        <div className={`relative mx-auto w-full pb-8 pt-4 ${isFullscreen ? "max-w-3xl px-8" : "max-w-2xl px-8"}`}>
          <div className="flex items-center gap-3 pt-3 text-[12px]" style={{ borderTop: "1px solid var(--bd)", color: "var(--t3)" }}>
            <span>{wordCount} Wörter</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--bd)" }} />
            <span>{content.length} Zeichen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
