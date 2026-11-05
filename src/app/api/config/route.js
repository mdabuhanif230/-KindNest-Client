// Public app flags — the login/register pages only render the Google button
// when the OAuth credentials actually exist, so a missing env never shows a
// button that can't work.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
}
