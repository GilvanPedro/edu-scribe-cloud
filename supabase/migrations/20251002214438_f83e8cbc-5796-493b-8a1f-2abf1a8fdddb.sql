-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  nome_completo text not null,
  email text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create alunos table
create table public.alunos (
  id uuid not null default gen_random_uuid() primary key,
  nome text not null,
  matricula text not null unique,
  email text not null,
  data_nascimento date not null,
  telefone text,
  endereco text,
  curso text,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.alunos enable row level security;

-- Alunos policies
create policy "Users can view their own alunos"
  on public.alunos for select
  using (auth.uid() = user_id);

create policy "Users can create their own alunos"
  on public.alunos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alunos"
  on public.alunos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alunos"
  on public.alunos for delete
  using (auth.uid() = user_id);

-- Create function to update timestamps
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for automatic timestamp updates
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_alunos_updated_at
  before update on public.alunos
  for each row
  execute function public.update_updated_at_column();

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome_completo, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome_completo', ''),
    new.email
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();