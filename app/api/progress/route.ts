import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import fs from "fs";
import path from "path";

const progressFilePath = path.join(process.cwd(), "data", "progress.json");

// Ensure the data directory exists
const dataDir = path.dirname(progressFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize progress file if it doesn't exist
if (!fs.existsSync(progressFilePath)) {
  fs.writeFileSync(progressFilePath, JSON.stringify({}));
}

interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  startDate: string;
  lastReadDate: string;
  isCompleted: boolean;
  readingTime?: number; // in minutes
  notes?: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const progressData = JSON.parse(fs.readFileSync(progressFilePath, "utf-8"));
    const userProgress = progressData[userEmail] || [];

    return NextResponse.json({ progress: userProgress });
  } catch (error) {
    console.error("Error fetching reading progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading progress" },
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
    const { bookId, currentPage, totalPages, readingTime, notes } = body;

    if (!bookId || !currentPage || !totalPages) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const progressData = JSON.parse(fs.readFileSync(progressFilePath, "utf-8"));
    const userProgress = progressData[userEmail] || [];

    const now = new Date().toISOString();
    const isCompleted = currentPage >= totalPages;

    const existingIndex = userProgress.findIndex(
      (p: ReadingProgress) => p.bookId === bookId
    );

    const progressEntry: ReadingProgress = {
      bookId,
      currentPage,
      totalPages,
      startDate: existingIndex >= 0 ? userProgress[existingIndex].startDate : now,
      lastReadDate: now,
      isCompleted,
      readingTime,
      notes,
    };

    if (existingIndex >= 0) {
      userProgress[existingIndex] = progressEntry;
    } else {
      userProgress.push(progressEntry);
    }

    progressData[userEmail] = userProgress;
    fs.writeFileSync(progressFilePath, JSON.stringify(progressData, null, 2));

    return NextResponse.json({ success: true, progress: progressEntry });
  } catch (error) {
    console.error("Error updating reading progress:", error);
    return NextResponse.json(
      { error: "Failed to update reading progress" },
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

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const progressData = JSON.parse(fs.readFileSync(progressFilePath, "utf-8"));
    const userProgress = progressData[userEmail] || [];

    const filteredProgress = userProgress.filter(
      (p: ReadingProgress) => p.bookId !== bookId
    );

    progressData[userEmail] = filteredProgress;
    fs.writeFileSync(progressFilePath, JSON.stringify(progressData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reading progress:", error);
    return NextResponse.json(
      { error: "Failed to delete reading progress" },
      { status: 500 }
    );
  }
} 