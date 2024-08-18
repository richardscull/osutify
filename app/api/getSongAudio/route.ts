import * as zip from "@zip.js/zip.js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "0";

  const servers = [
    "https://central.catboy.best/d/{}n",
    "https://api.nerinyan.moe/d/{}?noVideo=true&noBg=true&NoHitsound=true&NoStoryboard=true",
  ];

  let audioStream = null;
  const blob = await blobRace(servers, id, servers.length);

  if (blob) {
    audioStream = await unzipBlob(blob);
  }

  let isShortVer = false;
  if (!audioStream) {
    const previewUrl = `https://b.ppy.sh/preview/${id}.mp3`;
    audioStream = await fetch(previewUrl).then((res) => res.blob());
    isShortVer = true;
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
  console.log(
    `Trying to fetch audio file from ${url.valueOf().replace("{}", id)}`
  );
  return await fetch(url.valueOf().replace("{}", id))
    .then((res) => {
      if (!res.ok) return { url: url, blob: null };
      console.log(`Found audio file at ${url}`);
      return { url: url, blob: res.blob() };
    })
    .catch((_) => {
      return { url: url, blob: null };
    });
}

async function blobRace(servers: string[], id: string, retriesLeft: number) {
  let promises = servers.map((server) => getBlobFromUrl(server, id));
  const data = await Promise.race(promises);

  if (data.blob) {
    return await data.blob;
  } else {
    servers = servers.filter((s) => s.includes(data.url) === false);
    if (!servers.length || !retriesLeft) return null;
    return await blobRace(servers, id, retriesLeft - 1);
  }
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
