# MOVING EDM TO CLAUDE CODE

## First, a caution about the plan

"Assess and improve everything" is the wrong opening instruction. Given a repository this size and no constraints, an agent will churn through it, touch two hundred files, produce a large diff you can't review, and quietly rewrite copy that took months to settle. You'd spend longer checking it than you saved.

What works instead: give it the rules first, then one task at a time, each small enough that you can look at what changed and say yes or no. The `CLAUDE.md` file alongside this one is the rules. The sequence below is the tasks.

## Second, use the desktop app, not the terminal

Claude Code runs in a terminal, but there is also a desktop app that gives you the same thing with a normal interface. On your setup that's the right choice — you don't need to learn a shell to get the benefit.

If you or a developer do want the terminal version: the native installer is the recommended route now and doesn't need Node.js. There's also an npm route (`npm install -g @anthropic-ai/claude-code`) which needs Node 18 or newer. Either way, `claude --version` confirms it's working and `claude doctor` diagnoses anything that isn't. Current requirements and install commands: https://code.claude.com/docs/en/setup

---

## STEP 1 — Get it into a git repository

This is the part that makes everything else safe. Right now V11 is a zip. A zip has no history, so a bad change is permanent.

In git, every change is a diff you can read and undo. That is the entire reason this is worth doing before anything else.

Ask Claude Code, in the folder where you unzipped V11:

> Turn this folder into a git repository. Add a .gitignore that excludes node_modules and any build output. Make one initial commit called "V11 master as received". Don't change any files.

Then, separately:

> Restructure into these top-level folders: /brand, /website, /documents, /os, /gtm, /consents, /archive. Move files, don't rewrite them. Put the superseded mockups and old LinkedIn banner in /archive. Show me the plan before you move anything.

Two commits, two things you can read.

## STEP 2 — Drop in CLAUDE.md

Put the `CLAUDE.md` file at the top level of the repository. Claude Code reads it automatically at the start of every session, so the brand rules, the banned words, the consent gate and the no-invented-facts rule apply to everything without you having to repeat them.

You can also type `/init` and it will write its own version by reading the repo. Do that afterwards if you want, and merge anything useful it found — but keep the rules from the supplied file. Those are the parts it can't work out on its own.

## STEP 3 — Read-only assessment before any changes

The first real task is an audit, with nothing written. This is where "assess everything" belongs, and it's safe because the output is a report rather than a diff.

> Read the whole repository and write /gtm/ASSESSMENT.md. Cover: every place a fact contradicts another place; every colour or font outside the tokens in CLAUDE.md; every document with no editable source; anything in the website or EDM OS that looks broken, unfinished or insecure; and anything claiming capability we can't evidence. List findings worst first with the file path for each. Change nothing.

Read the output. That report becomes your backlog, and you decide the order — not the agent.

## STEP 4 — The five jobs worth doing, in order

**One. Build sources for the client-facing documents.**

The single biggest structural weakness in the pack. The capability statement, corporate brochure, handover standard and brand guidelines exist only as PDFs. There is no source file, so changing a sentence means rebuilding the whole document by hand. The stationery is fine — it has HTML sources in `09-Stationery-Sources` — which shows the approach already works.

> Build HTML sources for the capability statement, corporate brochure and handover standard, matching the existing PDFs exactly, using the same approach as the stationery sources in 09-Stationery-Sources. Then a script that renders each to PDF with all fonts embedded. Do the capability statement first and show me it side by side with the current PDF before you do the others.

Once that exists, correcting the turnover figure is a one-line change rather than a project.

**Two. Fix the facts.**

> No turnover figure should appear in any public document — see Decision 1 in DECISIONS.md. Find every remaining occurrence across the repo and list them with file paths. Don't change anything yet.

Then approve, then let it change them. Same pattern for the "100% safety record" claim.

**Three. Website tidy-up.**

> Check the site against the brand tokens in CLAUDE.md. Report every off-token value with its file and line. Also flag any accessibility problem, any broken link, and any page where the copy contradicts the capability statement.

Ask for the report first. Fix second.

**Four. EDM OS.**

This is the only genuinely code-shaped part of the repository, and it's where Claude Code earns its keep. Start narrow:

> Read the EDM OS codebase and tell me what state it's actually in. What works, what's scaffolding, what's missing. Don't write code.

Then take one feature at a time — the LinkedIn CRM fields from section 15 of the LinkedIn master document are a good first job, because they're small, well specified and immediately useful.

**Five. Make the brand rules enforceable.**

> Write a script that fails if any file in /website or /brand contains a colour outside the token list, or references a font other than Montserrat. Add it as a pre-commit hook.

After this, the palette can't drift again. That's the difference between a brand guideline and a brand system.

---

## How to prompt it, in general

**Ask for a plan before a change.** "Show me the plan before you touch anything" is the most useful sentence you'll type. It's the difference between reviewing an intention and reviewing a mess.

**One job per session.** Long sessions drift. Finish, commit, start fresh.

**Make it justify itself against the repo.** "Which file did you get that from?" catches invented facts faster than reading the output does.

**Be blunt.** It responds well to "that's wrong, here's why" and doesn't need softening.

**Don't let it write client-facing copy unsupervised.** The voice in the pack took real effort. Have it draft, then you edit. The banned-words list in CLAUDE.md catches the obvious failures but not a paragraph that's simply flat.

## What to keep doing here instead

Claude Code is right for the repository — code, documents, structure, consistency, anything with a file path.

Strategy, positioning, judgement calls about what to say to a Tier-1, whether a post reads like a person, whether the consent email is worded right: keep those in chat. They're conversations, not tasks, and they don't have a file path.

## The one thing to do before any of it

The written consent from PMK Group. `/consents/` being empty is what blocks the highest-value content in the whole system, and no amount of tooling fixes that.
