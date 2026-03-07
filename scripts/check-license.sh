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

# Files to check for the full Apache header (commented)
FILES=$(find src deploy .github scripts -type f \( -name "*.ts" -o -name "*.html" -o -name "*.scss" -o -name "*.yml" -o -name "*.sh" -o -name "Dockerfile" -o -name "nginx.conf" -o -name "eslint.config.js" -o -name ".prettierignore" \))

MISSING_HEADERS=0

for FILE in $FILES; do
  if [ ! -f "$FILE" ]; then
    continue
  fi

  # Check for Apache License header
  if ! grep -q "Licensed to the Apache Software Foundation" "$FILE"; then
    echo "Missing Apache License header in $FILE"
    MISSING_HEADERS=$((MISSING_HEADERS + 1))
  fi
done

# Check for the license field in JSON configuration files
# Exclude angular.json because the schema doesn't allow arbitrary properties
JSON_FILES=$(find . -maxdepth 1 -name "*.json" ! -name "package-lock.json" ! -name "angular.json")
JSON_FILES="$JSON_FILES $(find src/assets/i18n -name "*.json")"

for FILE in $JSON_FILES; do
  if [ ! -f "$FILE" ]; then
    continue
  fi
  if ! grep -i -q "Apache-2.0" "$FILE" && ! grep -q "Apache License" "$FILE"; then
    echo "Missing Apache license reference in $FILE"
    MISSING_HEADERS=$((MISSING_HEADERS + 1))
  fi
done

if [ $MISSING_HEADERS -gt 0 ]; then
  echo "Found $MISSING_HEADERS files missing license headers/fields."
  exit 1
else
  echo "All checked files have license headers/fields."
  exit 0
fi
