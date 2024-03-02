import { getSongsByIds } from "@/app/actions/getSongsByIds";

export async function POST(request: Request) {
  const { access_token, ids } = await request.json();

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
