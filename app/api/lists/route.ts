import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import fs from "fs";
import path from "path";

const listsFilePath = path.join(process.cwd(), "data", "lists.json");

// Ensure the data directory exists
const dataDir = path.dirname(listsFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize lists file if it doesn't exist
if (!fs.existsSync(listsFilePath)) {
  fs.writeFileSync(listsFilePath, JSON.stringify({}));
}

interface ReadingList {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  books: string[]; // array of book IDs
  followers: string[]; // array of user emails
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const listId = searchParams.get("listId");
    const userId = searchParams.get("userId");

    if (listId) {
      // Get specific list
      const listsData = JSON.parse(fs.readFileSync(listsFilePath, "utf-8"));
      const list = listsData[listId];

      if (!list) {
        return NextResponse.json({ error: "List not found" }, { status: 404 });
      }

      // Check if user can view the list
      if (!list.isPublic && list.createdBy !== session?.user?.email) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      return NextResponse.json({ list });
    }

    if (userId) {
      // Get lists by user
      const listsData = JSON.parse(fs.readFileSync(listsFilePath, "utf-8"));
      const allLists = Object.values(listsData) as ReadingList[];
      const userLists = allLists.filter(
        (list) => list.createdBy === userId
      );

      return NextResponse.json({ lists: userLists });
    }

    // Get all public lists and user's private lists
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const listsData = JSON.parse(fs.readFileSync(listsFilePath, "utf-8"));
    const allLists = Object.values(listsData) as ReadingList[];

    const accessibleLists = allLists.filter(
      (list) => list.isPublic || list.createdBy === userEmail
    );

    return NextResponse.json({ lists: accessibleLists });
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch lists" },
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
    const { name, description, isPublic, books } = body;

    if (!name) {
      return NextResponse.json(
        { error: "List name is required" },
        { status: 400 }
      );
    }

    const listsData = JSON.parse(fs.readFileSync(listsFilePath, "utf-8"));
    const now = new Date().toISOString();
    const listId = `list_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newList: ReadingList = {
      id: listId,
      name,
      description: description || "",
      isPublic: isPublic || false,
      createdBy: userEmail,
      createdAt: now,
      updatedAt: now,
      books: books || [],
      followers: [],
    };

    listsData[listId] = newList;
    fs.writeFileSync(listsFilePath, JSON.stringify(listsData, null, 2));

    return NextResponse.json({ success: true, list: newList });
  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.json(
      { error: "Failed to create list" },
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
    const { listId, action, bookId, name, description, isPublic } = body;

    if (!listId) {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      );
    }

    const listsData = JSON.parse(fs.readFileSync(listsFilePath, "utf-8"));
    const list = listsData[listId];

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (list.createdBy !== userEmail) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const now = new Date().toISOString();

    switch (action) {
      case "add_book":
        if (!bookId) {
          return NextResponse.json(
            { error: "Book ID is required" },
            { status: 400 }
          );
        }
        if (!list.books.includes(bookId)) {
          list.books.push(bookId);
        }
        break;

      case "remove_book":
        if (!bookId) {
          return NextResponse.json(
            { error: "Book ID is required" },
            { status: 400 }
          );
        }
        list.books = list.books.filter((id: string) => id !== bookId);
        break;

      case "update":
        if (name !== undefined) list.name = name;
        if (description !== undefined) list.description = description;
        if (isPublic !== undefined) list.isPublic = isPublic;
        break;

      case "follow":
        if (!list.followers.includes(userEmail)) {
          list.followers.push(userEmail);
        }
        break;

      case "unfollow":
        list.followers = list.followers.filter(
          (email: string) => email !== userEmail
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    list.updatedAt = now;
    listsData[listId] = list;
    fs.writeFileSync(listsFilePath, JSON.stringify(listsData, null, 2));

    return NextResponse.json({ success: true, list });
  } catch (error) {
    console.error("Error updating list:", error);
    return NextResponse.json(
      { error: "Failed to update list" },
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
    const listId = searchParams.get("listId");

    if (!listId) {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      );
    }

    const listsData = JSON.parse(fs.readFileSync(listsFilePath, "utf-8"));
    const list = listsData[listId];

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (list.createdBy !== userEmail) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    delete listsData[listId];
    fs.writeFileSync(listsFilePath, JSON.stringify(listsData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json(
      { error: "Failed to delete list" },
      { status: 500 }
    );
  }
}
