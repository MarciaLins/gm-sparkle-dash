-- Phase 1: Create profiles table for user metadata
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles (users can only see their own profile)
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Phase 2: Enable RLS on all existing tables
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alocacao_equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clientes (only authenticated users)
CREATE POLICY "Authenticated users can view clientes"
  ON public.clientes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert clientes"
  ON public.clientes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update clientes"
  ON public.clientes
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete clientes"
  ON public.clientes
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for eventos
CREATE POLICY "Authenticated users can view eventos"
  ON public.eventos
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert eventos"
  ON public.eventos
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update eventos"
  ON public.eventos
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete eventos"
  ON public.eventos
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for financeiro
CREATE POLICY "Authenticated users can view financeiro"
  ON public.financeiro
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert financeiro"
  ON public.financeiro
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update financeiro"
  ON public.financeiro
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete financeiro"
  ON public.financeiro
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for equipe
CREATE POLICY "Authenticated users can view equipe"
  ON public.equipe
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert equipe"
  ON public.equipe
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update equipe"
  ON public.equipe
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete equipe"
  ON public.equipe
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for alocacao_equipe
CREATE POLICY "Authenticated users can view alocacao_equipe"
  ON public.alocacao_equipe
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert alocacao_equipe"
  ON public.alocacao_equipe
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update alocacao_equipe"
  ON public.alocacao_equipe
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete alocacao_equipe"
  ON public.alocacao_equipe
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for lista_espera
CREATE POLICY "Authenticated users can view lista_espera"
  ON public.lista_espera
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert lista_espera"
  ON public.lista_espera
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update lista_espera"
  ON public.lista_espera
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete lista_espera"
  ON public.lista_espera
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for servicos
CREATE POLICY "Authenticated users can view servicos"
  ON public.servicos
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert servicos"
  ON public.servicos
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update servicos"
  ON public.servicos
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete servicos"
  ON public.servicos
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for cliente
CREATE POLICY "Authenticated users can view cliente"
  ON public.cliente
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert cliente"
  ON public.cliente
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update cliente"
  ON public.cliente
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete cliente"
  ON public.cliente
  FOR DELETE
  USING (auth.uid() IS NOT NULL);