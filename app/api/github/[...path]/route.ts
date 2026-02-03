import { NextRequest, NextResponse } from "next/server";

const GITHUB_API_BASE = "https://api.github.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const githubPath = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${GITHUB_API_BASE}/${githubPath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from GitHub API" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const githubPath = path.join("/");
  const body = await request.json();

  try {
    const response = await fetch(`${GITHUB_API_BASE}/${githubPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post to GitHub API" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const githubPath = path.join("/");
  const body = await request.json();

  try {
    const response = await fetch(`${GITHUB_API_BASE}/${githubPath}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to patch to GitHub API" },
      { status: 500 }
    );
  }
}
