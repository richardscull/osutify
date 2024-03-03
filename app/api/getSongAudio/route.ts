import * as zip from "@zip.js/zip.js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const servers = [
    "https://proxy.nerinyan.moe/d/",
    "https://osu.direct/d/",
    "https://catboy.best/d/",
  ];

  let audioStream = null;
  let blob = null;

  for (let i = 0; i < servers.length; i++) {
    blob = await getBlobFromUrl(servers[i] + id);
    if (blob) break;
  }

  if (blob) {
    const reader = new zip.ZipReader(new zip.BlobReader(blob));
    const files = (await reader.getEntries()) || [];

    for (const file of files) {
      if (file.filename.endsWith(".osu")) {
        await file.getData!(new zip.TextWriter()).then(async (text) => {
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("AudioFilename:")) {
              const audioFilename = line.split(":")[1].trim();
              const audioFile = files.find((f) => f.filename === audioFilename);

              if (audioFile) {
                const mp3Blob = await audioFile.getData!(
                  new zip.BlobWriter(`audio/${audioFilename.split(".").pop()}`)
                );
                audioStream = mp3Blob;
              }

              break;
            } // 🧗 <- This is Jack. Jack loves climbing overly nested things.
          }
        });
        break;
      }
    }
  }

  if (!audioStream) {
    const previewUrl = `https://b.ppy.sh/preview/${id}.mp3`;
    audioStream = await fetch(previewUrl).then((res) => res.blob());
  }

  return new Response(audioStream, {
    headers: {
      "Content-Type": "audio/mp3",
      "Content-Length": audioStream.size.toString(),
      "Cache-Control": "public, max-age=31536000",
    },
  });
}

async function getBlobFromUrl(url: string) {
  return await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  })
    .then((res) => {
      if (!res.ok) return null;
      return res.blob();
    })
    .catch((err) => {
      console.error(err); // Got "socketError: other side closed" some times, need to investigate
      return null;
    });
}
