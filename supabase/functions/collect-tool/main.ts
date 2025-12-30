import { z } from "jsr:@zod/zod@4.2.1";

type MyResponse = { status: number, message: string, data: any };


function myres(res: MyResponse): Response {
    const { status, message, data } = res;

    return new Response(JSON.stringify({ status, message, data }), {
        headers: { "Content-Type": "application/json" },
    });
}

async function fHome(req: Request): Promise<MyResponse> {
    return { status: 200, message: "안녕하세요, 취합 툴 API 입니다.", data: null };
}


Deno.serve(async (req) => {
    let res: { status: number, message: string, data: any } = { status: 200, message: "", data: null };

    try {
        const url = new URL(req.url);

        if (url.pathname === "/") res = await fHome(req);

    } catch(e: any) {
        res = { status: 500, message: "Internal Server Error, 서버 내부 문제 발생", data: e.toString() };
    }

    return myres(res);
});