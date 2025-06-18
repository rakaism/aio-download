import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "URL Diperlukan",
      },
      {
        status: 400,
      }
    );
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST_TT;

  if (!rapidApiKey || !rapidApiHost) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error: missing environment variables",
      },
      { status: 500 }
    );
  }

  const apiUrl = `https://${rapidApiHost}/analysis?url=${encodeURIComponent(
    videoUrl
  )}&hd=0`;

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
    console.error("Error in API route: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
