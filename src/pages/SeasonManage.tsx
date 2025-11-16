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
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SeasonManage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [season, setSeason] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [fixtureDialogOpen, setFixtureDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalFirstLegRounds, setTotalFirstLegRounds] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchSeasonData();
  }, [id, user, navigate]);

  const fetchSeasonData = async () => {
    try {
      const { data: seasonData, error: seasonError } = await supabase
        .from("seasons")
        .select(`
          *,
          leagues!inner(*)
        `)
        .eq("id", id)
        .single();

      if (seasonError) throw seasonError;
      if (seasonData.leagues.organizer_id !== user?.id) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to manage this season",
        });
        navigate("/dashboard");
        return;
      }

      setSeason(seasonData);

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("season_id", id)
        .order("name");

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      const { data: fixturesData, error: fixturesError } = await supabase
        .from("fixtures")
        .select(`
          *,
          home_team:teams!fixtures_home_team_id_fkey(name),
          away_team:teams!fixtures_away_team_id_fkey(name),
          results(*)
        `)
        .eq("season_id", id)
        .order("match_date");

      if (fixturesError) throw fixturesError;
      setFixtures(fixturesData || []);
      
      // Calculate current round and total first leg rounds
      const maxRound = fixturesData?.reduce((max, f) => Math.max(max, f.round || 1), 0) || 0;
      setCurrentRound(maxRound);
      
      // Calculate total rounds for first leg
      const numTeams = teamsData?.length || 0;
      const totalRounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams;
      setTotalFirstLegRounds(totalRounds);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading season",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from("teams").insert([
        {
          season_id: id,
          name: newTeamName,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Team added!",
        description: "The team has been added successfully.",
      });

      setNewTeamName("");
      setTeamDialogOpen(false);
      fetchSeasonData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding team",
        description: error.message,
      });
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const { error } = await supabase.from("teams").delete().eq("id", teamId);

      if (error) throw error;

      toast({
        title: "Team deleted",
        description: "The team has been removed.",
      });

      fetchSeasonData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting team",
        description: error.message,
      });
    }
  };

  const generateFirstLeg = async () => {
    if (teams.length < 2) {
      toast({
        variant: "destructive",
        title: "Not enough teams",
        description: "You need at least 2 teams to generate fixtures",
      });
      return;
    }

    setGenerating(true);
    try {
      // Check if any fixtures already exist
      const { data: existingFixtures } = await supabase
        .from("fixtures")
        .select("id")
        .eq("season_id", id);

      if (existingFixtures && existingFixtures.length > 0) {
        toast({
          variant: "destructive",
          title: "Fixtures already exist",
          description: "First leg fixtures have already been generated.",
        });
        setGenerating(false);
        return;
      }

      // Proper EPL-style round-robin algorithm
      const teamList = [...teams];
      const numTeams = teamList.length;
      const isOdd = numTeams % 2 === 1;
      
      // Add a "bye" team if odd number of teams
      if (isOdd) {
        teamList.push({ id: "bye", name: "BYE" } as any);
      }

      const totalTeams = teamList.length;
      const totalRounds = totalTeams - 1; // First leg only
      const matchesPerRound = totalTeams / 2;
      const startDate = new Date(season.start_date);
      const endDate = new Date(season.end_date);
      const allFixtures: any[] = [];
      
      // Calculate total duration and interval between rounds
      const totalDurationMs = endDate.getTime() - startDate.getTime();
      const totalAllRounds = totalRounds * 2; // First leg + second leg
      const intervalMs = totalDurationMs / totalAllRounds;
      
      // Generate all first leg rounds
      for (let round = 1; round <= totalRounds; round++) {
        const roundDate = new Date(startDate.getTime() + (round - 1) * intervalMs);
        
        // Generate fixtures for this round using round-robin algorithm
        for (let matchIndex = 0; matchIndex < matchesPerRound; matchIndex++) {
          let homeIndex, awayIndex;
          
          if (matchIndex === 0) {
            homeIndex = 0;
            awayIndex = round;
          } else {
            homeIndex = ((round - matchIndex) + totalTeams - 1) % (totalTeams - 1) + 1;
            awayIndex = ((round + matchIndex - 1) % (totalTeams - 1)) + 1;
          }
          
          const homeTeam = teamList[homeIndex];
          const awayTeam = teamList[awayIndex];
          
          // Skip if bye team
          if (homeTeam.id !== "bye" && awayTeam.id !== "bye") {
            allFixtures.push({
              season_id: id,
              home_team_id: homeTeam.id,
              away_team_id: awayTeam.id,
              match_date: roundDate.toISOString(),
              round: round,
              status: "scheduled",
            });
          }
        }
      }

      const { error } = await supabase.from("fixtures").insert(allFixtures);

      if (error) throw error;

      toast({
        title: "First leg generated!",
        description: `All ${totalRounds} rounds of first leg fixtures created (${allFixtures.length} matches total).`,
      });

      setFixtureDialogOpen(false);
      fetchSeasonData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating fixtures",
        description: error.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateSecondLeg = async () => {
    setGenerating(true);
    try {
      // Get all first leg fixtures
      const { data: firstLegFixtures } = await supabase
        .from("fixtures")
        .select("*")
        .eq("season_id", id)
        .lte("round", totalFirstLegRounds);

      if (!firstLegFixtures || firstLegFixtures.length === 0) {
        toast({
          variant: "destructive",
          title: "No first leg fixtures",
          description: "Generate first leg fixtures before creating second leg.",
        });
        setGenerating(false);
        return;
      }

      // Check if all first leg fixtures are completed
      const allCompleted = firstLegFixtures.every(f => f.status === "completed");
      if (!allCompleted) {
        toast({
          variant: "destructive",
          title: "First leg not completed",
          description: "Complete all first leg matches before generating second leg.",
        });
        setGenerating(false);
        return;
      }

      // Check if second leg already exists
      const { data: existingSecondLeg } = await supabase
        .from("fixtures")
        .select("id")
        .eq("season_id", id)
        .gt("round", totalFirstLegRounds);

      if (existingSecondLeg && existingSecondLeg.length > 0) {
        toast({
          variant: "destructive",
          title: "Second leg already exists",
          description: "Second leg fixtures have already been generated.",
        });
        setGenerating(false);
        return;
      }

      const startDate = new Date(season.start_date);
      const endDate = new Date(season.end_date);
      const allSecondLegFixtures: any[] = [];

      // Calculate interval between rounds based on season duration
      const totalDurationMs = endDate.getTime() - startDate.getTime();
      const totalAllRounds = totalFirstLegRounds * 2; // First leg + second leg
      const intervalMs = totalDurationMs / totalAllRounds;

      // Generate second leg by reversing home/away from first leg
      firstLegFixtures.forEach((fixture) => {
        const roundOffset = totalFirstLegRounds + fixture.round;
        const matchDate = new Date(startDate.getTime() + (roundOffset - 1) * intervalMs);

        allSecondLegFixtures.push({
          season_id: id,
          home_team_id: fixture.away_team_id, // Reversed
          away_team_id: fixture.home_team_id, // Reversed
          match_date: matchDate.toISOString(),
          round: roundOffset,
          status: "scheduled",
        });
      });

      const { error } = await supabase.from("fixtures").insert(allSecondLegFixtures);

      if (error) throw error;

      toast({
        title: "Second leg generated!",
        description: `All ${totalFirstLegRounds} rounds of return fixtures created (${allSecondLegFixtures.length} matches total).`,
      });

      setFixtureDialogOpen(false);
      fetchSeasonData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating second leg",
        description: error.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  const updateResult = async (fixtureId: string, homeGoals: number, awayGoals: number) => {
    try {
      // Check if result exists
      const { data: existingResult } = await supabase
        .from("results")
        .select("*")
        .eq("fixture_id", fixtureId)
        .maybeSingle();

      if (existingResult) {
        const { error } = await supabase
          .from("results")
          .update({ home_goals: homeGoals, away_goals: awayGoals })
          .eq("fixture_id", fixtureId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("results")
          .insert([{ fixture_id: fixtureId, home_goals: homeGoals, away_goals: awayGoals }]);

        if (error) throw error;
      }

      // Update fixture status
      await supabase
        .from("fixtures")
        .update({ status: "completed" })
        .eq("id", fixtureId);

      toast({
        title: "Result saved!",
        description: "Match result has been updated.",
      });

      fetchSeasonData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving result",
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

  if (!season) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center flex-grow">
          <h1 className="text-2xl font-bold">Season not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{season.name}</h1>
          <p className="text-muted-foreground">
            {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
          </p>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Teams</h2>
              <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-5 w-5" />
                    Add Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Team</DialogTitle>
                    <DialogDescription>
                      Add a team to this season
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addTeam} className="space-y-4">
                    <div>
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input
                        id="team-name"
                        placeholder="e.g., Manchester United"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Team
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {teams.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-6">No teams added yet</p>
                  <Button onClick={() => setTeamDialogOpen(true)} className="gap-2">
                    <Plus className="h-5 w-5" />
                    Add Your First Team
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {team.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fixtures" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Fixtures</h2>
                {currentRound > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {currentRound <= totalFirstLegRounds ? "First Leg" : "Second Leg"} - Round: {currentRound}
                  </p>
                )}
              </div>
              {fixtures.length === 0 ? (
                <Dialog open={fixtureDialogOpen} onOpenChange={setFixtureDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" disabled={teams.length < 2}>
                      <CalendarIcon className="h-5 w-5" />
                      Generate First Leg
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate First Leg Fixtures</DialogTitle>
                      <DialogDescription>
                        This will create all first leg fixtures where each team plays every other team once
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Generate all first leg fixtures for {teams.length} teams?</p>
                      <p className="text-sm text-muted-foreground">
                        This will create {totalFirstLegRounds} rounds of fixtures.
                      </p>
                      <Button onClick={generateFirstLeg} className="w-full" disabled={generating}>
                        {generating ? "Generating..." : "Generate First Leg"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                (() => {
                  const firstLegFixtures = fixtures.filter(f => f.round <= totalFirstLegRounds);
                  const allFirstLegComplete = firstLegFixtures.every(f => f.status === "completed");
                  const hasSecondLeg = fixtures.some(f => f.round > totalFirstLegRounds);

                  return allFirstLegComplete && !hasSecondLeg && (
                    <Dialog open={fixtureDialogOpen} onOpenChange={setFixtureDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          Generate Second Leg
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generate Second Leg Fixtures</DialogTitle>
                          <DialogDescription>
                            First leg is complete! Generate return fixtures where home and away teams are reversed.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Generate all second leg fixtures (return matches)?</p>
                          <p className="text-sm text-muted-foreground">
                            This will create {totalFirstLegRounds} rounds of return fixtures.
                          </p>
                          <Button onClick={generateSecondLeg} className="w-full" disabled={generating}>
                            {generating ? "Generating..." : "Generate Second Leg"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })()
              )}
            </div>

            {fixtures.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-6">
                    {teams.length < 2
                      ? "Add at least 2 teams to generate fixtures"
                      : "No fixtures generated yet"}
                  </p>
                  {teams.length >= 2 && (
                    <Button onClick={() => setFixtureDialogOpen(true)} className="gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Generate Fixtures
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Array.from(new Set(fixtures.map(f => f.round || 1))).sort((a, b) => a - b).map((round) => {
                  const roundFixtures = fixtures.filter(f => (f.round || 1) === round);
                  const allComplete = roundFixtures.every(f => f.status === "completed");
                  const isSecondLeg = round > totalFirstLegRounds;

                  return (
                    <div key={round} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">
                          Round {round} {isSecondLeg && <span className="text-sm text-muted-foreground">(Second Leg)</span>}
                        </h3>
                        {allComplete && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Complete
                          </span>
                        )}
                      </div>
                      
                      {roundFixtures.map((fixture) => {
                        const isCompleted = fixture.status === "completed";
                        
                        return (
                          <Card key={fixture.id} className={isCompleted ? "border-primary/20 bg-muted/30" : ""}>
                            <CardContent className="py-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm sm:text-base">{fixture.home_team.name}</p>
                                  <p className="font-semibold text-sm sm:text-base">{fixture.away_team.name}</p>
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                    {new Date(fixture.match_date).toLocaleString()}
                                  </p>
                                </div>
                                
                                {isCompleted ? (
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="text-right">
                                      <div className="text-xl sm:text-2xl font-bold">{fixture.results?.[0]?.home_goals}</div>
                                      <div className="text-xl sm:text-2xl font-bold">{fixture.results?.[0]?.away_goals}</div>
                                    </div>
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                                      Final
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      defaultValue={fixture.results?.[0]?.home_goals || ""}
                                      className="w-14 sm:w-16 text-center text-sm"
                                      id={`home-${fixture.id}`}
                                    />
                                    <span className="font-bold">-</span>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      defaultValue={fixture.results?.[0]?.away_goals || ""}
                                      className="w-14 sm:w-16 text-center text-sm"
                                      id={`away-${fixture.id}`}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const homeInput = document.getElementById(`home-${fixture.id}`) as HTMLInputElement;
                                        const awayInput = document.getElementById(`away-${fixture.id}`) as HTMLInputElement;
                                        updateResult(fixture.id, parseInt(homeInput.value) || 0, parseInt(awayInput.value) || 0);
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
