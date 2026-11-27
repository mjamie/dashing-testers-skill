# DashingTesters skill

Invoke the skill in your app's Codex or Claude Code chat to write a manual test checklist and automatically publish the project, build instructions, and plain-language stories to your DashingTesters dashboard. Each story has a goal, ordered steps, and a visible expected result.

## Install

Clone this repository and copy the entire `skills/dashing-testers` folder into your user skill directory.

| Assistant | User skill directory |
| --- | --- |
| Codex | `~/.agents/skills/` |
| Claude Code | `~/.claude/skills/` |

The helper uses Node.js 20 or newer. Start a new assistant session after installing or refreshing the skill.

## Connect once

Under **Team → My upload tokens** in DashingTesters, create a token for your developer account. Set `DASHINGTESTERS_URL` and `DASHINGTESTERS_TOKEN` in the environment that launches your assistant. Set `DASHINGTESTERS_TESTER_EMAIL` if you want a default tester when more than one has joined. Keep the token private.

The helper also reads a private connection file when the environment variables are absent. Use `%LOCALAPPDATA%/DashingTesters/connection.json` on Windows or `${XDG_CONFIG_HOME:-~/.config}/dashingtesters/connection.json` on macOS and Linux. The fields are `url`, `token`, and optional `tester_email`.

## Publish a checklist

In the chat for the app you want tested, invoke `$dashing-testers` in Codex or `/dashing-testers` in Claude Code. Include an existing dashboard slug if it differs from the app name. Add a feature to narrow the scope.

The skill writes and publishes the checklist automatically, creating the project and first round as needed. If exactly one tester has joined, the dashboard assigns them to a new project automatically. Repeat uploads preserve existing stories and tester progress.

### JSON import fallback

If direct publishing is unavailable, the skill gives you a JSON file. Upload it under **Projects → Import JSON** or choose **Import JSON** inside an existing project. To request the fallback file explicitly, add `export JSON` to the invocation.

## Update the skill

Keep `skills/dashing-testers/references/story-batch.md` and the dashboard API in sync when changing the batch format. Pull updates and refresh your installed copy.
