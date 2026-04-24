import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://localhost:8000/api/chat/";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Forward the request to Django
    const response = await fetch(DJANGO_API_URL, {
      method: "POST",
      body: formData,
      // Note: We don't need to manually set content-type for FormData, 
      // fetch will do it with the correct boundary.
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Django server error" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Next.js Proxy Error:", error);
    return NextResponse.json({ 
      error: "Could not connect to Django backend.", 
      details: "Ensure your Django server is running on http://localhost:8000" 
    }, { status: 500 });
  }
}
