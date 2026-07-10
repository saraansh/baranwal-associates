-- Local/dev seed data. Fictional (example.com) — see docs/research/sample-content.md
-- Users are created directly in auth.users (local dev only); the
-- handle_new_user trigger creates their profiles, which we then enrich.

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'saraansh.baranwal@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ar. Saraansh Baranwal"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated', 'priya.srivastava@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Srivastava"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333',
   'authenticated', 'authenticated', 'manoj.gupta@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Manoj Kumar Gupta"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444',
   'authenticated', 'authenticated', 'alok.verma@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Er. Alok Verma"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555',
   'authenticated', 'authenticated', 'ramesh.agarwal@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ramesh Agarwal"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666',
   'authenticated', 'authenticated', 'neha.khanna@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Neha Khanna"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777',
   'authenticated', 'authenticated', 'sunil.jaiswal@example.com',
   crypt('password123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Sunil Jaiswal"}', now(), now());

update public.profiles set role = 'system_admin', phone = '+91 94152 45083'
  where id = '11111111-1111-1111-1111-111111111111';
update public.profiles set role = 'employee'
  where id = '22222222-2222-2222-2222-222222222222';
update public.profiles set role = 'accountant'
  where id = '33333333-3333-3333-3333-333333333333';
update public.profiles set role = 'collaborator'
  where id = '44444444-4444-4444-4444-444444444444';
-- 55/66/77 keep the default 'client' role.

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
insert into public.projects
  (id, name, slug, description, location, client_id, status, progress,
   budget_min_inr, budget_max_inr, is_public, cover_image_url, created_by)
