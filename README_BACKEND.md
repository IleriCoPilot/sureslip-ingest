# SureSlip Backend

This repository contains automation scripts for data ingestion into Supabase.

## Automation layer: GitHub Actions

This pipeline uses GitHub Actions to run ingestion scripts on a schedule:

- OddsAPI fetch runs every 6 minutes.
- FootyStats fetch runs every 12 minutes.

The workflow (`.github/workflows/ingest.yml`) triggers Node.js scripts to call Supabase RPC endpoints.

### Costs

- Public repositories: unlimited free GitHub Actions minutes.
- Private repositories: first 2,000 minutes per month are free; extra minutes cost about $0.008 per minute (approximately $20,000 per month at very high volumes).

### Slack Alerts

Failed runs send Slack notifications via the configured webhook.
