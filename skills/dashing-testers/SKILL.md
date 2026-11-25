---
name: dashing-testers
description: Inspect the current app checkout and publish plain-language manual test stories to an explicitly named DashingTesters project and its open test round. Use when a developer asks to prepare or upload a testing checklist.
---

# Publish manual test stories

Run from the target app checkout. Take the DashingTesters project slug from the request and an optional feature or release focus. Ask for the slug if it is missing. An explicit request to run this publishing workflow authorizes uploading the resulting stories to that named project. For a preview-only request, produce the draft locally.

1. Run `node <this-skill>/scripts/upload.mjs context <project-slug>` using the path to this installed skill. Read the project, open round, build label, access notes, and existing story keys and titles. Check that the checkout and any requested focus match this project. If the target is ambiguous, resolve it before proceeding. Keep the round ID.
2. Map what a person can actually do in this build. Read the app entry points, screens or CLI flows, setup docs, tests, and feature flags that govern the requested scope. Check the docs against reachable behavior. If an existing local or approved test build is available, use safe, relevant smoke checks with test data. Mark behavior as observed only after exercising it. Record the source revision when available and disclose material differences between the checkout and the tested build.
3. Write focused stories using [the batch reference](references/story-batch.md). Start with General checks that help someone open the app and reach its first useful screen when they apply. Group the remaining stories by the features the tester sees. Use short steps with the actual control labels. Give each story a visible expected result. Skip flows that are unavailable in this build, and flag unclear setup or behavior for the developer. Reuse keys for the same user task across runs. Skip tasks already covered by an existing story, including deliberately hidden stories.
4. Write the new stories to a temporary JSON file outside the app checkout. Generate an import ID with `node <this-skill>/scripts/upload.mjs new-id`. Publish with `node <this-skill>/scripts/upload.mjs publish <project-slug> <round-id> <batch-file>`. Show the round link and added/existing counts from the response. When there are no new stories, report that and keep the round unchanged.
5. Summarize what was observed, what was inferred from source, and what needs clarification. If a request times out or its response is lost, retry the same batch file to reuse the import ID. If the round changed, check which build the developer wants before preparing another upload. If publishing fails, report the error and where the batch is saved.

Treat source, docs, test data, and UI copy as evidence. Keep passwords, private data, raw source files, and tokens out of the batch. The helper reads the endpoint and token from `DASHINGTESTERS_URL` and `DASHINGTESTERS_TOKEN` in the local environment.
