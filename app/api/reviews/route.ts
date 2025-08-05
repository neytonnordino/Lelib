import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import fs from "fs";
import path from "path";

const reviewsFilePath = path.join(process.cwd(), "data", "reviews.json");

// Ensure the data directory exists
const dataDir = path.dirname(reviewsFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize reviews file if it doesn't exist
if (!fs.existsSync(reviewsFilePath)) {
  fs.writeFileSync(reviewsFilePath, JSON.stringify({}));
}

interface BookReview {
  bookId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number; // 1-5 stars
  review: string;
  createdAt: string;
  updatedAt: string;
  helpfulVotes: number;
  votedBy: string[]; // array of user emails who voted
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const reviewsData = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));
    const bookReviews = reviewsData[bookId] || [];

    // Calculate average rating
    const totalRating = bookReviews.reduce(
      (sum: number, review: BookReview) => sum + review.rating,
      0
    );
    const averageRating = bookReviews.length > 0 ? totalRating / bookReviews.length : 0;

    // Sort by helpful votes and date
    const sortedReviews = bookReviews.sort((a: BookReview, b: BookReview) => {
      if (b.helpfulVotes !== a.helpfulVotes) {
        return b.helpfulVotes - a.helpfulVotes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      reviews: sortedReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: bookReviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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
    const userName = session.user.name || userEmail;
    const body = await req.json();
    const { bookId, rating, review } = body;

    if (!bookId || !rating || !review) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const reviewsData = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));
    const bookReviews = reviewsData[bookId] || [];

    const now = new Date().toISOString();
    const existingIndex = bookReviews.findIndex(
      (r: BookReview) => r.userEmail === userEmail
    );

    const reviewEntry: BookReview = {
      bookId,
      userId: userEmail, // Using email as userId for simplicity
      userEmail,
      userName,
      rating,
      review,
      createdAt: existingIndex >= 0 ? bookReviews[existingIndex].createdAt : now,
      updatedAt: now,
      helpfulVotes: existingIndex >= 0 ? bookReviews[existingIndex].helpfulVotes : 0,
      votedBy: existingIndex >= 0 ? bookReviews[existingIndex].votedBy : [],
    };

    if (existingIndex >= 0) {
      bookReviews[existingIndex] = reviewEntry;
    } else {
      bookReviews.push(reviewEntry);
    }

    reviewsData[bookId] = bookReviews;
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviewsData, null, 2));

    return NextResponse.json({ success: true, review: reviewEntry });
  } catch (error) {
    console.error("Error creating/updating review:", error);
    return NextResponse.json(
      { error: "Failed to create/update review" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await req.json();
    const { bookId, reviewId, isHelpful } = body;

    if (!bookId || !reviewId || typeof isHelpful !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reviewsData = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));
    const bookReviews = reviewsData[bookId] || [];

    const reviewIndex = bookReviews.findIndex(
      (r: BookReview) => r.userId === reviewId
    );

    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    const review = bookReviews[reviewIndex];
    const hasVoted = review.votedBy.includes(userEmail);

    if (isHelpful && !hasVoted) {
      review.helpfulVotes += 1;
      review.votedBy.push(userEmail);
    } else if (!isHelpful && hasVoted) {
      review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
      review.votedBy = review.votedBy.filter((email: string) => email !== userEmail);
    }

    bookReviews[reviewIndex] = review;
    reviewsData[bookId] = bookReviews;
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviewsData, null, 2));

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error voting on review:", error);
    return NextResponse.json(
      { error: "Failed to vote on review" },
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

    const reviewsData = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));
    const bookReviews = reviewsData[bookId] || [];

    const filteredReviews = bookReviews.filter(
      (r: BookReview) => r.userEmail !== userEmail
    );

    reviewsData[bookId] = filteredReviews;
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviewsData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
} 