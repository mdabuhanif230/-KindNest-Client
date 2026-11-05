import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-20 stamp">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div><p className="text-2xl font-extrabold text-secondary">KindNest</p>
          <p className="mt-2 hand text-lg opacity-90">Neighbours helping neighbours. Find a drive near you, show up, and make a difference.</p></div>
        <div className="grid gap-1 text-sm"><p className="font-bold">Explore</p>
          <Link href="/events">Upcoming Events</Link><Link href="/create">Create Event</Link><Link href="/joined">Joined Events</Link></div>
        <div className="text-sm"><p className="font-bold">Contact</p><p>help@kindnest.example</p><p>Mirpur 10, Dhaka</p>
          <a href="https://x.com" aria-label="X" className="inline-block mt-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a></div>
      </div>
      <p className="text-center text-xs opacity-60 pb-6">© 2026 KindNest. All rights reserved.</p>
    </footer>
  );
}
