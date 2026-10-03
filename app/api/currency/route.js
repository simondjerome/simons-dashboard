export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=CAD&to=USD,GBP,EUR,AUD,SGD", { cache: "no-store" });
    if (!res.ok) throw new Error("Exchange rate request failed");
    const data = await res.json();
    return Response.json({ rates: data.rates, date: data.date });
  } catch {
    return Response.json({ error: "Couldn't load exchange rates." }, { status: 502 });
  }
}
