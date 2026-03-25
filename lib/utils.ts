export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Minute${minutes !== 1 ? "n" : ""}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Stunde${hours !== 1 ? "n" : ""}`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days !== 1 ? "en" : ""}`;
}
