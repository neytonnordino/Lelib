import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookIds } = body;

    if (!bookIds || !Array.isArray(bookIds)) {
      return NextResponse.json(
        { error: "bookIds array is required" },
        { status: 400 }
      );
    }

    // Limit to 10 books per request to avoid overwhelming the API
    const limitedBookIds = bookIds.slice(0, 10);

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

    // Fetch books in parallel with rate limiting
    const bookPromises = limitedBookIds.map(async (bookId, index) => {
      // Add delay between requests to avoid rate limiting
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      try {
        const url = new URL("https://www.googleapis.com/books/v1/volumes");
        url.searchParams.set("q", bookId);
        url.searchParams.set("key", apiKey);
        url.searchParams.set("maxResults", "1");

        const response = await fetch(url.toString(), {
          headers: {
            "User-Agent": "Lelib/1.0",
            Accept: "application/json",
            Referer: "http://localhost:3001",
          },
        });

        if (response.ok) {
          const data = await response.json();
          return {
            bookId,
            book: data.items?.[0] || null,
            success: true,
          };
        } else {
          return {
            bookId,
            book: null,
            success: false,
            error: `HTTP ${response.status}`,
          };
        }
      } catch (error) {
        return {
          bookId,
          book: null,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    const results = await Promise.all(bookPromises);

    // Separate successful and failed requests
    const successfulBooks = results
      .filter((result) => result.success && result.book)
      .map((result) => result.book);

    const failedRequests = results.filter((result) => !result.success);

    return NextResponse.json({
      books: successfulBooks,
      failedRequests,
      totalRequested: limitedBookIds.length,
      totalSuccessful: successfulBooks.length,
    });
  } catch (error) {
    console.error("Batch books API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
