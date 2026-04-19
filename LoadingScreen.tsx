export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-navy flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30">
        <img src="/icon-192.png" alt="ABVP" className="w-full h-full object-contain" />
      </div>
      <div className="text-xs text-muted-foreground animate-pulse">Connecting to server…</div>
    </div>
  );
}
