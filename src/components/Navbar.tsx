import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  isPublic?: boolean;
}

export function Navbar({ isPublic = false }: NavbarProps) {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LeagueManager
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {!isPublic && (
              <>
                <Link to="/about" className="hidden sm:block">
                  <Button variant="ghost">About</Button>
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="default" size="sm" className="sm:size-default">Dashboard</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="sm:size-default" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button variant="default" size="sm" className="sm:size-default">Sign In</Button>
                  </Link>
                )}
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
