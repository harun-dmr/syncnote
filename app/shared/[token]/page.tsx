import type { Metadata } from "next";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Props = { params: Promise<{ token: string }> };

function decodeToken(token: string): { title: string; content: string } | null {
  try {
    const decoded = JSON.parse(decodeURIComponent(Buffer.from(token, "base64").toString("utf-8")));
    if (typeof decoded.title !== "string" || typeof decoded.content !== "string") return null;
    return { title: decoded.title ?? "", content: decoded.content ?? "" };
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const data = decodeToken(token);
  const title = data?.title ?? "Geteilte Notiz";
  const description = data?.content?.slice(0, 120).replace(/\n/g, " ") || "Eine geteilte Notiz von SyncNotes.";
  return { title: `${title} – SyncNotes`, description, openGraph: { title: `${title} – SyncNotes`, description, type: "article" } };
}

export default async function SharedNotePage({ params }: Props) {
  const { token } = await params;
  const data = decodeToken(token);

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#03030a] px-4">
        <div className="glass animate-fade-up rounded-2xl p-10 text-center shadow-2xl shadow-black/60">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 ring-1 ring-red-500/25">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(248,113,113)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Link ungültig</h1>
          <p className="mt-2 text-slate-500">Dieser Freigabelink ist abgelaufen oder ungültig.</p>
          <Link href="/login" className="animate-gradient-x mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.03]">
            Zur App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/login" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/30 transition group-hover:scale-110">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-700 transition group-hover:text-violet-600">SyncNotes</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
            <span className="text-xs font-semibold text-emerald-700">Geteilte Notiz · Nur lesen</span>
          </div>
        </div>
        {/* Gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="mb-10 text-4xl font-bold tracking-tight text-slate-900">{data.title}</h1>
        <MarkdownRenderer content={data.content} />
      </main>

      {/* Footer CTA */}
      <footer className="mx-auto mt-8 max-w-3xl border-t border-slate-200 px-6 py-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Erstellt mit SyncNotes</p>
          <Link href="/login"
            className="animate-gradient-x rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:scale-[1.03]">
            Eigene Notizen erstellen
          </Link>
        </div>
      </footer>
    </div>
  );
}
