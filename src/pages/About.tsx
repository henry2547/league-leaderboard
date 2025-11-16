import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, BarChart3, Code2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">About Play Kenya</h1>
            <p className="text-xl text-muted-foreground">
              The ultimate platform for organizing and managing championship leagues
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <Code2 className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>About the Developer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">✨ Henry Muchiri</h3>
                <p className="text-lg text-primary mb-4">
                  Junior Software Developer | Tech Enthusiast | Problem Solver
                </p>
                <p className="text-muted-foreground mb-4">
                  Crafting digital solutions with clean code & creative thinking
                </p>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p>📍 Based in Kirinyaga County, Kenya</p>
                <p>🌱 Currently growing my skills in: Backend Development • Cloud Technologies • Open-Source</p>
              </div>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "Turning complex problems into elegant solutions – one line of code at a time."
              </blockquote>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Trophy className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Professional League Management</CardTitle>
                <CardDescription>
                  Create and manage leagues with ease, featuring EPL-style standings and match tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-secondary" />
                <CardTitle>Team & Player Management</CardTitle>
                <CardDescription>
                  Add teams or individual players, track performance, and manage rosters effortlessly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Automated Fixtures</CardTitle>
                <CardDescription>
                  Generate complete season fixtures automatically with our intelligent scheduling system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 mb-2 text-secondary" />
                <CardTitle>Real-time Standings</CardTitle>
                <CardDescription>
                  Track points, wins, draws, losses, and goal statistics with instant updates
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Secure organizer authentication and league management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Automatic fixture generation for entire seasons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Real-time standings updates after every match result</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Today's matches and upcoming fixtures views</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Public shareable links for players and fans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Dark and light mode support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Mobile-friendly responsive design</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <strong>Create Your League</strong>
                    <p className="text-muted-foreground">Sign up and create a new league with your preferred settings</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <strong>Add Teams</strong>
                    <p className="text-muted-foreground">Add all participating teams or players to your season</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <strong>Generate Fixtures</strong>
                    <p className="text-muted-foreground">Let our system automatically create a complete fixture schedule</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <strong>Enter Results</strong>
                    <p className="text-muted-foreground">Update match scores and watch the standings update in real-time</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </span>
                  <div>
                    <strong>Share Your League</strong>
                    <p className="text-muted-foreground">Share the public link with players and fans to view fixtures and standings</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
