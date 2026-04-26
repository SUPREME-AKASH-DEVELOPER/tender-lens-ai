import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border px-6 md:px-10 py-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-background">
      <Link to="/" className="space-y-1 group">
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-muted-foreground">
          System Protocol v.4.12
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight group-hover:italic transition-all">
          TenderLens AI
        </h1>
      </Link>
      <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "text-foreground border-b border-foreground" }}
          className="pb-1 hover:text-foreground transition-colors"
        >
          Overview
        </Link>
        <Link
          to="/dossier"
          activeProps={{ className: "text-foreground border-b border-foreground" }}
          className="pb-1 hover:text-foreground transition-colors"
        >
          Dossier
        </Link>
        <Link
          to="/intake"
          activeProps={{ className: "text-foreground border-b border-foreground" }}
          className="pb-1 hover:text-foreground transition-colors"
        >
          Intake
        </Link>
        <Link
          to="/about"
          activeProps={{ className: "text-foreground border-b border-foreground" }}
          className="pb-1 hover:text-foreground transition-colors"
        >
          Method
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background px-6 md:px-10 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase">
      <div className="font-mono">Session Hash: 0X9A4B…2F11</div>
      <div className="flex gap-6">
        <span>Real-time Audit Active</span>
        <span>Secure Node · London-04</span>
      </div>
    </footer>
  );
}
