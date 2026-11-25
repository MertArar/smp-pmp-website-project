import { notFound } from "next/navigation";
import MediaPage from "@/features/media/MediaPage";

const validTabs = [
  "all-catalog",
  "video",
  "photo",
  "user-manuals",
  "documents-certification",
  "pump-control-panel",
] as const;

export type MediaTab = (typeof validTabs)[number];

export default async function Page({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;

  if (!validTabs.some((item) => item === tab)) {
    notFound();
  }

  return <MediaPage tab={tab as MediaTab} />;
}
