# Nurtura avatar feature: follow-up prompt for the Mac session

Paste everything below the line into Claude Code running on the Mac (`cd /Users/bonairmedia/Repos/nurtura-ios && claude`).

---

```text
Continue the Nurtura avatar feature in /Users/bonairmedia/Repos/nurtura-ios.

Before you start:
- Read AGENTS.md and follow its Obsidian workflow.
- Read convex/_generated/ai/guidelines.md before you change any Convex code.
- Run git status. Preserve all existing uncommitted work, including the authentication and password-recovery changes.
- Don't deploy, push, or change billing. Don't overwrite unrelated work.

Context:
- A previous session implemented the avatar feature locally. Its notes are the "Implementation update — 2026-10-09" entry on the Notion hub: https://app.notion.com/p/3f4d6da30d95819f86a9d3dcaa203086
  That entry lists:
  - schema fields avatarType / avatarPhotoId / avatarConfig, with legacy avatarEmoji kept
  - profiles.updateAvatar and careRecipients.updateAvatar, with server-side entitlement checks
  - files.generateUploadUrl
  - shared Avatar and AvatarPicker components
  - a hand-built SVG builder for skin, hair, glasses, facial hair, clothing and background
  - tsc, eslint and jest passing
  - no check on a device or simulator yet
- The full spec is at https://app.notion.com/p/3f5d6da30d9581a0be6ec0599153b22e ("Avatar Customization — Spec & Status"). A copy is in the bonairmedia repo at nurtura-gtm/AVATAR_FEATURE_SPEC.md.

Tasks:

1. Check that the code matches what the Notion entry says. Report any differences before you build on top of it.

2. Add the three controls I asked for that are missing:
   - Face shape: round, oval, square, heart, long.
   - Eye color: brown, hazel, green, blue, gray, amber, at minimum.
   - Age: a bracket picker that sets the face lines, following these rules from the spec:
     - 13–29: no lines (a 16-year-old has no lines on the face)
     - 30–39: subtle ticks
     - 40–49: half laugh lines
     - 50–64: two full laugh lines
     - 65–79: two laugh lines plus crow's feet (a 65-year-old has two laugh lines)
     - 80+: also adds one forehead line
     Keep the lines in the same flat style as the reference grid: thin, clean strokes and no shading.
   Add these as optional fields in avatarConfig, with defaults, so existing saved avatars keep rendering. Update the Convex validators to match.

3. Two choices from the last session need my decision. Don't change them; ask me at the end:
   a) Who can edit a care recipient's avatar: any care-team member, or only the owner/admins?
   b) What happens when a Plus/Professional subscription is cancelled: lose the builder right away, or keep the saved custom avatar visible and only lock editing? (My leaning is to keep it visible.)
   Give me your recommendation for each.

4. Look at the three Higgsfield concept sheets embedded on the spec page. Compare the builder's output to them and list the visual gaps that matter.

5. Validate:
   - Run tsc, eslint and jest.
   - Add tests for the age-to-lines mapping, for avatarConfig defaults and backward compatibility, and for entitlement and ownership checks in the updateAvatar mutations.
   - Run the app in the iOS Simulator. Test photo upload, building and saving a custom avatar, reopening it after a restart (to confirm it persisted), the soft paywall for free users, and VoiceOver labels on the controls. Do this for a care recipient, a provider and a family member, and take screenshots.
   - In your report, say clearly which checks ran in the simulator, which ran against the live Convex backend, and which you only reasoned about.

6. Update the Notion spec page with the real implementation status. Resolve the conflict noted in Section 0 and Open Question 11, record the decisions you made, attach the evidence, and list what's left.

7. Brief my GrokBot team on the project, what's done, what's left, and the decisions so far. Find the actual GrokBot connection and the right team before sending. If you can't reach it, tell me what blocked you. Don't claim it was delivered unless it was.

8. Record the reusable lessons you verified in the Obsidian workflow from AGENTS.md.

Return:
- what changed, by file
- screenshots
- test, lint and type-check results
- the Notion link
- the GrokBot delivery status
- the two questions from task 3, each with your recommendation
- anything still blocked
```
