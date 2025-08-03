import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  
  return NextResponse.json({
    message: "Test API route",
    apiKeyExists: !!apiKey,
    apiKeyValue: apiKey ? `${apiKey.substring(0, 10)}...` : "Not set",
    env: process.env.NODE_ENV
  });
} 