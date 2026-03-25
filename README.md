# SME Skills

A collection of persona-driven Agent Skills for SME (Subject Matter Expert) roles, alongside a CLI tool to easily install them into your agent workflows.

## The CLI

You can install these skills directly from GitHub into your local agent environment using the `sme-skills` CLI.

### Usage

You can run the CLI via `npx` (once published) or by linking it locally:

**Install all skills:**
```bash
npx sme-skills@latest add hoangcongst/sme_skills
```

**Install a specific skill:**
```bash
npx sme-skills@latest add hoangcongst/sme_skills --skill=business-analyst
```

By default, the CLI will extract the skills into the `./.agents/skills/` directory in your current working folder.

## Available Skills

All agent skills are located in the `skills/` directory:
- `backend-developer`
- `business-analyst`
- `data-analyst`
- `marketing-specialist`
- `project-manager`
- `qa-qc-engineer`
- `social-content-creator`
- `software-architect`
- `ui-ux-designer`

*Note: For the specifically related skills (`backend-developer`, `business-analyst`, `project-manager`, `qa-qc-engineer`), the CLI will automatically clone the `ai-friendly-documentation-standard` repository inside the installed skill directory to provide a structural standard for the persona.*

## Development

If you'd like to test the CLI locally before publishing:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm link` to make the `sme-skills` command available globally.
4. Test the command: `sme-skills add hoangcongst/sme_skills --skill=data-analyst`
