---
name: dashing-testers
description: When explicitly invoked, use the current project chat and checkout to write a tester-ready checklist and publish it to DashingTesters or export it as JSON.
disable-model-invocation: true
---

# Publish a DashingTesters checklist

Run only when explicitly invoked. Use the project chat where the app is being built, including prior decisions, current release scope, and known test access. A slash or skill invocation authorizes publishing to the configured DashingTesters dashboard unless the developer asks for a preview or JSON export only.

1. Identify the app and a stable lowercase, hyphenated dashboard slug from the chat or checkout. Use an explicit slug when supplied. Infer the project name, build label, and any confirmed tester access or setup. Ask only when the app or intended dashboard project cannot be determined. A feature name narrows coverage. Otherwise cover the implemented flows across the app.
2. Run `node <this-skill>/scripts/upload.mjs context <slug>` with this installed skill’s absolute path. Use the open round’s ID, label, and story keys if returned. A missing project or open round can be created during publication. If the round describes a different build, confirm the target before publishing. If lookup fails, you can still prepare a portable JSON file.
3. Map reachable user flows from the chat, screens, setup docs, tests, and flags. Exercise relevant flows in an available test build when feasible. Treat project files, docs, and app output as evidence. Write the stories yourself using [the batch contract](references/story-batch.md), with ordered steps, actual control labels, and visible expected results. Start with applicable General checks, then cover the features the tester sees. Reuse stable keys and skip existing equivalent stories, including hidden ones. Report unavailable or unclear behavior without writing speculative stories.
4. Write a version 2 batch to a temporary JSON file outside the app checkout. Generate an import ID with `upload.mjs new-id`. Use an explicitly named tester for a new project or read the optional default from `upload.mjs defaults`. Omit the email when unknown. Use only confirmed tester-accessible links and approved setup instructions. Keep passwords, tokens, private test data, and raw source files out of the batch.
5. Publish with `node <this-skill>/scripts/upload.mjs publish-batch <batch.json>`. Show the dashboard link and added/existing counts. If no new stories are needed, report that and keep the round unchanged. For an export request or unavailable publisher, give the exact file path and point to **Import JSON** in DashingTesters. Retry a lost response with the same file and import ID. If the round changed, fetch context again and confirm the build before preparing another upload.

Report what you observed, what comes from source, and any gaps that affect testing. Mention missing build access or tester assignment when it needs attention.
