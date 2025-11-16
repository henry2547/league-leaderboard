import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trophy, Calendar, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLeagues();
  }, [user, navigate]);

  const fetchLeagues = async () => {
    try {
      const { data, error } = await supabase
        .from("leagues")
        .select("*")
        .eq("organizer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeagues(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading leagues",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("leagues")
        .insert([{ name: newLeagueName, organizer_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "League created!",
        description: "Your new league has been created successfully.",
      });

      setNewLeagueName("");
      setDialogOpen(false);
      fetchLeagues();
      navigate(`/league/${data.id}/manage`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating league",
        description: error.message,
      });
    }
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Leagues</h1>
            <p className="text-muted-foreground">Manage your championship leagues</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create League
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New League</DialogTitle>
                <DialogDescription>
                  Give your league a name to get started
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createLeague} className="space-y-4">
                <div>
                  <Label htmlFor="league-name">League Name</Label>
                  <Input
                    id="league-name"
                    placeholder="e.g., Summer Championship 2025"
                    value={newLeagueName}
                    onChange={(e) => setNewLeagueName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Create League</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {leagues.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No leagues yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first league to start organizing matches
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First League
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leagues.map((league) => (
              <Card key={league.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/league/${league.id}/manage`)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    {league.name}
                  </CardTitle>
                  <CardDescription>
                    Created {new Date(league.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Manage seasons & fixtures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Add teams & players</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={(e) => {
                      e.stopPropagation();
                      const publicUrl = `${window.location.origin}/league/${league.public_link_id}`;
                      navigator.clipboard.writeText(publicUrl);
                      toast({
                        title: "Link copied!",
                        description: "Public league link copied to clipboard",
                      });
                    }}>
                      Share Public Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
