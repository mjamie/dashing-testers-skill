# Portable story batch v2

Use one short action or observation per step. Write the goal in user terms and name what the tester should see when it works. If the story needs sample data, say where to get it or describe safe sample values. Avoid developer commands and internal terminology in tester-facing fields. Put supporting references only in evidence.

Use a durable lowercase hyphenated story_key based on the feature and task, such as account-sign-in-valid. Avoid release numbers, filenames, and changing display labels in the key. Follow the dashboard context for an existing equivalent story. Keys must be unique within a batch.

```json
{
  "schema_version": 2,
  "import_id": "abb6b178-d85b-412c-8fc4-c61584d02a03",
  "source_revision": "example-revision",
  "project": {
    "slug": "example-app",
    "name": "Example App",
    "description": "A workspace for managing accounts."
  },
  "build": {
    "label": "Version 1.2",
    "access_instructions": "Open the QA preview shared with this round.",
    "setup": "Use the test account shared separately."
  },
  "stories": [
    {
      "story_key": "account-sign-in-valid",
      "category": "General",
      "title": "Sign in with a test account",
      "goal": "Get to the home screen with your test account.",
      "steps": [
        "Open the app and choose Sign in.",
        "Enter the test email and password supplied for this round.",
        "Select Sign in."
      ],
      "expected_result": "The home screen opens and shows your account name.",
      "evidence": {
        "basis": "source",
        "references": ["src/screens/SignIn.tsx", "tests/sign-in.test.ts"]
      }
    }
  ]
}
```

Use observed only when a running build showed the expected behavior, or when a smoke check actually ran and exercised it. Name the check and the environment in the references. Use source when the behavior is supported by the checkout and has yet to be exercised. References can be repo-relative paths or short descriptions of observed results. Keep each batch to 100 stories or fewer.

Include the top-level `round_id` when the context command returns one. For an offline export, omit it and use the confirmed build label so the dashboard can check the intended round. The same slug updates the existing project. An existing round keeps its setup, stories, and outcomes. When starting a checklist for a different build, get the new round’s context after the developer opens it.

The project slug, name, and build label are required. Description, source revision, and build access fields are optional. Set `build.app_url` only for a confirmed web link the tester can open. Use `build.access_instructions` for install instructions and `build.setup` for preparation. Set `project.tester_email` to an invited tester’s email when requested or configured on this machine. Otherwise a new project is assigned automatically when there is exactly one tester account. Existing assignments are preserved.

The same file works with the helper’s `publish-batch` command and the dashboard’s **Import JSON** form. Each batch has its own UUID. Reuse the original file when retrying. Version 1 batches still work through the legacy `publish` command or **Import JSON** from a project with an open round.
