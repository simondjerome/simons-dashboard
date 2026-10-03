function clean(value="") {
  return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
}

export async function GET() {
  const feeds = [
    ["CBC Canada", "https://www.cbc.ca/cmlink/rss-canada"],
    ["CBC World", "https://www.cbc.ca/cmlink/rss-world"]
  ];

  const articles = [];
  for (const [source, url] of feeds) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].slice(0, 10);
      for (const match of items) {
        const block = match[0];
        const title = clean(block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
        const link = clean(block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || "");
        const pubDate = clean(block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || "");
        if (title && link) articles.push({ title, link, source, pubDate });
      }
    } catch {}
  }

  const unique = [];
  const seen = new Set();
  for (const a of articles) {
    if (!seen.has(a.title)) { seen.add(a.title); unique.push(a); }
  }
  unique.sort((a,b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
  return Response.json({ articles: unique.slice(0, 12) });
}