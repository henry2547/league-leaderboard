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
                className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className="text-xs font-semibold"
                      variant={
                        fixture.status === "live"
                          ? "destructive"
                          : fixture.status === "completed"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {fixture.status === "live" && "🔴 LIVE"}
                      {fixture.status === "completed" && "✓ FINAL"}
                      {fixture.status === "scheduled" && "⏰ SCHEDULED"}
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {format(fixture.date, "MMM d, HH:mm")}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-8">
                    {/* Home Team */}
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-base sm:text-xl mb-2 text-foreground">
                        {fixture.homeTeam}
                      </h3>
                      {fixture.status === "completed" && fixture.homeGoals !== undefined && (
                        <div className="text-3xl sm:text-5xl font-black text-primary">
                          {fixture.homeGoals}
                        </div>
                      )}
                    </div>

                    {/* VS or Score Separator */}
                    <div className="flex flex-col items-center justify-center px-2 sm:px-4">
                      {fixture.status === "completed" ? (
                        <div className="text-xl sm:text-2xl font-bold text-muted-foreground">-</div>
                      ) : (
                        <div className="text-sm sm:text-base font-semibold text-muted-foreground px-3 py-1 rounded-full bg-muted">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-base sm:text-xl mb-2 text-foreground">
                        {fixture.awayTeam}
                      </h3>
                      {fixture.status === "completed" && fixture.awayGoals !== undefined && (
                        <div className="text-3xl sm:text-5xl font-black text-primary">
                          {fixture.awayGoals}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative accent line */}
                {fixture.status === "live" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-primary to-destructive animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
