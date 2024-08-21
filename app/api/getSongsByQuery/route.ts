import { getSongsByQuery } from "@/app/actions/getSongsByQuery";

export async function POST(request: Request) {
  const { cursor, query } = await request.json();
  const cookie = request.headers.get("Cookie");
  const access_token = cookie?.split("osu_access_token=")[1]?.split(";")[0];

  if (!access_token || !cookie) {
    return new Response(JSON.stringify({ message: "No data" }), {
      status: 400,
    });
  }

  const result = await getSongsByQuery(access_token, query, cursor || "");

  // Handle the result
  if (result) {
    return new Response(JSON.stringify(result), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: "No data" }), {
      status: 404,
    });
  }
}
