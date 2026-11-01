export default function EventGrid({ list, render }) {
  if (!list) return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-96" />)}</div>;
  if (!list.length) return <p className="text-center py-16 opacity-70">No events here yet. Create one and invite your neighbours.</p>;
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{list.map(render)}</div>;
}
