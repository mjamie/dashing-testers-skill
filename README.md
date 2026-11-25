# DashingTesters skill

Generate plain-language manual test stories from an app checkout and publish them to an open round in your DashingTesters dashboard. Each story includes a goal, ordered steps, and an expected result.

## Install

Clone this repository and copy the entire skills/dashing-testers folder into one of these user skill directories.

| Assistant | User skill directory |
| --- | --- |
| Codex | ~/.agents/skills/ |
| Claude Code | ~/.claude/skills/ |

The upload helper uses Node.js 20 or newer. Start a new assistant session after installation.

## Connect a dashboard

Create the project and open a test round in DashingTesters. Under **Team → My upload tokens**, create a token for your developer account. Set DASHINGTESTERS_URL to the dashboard base URL and DASHINGTESTERS_TOKEN to your upload token in the environment that starts your assistant. Keep the token in your local environment or secret manager.

Open your target app checkout in your assistant. In Codex, ask it to use the dashing-testers skill for your project slug. In Claude Code, run /dashing-testers followed by the project slug. Add a feature name to narrow the scope, or leave it out to review the app across its implemented flows.

Uploads become visible immediately. Repeat runs add new story keys and preserve existing edits and tester results.

## Update the skill

Edit skills/dashing-testers/SKILL.md to change the workflow. Keep the JSON contract in skills/dashing-testers/references/story-batch.md and the dashboard API in sync when changing the payload. Pull updates and refresh your installed copy.
