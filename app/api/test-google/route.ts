import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Google API test route working" });
}
