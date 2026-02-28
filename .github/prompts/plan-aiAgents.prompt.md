# Plan: Migrate 11 Main Frontend Pages Under app/ai-agents/

To meet the requirement, the 11 main frontend pages should be duplicated or migrated so that they are accessible under the route prefix:
**app/ai-agents/**

For example:
- Home/Landing: /ai-agents/
- Protocol Info: /ai-agents/landing
- Launch Form: /ai-agents/launch
- Explorer: /ai-agents/explore
- Project Dashboard: /ai-agents/project/[address]
- Governance: /ai-agents/governance/[address]
- Reputation: /ai-agents/reputation
- Analytics: /ai-agents/analytics/[address]
- Agents: /ai-agents/agents
- Documentation: /ai-agents/docs
- System Status: /ai-agents/system

**Next steps for planning:**
- Review what currently exists under app/ai-agents.
- For each of the 11 pages, create a corresponding file or folder under app/ai-agents/ matching the original route structure.
- For dynamic routes (e.g., [address]), ensure the same dynamic folder structure is used.
- Copy or move the relevant page components, or use wrappers/imports to avoid code duplication.

Would you like a detailed plan for how to structure and implement these routes under app/ai-agents/? If so, should the content be identical to the originals, or will there be differences?
