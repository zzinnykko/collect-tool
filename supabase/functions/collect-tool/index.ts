import { schema } from "./schema.ts";

function myres(obj: object): Response {
    return new Response(JSON.stringify(obj));
}

async function fgetuser(req: Request): Promise<object> {
    let data: Array<Array<string>> = [];

    return { code: 200, message: "유저 로드 완료", data };
}

Deno.serve(async (req) => {
    try {
        // POST 요청이 아닌 경우
        if (req.method !== "POST") return myres({ code: 400, message: "POST 요청이 아님", data: null });

        // body 가 없거나 올바른 json 형식이 아닌 경우
        const body = await (async () => {
            try {
                return await req.json();
            } catch (_err) {
                return null;
            }
        })();
        if (!body) return myres({ code: 400, message: "요청 양식이 올바른 json 형식 아님", data: null });

        // 스키마 오류
        const isValidReq = schema.safeParse(body);
        if (!isValidReq.success) {
            const data = isValidReq.error.issues;
            return myres({ code: 400, message: "요청 양식이 올바르지 않음", data });
        } 

        // action (getuser, getstatus, setuser, setstatus) 필드에 따른 분기
        let code: number = 0;
        let message: string = "";
        let data: any = null;

        if (body.action === "getuser") return myres(await fgetuser(req));

        
        return myres({ code: 200, message: `${body.action} 요청, 기능 구현 중`, data: body });

    } catch (err: any) {
        return myres({ code: 500, message: "서버 내부 오류 발생", data: err.toString() });
    }

});