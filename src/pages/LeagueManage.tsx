import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Calendar, Users, Trophy, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeagueManage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [league, setLeague] = useState<any>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLeagueData();
  }, [id, user, navigate]);

  const fetchLeagueData = async () => {
    try {
      const { data: leagueData, error: leagueError } = await supabase
        .from("leagues")
        .select("*")
        .eq("id", id)
        .single();

      if (leagueError) throw leagueError;
      if (leagueData.organizer_id !== user?.id) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to manage this league",
        });
        navigate("/dashboard");
        return;
      }

      setLeague(leagueData);

      const { data: seasonsData, error: seasonsError } = await supabase
        .from("seasons")
        .select("*")
        .eq("league_id", id)
        .order("is_active", { ascending: false })
        .order("created_at", { ascending: false });

      if (seasonsError) throw seasonsError;
      setSeasons(seasonsData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading league",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, set all existing seasons to inactive
      await supabase
        .from("seasons")
        .update({ is_active: false })
        .eq("league_id", id);

      // Then create the new season as active
      const { error } = await supabase.from("seasons").insert([
        {
          league_id: id,
          name: newSeason.name,
          start_date: newSeason.startDate,
          end_date: newSeason.endDate,
          is_active: true,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Season created!",
        description: "Your new season is now active. Previous seasons have been archived.",
      });

      setNewSeason({ name: "", startDate: "", endDate: "" });
      setSeasonDialogOpen(false);
      fetchLeagueData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating season",
        description: error.message,
      });
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/league/${league.public_link_id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copied!",
      description: "Public league link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center py-16 flex-grow">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center flex-grow">
          <h1 className="text-2xl font-bold">League not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{league.name}</h1>
            <p className="text-muted-foreground">Manage your league settings and seasons</p>
          </div>
          <Button onClick={copyPublicLink} className="gap-2">
            <Share2 className="h-5 w-5" />
            Share Public Link
          </Button>
        </div>

        <Tabs defaultValue="seasons" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          </TabsList>

          <TabsContent value="seasons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Seasons</h2>
              <Dialog open={seasonDialogOpen} onOpenChange={setSeasonDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Season
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Season</DialogTitle>
                    <DialogDescription>
                      Set up a new season for your league
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={createSeason} className="space-y-4">
                    <div>
                      <Label htmlFor="season-name">Season Name</Label>
                      <Input
                        id="season-name"
                        placeholder="e.g., 2024/2025 Season"
                        value={newSeason.name}
                        onChange={(e) =>
                          setNewSeason({ ...newSeason, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newSeason.startDate}
                        onChange={(e) =>
                          setNewSeason({ ...newSeason, startDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newSeason.endDate}
                        onChange={(e) =>
                          setNewSeason({ ...newSeason, endDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Season
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {seasons.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold mb-2">No seasons yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a season to start adding teams and fixtures
                  </p>
                  <Button onClick={() => setSeasonDialogOpen(true)} className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Your First Season
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasons.map((season) => (
                  <Card
                    key={season.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/season/${season.id}/manage`)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          {season.name}
                        </div>
                        {season.is_active && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {new Date(season.start_date).toLocaleDateString()} -{" "}
                        {new Date(season.end_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Manage Season
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardContent className="py-16 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a season first to manage teams
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixtures">
            <Card>
              <CardContent className="py-16 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a season first to manage fixtures
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
