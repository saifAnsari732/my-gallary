import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const image = await Image.findById(id);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const image = await Image.findById(id);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from ImageKit using their API
    const privateKey = process.env.PRIVATE_KEY;
    if (privateKey && image.fileId) {
      try {
        const authHeader = Buffer.from(privateKey + ":").toString("base64");
        await fetch(`https://api.imagekit.io/v1/files/${image.fileId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${authHeader}`,
          },
        });
      } catch (ikError) {
        console.error("ImageKit deletion failed (continuing with DB delete):", ikError);
      }
    }

    // Delete from MongoDB
    await Image.findByIdAndDelete(id);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
