-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create leagues table
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organizer_id UUID NOT NULL,
  public_link_id TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can view their own leagues"
  ON public.leagues FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "Anyone can view leagues by public link"
  ON public.leagues FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create leagues"
  ON public.leagues FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own leagues"
  ON public.leagues FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their own leagues"
  ON public.leagues FOR DELETE
  USING (auth.uid() = organizer_id);

-- Create seasons table
CREATE TABLE public.seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seasons"
  ON public.seasons FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create seasons"
  ON public.seasons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE id = league_id AND organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update their seasons"
  ON public.seasons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE id = league_id AND organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete their seasons"
  ON public.seasons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE id = league_id AND organizer_id = auth.uid()
    )
  );

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seasons s
      JOIN public.leagues l ON s.league_id = l.id
      WHERE s.id = season_id AND l.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update their teams"
  ON public.teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.seasons s
      JOIN public.leagues l ON s.league_id = l.id
      WHERE s.id = season_id AND l.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete their teams"
  ON public.teams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.seasons s
      JOIN public.leagues l ON s.league_id = l.id
      WHERE s.id = season_id AND l.organizer_id = auth.uid()
    )
  );

-- Create fixtures table
CREATE TABLE public.fixtures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fixtures"
  ON public.fixtures FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create fixtures"
  ON public.fixtures FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seasons s
      JOIN public.leagues l ON s.league_id = l.id
      WHERE s.id = season_id AND l.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update their fixtures"
  ON public.fixtures FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.seasons s
      JOIN public.leagues l ON s.league_id = l.id
      WHERE s.id = season_id AND l.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete their fixtures"
  ON public.fixtures FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.seasons s
      JOIN public.leagues l ON s.league_id = l.id
      WHERE s.id = season_id AND l.organizer_id = auth.uid()
    )
  );

-- Create results table
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL UNIQUE REFERENCES public.fixtures(id) ON DELETE CASCADE,
  home_goals INTEGER NOT NULL DEFAULT 0 CHECK (home_goals >= 0),
  away_goals INTEGER NOT NULL DEFAULT 0 CHECK (away_goals >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view results"
  ON public.results FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create results"
  ON public.results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.fixtures f
      JOIN public.seasons s ON f.season_id = s.id
      JOIN public.leagues l ON s.league_id = l.id
      WHERE f.id = fixture_id AND l.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update their results"
  ON public.results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.fixtures f
      JOIN public.seasons s ON f.season_id = s.id
      JOIN public.leagues l ON s.league_id = l.id
      WHERE f.id = fixture_id AND l.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete their results"
  ON public.results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.fixtures f
      JOIN public.seasons s ON f.season_id = s.id
      JOIN public.leagues l ON s.league_id = l.id
      WHERE f.id = fixture_id AND l.organizer_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON public.leagues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON public.seasons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fixtures_updated_at BEFORE UPDATE ON public.fixtures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();