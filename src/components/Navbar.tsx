import { Link } from "react-router-dom";
import { Trophy, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface NavbarProps {
  isPublic?: boolean;
}

export function Navbar({ isPublic = false }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Play Kenya
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {!isPublic && (
              <>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2 sm:gap-4">
                  <Link to="/about">
                    <Button variant="ghost">About</Button>
                  </Link>
                  {user ? (
                    <>
                      <Link to="/dashboard">
                        <Button variant="default">Dashboard</Button>
                      </Link>
                      <Button variant="outline" onClick={() => signOut()}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth">
                      <Button variant="default">Sign In</Button>
                    </Link>
                  )}
                </div>

                {/* Mobile Hamburger Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[250px]">
                    <div className="flex flex-col gap-4 mt-8">
                      <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">About</Button>
                      </Link>
                      {user ? (
                        <>
                          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="default" className="w-full">Dashboard</Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => {
                              signOut();
                              setMobileMenuOpen(false);
                            }}
                          >
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="default" className="w-full">Sign In</Button>
                        </Link>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
