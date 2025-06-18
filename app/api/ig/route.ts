import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      {
        success: false,
        message: "Url tidak ditemukan.",
      },
      {
        status: 400,
      }
    );
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST_IG;

  if (!rapidApiKey || !rapidApiHost) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error: missing environment variables",
      },
      { status: 500 }
    );
  }

  const apiUrl = `https://${rapidApiHost}/convert?url=${encodeURIComponent(
    url
  )}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": rapidApiHost,
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
