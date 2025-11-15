import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamStanding {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface StandingsTableProps {
  standings: TeamStanding[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
          <span className="text-xl sm:text-2xl">📊</span>
          League Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 sm:w-12 text-xs sm:text-sm">#</TableHead>
                <TableHead className="min-w-[120px] text-xs sm:text-sm">Team</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">P</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">W</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">D</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">L</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">GF</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">GA</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">GD</TableHead>
                <TableHead className="text-center font-bold text-xs sm:text-sm">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team) => (
                <TableRow key={team.position} className="hover:bg-muted/50">
                  <TableCell className="font-bold text-xs sm:text-sm py-2 sm:py-4">
                    {team.position === 1 && <Badge className="bg-primary text-xs">{team.position}</Badge>}
                    {team.position > 1 && team.position <= 4 && (
                      <Badge variant="secondary" className="text-xs">{team.position}</Badge>
                    )}
                    {team.position > 4 && <span>{team.position}</span>}
                  </TableCell>
                  <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">{team.team}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">{team.played}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">{team.won}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">{team.drawn}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">{team.lost}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">{team.goalsFor}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">{team.goalsAgainst}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm py-2 sm:py-4">
                    <span className={team.goalDifference > 0 ? "text-primary font-semibold" : ""}>
                      {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold text-sm sm:text-lg py-2 sm:py-4">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
