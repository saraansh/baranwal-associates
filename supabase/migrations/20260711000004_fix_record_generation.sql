-- FOR UPDATE cannot be combined with aggregates; lock the user's ledger
-- rows first, then sum.
create or replace function public.record_generation(
  p_user uuid,
  p_thread uuid,
  p_message uuid,
  p_input_keys text[],
  p_presets jsonb,
  p_output_key text,
  p_model text,
  p_is_trial boolean,
  p_credits int
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_balance int;
  v_generation uuid;
begin
  if not p_is_trial then
    perform 1 from credits_ledger where user_id = p_user for update;
    select coalesce(sum(delta), 0) into v_balance
    from credits_ledger where user_id = p_user;

    if v_balance < p_credits then
      raise exception 'insufficient_credits';
    end if;
  end if;

  insert into ai_generations
    (thread_id, user_id, message_id, input_keys, presets, output_key,
     model, credits_spent, is_trial)
  values
    (p_thread, p_user, p_message, p_input_keys, p_presets, p_output_key,
     p_model, case when p_is_trial then 0 else p_credits end, p_is_trial)
  returning id into v_generation;

  if not p_is_trial then
    insert into credits_ledger (user_id, delta, reason, generation_id)
    values (p_user, -p_credits, 'generation_spend', v_generation);
  end if;

  return v_generation;
end;
$$;
