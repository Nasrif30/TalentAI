import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "No CV text provided" },
                { status: 400 }
            );
        }

        const HF_TOKEN = process.env.HF_TOKEN;

        if (!HF_TOKEN) {
            return NextResponse.json(
                { error: "Missing Hugging Face token" },
                { status: 500 }
            );
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: `
You are an AI recruiter.

Extract structured data from this CV:

Return ONLY valid JSON:
{
  "name": "",
  "skills": [],
  "experience": [],
  "summary": ""
}

CV:
${text}
          `,
                }),
            }
        );

        const data = await response.json();

        return NextResponse.json({
            success: true,
            result: data,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "CV analysis failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}