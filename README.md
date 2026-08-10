# Anusandhan Setu

A premium product prototype connecting verified academic research with funded industry and government problem statements.

## Core workflows

- Discovery
- Verified research asset
- Funded problem brief
- Evidence-led match room

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm start
```

The build is generated in `dist/`. The application service stores pilot records and protected
files under `.setu-data/`, which is excluded from source control.

## Protected workspace

The pilot service includes email accounts, saved sessions, four roles, organisation confirmation,
extra password checks for sensitive actions, protected file versions and access history,
record-linked messages, version-bound approval decisions, ORCID sign-in and cached OpenAlex search.

Copy `.env.example` to `.env` and provide OpenAlex and ORCID credentials to enable those live
connections. The service works without them and explains which connection is awaiting setup.

This local SQLite and filesystem setup is intended for a controlled pilot. Before a public launch,
move the records and files to managed encrypted services, add real email delivery and malware
scanning, and complete a security, privacy and institutional-policy review.

## Product and pilot documents

The controlling readiness checklist, legal working pack, discovery instruments, PRD and system architecture live in [`docs`](docs/00-READINESS-STATUS.md). Demonstration records in this app do not count as completed interviews, accepted buyer briefs or institution-cleared assets.
