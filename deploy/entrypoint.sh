#!/bin/sh

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

# Create config.json from environment variables
# If FINERACT_API_URL is set, use it, otherwise keep the default in the file
if [ ! -z "$FINERACT_API_URL" ]; then
  echo "Setting FINERACT_API_URL to $FINERACT_API_URL"
  cat <<EOF > /usr/share/nginx/html/config.json
{
  "fineractApiUrl": "$FINERACT_API_URL",
  "defaultTenant": "${DEFAULT_TENANT:-default}"
}
EOF
fi

# Execute CMD
exec "$@"
