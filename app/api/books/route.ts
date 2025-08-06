import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the book data interface
interface BookData {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
      averageRating?: number;
      ratingsCount?: number;
    };
  }>;
  totalItems?: number;
  kind?: string;
  error?: string;
}

// Server-side cache for book details
const bookCache = new Map<string, { data: BookData; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Cache file for persistence across server restarts
const cacheFilePath = path.join(process.cwd(), "data", "book-cache.json");

// Load cache from file on startup
const loadCache = () => {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
      bookCache.clear();
      Object.entries(cacheData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'data' in value && 'timestamp' in value) {
          bookCache.set(key, value as { data: BookData; timestamp: number });
        }
      });
    }
  } catch (error) {
    console.warn("Failed to load book cache:", error);
  }
};

// Save cache to file
const saveCache = () => {
  try {
    const dataDir = path.dirname(cacheFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const cacheData: Record<string, { data: BookData; timestamp: number }> = {};
    bookCache.forEach((value, key) => {
      cacheData[key] = value;
    });

    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.warn("Failed to save book cache:", error);
  }
};

// Initialize cache
loadCache();

// Global rate limiting for all requests
const globalRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();
const GLOBAL_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const GLOBAL_MAX_REQUESTS_PER_WINDOW = parseInt(
  process.env.GLOBAL_MAX_REQUESTS_PER_MINUTE || "20"
); // Configurable via env

// Daily global rate limiting
const dailyGlobalRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();
const DAILY_GLOBAL_RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const DAILY_GLOBAL_MAX_REQUESTS = parseInt(
  process.env.DAILY_GLOBAL_MAX_REQUESTS || "2000"
); // Configurable via env

// Per-client rate limiting
const clientRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();
const CLIENT_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const CLIENT_MAX_REQUESTS_PER_WINDOW = parseInt(
  process.env.CLIENT_MAX_REQUESTS_PER_MINUTE || "10"
); // Configurable via env

// Daily per-client rate limiting
const dailyClientRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();
const DAILY_CLIENT_RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const DAILY_CLIENT_MAX_REQUESTS = parseInt(
  process.env.DAILY_CLIENT_MAX_REQUESTS || "200"
); // Configurable via env

function checkGlobalRateLimit(): boolean {
  const now = Date.now();
  const globalKey = "global";
  const record = globalRequestCounts.get(globalKey);

  if (!record || now > record.resetTime) {
    globalRequestCounts.set(globalKey, {
      count: 1,
      resetTime: now + GLOBAL_RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= GLOBAL_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function checkDailyGlobalRateLimit(): boolean {
  const now = Date.now();
  const dailyGlobalKey = "daily_global";
  const record = dailyGlobalRequestCounts.get(dailyGlobalKey);

  if (!record || now > record.resetTime) {
    dailyGlobalRequestCounts.set(dailyGlobalKey, {
      count: 1,
      resetTime: now + DAILY_GLOBAL_RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= DAILY_GLOBAL_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function checkClientRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = clientRequestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    clientRequestCounts.set(identifier, {
      count: 1,
      resetTime: now + CLIENT_RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= CLIENT_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function checkDailyClientRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = dailyClientRequestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    dailyClientRequestCounts.set(identifier, {
      count: 1,
      resetTime: now + DAILY_CLIENT_RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= DAILY_CLIENT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

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

    // Create cache key
    const cacheKey = `${q}_${startIndex}_${maxResults}`;

    // Check cache first
    const cachedData = bookCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for query: ${q}`);
      return NextResponse.json(cachedData.data);
    }

    // Check daily global rate limit first
    if (!checkDailyGlobalRateLimit()) {
      console.warn("Daily global rate limit exceeded");
      return NextResponse.json(
        {
          error: "Daily API limit exceeded. Please try again tomorrow.",
        },
        { status: 429 }
      );
    }

    // Check global rate limit
    if (!checkGlobalRateLimit()) {
      console.warn("Global rate limit exceeded");
      return NextResponse.json(
        {
          error:
            "Service temporarily unavailable due to high traffic. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Check client-specific rate limit
    const clientIP =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-client-ip") ||
      "unknown";

    // Check daily client rate limit
    if (!checkDailyClientRateLimit(clientIP)) {
      console.warn(`Daily client rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Daily request limit exceeded. Please try again tomorrow." },
        { status: 429 }
      );
    }

    if (!checkClientRateLimit(clientIP)) {
      console.warn(`Client rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
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

      // If Google API returns 429, return a more specific error
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Google Books API rate limit exceeded. Please try again later.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch books", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache the successful response
    bookCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    // Save cache to file periodically (every 10 requests)
    if (bookCache.size % 10 === 0) {
      saveCache();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
