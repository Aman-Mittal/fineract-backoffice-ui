#!/bin/bash

# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Brings the local Fineract stack up, and waits until it actually answers.
#
#   scripts/e2e-stack.sh          # start, keeping any existing data
#   scripts/e2e-stack.sh --fresh  # destroy the volume first
#
# --fresh is what CI gets on every run, and the difference matters more than it
# sounds: a database that has accumulated data across local runs hides failures
# that a migration-fresh one finds immediately — an assertion like "the products
# list shows a badge" passes locally on leftover products and fails in CI, where
# nothing has created one yet. Reach for --fresh before concluding that a CI-only
# failure is CI's fault.

set -euo pipefail

COMPOSE_FILE="deploy/docker-compose-e2e.yml"
HEALTH_URL="https://localhost:8443/fineract-provider/actuator/info"

if [[ "${1:-}" == "--fresh" ]]; then
  echo "🧹 Removing the existing database volume..."
  docker compose -f "$COMPOSE_FILE" down -v
fi

echo "🐘 Starting PostgreSQL..."
docker compose -f "$COMPOSE_FILE" up -d --wait fineract-db

# init-db.sql is idempotent (\gexec), so this is safe with or without --fresh.
echo "📦 Ensuring the Fineract databases exist..."
docker exec -i fineract-db psql -U postgres < deploy/init-db.sql

echo "🚀 Starting Fineract..."
docker compose -f "$COMPOSE_FILE" up -d fineract-backend

echo "⏳ Waiting for Fineract (migrations take 60-90s on a fresh volume)..."
for _ in {1..60}; do
  if [[ "$(curl -k -s -o /dev/null -w '%{http_code}' --max-time 5 "$HEALTH_URL" || true)" == "200" ]]; then
    echo "✅ Fineract is up. Run: npm run test:e2e:local"
    exit 0
  fi
  sleep 5
done

echo "❌ Fineract did not come up in time. Recent logs:"
docker compose -f "$COMPOSE_FILE" logs --tail=50 fineract-backend
exit 1
