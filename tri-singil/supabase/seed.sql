-- Placeholder zones and fares for local testing.
-- Fares are FIXED per zone-to-zone route, not distance-calculated.

insert into zones (id, name, municipality, boundary) values
  ('11111111-1111-1111-1111-111111111111', 'Poblacion', 'San Pedro', null),
  ('22222222-2222-2222-2222-222222222222', 'Riverside', 'San Pedro', null),
  ('33333333-3333-3333-3333-333333333333', 'Highway Junction', 'San Pedro', null),
  ('44444444-4444-4444-4444-444444444444', 'Market Area', 'San Pedro', null)
on conflict (id) do nothing;

insert into fare_matrix (origin_zone_id, destination_zone_id, base_fare, effective_date, is_active) values
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 15, current_date, true),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 15, current_date, true),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 20, current_date, true),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 20, current_date, true),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 12, current_date, true),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 12, current_date, true),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 25, current_date, true),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 25, current_date, true);

insert into fare_modifiers (type, calculation, value, time_start, time_end, is_active) values
  ('night_surcharge', 'flat', 5, '22:00', '05:00', true),
  ('student_discount', 'percent', 20, null, null, true),
  ('senior_discount', 'percent', 20, null, null, true),
  ('pwd_discount', 'percent', 20, null, null, true);
