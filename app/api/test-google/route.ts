import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not found" });
  }

  try {
    // Test with a simple query
    const url = `https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=${apiKey}&maxResults=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Lelib/1.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        error: "Google API Error",
        status: response.status,
        details: errorData,
      });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      totalItems: data.totalItems,
      sampleBook: data.items?.[0]?.volumeInfo?.title || "No books found",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Fetch error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
