import { db } from "@/server/db";
import { getQueueData } from "@/server/queries/queue";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const { value } = await params;
  if (!value) return NextResponse.json({ error: "missing required args" });
  try {
    const data = await db.queueList.findUnique({
      where: { userId: value },
    });
    const queues = await db.queueList
      .findUnique({ where: { userId: value } })
      .queues();
    if (!data || !queues) throw "no queue";
    return NextResponse.json(await getQueueData({ queueList: data, queues }));
  } catch (error) {
    return NextResponse.json({ error });
  }
}
