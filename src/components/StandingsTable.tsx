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

const getRowClassName = (position: number, totalTeams: number) => {
  // Champion (1st place) - Gold background
  if (position === 1) {
    return "bg-yellow-500/20 hover:bg-yellow-500/30 border-l-4 border-l-yellow-500";
  }
  // Champions League (2nd-4th) - Blue background
  if (position >= 2 && position <= 4) {
    return "bg-blue-500/20 hover:bg-blue-500/30 border-l-4 border-l-blue-500";
  }
  // Europa League (5th) - Orange background
  if (position === 5) {
    return "bg-orange-500/20 hover:bg-orange-500/30 border-l-4 border-l-orange-500";
  }
  // Relegation zone (last 3) - Red background
  if (position > totalTeams - 3) {
    return "bg-red-500/20 hover:bg-red-500/30 border-l-4 border-l-red-500";
  }
  // Mid-table - default
  return "hover:bg-muted/50";
};

export function StandingsTable({ standings }: StandingsTableProps) {
  const totalTeams = standings.length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
          <span className="text-xl sm:text-2xl">📊</span>
          League Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/40 border-l-2 border-l-yellow-500"></div>
            <span>Champion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500/40 border-l-2 border-l-blue-500"></div>
            <span>Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500/40 border-l-2 border-l-orange-500"></div>
            <span>Europa League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/40 border-l-2 border-l-red-500"></div>
            <span>Relegation</span>
          </div>
        </div>
        
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
                <TableRow 
                  key={team.position} 
                  className={getRowClassName(team.position, totalTeams)}
                >
                  <TableCell className="font-bold text-xs sm:text-sm py-2 sm:py-4">
                    <span>{team.position}</span>
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
