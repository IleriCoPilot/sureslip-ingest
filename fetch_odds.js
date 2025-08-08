import fetch from "node-fetch";

const {
  ODDSAPI_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

async function callRpc(body) {
  return fetch(`${SUPABASE_URL}/rest/v1/rpc/upsert_match_odds_json`, {
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
  const res = await fetch(
    `https://api.the-odds-api.com/v4/sports/soccer_epl/odds?apiKey=${ODDSAPI_KEY}&regions=eu&markets=h2h`
  );
  if (!res.ok) throw new Error(`OddsAPI ${res.status}`);
  const data = await res.json();

  for (const item of data) {
    const r = await callRpc(item);
    if (!r.ok) console.error(await r.text());
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
