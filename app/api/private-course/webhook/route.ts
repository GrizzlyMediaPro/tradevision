import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getMuxClient, isMuxConfigured } from "@/lib/mux";

type MuxWebhookPayload = {
  type?: string;
  data?: {
    id?: string;
    upload_id?: string;
    status?: string;
    duration?: number;
    playback_ids?: { id: string; policy: string }[];
  };
};

export async function POST(req: Request) {
  if (!isMuxConfigured()) {
    return NextResponse.json({ error: "Mux not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const secret = process.env.MUX_WEBHOOK_SECRET?.trim();

  if (secret) {
    try {
      const mux = getMuxClient();
      await mux.webhooks.verifySignature(
        rawBody,
        {
          "mux-signature": req.headers.get("mux-signature") ?? "",
        },
        secret,
      );
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let payload: MuxWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MuxWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = payload.type ?? "";
  const data = payload.data;
  if (!data?.id) {
    return NextResponse.json({ ok: true });
  }

  if (type === "video.asset.ready" || type === "video.asset.created") {
    const assetId = data.id;
    const uploadId = data.upload_id;
    const playbackId =
      data.playback_ids?.find((p) => p.policy === "signed")?.id ??
      data.playback_ids?.[0]?.id ??
      null;

    const lesson =
      (uploadId
        ? await prisma.privateCourseLesson.findFirst({
            where: { muxUploadId: uploadId },
          })
        : null) ??
      (await prisma.privateCourseLesson.findFirst({
        where: { muxAssetId: assetId },
      }));

    if (lesson) {
      await prisma.privateCourseLesson.update({
        where: { id: lesson.id },
        data: {
          muxAssetId: assetId,
          muxPlaybackId: playbackId ?? lesson.muxPlaybackId,
          durationSeconds: data.duration ?? lesson.durationSeconds,
          status: type === "video.asset.ready" ? "ready" : "processing",
        },
      });
    }
  }

  if (type === "video.asset.errored") {
    const assetId = data.id;
    await prisma.privateCourseLesson.updateMany({
      where: { muxAssetId: assetId },
      data: { status: "error" },
    });
  }

  return NextResponse.json({ ok: true });
}
