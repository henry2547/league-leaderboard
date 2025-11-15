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
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fixtures.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {fixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{fixture.homeTeam}</span>
                    {fixture.status === "completed" && fixture.homeGoals !== undefined && (
                      <span className="text-xl font-bold">{fixture.homeGoals}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{fixture.awayTeam}</span>
                    {fixture.status === "completed" && fixture.awayGoals !== undefined && (
                      <span className="text-xl font-bold">{fixture.awayGoals}</span>
                    )}
                  </div>
                </div>

                <div className="ml-6 text-right flex flex-col items-end gap-2">
                  <Badge
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
                  <span className="text-sm text-muted-foreground">
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
