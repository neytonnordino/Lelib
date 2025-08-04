import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const startIndex = searchParams.get("startIndex") || "0";
    const maxResults = searchParams.get("maxResults") || "20";

    if (!q) {
      return NextResponse.json(
        { error: "Missing search term" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    if (!apiKey || apiKey === "your_google_books_api_key_here") {
      return NextResponse.json(
        {
          error:
            "API key not configured. Please set GOOGLE_BOOKS_API_KEY in your .env.local file",
        },
        { status: 500 }
      );
    }

    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.set("q", q);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("startIndex", startIndex);
    url.searchParams.set("maxResults", maxResults);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Lelib/1.0",
        Accept: "application/json",
        Referer: "http://localhost:3001",
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Failed to parse error response" };
      }
      console.error("Google Books API error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch books", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
