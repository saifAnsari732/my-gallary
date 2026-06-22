import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newDoc = await Document.create(body);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Error creating document record:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const documents = await Document.find().sort({ uploadDate: -1 });
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
