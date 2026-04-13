import { NextRequest } from "next/server";

const WP_IP = "118.27.100.221";
const WP_HOST = "ai-hack-portal.com";

async function proxyToWP(request: NextRequest, method: string, wpPath: string) {
  const url = new URL(request.url);
  const queryString = url.search;
  const target = `https://${WP_IP}${wpPath}${queryString}`;

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

  const fetchOptions: RequestInit = {
    method,
    headers,
    redirect: "manual",
    // @ts-expect-error Node.js fetch option to skip TLS verification
    rejectUnauthorized: false,
  };

  if (method === "POST") {
    headers["Content-Type"] = request.headers.get("content-type") || "";
    fetchOptions.body = await request.arrayBuffer();
  }

  let res = await fetch(target, fetchOptions);

  // Handle redirects manually to keep Host header pointing to WP
  if ([301, 302, 307, 308].includes(res.status)) {
    const location = res.headers.get("location");
    if (location) {
      const redirectUrl = location
        .replace(`https://${WP_HOST}`, `https://${WP_IP}`)
        .replace(`http://${WP_HOST}`, `https://${WP_IP}`);
      res = await fetch(redirectUrl, {
        method: method === "POST" && [307, 308].includes(res.status) ? "POST" : "GET",
        headers,
        redirect: "manual",
        // @ts-expect-error Node.js fetch option
        rejectUnauthorized: false,
      });
    }
  }

  const body = await res.arrayBuffer();

  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!["transfer-encoding", "connection", "content-encoding"].includes(lower)) {
      // Rewrite location headers to use our domain
      if (lower === "location") {
        responseHeaders.set(key, value.replace(`https://${WP_HOST}`, "").replace(`http://${WP_HOST}`, ""));
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
