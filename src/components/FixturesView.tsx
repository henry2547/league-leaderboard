import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  status: "scheduled" | "live" | "completed";
  homeGoals?: number;
  awayGoals?: number;
}

interface FixturesViewProps {
  title: string;
  fixtures: Fixture[];
  emptyMessage?: string;
}

export function FixturesView({ title, fixtures, emptyMessage = "No matches scheduled" }: FixturesViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
          <span className="text-xl sm:text-2xl">⚽</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {fixtures.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">{emptyMessage}</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {fixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="font-semibold text-sm sm:text-base">{fixture.homeTeam}</span>
                    {fixture.status === "completed" && fixture.homeGoals !== undefined && (
                      <span className="text-lg sm:text-xl font-bold ml-2">{fixture.homeGoals}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base">{fixture.awayTeam}</span>
                    {fixture.status === "completed" && fixture.awayGoals !== undefined && (
                      <span className="text-lg sm:text-xl font-bold ml-2">{fixture.awayGoals}</span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:ml-6 sm:text-right">
                  <Badge
                    className="text-xs"
                    variant={
                      fixture.status === "live"
                        ? "destructive"
                        : fixture.status === "completed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {fixture.status === "live" ? "LIVE" : fixture.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {format(fixture.date, "MMM d, HH:mm")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
