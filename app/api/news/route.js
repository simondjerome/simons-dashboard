export async function GET() {
  const feeds = [
    ["Reuters World", "https://feeds.reuters.com/reuters/worldNews"],
    ["BBC World", "https://feeds.bbci.co.uk/news/world/rss.xml"],
    ["Al Jazeera", "https://www.aljazeera.com/xml/rss/all.xml"]
  ];

  const articles = [];
  for (const [source, url] of feeds) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].slice(0, 6);
      for (const match of items) {
        const block = match[0];
        const title = (block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "")
          .replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        const link = (block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || "").trim();
        if (title && link) articles.push({ title, link, source });
      }
    } catch {}
  }

  const unique = [];
  const seen = new Set();
  for (const a of articles) {
    if (!seen.has(a.title)) { seen.add(a.title); unique.push(a); }
  }

  return Response.json({ articles: unique.slice(0, 12) });
}