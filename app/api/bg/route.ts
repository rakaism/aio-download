import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const pict = searchParams.get("url");

  if (!pict) {
    return NextResponse.json(
      {
        success: false,
        message: "Gambar belum diupload.",
      },
      {
        status: 400,
      }
    );
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST_BG;

  if (!rapidApiKey || !rapidApiHost) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error: missing environment variables",
      },
      { status: 500 }
    );
  }

  const apiUrl = `https://${rapidApiHost}/v1/results?mode=fg-image`;

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
