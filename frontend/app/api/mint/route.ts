import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({
            status: 400,
            message: "address is required"
        })
    }


    



}

