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
    const returnData = await getQueueData({ queueList: data, queues });
    console.log("kefyyy", returnData);
    return NextResponse.json(returnData);
  } catch (error) {
    console.log("as you need", error);
    return NextResponse.json({ error });
  }
}
