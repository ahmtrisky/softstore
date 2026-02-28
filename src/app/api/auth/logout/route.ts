import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  // Clear any auth cookies if needed
  return response
}
