import { NextRequest } from "next/server";

const WP_IP = "118.27.100.221";
const WP_HOST = "ai-hack-portal.com";

async function proxyToWP(request: NextRequest, method: string, wpPath: string) {
  const url = new URL(request.url);
  const queryString = url.search;

  // Use HTTP to avoid SSL cert mismatch with IP address
  // nginx will try to redirect to HTTPS, so we follow manually back to IP
  let target = `http://${WP_IP}${wpPath}${queryString}`;

  const headers: Record<string, string> = {
    Host: WP_HOST,
    "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
    "X-Forwarded-Proto": "https",
    "User-Agent": request.headers.get("user-agent") || "",
  };

  if (method === "GET") {
    headers["Accept"] = request.headers.get("accept") || "";
    headers["Accept-Language"] = request.headers.get("accept-language") || "";
  }

  const cookie = request.headers.get("cookie");
  if (cookie) headers["Cookie"] = cookie;

  if (method === "POST") {
    headers["Content-Type"] = request.headers.get("content-type") || "";
  }

  let res = await fetch(target, {
    method,
    headers,
    redirect: "manual",
    body: method === "POST" ? await request.arrayBuffer() : undefined,
  });

  // nginx redirects HTTP -> HTTPS with Location: https://ai-hack-portal.com/...
  // We need to rewrite that to http://IP and retry
  let retries = 0;
  while ([301, 302, 307, 308].includes(res.status) && retries < 3) {
    const location = res.headers.get("location");
    if (!location) break;

    // Rewrite any redirect back to our IP with HTTP
    target = location
      .replace(`https://${WP_HOST}`, `http://${WP_IP}`)
      .replace(`http://${WP_HOST}`, `http://${WP_IP}`);

    res = await fetch(target, {
      method: method === "POST" && [307, 308].includes(res.status) ? "POST" : "GET",
      headers,
      redirect: "manual",
    });
    retries++;
  }

  const body = await res.arrayBuffer();

  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!["transfer-encoding", "connection", "content-encoding"].includes(lower)) {
      if (lower === "location") {
        // Rewrite WP domain references back to our public URL
        responseHeaders.set(
          key,
          value
            .replace(`https://${WP_HOST}`, "")
            .replace(`http://${WP_HOST}`, "")
        );
      } else {
        responseHeaders.set(key, value);
      }
    }
  });

  return new Response(body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const wpPath = "/blog" + (path ? "/" + path.join("/") : "");
  return proxyToWP(request, "GET", wpPath);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const wpPath = "/blog" + (path ? "/" + path.join("/") : "");
  return proxyToWP(request, "POST", wpPath);
}
