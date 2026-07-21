export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-path-teal/20 border-t-path-teal rounded-full animate-spin mx-auto mb-4" />
        <p className="text-path-slate text-sm">A carregar...</p>
      </div>
    </div>
  );
}
