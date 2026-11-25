import { readdirSync } from "node:fs";
import { join } from "node:path";
import NotFoundPage from "@/features/not-found/NotFoundPage";

export default function NotFound() {
  let videoSrc: string | null = null;
  let mobileVideoSrc: string | null = null;
  try {
    const files = readdirSync(join(process.cwd(), "public", "404"));
    const video = files.find((file) => file.toLowerCase() === "404.mp4.mp4")
      ?? files.find((file) => file.toLowerCase() === "404.mp4")
      ?? files.find((file) => /\.(mp4|webm)$/i.test(file));
    if (video) videoSrc = `/404/${encodeURIComponent(video)}`;
    const mobileVideo = files.find((file) => file.toLowerCase() === "404-mobile-cropped.mp4")
      ?? files.find((file) => file.toLowerCase() === "404-responsive.mp4");
    if (mobileVideo) mobileVideoSrc = `/404/${encodeURIComponent(mobileVideo)}`;
  } catch {
    // The media folder may not yet be present in a fresh checkout.
  }

  return <NotFoundPage videoSrc={videoSrc} mobileVideoSrc={mobileVideoSrc} />;
}
