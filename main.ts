import { Hono } from "jsr:@hono/hono@4.11";

const kv = await Deno.openKv();
const LIMIT = 1_000;
const app = new Hono();

app.get("/", async (c) => {
    const html = await Deno.readTextFile("index.html");
    return c.html(html);
});

app.post("/viewer", async (c) => {
    try {
        const body = await (async () => {
            try {
                return c.req.json();
            } catch (err) {
                return null;
            }
        })();
        if (!body) {
            return c.json({ code: "error", message: "requested data is not json type", data: null });
        }
        if (body?.auth !== Deno.env.get("VIEWER_AUTH")) {
            return c.json({ code: "error", message: "requested data have invalid auth", data: null });
        }

        const key = body.key.split(",");

        const data = await (async () => {
            const data = [];
            try {
                for await (const entry of kv.list({ prefix: key }, { limit: LIMIT })) {
                    data.push(entry);
                }
                return data;
            } catch (err) {
                return null;
            }
        })();
        if (!data) {
            return c.json({ code: "error", message: "deno kv is something wrong", data: null });
        }

        return c.json({ code: "ok", message: `passed ${data.length} data`, data: data });

    } catch (err: any) {
        return c.json({ code: "error", message: "internal server error", data: err.toString() });
    }

});

Deno.serve(app.fetch);