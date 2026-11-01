import { auth } from "@/lib/auth";
export const GET = (req) => auth.handler(req);
export const POST = (req) => auth.handler(req);
