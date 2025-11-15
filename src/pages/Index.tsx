import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, BarChart3, Share2, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Trophy className="mx-auto h-20 w-20 mb-6 text-primary animate-fade-in" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Manage Your Championship
              <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Create leagues, generate fixtures automatically, and track standings in real-time with our EPL-style management system
            </p>
            <div className="flex gap-4 justify-center animate-fade-in">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <Zap className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>League Management</CardTitle>
              <CardDescription>
                Create and manage multiple leagues with ease. Perfect for organizers running tournaments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-secondary" />
              <CardTitle>Team Organization</CardTitle>
              <CardDescription>
                Add teams or individual players, manage rosters, and track performance across seasons
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Auto Fixtures</CardTitle>
              <CardDescription>
                Generate complete season fixtures automatically with intelligent round-robin scheduling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 mb-2 text-secondary" />
              <CardTitle>Live Standings</CardTitle>
              <CardDescription>
                EPL-style table with points, wins, draws, losses, and goal statistics updated instantly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Share2 className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Public Sharing</CardTitle>
              <CardDescription>
                Share a public link with players and fans to view fixtures and standings without signing up
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-secondary" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Standings refresh instantly after every result. See today's matches and upcoming fixtures
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Organize Your League?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join organizers worldwide who trust LeagueManager to run their championships professionally
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start Managing Now
                <Trophy className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
