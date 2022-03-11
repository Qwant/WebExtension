#!/bin/bash
set -euo pipefail

./scripts/build.sh chrome
./scripts/build.sh firefox
./scripts/build.sh edge
./scripts/build.sh opera
