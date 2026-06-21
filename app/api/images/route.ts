import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newImage = await Image.create(body);
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error creating image record:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    
    let query = {};
    if (category && category !== "All") {
      query = { category };
    }

    const images = await Image.find(query).sort({ uploadDate: -1 });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
