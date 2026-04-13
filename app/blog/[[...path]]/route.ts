import { NextRequest } from "next/server";

const WP_ORIGIN = "https://118.27.100.221";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const wpPath = "/blog" + (path ? "/" + path.join("/") : "");
  const url = new URL(request.url);
  const queryString = url.search;

  const res = await fetch(`${WP_ORIGIN}${wpPath}${queryString}`, {
    headers: {
      Host: "ai-hack-portal.com",
      "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
      "X-Forwarded-Proto": "https",
      "User-Agent": request.headers.get("user-agent") || "",
      Accept: request.headers.get("accept") || "",
      "Accept-Language": request.headers.get("accept-language") || "",
      Cookie: request.headers.get("cookie") || "",
    },
  });

  const body = await res.arrayBuffer();

  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    if (!["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new Response(body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const wpPath = "/blog" + (path ? "/" + path.join("/") : "");

  const res = await fetch(`${WP_ORIGIN}${wpPath}`, {
    method: "POST",
    headers: {
      Host: "ai-hack-portal.com",
      "Content-Type": request.headers.get("content-type") || "",
      Cookie: request.headers.get("cookie") || "",
      "User-Agent": request.headers.get("user-agent") || "",
    },
    body: await request.arrayBuffer(),
  });

  const body = await res.arrayBuffer();

  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    if (!["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new Response(body, {
    status: res.status,
    headers: responseHeaders,
  });
}
