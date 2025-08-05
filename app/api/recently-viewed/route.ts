import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import fs from "fs";
import path from "path";

const recentlyViewedFilePath = path.join(process.cwd(), "data", "recently-viewed.json");

// Ensure the data directory exists
const dataDir = path.dirname(recentlyViewedFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize recently viewed file if it doesn't exist
if (!fs.existsSync(recentlyViewedFilePath)) {
  fs.writeFileSync(recentlyViewedFilePath, JSON.stringify({}));
}

interface RecentlyViewedBook {
  bookId: string;
  viewedAt: string;
  viewCount: number;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const recentlyViewedData = JSON.parse(fs.readFileSync(recentlyViewedFilePath, "utf-8"));
    const userRecentlyViewed = recentlyViewedData[userEmail] || [];

    // Sort by most recently viewed and limit results
    const sortedRecentlyViewed = userRecentlyViewed
      .sort((a: RecentlyViewedBook, b: RecentlyViewedBook) => 
        new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      )
      .slice(0, limit);

    return NextResponse.json({ recentlyViewed: sortedRecentlyViewed });
  } catch (error) {
    console.error("Error fetching recently viewed books:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently viewed books" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await req.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const recentlyViewedData = JSON.parse(fs.readFileSync(recentlyViewedFilePath, "utf-8"));
    const userRecentlyViewed = recentlyViewedData[userEmail] || [];

    const now = new Date().toISOString();
    const existingIndex = userRecentlyViewed.findIndex(
      (book: RecentlyViewedBook) => book.bookId === bookId
    );

    if (existingIndex >= 0) {
      // Update existing entry
      userRecentlyViewed[existingIndex].viewedAt = now;
      userRecentlyViewed[existingIndex].viewCount += 1;
    } else {
      // Add new entry
      userRecentlyViewed.push({
        bookId,
        viewedAt: now,
        viewCount: 1,
      });
    }

    // Keep only the last 50 entries to prevent the list from growing too large
    const limitedRecentlyViewed = userRecentlyViewed
      .sort((a: RecentlyViewedBook, b: RecentlyViewedBook) => 
        new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      )
      .slice(0, 50);

    recentlyViewedData[userEmail] = limitedRecentlyViewed;
    fs.writeFileSync(recentlyViewedFilePath, JSON.stringify(recentlyViewedData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating recently viewed books:", error);
    return NextResponse.json(
      { error: "Failed to update recently viewed books" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    const recentlyViewedData = JSON.parse(fs.readFileSync(recentlyViewedFilePath, "utf-8"));
    const userRecentlyViewed = recentlyViewedData[userEmail] || [];

    if (bookId) {
      // Remove specific book from recently viewed
      const filteredRecentlyViewed = userRecentlyViewed.filter(
        (book: RecentlyViewedBook) => book.bookId !== bookId
      );
      recentlyViewedData[userEmail] = filteredRecentlyViewed;
    } else {
      // Clear all recently viewed books
      delete recentlyViewedData[userEmail];
    }

    fs.writeFileSync(recentlyViewedFilePath, JSON.stringify(recentlyViewedData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recently viewed books:", error);
    return NextResponse.json(
      { error: "Failed to delete recently viewed books" },
      { status: 500 }
    );
  }
} 