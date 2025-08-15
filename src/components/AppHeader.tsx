import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
        <h1 className="text-xl font-semibold text-foreground">
          Sistema Dental
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/odontograma">
          <Button variant="outline" size="sm">
            Ver Odontograma
          </Button>
        </Link>
      </div>
    </header>
  );
}