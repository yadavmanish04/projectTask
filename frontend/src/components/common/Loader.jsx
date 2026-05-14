export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 p-6 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
