import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

// Issues a JWT signed with JWT_SECRET so the Express API can verify the caller
export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.email)
      return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    const token = jwt.sign({ email: session.user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ message: "Could not verify your session." }, { status: 401 });
  }
}