values
  ('aaaa0014-0000-0000-0000-000000000014', 'Agarwal Residence',
   'agarwal-residence',
   '4BHK family bungalow, G+1, ~3,800 sq ft built-up on Sarnath Road. Vastu-aligned plan with a sloped mangalore-tile porch.',
   'Sarnath Road, Varanasi', '55555555-5555-5555-5555-555555555555',
   'construction', 58, 9500000, 11000000, true,
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111'),
  ('aaaa0003-0000-0000-0000-000000000003', 'Khanna Apartment Interiors',
   'khanna-apartment-interiors',
   'Full interiors for a 1,450 sq ft 3BHK in Shivpur — modern-minimal, fluted panelling, Statuario marble.',
   'Shivpur, Varanasi', '66666666-6666-6666-6666-666666666666',
   'design', 35, 1800000, 2400000, true,
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111'),
  ('aaaa0018-0000-0000-0000-000000000018', 'Jaiswal Silks Showroom',
   'jaiswal-silks-showroom',
   '1,600 sq ft Banarasi silk retail fit-out in Godowlia — gaddi seating zone, brass jaali facade, 3000K accent lighting.',
   'Godowlia, Varanasi', '77777777-7777-7777-7777-777777777777',
   'completed', 100, 6200000, 7000000, true,
   'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111'),
  ('aaaa0021-0000-0000-0000-000000000021', 'Jaiswal Haveli Restoration',
   'jaiswal-haveli-restoration',
   'Restoration and adaptive reuse of a 120-year-old haveli near Assi Ghat as a boutique homestay (~5,200 sq ft).',
   'Assi Ghat, Varanasi', '77777777-7777-7777-7777-777777777777',
   'on_hold', 22, 12500000, 15500000, false,
   'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111');

insert into public.project_members (project_id, user_id, member_role, added_by) values
  ('aaaa0014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'lead', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0014-0000-0000-0000-000000000014', '22222222-2222-2222-2222-222222222222', 'architect', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0014-0000-0000-0000-000000000014', '44444444-4444-4444-4444-444444444444', 'structural_engineer', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'lead', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'reviewer', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0018-0000-0000-0000-000000000018', '11111111-1111-1111-1111-111111111111', 'lead', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0018-0000-0000-0000-000000000018', '22222222-2222-2222-2222-222222222222', 'architect', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0021-0000-0000-0000-000000000021', '11111111-1111-1111-1111-111111111111', 'lead', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0021-0000-0000-0000-000000000021', '44444444-4444-4444-4444-444444444444', 'structural_engineer', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0021-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', 'documentation', '11111111-1111-1111-1111-111111111111');

-- Milestones (Agarwal Residence shown fully; others abbreviated)
insert into public.milestones (project_id, title, due_on, position, completed_at) values
  ('aaaa0014-0000-0000-0000-000000000014', 'Site survey & soil test', '2025-03-10', 1, '2025-03-10'),
  ('aaaa0014-0000-0000-0000-000000000014', 'Concept design sign-off', '2025-04-22', 2, '2025-04-22'),
  ('aaaa0014-0000-0000-0000-000000000014', 'VDA sanction', '2025-07-05', 3, '2025-07-05'),
  ('aaaa0014-0000-0000-0000-000000000014', 'Structural drawings issued (GFC)', '2025-08-18', 4, '2025-08-18'),
  ('aaaa0014-0000-0000-0000-000000000014', 'Plinth complete', '2025-10-30', 5, '2025-10-30'),
  ('aaaa0014-0000-0000-0000-000000000014', 'First-floor slab cast', '2026-02-14', 6, '2026-02-14'),
  ('aaaa0014-0000-0000-0000-000000000014', 'Brickwork & electrical conduiting', '2026-08-15', 7, null),
  ('aaaa0014-0000-0000-0000-000000000014', 'Finishes & handover', '2027-01-31', 8, null),
  ('aaaa0003-0000-0000-0000-000000000003', 'Site measurement & brief', '2026-04-08', 1, '2026-04-08'),
  ('aaaa0003-0000-0000-0000-000000000003', 'Mood boards & style lock', '2026-05-02', 2, '2026-05-02'),
  ('aaaa0003-0000-0000-0000-000000000003', 'Furniture layout approval', '2026-06-12', 3, '2026-06-12'),
  ('aaaa0003-0000-0000-0000-000000000003', '3D views — living/dining', '2026-07-20', 4, null),
  ('aaaa0003-0000-0000-0000-000000000003', 'GFC + BOQ issue', '2026-08-25', 5, null),
  ('aaaa0003-0000-0000-0000-000000000003', 'Fit-out complete & handover', '2026-12-15', 6, null),
  ('aaaa0018-0000-0000-0000-000000000018', 'Brief & measured drawing', '2025-06-15', 1, '2025-06-15'),
  ('aaaa0018-0000-0000-0000-000000000018', 'Concept + lighting design', '2025-07-28', 2, '2025-07-28'),
  ('aaaa0018-0000-0000-0000-000000000018', 'GFC & BOQ', '2025-09-05', 3, '2025-09-05'),
  ('aaaa0018-0000-0000-0000-000000000018', 'Fit-out execution', '2025-12-20', 4, '2025-12-20'),
  ('aaaa0018-0000-0000-0000-000000000018', 'Snag list closure & handover', '2026-01-18', 5, '2026-01-18'),
  ('aaaa0021-0000-0000-0000-000000000021', 'Condition mapping & photo documentation', '2025-11-10', 1, '2025-11-10'),
  ('aaaa0021-0000-0000-0000-000000000021', 'Measured drawings (as-built)', '2026-01-25', 2, '2026-01-25'),
  ('aaaa0021-0000-0000-0000-000000000021', 'Structural distress assessment', '2026-03-14', 3, '2026-03-14'),
  ('aaaa0021-0000-0000-0000-000000000021', 'Heritage cell NOC', '2026-08-30', 4, null);

-- ---------------------------------------------------------------------------
-- Drawings and versions
-- ---------------------------------------------------------------------------
insert into public.drawings (id, project_id, title, kind, created_by) values
  ('dddd0001-0000-0000-0000-000000000001', 'aaaa0014-0000-0000-0000-000000000014', 'Floor plans', 'dwg_2d', '22222222-2222-2222-2222-222222222222'),
  ('dddd0002-0000-0000-0000-000000000002', 'aaaa0014-0000-0000-0000-000000000014', '3D massing', 'sketchup_3d', '22222222-2222-2222-2222-222222222222'),
  ('dddd0003-0000-0000-0000-000000000003', 'aaaa0014-0000-0000-0000-000000000014', 'Structural — foundation', 'dwg_2d', '44444444-4444-4444-4444-444444444444'),
  ('dddd0004-0000-0000-0000-000000000004', 'aaaa0003-0000-0000-0000-000000000003', 'Furniture layout', 'dwg_2d', '22222222-2222-2222-2222-222222222222'),
  ('dddd0005-0000-0000-0000-000000000005', 'aaaa0003-0000-0000-0000-000000000003', 'Living room 3D', 'sketchup_3d', '22222222-2222-2222-2222-222222222222'),
  ('dddd0006-0000-0000-0000-000000000006', 'aaaa0018-0000-0000-0000-000000000018', 'Showroom layout', 'dwg_2d', '22222222-2222-2222-2222-222222222222'),
  ('dddd0007-0000-0000-0000-000000000007', 'aaaa0021-0000-0000-0000-000000000021', 'As-built measured drawings', 'dwg_2d', '22222222-2222-2222-2222-222222222222');

insert into public.drawing_versions
  (drawing_id, version_no, original_key, original_filename, preview_kind, preview_key, notes, approval, uploaded_by, created_at) values
  ('dddd0001-0000-0000-0000-000000000001', 1, 'seed/AGR-BNG_floor-plans_v1.dwg', 'AGR-BNG_floor-plans.dwg', 'pdf', 'seed/AGR-BNG_floor-plans_v1.pdf', 'Concept layout', 'approved', '22222222-2222-2222-2222-222222222222', '2025-04-02'),
  ('dddd0001-0000-0000-0000-000000000001', 2, 'seed/AGR-BNG_floor-plans_v2.dwg', 'AGR-BNG_floor-plans.dwg', 'pdf', 'seed/AGR-BNG_floor-plans_v2.pdf', 'Pooja room shifted NE per Vastu, kitchen enlarged', 'approved', '22222222-2222-2222-2222-222222222222', '2025-04-18'),
  ('dddd0001-0000-0000-0000-000000000001', 3, 'seed/AGR-BNG_floor-plans_v3.dwg', 'AGR-BNG_floor-plans.dwg', 'pdf', 'seed/AGR-BNG_floor-plans_v3.pdf', 'VDA sanction set — setbacks corrected to 3.0 m front', 'approved', '22222222-2222-2222-2222-222222222222', '2025-06-20'),
  ('dddd0002-0000-0000-0000-000000000002', 1, 'seed/AGR-BNG_3d-massing_v1.skp', 'AGR-BNG_3d-massing.skp', 'gltf', 'seed/AGR-BNG_3d-massing_v1.gltf', 'Flat-roof scheme', 'changes_requested', '22222222-2222-2222-2222-222222222222', '2025-04-05'),
  ('dddd0002-0000-0000-0000-000000000002', 2, 'seed/AGR-BNG_3d-massing_v2.skp', 'AGR-BNG_3d-massing.skp', 'gltf', 'seed/AGR-BNG_3d-massing_v2.gltf', 'Added sloped mangalore-tile porch per client request', 'approved', '22222222-2222-2222-2222-222222222222', '2025-04-19'),
  ('dddd0003-0000-0000-0000-000000000003', 1, 'seed/AGR-BNG_STR-foundation_v1.dwg', 'AGR-BNG_STR-foundation.dwg', 'pdf', null, 'Isolated footings', 'changes_requested', '44444444-4444-4444-4444-444444444444', '2025-08-01'),
  ('dddd0003-0000-0000-0000-000000000003', 2, 'seed/AGR-BNG_STR-foundation_v2.dwg', 'AGR-BNG_STR-foundation.dwg', 'pdf', null, 'Footing depth revised to 1.8 m after soil report', 'approved', '44444444-4444-4444-4444-444444444444', '2025-08-16'),
  ('dddd0004-0000-0000-0000-000000000004', 1, 'seed/KHN-INT_furniture-layout_v1.dwg', 'KHN-INT_furniture-layout.dwg', 'pdf', null, 'Initial layout', 'changes_requested', '22222222-2222-2222-2222-222222222222', '2026-05-20'),
  ('dddd0004-0000-0000-0000-000000000004', 2, 'seed/KHN-INT_furniture-layout_v2.dwg', 'KHN-INT_furniture-layout.dwg', 'pdf', null, 'L-shaped sofa swapped for 3+2, TV wall moved off window', 'changes_requested', '22222222-2222-2222-2222-222222222222', '2026-06-04'),
  ('dddd0004-0000-0000-0000-000000000004', 3, 'seed/KHN-INT_furniture-layout_v3.dwg', 'KHN-INT_furniture-layout.dwg', 'pdf', null, 'Approved set — crockery unit added in dining', 'approved', '22222222-2222-2222-2222-222222222222', '2026-06-11'),
  ('dddd0005-0000-0000-0000-000000000005', 1, 'seed/KHN-INT_living-3d_v1.skp', 'KHN-INT_living-3d.skp', 'gltf', 'seed/KHN-INT_living-preview_v1.gltf', 'Walnut veneer TV panel, grey vitrified tile', 'changes_requested', '22222222-2222-2222-2222-222222222222', '2026-06-28'),
  ('dddd0005-0000-0000-0000-000000000005', 2, 'seed/KHN-INT_living-3d_v2.skp', 'KHN-INT_living-3d.skp', 'gltf', 'seed/KHN-INT_living-preview_v2.gltf', 'Fluted panel + Statuario flooring, 2700K dimmable cove', 'approved', '22222222-2222-2222-2222-222222222222', '2026-07-08'),
  ('dddd0006-0000-0000-0000-000000000006', 1, 'seed/JSL-SHW_layout_v1.dwg', 'JSL-SHW_layout.dwg', 'pdf', null, 'Central display island', 'changes_requested', '22222222-2222-2222-2222-222222222222', '2025-07-10'),
  ('dddd0006-0000-0000-0000-000000000006', 2, 'seed/JSL-SHW_layout_v2.dwg', 'JSL-SHW_layout.dwg', 'pdf', null, 'Island removed for gaddi seating zone', 'approved', '22222222-2222-2222-2222-222222222222', '2025-07-25'),
  ('dddd0006-0000-0000-0000-000000000006', 3, 'seed/JSL-SHW_layout_v3.dwg', 'JSL-SHW_layout.dwg', 'pdf', null, 'GFC with electrical layout', 'approved', '22222222-2222-2222-2222-222222222222', '2025-08-30'),
  ('dddd0007-0000-0000-0000-000000000007', 1, 'seed/JSH-HRT_as-built_v1.dwg', 'JSH-HRT_as-built.dwg', 'pdf', null, 'Ground-floor measured drawing', 'approved', '22222222-2222-2222-2222-222222222222', '2026-01-15'),
  ('dddd0007-0000-0000-0000-000000000007', 2, 'seed/JSH-HRT_as-built_v2.dwg', 'JSH-HRT_as-built.dwg', 'pdf', null, 'Added first floor + courtyard sections, crack mapping layer', 'approved', '22222222-2222-2222-2222-222222222222', '2026-01-24');

-- ---------------------------------------------------------------------------
-- Threads and messages (abbreviated from the research transcripts)
-- ---------------------------------------------------------------------------
insert into public.threads (id, kind, project_id, title, created_by) values
  ('eeee0001-0000-0000-0000-000000000001', 'project_chat', 'aaaa0014-0000-0000-0000-000000000014', 'Agarwal Residence — project chat', '55555555-5555-5555-5555-555555555555'),
  ('eeee0002-0000-0000-0000-000000000002', 'drawing_feedback', 'aaaa0003-0000-0000-0000-000000000003', 'Living room 3D — feedback', '22222222-2222-2222-2222-222222222222'),
  ('eeee0003-0000-0000-0000-000000000003', 'ai_chat', 'aaaa0003-0000-0000-0000-000000000003', 'Interior visualizer session', '66666666-6666-6666-6666-666666666666');

insert into public.messages (thread_id, sender_id, body, is_ai, created_at) values
  ('eeee0001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Namaste Saraansh ji. Contractor is saying slab casting this Friday. Should we be present at site?', false, '2026-02-10 09:42'),
  ('eeee0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Namaste Ramesh ji. Yes, Friday 14th is confirmed. Priya will be on site from 7 AM for reinforcement checking before the pour. You''re welcome to visit after 11 AM once casting starts.', false, '2026-02-10 10:15'),
  ('eeee0001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Ok. Also my wife is asking — can we still change the kitchen platform height?', false, '2026-02-10 10:22'),
  ('eeee0001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Ramesh ji, yes — platform height is decided at finishing stage, so no problem at all. Standard is 850 mm; we can do 800 mm. I''ll note it in the interior working drawings.', false, '2026-02-10 11:05'),
  ('eeee0001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Slab cast completed at 4:30 PM — 42 m³ M25 RMC, cube samples taken. Milestone marked complete, progress updated. ✅', false, '2026-02-14 17:45'),
  ('eeee0002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Hi Neha, the living room 3D views are ready — please review version v1 on the portal.', false, '2026-06-28 16:10'),
  ('eeee0002-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666', 'Looks nice but the TV wall feels flat. And the grey tile is making the room feel like an office. Can we look at marble? Budget can stretch a little.', false, '2026-06-29 21:34'),
  ('eeee0002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Two suggestions: fluted wood panelling on the TV wall, and Statuario-look Italian marble (~₹580/sq ft, +₹1.6 L for living+dining). I''ll model both.', false, '2026-06-30 10:05'),
  ('eeee0002-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666', 'Wow, huge difference on v2. Approving this direction. Can the cove light be slightly dimmer/warmer in the final spec?', false, '2026-07-08 22:15'),
  ('eeee0002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Noted — spec updated to 2700K dimmable strip. Marking v2 as client-approved. 🎉', false, '2026-07-09 09:30'),
  ('eeee0003-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666', 'This is my current living room. Can I see how my new flat''s living room could look in the style we chose?', false, '2026-07-11 20:05'),
  ('eeee0003-0000-0000-0000-000000000003', null, 'Applied: fluted oak TV wall, low-profile off-white sofa, Statuario marble flooring, 2700K warm evening lighting. Credits remaining: 9.', true, '2026-07-11 20:07'),
  ('eeee0003-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666', 'I love the floor! But the curtains look too dark and can you add some plants near the window?', false, '2026-07-11 20:09'),
  ('eeee0003-0000-0000-0000-000000000003', null, 'Updated: sheer ivory curtains, areca palm + fiddle-leaf fig by the north window. Credits remaining: 8.', true, '2026-07-11 20:11');

insert into public.ai_generations (thread_id, user_id, presets, output_key, model, credits_spent, created_at) values
  ('eeee0003-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666',
   '{"style":"modern-minimal","lighting_mood":"warm-ambient","flooring":"polished-marble"}',
   'seed/ai-gen-0042-01.png', 'gpt-4o', 1, '2026-07-11 20:07'),
  ('eeee0003-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666',
   '{"style":"modern-minimal","lighting_mood":"warm-ambient","flooring":"polished-marble","notes":"sheer ivory curtains, plants"}',
   'seed/ai-gen-0042-02.png', 'gpt-4o', 1, '2026-07-11 20:11');

-- ---------------------------------------------------------------------------
-- Payments and credits
-- ---------------------------------------------------------------------------
insert into public.payments (id, user_id, amount_inr, method, status, razorpay_payment_id, recorded_by, notes, created_at) values
  ('ffff0091-0000-0000-0000-000000000091', '55555555-5555-5555-5555-555555555555', 250000, 'razorpay', 'paid', 'pay_QaX8kR2mNv91Lc', null, 'Design fee — 1st instalment (concept sign-off)', '2025-04-25'),
  ('ffff0102-0000-0000-0000-000000000102', '55555555-5555-5555-5555-555555555555', 200000, 'cash', 'paid', null, '33333333-3333-3333-3333-333333333333', 'Design fee — 2nd instalment (sanction) · RCPT-2025-041', '2025-07-08'),
  ('ffff0110-0000-0000-0000-000000000110', '77777777-7777-7777-7777-777777777777', 300000, 'razorpay', 'paid', 'pay_QhT3wPz6XbK2Mn', null, 'Showroom — design fee advance', '2025-08-01'),
  ('ffff0118-0000-0000-0000-000000000118', '77777777-7777-7777-7777-777777777777', 150000, 'cash', 'paid', null, '33333333-3333-3333-3333-333333333333', 'Showroom — GFC milestone · RCPT-2025-057', '2025-09-10'),
  ('ffff0142-0000-0000-0000-000000000142', '55555555-5555-5555-5555-555555555555', 150000, 'cash', 'paid', null, '33333333-3333-3333-3333-333333333333', '3rd instalment (first-floor slab milestone) · RCPT-2026-008', '2026-02-16'),
  ('ffff0151-0000-0000-0000-000000000151', '66666666-6666-6666-6666-666666666666', 120000, 'razorpay', 'paid', 'pay_SdN7yLw3TzJ5Kp', null, 'Interior design fee — booking advance', '2026-04-10'),
  ('ffff0160-0000-0000-0000-000000000160', '66666666-6666-6666-6666-666666666666', 2499, 'razorpay', 'paid', 'pay_ShQ9rNw2YzT6Gm', null, 'AI visualizer credit pack (10 credits)', '2026-06-25');

insert into public.credits_ledger (user_id, delta, reason, payment_id, created_at) values
  ('66666666-6666-6666-6666-666666666666', 10, 'purchase', 'ffff0160-0000-0000-0000-000000000160', '2026-06-25'),
  ('66666666-6666-6666-6666-666666666666', -1, 'generation_spend', null, '2026-07-11 20:07'),
  ('66666666-6666-6666-6666-666666666666', -1, 'generation_spend', null, '2026-07-11 20:11'),
  ('55555555-5555-5555-5555-555555555555', 5, 'admin_adjustment', null, '2025-05-01'),
  ('55555555-5555-5555-5555-555555555555', -1, 'generation_spend', null, '2025-05-04'),
  ('77777777-7777-7777-7777-777777777777', 5, 'admin_adjustment', null, '2025-08-05');

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
insert into public.blog_posts (title, slug, category, summary, body_md, cover_image_url, author_id, published_at) values
  ('Vastu Meets Modern: Designing a Contemporary Home Without Compromising Tradition',
   'vastu-meets-modern-contemporary-home', 'Residential Design',
   'How we reconcile Vastu Shastra principles — entrance orientation, brahmasthan planning, kitchen placement — with open-plan modern living.',
   'Full article coming soon.', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111', '2026-05-15'),
  ('What Does It Really Cost to Build a House in Eastern U.P. in 2026?',
   'cost-to-build-house-2026', 'Guides & Costs',
   'A transparent breakdown of construction costs — from ₹1,800/sq ft economy builds to ₹3,500+/sq ft premium finishes.',
   'Full article coming soon.', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111', '2026-06-01'),
  ('Restoring a 120-Year-Old Haveli: A Conservation Diary',
   'haveli-restoration-diary', 'Heritage & Conservation',
   'Field notes from our ongoing haveli restoration — lime plaster instead of cement, salvaging original teak brackets.',
   'Full article coming soon.', 'https://images.unsplash.com/photo-1721244654394-36a7bc2da288?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111', '2026-06-10'),
  ('Italian Marble vs. Vitrified Tiles: An Honest Comparison for Indian Homes',
   'italian-marble-vs-vitrified-tiles', 'Interiors & Materials',
   'Statuario looks stunning, but is it right for your lifestyle? Cost, maintenance, staining, and resale perception compared.',
   'Full article coming soon.', 'https://images.pexels.com/photos/14583331/pexels-photo-14583331.jpeg?auto=compress&cs=tinysrgb&w=1200',
   '22222222-2222-2222-2222-222222222222', '2026-06-20'),
  ('Why Your Architect Wants a 3D Model Before You Approve Anything',
   'why-3d-models-before-approval', 'Process & Technology',
   'Clients who review 3D walkthroughs request far fewer changes during construction. How our drawing-versioning workflow saves you money.',
   'Full article coming soon.', 'https://images.unsplash.com/photo-1624066969616-69b0b0301d4d?auto=format&fit=crop&w=1600&q=80',
   '11111111-1111-1111-1111-111111111111', '2026-07-01'),
  ('Small Showroom, Big Impact: Retail Design Lessons from a Banarasi Silk Store',
   'retail-design-banarasi-silk-showroom', 'Commercial',
   'Lighting temperature sells silk — 3000K warm spots on display walls, 4000K at billing. Our design decisions for a 1,600 sq ft showroom.',
   'Full article coming soon.', 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600',
   '11111111-1111-1111-1111-111111111111', '2026-07-05');
