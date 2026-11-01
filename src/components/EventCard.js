import Link from "next/link";
export default function EventCard({ ev, children }) {
  return (
    <div className="card bg-base-200 border border-base-300 h-full">
      <figure className="h-48"><img src={ev.thumbnail} alt={ev.title} className="w-full h-full object-cover" /></figure>
      <div className="card-body">
        <span className="badge badge-secondary">{ev.type}</span>
        <h3 className="card-title line-clamp-1">{ev.title}</h3>
        <p className="text-sm opacity-80">{ev.location}</p>
        <p className="text-sm font-medium">{new Date(ev.date).toDateString()}</p>
        <div className="card-actions mt-auto pt-2">
          <Link href={`/events/${ev._id}`} className="btn btn-primary btn-sm">View Event</Link>{children}
        </div>
      </div>
    </div>
  );
}
