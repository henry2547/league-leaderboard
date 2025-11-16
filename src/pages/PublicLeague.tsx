import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StandingsTable } from "@/components/StandingsTable";
import { FixturesView } from "@/components/FixturesView";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";

export default function PublicLeague() {
  const { publicId } = useParams();
  const { toast } = useToast();
  const [league, setLeague] = useState<any>(null);
  const [activeSeasons, setActiveSeasons] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [todayFixtures, setTodayFixtures] = useState<any[]>([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState<any[]>([]);
  const [completedFixtures, setCompletedFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicLeagueData();
  }, [publicId]);

  const fetchPublicLeagueData = async () => {
    try {
      const { data: leagueData, error: leagueError } = await supabase
        .from("leagues")
        .select("*")
        .eq("public_link_id", publicId)
        .single();

      if (leagueError) throw leagueError;
      setLeague(leagueData);

      const { data: seasonsData, error: seasonsError } = await supabase
        .from("seasons")
        .select("*")
        .eq("league_id", leagueData.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (seasonsError) throw seasonsError;
      setActiveSeasons(seasonsData || []);

      if (seasonsData && seasonsData.length > 0) {
        await fetchSeasonData(seasonsData[0].id);
      }
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

  const fetchSeasonData = async (seasonId: string) => {
    try {
      const { data: teamsData } = await supabase
        .from("teams")
        .select("*")
        .eq("season_id", seasonId);

      const { data: fixturesData } = await supabase
        .from("fixtures")
        .select(`
          *,
          home_team:teams!fixtures_home_team_id_fkey(name),
          away_team:teams!fixtures_away_team_id_fkey(name),
          results(*)
        `)
        .eq("season_id", seasonId)
        .order("match_date");

      const { data: resultsData } = await supabase
        .from("results")
        .select(`
          *,
          fixtures!inner(
            season_id,
            home_team_id,
            away_team_id
          )
        `)
        .eq("fixtures.season_id", seasonId);

      // Calculate standings
      const teamStats = new Map();
      
      teamsData?.forEach(team => {
        teamStats.set(team.id, {
          team: team.name,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        });
      });

      resultsData?.forEach(result => {
        const homeTeam = teamStats.get(result.fixtures.home_team_id);
        const awayTeam = teamStats.get(result.fixtures.away_team_id);

        if (homeTeam && awayTeam) {
          homeTeam.played++;
          awayTeam.played++;

          homeTeam.goalsFor += result.home_goals;
          homeTeam.goalsAgainst += result.away_goals;
          awayTeam.goalsFor += result.away_goals;
          awayTeam.goalsAgainst += result.home_goals;

          if (result.home_goals > result.away_goals) {
            homeTeam.won++;
            homeTeam.points += 3;
            awayTeam.lost++;
          } else if (result.home_goals < result.away_goals) {
            awayTeam.won++;
            awayTeam.points += 3;
            homeTeam.lost++;
          } else {
            homeTeam.drawn++;
            awayTeam.drawn++;
            homeTeam.points++;
            awayTeam.points++;
          }

          homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
          awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
        }
      });

      const standingsArray = Array.from(teamStats.values())
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        })
        .map((team, index) => ({ ...team, position: index + 1 }));

      setStandings(standingsArray);

      // Filter today's and upcoming fixtures
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayMatches = fixturesData?.filter(f => {
        const matchDate = new Date(f.match_date);
        return matchDate >= today && matchDate < tomorrow;
      }).map(f => ({
        id: f.id,
        homeTeam: f.home_team.name,
        awayTeam: f.away_team.name,
        date: new Date(f.match_date),
        status: f.status,
        homeGoals: f.results?.[0]?.home_goals,
        awayGoals: f.results?.[0]?.away_goals,
      })) || [];

      const upcomingMatches = fixturesData?.filter(f => {
        const matchDate = new Date(f.match_date);
        return matchDate >= tomorrow && f.status === "scheduled";
      }).slice(0, 10).map(f => ({
        id: f.id,
        homeTeam: f.home_team.name,
        awayTeam: f.away_team.name,
        date: new Date(f.match_date),
        status: f.status,
      })) || [];

      const completedMatches = fixturesData?.filter(f => 
        f.status === "completed"
      ).map(f => ({
        id: f.id,
        homeTeam: f.home_team.name,
        awayTeam: f.away_team.name,
        date: new Date(f.match_date),
        status: f.status,
        homeGoals: f.results?.[0]?.home_goals,
        awayGoals: f.results?.[0]?.away_goals,
        round: f.round,
      })) || [];

      setTodayFixtures(todayMatches);
      setUpcomingFixtures(upcomingMatches);
      setCompletedFixtures(completedMatches);
    } catch (error: any) {
      console.error("Error fetching season data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">League not found</h1>
          <p className="text-muted-foreground">This league doesn't exist or has been removed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isPublic={true} />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <Trophy className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-primary" />
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">{league.name}</h1>
          {activeSeasons.length > 0 && (
            <p className="text-sm sm:text-base text-muted-foreground">{activeSeasons[0].name}</p>
          )}
        </div>

        {activeSeasons.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No active season at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="standings" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="standings" className="text-xs sm:text-sm">Standings</TabsTrigger>
              <TabsTrigger value="results" className="text-xs sm:text-sm">Results</TabsTrigger>
              <TabsTrigger value="today" className="text-xs sm:text-sm">Today</TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value="standings" className="space-y-4">
              <StandingsTable standings={standings} />
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <FixturesView
                title="Match Results"
                fixtures={completedFixtures}
                emptyMessage="No completed matches yet"
              />
            </TabsContent>

            <TabsContent value="today" className="space-y-4">
              <FixturesView
                title="Today's Matches"
                fixtures={todayFixtures}
                emptyMessage="No matches scheduled for today"
              />
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <FixturesView
                title="Upcoming Fixtures"
                fixtures={upcomingFixtures}
                emptyMessage="No upcoming matches scheduled"
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
