import { getSongsByIds } from "@/app/actions/getSongsByIds";

export async function POST(request: Request) {
  const { ids } = await request.json();
  const cookie = request.headers.get("Cookie");
  const access_token = cookie?.split("osu_access_token=")[1]?.split(";")[0];

  if (!access_token || !ids || ids.length === 0) {
    return new Response(JSON.stringify({ message: "No data" }), {
      status: 400,
    });
  }

  // Call getSongsByIds function with dataToken and ids
  const result = await getSongsByIds(ids, access_token);

  // Handle the result
  if (result) {
    return new Response(JSON.stringify(result), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: "No data" }), {
      status: 404,
    });
  }
}
