import * as zip from "@zip.js/zip.js";

const cache = new Map<string, Blob>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const servers = [
    "https://osu.direct/d/",
    "https://catboy.best/d/",
    "https://proxy.nerinyan.moe/d/", // nerinyan my beloved
  ];

  let audioStream = null;
  let blob = null;

  if (cache.has(id!)) {
    blob = cache.get(id!)!;
  } else {
    blob = await getBlob(servers, id!);

    console.log("Blob", blob);

    if (!blob) {
      return new Response("Not Found", { status: 404 });
    }

    cache.set(id!, blob);
    setTimeout(() => cache.delete(id!), 5 * 60 * 1000);
  }

  audioStream = await unzipBlob(blob);

  let isShortVer = false;
  if (!audioStream) {
    const previewUrl = `https://b.ppy.sh/preview/${id}.mp3`;
    audioStream = await fetch(previewUrl).then((res) => res.blob());
    isShortVer = true;
  }

  const stream = audioStream.stream();
  const reader = stream.getReader();

  if (!request) {
    return;
  }

  const range = request?.headers.get("Range");
  if (range) {
    const CHUNK_SIZE = 128 * 1024; // 128 KB
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = Math.min(start + CHUNK_SIZE - 1, blob.size - 1);
    const chunkSize = end - start + 1;

    // Read the range from the stream
    const rangeStream = new ReadableStream({
      start(controller) {
        let position = 0;

        reader.read().then(function processText({ done, value }) {
          try {
            if (done) {
              controller.close();
              return;
            }

            const chunk = value.slice(start, end + 1);
            controller.enqueue(chunk);

            position += chunk.length;
            if (position >= chunkSize) {
              controller.close();
            }

            reader.read().then(processText);
          } catch (_) {}
        });
      },
    });

    return new Response(rangeStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${blob.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "audio/mp3",
        Connection: "keep-alive",
      },
    });
  }

  return new Response(audioStream, {
    headers: {
      "Content-Type": "audio/mp3",
      "Content-Length": audioStream.size.toString(),
      "Cache-Control": `public, max-age=${isShortVer ? 0 : 31536000}`,
    },
  });
}

async function getBlobFromUrl(url: string, id: string) {
  return await fetch(url + id, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  })
    .then(async (res) => {
      if (!res.ok) return { url: url, blob: null };
      return { url: url, blob: res.blob() };
    })
    .catch((_) => {
      return { url: url, blob: null };
    });
}

async function getBlob(servers: string[], id: string) {
  let promises = servers.map((server) => getBlobFromUrl(server, id));

  for (const p of promises) {
    const data = await p;

    if (await data.blob) {
      return await data.blob;
    }
  }

  return null;
}

async function unzipBlob(blob: Blob) {
  try {
    const reader = new zip.ZipReader(new zip.BlobReader(blob));
    const files = (await reader.getEntries()) || [];

    for (const file of files) {
      if (!file.filename.endsWith(".osu")) continue;

      const text = await file.getData!(new zip.TextWriter("utf-8"));
      for (const line of text.split("\n")) {
        if (!line.startsWith("AudioFilename:")) continue;

        const audioFilename = line.split(":")[1].trim();
        const audioFile = files.find((f) => f.filename === audioFilename);

        if (!audioFile) {
          console.error("Audio file not found in beatmap");
          break;
        }

        return await audioFile.getData!(
          new zip.BlobWriter(`audio/${audioFilename.split(".").pop()}`)
        );
      }
    }
  } catch (e) {
    console.error("Failed to extract audio from beatmap");
    console.error(e);
  }
}
