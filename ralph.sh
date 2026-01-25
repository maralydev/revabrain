#!/usr/bin/env bash
set -euo pipefail

# Ralph loop — Claude Code edition (RevaBrain)
#
# Usage:
#   ./ralph.sh [max_iterations]
#   ./ralph.sh --tool claude [max_iterations]
#
# Notes:
# - Runs one Claude Code "print mode" invocation per iteration.
# - Expects prd.json in the same directory as this script.
# - Memory + rules are loaded via .claude/CLAUDE.md (Claude Code project memory).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TOOL="claude"
MAX_ITERATIONS="${1:-10}"

if [[ "${1:-}" == "--tool" ]]; then
  TOOL="${2:-claude}"
  MAX_ITERATIONS="${3:-10}"
fi

PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"
ARCHIVE_DIR="$SCRIPT_DIR/archive"

if [[ ! -f "$PRD_FILE" ]]; then
  echo "Error: prd.json not found at $PRD_FILE"
  echo "Create it (or update it) based on prd.md and rerun."
  exit 1
fi

# Ensure progress file exists
if [[ ! -f "$PROGRESS_FILE" ]]; then
  cat > "$PROGRESS_FILE" <<'EOF'
# Progress Log — RevaBrain (Ralph loop)

## Codebase Patterns

- (nog leeg)
EOF
fi

# Read current branch name from PRD
BRANCH_NAME="$(jq -r '.branchName' "$PRD_FILE")"
if [[ -z "$BRANCH_NAME" || "$BRANCH_NAME" == "null" ]]; then
  echo "Error: branchName missing in prd.json"
  exit 1
fi

# Archive previous run if branch changed
if [[ -f "$LAST_BRANCH_FILE" ]]; then
  LAST_BRANCH="$(cat "$LAST_BRANCH_FILE")"
  if [[ "$LAST_BRANCH" != "$BRANCH_NAME" ]]; then
    echo "New branch detected. Archiving previous run..."
    TIMESTAMP="$(date +%Y-%m-%d-%H%M%S)"
    ARCHIVE_PATH="$ARCHIVE_DIR/$TIMESTAMP-$LAST_BRANCH"
    mkdir -p "$ARCHIVE_PATH"
    cp -f "$PRD_FILE" "$ARCHIVE_PATH/prd.json" 2>/dev/null || true
    cp -f "$PROGRESS_FILE" "$ARCHIVE_PATH/progress.txt" 2>/dev/null || true
    echo "Archived to $ARCHIVE_PATH"
  fi
fi

echo "$BRANCH_NAME" > "$LAST_BRANCH_FILE"

# Create or checkout branch
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  git checkout "$BRANCH_NAME"
else
  echo "Creating branch: $BRANCH_NAME"
  git checkout -b "$BRANCH_NAME"
fi

# Main loop
for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "========================================="
  echo "Ralph iteration $i/$MAX_ITERATIONS"
  echo "========================================="

  # Stop if all stories pass
  REMAINING="$(jq -r '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")"
  if [[ "$REMAINING" -eq 0 ]]; then
    echo "<promise>COMPLETE</promise>"
    exit 0
  fi

  case "$TOOL" in
    claude)
      # Claude Code headless / print mode.
      # We feed the prompt via STDIN (claude.md).
      # --dangerously-skip-permissions is required for unattended runs.
      claude --dangerously-skip-permissions --no-session-persistence --print < "$SCRIPT_DIR/claude.md"
      ;;
    *)
      echo "Error: Unsupported tool '$TOOL'. Supported: claude"
      exit 1
      ;;
  esac

  # If Claude indicates completion, stop
  if tail -n 5 "$PROGRESS_FILE" 2>/dev/null | grep -q "<promise>COMPLETE</promise>"; then
    echo "<promise>COMPLETE</promise>"
    exit 0
  fi
done

echo "Reached max iterations ($MAX_ITERATIONS)."
exit 0
