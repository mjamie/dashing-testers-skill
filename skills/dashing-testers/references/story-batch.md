# Story batch v1

Use one short action or observation per step. Write the goal in user terms and name what the tester should see when it works. If the story needs sample data, say where to get it or describe safe sample values. Avoid developer commands and internal terminology in tester-facing fields. Put supporting references only in evidence.

Use a durable lowercase hyphenated story_key based on the feature and task, such as account-sign-in-valid. Avoid release numbers, filenames, and changing display labels in the key. Follow the dashboard context for an existing equivalent story. Keys must be unique within a batch.

```json
{
  "schema_version": 1,
  "import_id": "abb6b178-d85b-412c-8fc4-c61584d02a03",
  "source_revision": "example-revision",
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
