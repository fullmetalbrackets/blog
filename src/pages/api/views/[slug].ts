import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug || slug.includes("..") || slug.includes("/")) {
    return new Response(JSON.stringify({ error: "Invalid slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const UMAMI_BASE_URL = (env as Env).UMAMI_BASE_URL ?? import.meta.env.UMAMI_BASE_URL;
  const UMAMI_USERNAME = (env as Env).UMAMI_USERNAME ?? import.meta.env.UMAMI_USERNAME;
  const UMAMI_PASSWORD = (env as Env).UMAMI_PASSWORD ?? import.meta.env.UMAMI_PASSWORD;
  const UMAMI_WEBSITE_ID = (env as Env).UMAMI_WEBSITE_ID ?? import.meta.env.UMAMI_WEBSITE_ID;

  try {
    const loginRes = await fetch(`${UMAMI_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
    });
    if (!loginRes.ok) throw new Error(`Umami auth failed: ${loginRes.status}`);

    const { token } = (await loginRes.json()) as { token: string };

    const statsUrl = new URL(
      `${UMAMI_BASE_URL}/api/websites/${UMAMI_WEBSITE_ID}/stats`
    );
    statsUrl.searchParams.set("startAt", "0");
    statsUrl.searchParams.set("endAt", String(Date.now()));
    statsUrl.searchParams.set("path", `/blog/${slug}`);

    const statsRes = await fetch(statsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!statsRes.ok) throw new Error(`Umami stats failed: ${statsRes.status}`);

    const { pageviews } = (await statsRes.json()) as { pageviews: number };

    return new Response(JSON.stringify({ views: pageviews }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("[/api/views]", err);
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};