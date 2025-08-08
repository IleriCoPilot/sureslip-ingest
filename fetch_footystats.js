import fetch from "node-fetch";
const { FOOTYSTATS_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

async function rpc(name, body) {
  return fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "params=single-object",
    },
    body: JSON.stringify(body),
  });
}

async function main() {
  // fixtures → team form
  let url = `https://api.footystats.org/v3/matches?key=${FOOTYSTATS_API_KEY}&days=1`;
  const fx = await (await fetch(url)).json();
  for (const m of fx.data || []) {
    await rpc("upsert_team_form_json", {
      p_source: "footystats",
      p_team_key: m.homeID,
      p_season_key: m.season_id,
      p_window_code: "last5",
      p_metric: m.homeForm,
    });
  }

  // injuries → availability
  url = `https://api.footystats.org/v3/injuries?key=${FOOTYSTATS_API_KEY}&days=1`;
  const inj = await (await fetch(url)).json();
  for (const rec of inj.data || []) {
    await rpc("upsert_player_availability_json", {
      p_source: "footystats",
      p_player_key: rec.player_id,
      p_team_key: rec.team_id,
      p_season: rec.season,
      p_status_code: rec.status,
      p_start_date: rec.start_date,
      p_end_date: rec.expected_return,
      p_note: rec.description,
    });
  }
}

main().catch(async e => {
  await rpc("upsert_api_logs_json", {
    p_source: "footystats",
    p_level: "error",
    p_message: e.message,
    p_payload: null,
  });
  console.error(e);
  process.exit(1);
});
