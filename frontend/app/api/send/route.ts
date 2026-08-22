import { sendRequestSchema } from "@/app/schemas/validations";
import { NextResponse } from "next/server";
import z from "zod";



export async function POST(request: Request) {
    const body = await request.json();
const parsedData =sendRequestSchema.safeParse(body);

    if (!parsedData.success) {
        return NextResponse.json({
            message: "Invalid input data",
            // flatten().fieldErrors turns the Zod errors into a clean object
            // e.g., { amount: ["Amount is required"] }
            errors: z.treeifyError(parsedData.error), 
        }, {
            status: 400
        });
    }

    const data = parsedData.data;

}