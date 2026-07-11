-- Atomic generation recording: balance check + generation row + ledger
-- debit in one transaction, so concurrent requests can't overspend.
create function public.record_generation(
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
    select coalesce(sum(delta), 0) into v_balance
    from credits_ledger where user_id = p_user for update;

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

-- Counts trial generations already consumed by a user.
create function public.trial_generations_used(p_user uuid)
returns int
language sql stable security definer set search_path = public
as $$
  select count(*)::int from ai_generations
  where user_id = p_user and is_trial;
$$;

-- Credit purchases (Razorpay success or accountant cash) — idempotent per
-- payment so webhook + verify callbacks can't double-grant.
create function public.grant_credits_for_payment(
  p_payment uuid,
  p_credits int
) returns void
language plpgsql security definer set search_path = public
as $$
begin
  if exists (select 1 from credits_ledger where payment_id = p_payment) then
    return;
  end if;
  insert into credits_ledger (user_id, delta, reason, payment_id, recorded_by)
  select user_id, p_credits,
         case when method = 'cash' then 'cash_payment' else 'purchase' end::public.credit_reason,
         id, recorded_by
  from payments where id = p_payment and status = 'paid';
end;
$$;
