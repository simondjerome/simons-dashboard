export async function GET() {
  const token = process.env.TODOIST_API_TOKEN;
  if (!token) {
    return Response.json({ error: "Todoist isn't connected yet." }, { status: 503 });
  }

  const res = await fetch("https://api.todoist.com/api/v1/tasks?filter=today", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) return Response.json({ error: "Todoist connection failed." }, { status: res.status });
  const data = await res.json();
  return Response.json({ tasks: data.results || [] });
}

export async function POST(request) {
  const token = process.env.TODOIST_API_TOKEN;
  if (!token) return Response.json({ error: "Todoist isn't connected yet." }, { status: 503 });

  const { id } = await request.json();
  const res = await fetch(`https://api.todoist.com/api/v1/tasks/${id}/close`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return Response.json({ error: "Couldn't complete task." }, { status: res.status });
  return Response.json({ ok: true });
}