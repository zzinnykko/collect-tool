import { z } from "jsr:@zod/zod@4.2.1";

const commonSchema = z.object({
    department: z.string(),
    userID: z.string().min(4),
    userPW: z.string().min(4),
});

const setSchema = commonSchema.extend({
    action: z.enum(["setuser", "setstatus"]),
    data: z.array(z.object({
        key: z.array(z.string()).length(4),             // department, id, (user or status), row
        value: z.array(z.string()).min(1),              // user, status 장표 모두 제일 첫 컬럼에 id 가 필요
    })),
}).strict();

const getSchema = commonSchema.extend({
    action: z.enum(["getuser", "getstatus"]),
    data: z.null(),
}).strict();

export const schema = z.union([setSchema, getSchema]);
