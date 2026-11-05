import Btn from "@/components/Btn";
export default function EventCard({ ev, children }) {
  return (
    <div className="paper overflow-hidden h-full flex flex-col">
      {/* thumbnail falls back to the imported field name, so an old-format doc
          never renders a broken image */}
      <figure className="h-48 overflow-hidden"><img src={ev.thumbnail || ev.image} alt={ev.title} className="w-full h-full object-cover" /></figure>
      <div className="card-body">
        <span className="badge badge-secondary -rotate-2 self-start">{ev.type || ev.category}</span>
        <h3 className="card-title line-clamp-1">{ev.title}</h3>
        <p className="text-sm opacity-80">📍 {ev.location}</p>
        <p className="text-sm font-semibold">🗓 {new Date(ev.date).toDateString()}</p>
        <div className="card-actions flex-wrap mt-auto pt-2">
          <Btn href={`/events/${ev._id}`} size="sm">View Event</Btn>{children}
        </div>
      </div>
    </div>
  );
}
