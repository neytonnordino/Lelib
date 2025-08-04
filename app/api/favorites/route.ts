import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import fs from "fs";
import path from "path";

// Simple file-based storage (replace with database in production)
const FAVORITES_FILE = path.join(process.cwd(), "data", "favorites.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(FAVORITES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load favorites from file
const loadFavorites = () => {
  ensureDataDir();
  if (!fs.existsSync(FAVORITES_FILE)) {
    return {};
  }
  try {
    const data = fs.readFileSync(FAVORITES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading favorites:", error);
    return {};
  }
};

// Save favorites to file
const saveFavorites = (favorites: Record<string, string[]>) => {
  ensureDataDir();
  try {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = loadFavorites();
    const userFavorites = favorites[session.user.email] || [];

    return NextResponse.json({ favorites: userFavorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId, action } = await request.json();

    if (!bookId || !action) {
      return NextResponse.json(
        { error: "Missing bookId or action" },
        { status: 400 }
      );
    }

    const favorites = loadFavorites();
    const userEmail = session.user.email;

    if (!favorites[userEmail]) {
      favorites[userEmail] = [];
    }

    if (action === "add") {
      if (!favorites[userEmail].includes(bookId)) {
        favorites[userEmail].push(bookId);
      }
    } else if (action === "remove") {
      favorites[userEmail] = favorites[userEmail].filter(
        (id: string) => id !== bookId
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    saveFavorites(favorites);

    return NextResponse.json({
      success: true,
      favorites: favorites[userEmail],
      message:
        action === "add"
          ? "Book added to favorites"
          : "Book removed from favorites",
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
