import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get("access_token")) {
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

    if (!data.ok) throw new Error("Can't get user token from osu.ppy.sh");

    const json = await data.json();
    response.cookies.set("osu_access_token", json.access_token, {
      expires: new Date(Date.now() + json.expires_in * 1000),
      httpOnly: true,
      secure: true,
    });
  }

  return response;
}
