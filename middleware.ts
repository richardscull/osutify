import { NextResponse, NextRequest } from "next/server";

/*
 * 🍪🍪🍪🍪🍪🍪🍪🍪
 * I HATE COOKIES
 * I HATE COOKIES
 * I HATE COOKIES
 * I HATE COOKIES
 * 🍪🍪🍪🍪🍪🍪🍪🍪
 */

export async function middleware(request: NextRequest) {
  if (request.method !== "GET" || request.nextUrl.pathname.includes("/api"))
    return NextResponse.next(); // Don't run this middleware on POST requests or API routes

  const osu_access_token = request.cookies.get("osu_access_token");
  const response = NextResponse.next();

  if (!osu_access_token) {
    const data = await fetch("https://osu.ppy.sh/oauth/token", {
      body: JSON.stringify({
        client_id: process.env.OSU_CLIENT_ID,
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "public",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (data.ok) {
      const json = await data.json();
      response.cookies.set("osu_access_token", json.access_token, {
        expires: new Date(Date.now() + json.expires_in * 1000),
        httpOnly: true,
        secure: true,
      });
      response.headers.set("Refresh", "0"); // 👩‍🦽👩‍🦽👩‍🦽👩‍🦽👩‍🦽
    }
  }

  return response;
}
