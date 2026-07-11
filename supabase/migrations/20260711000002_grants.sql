-- Table/sequence/function privileges for the API roles. Row-level access is
-- governed by the RLS policies in the core schema migration; these grants
-- mirror Supabase hosted defaults.
grant usage on schema public to anon, authenticated, service_role;

grant all privileges on all tables in schema public
  to anon, authenticated, service_role;
grant all privileges on all sequences in schema public
  to anon, authenticated, service_role;
grant execute on all functions in schema public
  to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant execute on functions to anon, authenticated, service_role;
