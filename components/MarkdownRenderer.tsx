import React from "react";

function parseInline(text: string, dark: boolean): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`)/g);
  return parts.map((seg, i) => {
    if (/^\*\*[^*]+\*\*$/.test(seg)) {
      return <strong key={i} className={dark ? "font-bold text-white" : "font-bold text-slate-900"}>{seg.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(seg)) {
      return <em key={i}>{seg.slice(1, -1)}</em>;
    }
    if (/^~~[^~]+~~$/.test(seg)) {
      return <del key={i} className="opacity-50">{seg.slice(2, -2)}</del>;
    }
    if (/^`[^`]+`$/.test(seg)) {
      return (
        <code key={i} className={
          dark
            ? "rounded-md bg-violet-500/15 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-300 ring-1 ring-violet-500/20"
            : "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-700"
        }>
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}

export default function MarkdownRenderer({ content, dark = false }: { content: string; dark?: boolean }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-0">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className={`mb-4 mt-8 text-3xl font-bold tracking-tight first:mt-0 ${dark ? "text-white" : "text-slate-900"}`}>
              {parseInline(line.slice(2), dark)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className={`mb-3 mt-6 text-xl font-semibold first:mt-0 ${dark ? "text-slate-100" : "text-slate-800"}`}>
              {parseInline(line.slice(3), dark)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className={`mb-2 mt-5 text-[17px] font-semibold first:mt-0 ${dark ? "text-slate-200" : "text-slate-700"}`}>
              {parseInline(line.slice(4), dark)}
            </h3>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className={`flex items-start gap-2.5 py-0.5 text-[17px] leading-8 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              <span className={`mt-3 h-1.5 w-1.5 shrink-0 rounded-full ${dark ? "bg-violet-400" : "bg-slate-400"}`} />
              <span>{parseInline(line.slice(2), dark)}</span>
            </div>
          );
        }
        if (/^\d+\. /.test(line)) {
          const match = line.match(/^(\d+)\. (.*)$/);
          if (match) {
            return (
              <div key={i} className={`flex items-start gap-2.5 py-0.5 text-[17px] leading-8 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                <span className={`mt-1 shrink-0 text-sm font-semibold tabular-nums ${dark ? "text-violet-400" : "text-slate-500"}`}>{match[1]}.</span>
                <span>{parseInline(match[2], dark)}</span>
              </div>
            );
          }
        }
        if (line.startsWith("> ")) {
          return (
            <blockquote key={i} className={`my-1 border-l-2 py-1 pl-4 text-[17px] leading-8 italic ${dark ? "border-violet-500/50 text-slate-400" : "border-violet-400/50 text-slate-500"}`}>
              {parseInline(line.slice(2), dark)}
            </blockquote>
          );
        }
        if (line === "---" || line === "***") {
          return <hr key={i} className={`my-4 border-0 h-px ${dark ? "bg-white/[0.08]" : "bg-slate-200"}`} />;
        }
        if (line.trim() === "") {
          return <div key={i} className="h-4" />;
        }
        return (
          <p key={i} className={`text-[17px] leading-8 ${dark ? "text-slate-300" : "text-slate-700"}`}>
            {parseInline(line, dark)}
          </p>
        );
      })}
    </div>
  );
}
