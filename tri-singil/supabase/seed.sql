-- Sample zones and fares for local testing.
-- Fares are FIXED per zone-to-zone route, not distance-calculated.
--
-- Target service area is Candon City, Ilocos Sur. These 5 zones are
-- illustrative placeholders — small ~800m boxes spread around the city
-- center so map-tap/GPS zone lookup has something real to resolve against
-- during development. They are NOT verified barangay boundaries. Swap in
-- the actual barangay GeoJSON and a real fare matrix (from the local
-- TODA/LGU fare ordinance) before this is usable by real riders.
--
-- Minimum fare per passenger: PHP 20 (see MIN_FARE in src/lib/fareEngine.js).

insert into zones (id, name, municipality, boundary) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Poblacion (city center)',
    'Candon City',
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[120.4462,17.2012],[120.4542,17.2012],[120.4542,17.1932],[120.4462,17.1932],[120.4462,17.2012]]]}')
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'North Candon',
    'Candon City',
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[120.4480,17.2190],[120.4560,17.2190],[120.4560,17.2110],[120.4480,17.2110],[120.4480,17.2190]]]}')
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'South Candon',
    'Candon City',
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[120.4440,17.1840],[120.4520,17.1840],[120.4520,17.1760],[120.4440,17.1760],[120.4440,17.1840]]]}')
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Coastal (west)',
    'Candon City',
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[120.4360,17.2012],[120.4440,17.2012],[120.4440,17.1932],[120.4360,17.1932],[120.4360,17.2012]]]}')
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Highway East',
    'Candon City',
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[120.4560,17.2012],[120.4640,17.2012],[120.4640,17.1932],[120.4560,17.1932],[120.4560,17.2012]]]}')
  )
on conflict (id) do nothing;

insert into fare_matrix (origin_zone_id, destination_zone_id, base_fare, effective_date, is_active) values
  -- Poblacion <-> each surrounding zone: short hop, minimum fare
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 20, current_date, true),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 20, current_date, true),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 20, current_date, true),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 20, current_date, true),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 20, current_date, true),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 20, current_date, true),
  ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 20, current_date, true),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 20, current_date, true),
  -- Cross-town trips that skip Poblacion: longer, higher fare
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 35, current_date, true),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 35, current_date, true),
  ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 30, current_date, true),
  ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 30, current_date, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 25, current_date, true),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 25, current_date, true),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 25, current_date, true),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 25, current_date, true);

insert into fare_modifiers (type, calculation, value, time_start, time_end, is_active) values
  ('night_surcharge', 'flat', 5, '22:00', '05:00', true),
  ('student_discount', 'percent', 20, null, null, true),
  ('senior_discount', 'percent', 20, null, null, true),
  ('pwd_discount', 'percent', 20, null, null, true);
