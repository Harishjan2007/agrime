import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("crop_prices")
    .select(`
      id,
      price,
      unit,
      recorded_at,
      source,
      crops (
        name
      ),
      markets (
        name,
        location
      )
    `)
    .order("recorded_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}