import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getPacks } from "./actions/getPacks";
import { Player } from "@/components/Player";
import { cookies } from "next/headers";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Osutify - Listen to osu! songs",
  description: "Spotify clone with osu! beatmaps",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const packs = await getPacks();

  return (
    <html lang="en">
      <body className={font.className}>
        <Sidebar packs={packs}>{children}</Sidebar>
        <Player />
      </body>
    </html>
  );
}
