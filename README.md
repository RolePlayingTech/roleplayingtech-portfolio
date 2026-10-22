# RolePlayingTech

**Personal projects at the intersection of software, AI, content and electronics.**

I'm **Grzegorz Stuczyński**. After years in IT — from technical support and testing to DevOps and senior software development — I stepped away from professional programming for a while. Generative AI got me interested in building things again. Today I develop my own projects, sometimes collaborate with others, and share what I learn.

This is my **personal portfolio**, not an agency or a catalogue of turnkey products. Some projects are ongoing; the contributions below are intentionally specific.

**[Portfolio](https://roleplayingtech.com/en/)** · **[Projects](https://roleplayingtech.com/en/#work)** · **[Learning & open source](https://roleplayingtech.com/en/education/)** · **[About](https://roleplayingtech.com/en/about/)** · **[Contact](mailto:stuczynski.g@gmail.com)**

## Featured projects

| Project | What it is | My role |
| --- | --- | --- |
| **[Mumro](https://mumro.io/)** · [Case study](https://roleplayingtech.com/en/work/mumro/) | A platform for content workflows, publishing, integrations and automation. | Independently developed with extensive AI-agent assistance. I handle product direction, architecture, review, testing and quality. Primarily used in my own projects; **not yet a generally available subscription SaaS**. |
| **[Świadek Dziejów](https://swiadek-dziejow.pl/)** · [Case study](https://roleplayingtech.com/en/work/swiadek-dziejow/) | A history and education media project: videos, illustrations, articles, website and social channels. | I develop the content, site and publishing workflows. |
| **[Crewly](https://crewly.pl/)** · [Case study](https://roleplayingtech.com/en/work/crewly/) | A platform connecting sailing crews, skippers and trips. | **Co-created**, live and being developed with early users and customers. |
| **[MFC Monitoring Station](https://roleplayingtech.com/en/work/mfc/)** | Hardware and software for monitoring a microbial fuel cell experiment. | I built the supporting electronics, sensing, data collection and remote-control system for **someone else's PhD research**; I did not conduct the scientific research. |

I have also worked on smaller client projects involving automation (n8n and custom code), integrations, websites and AI-assisted media.

## Learning and open source

I publish practical notes and tools from working with AI, coding agents and software systems:

| Resource | Description |
| --- | --- |
| **[MUMRO Academy](https://academy.mumro.io/)** · [Source](https://github.com/RolePlayingTech/mumro-academy) | A free, bilingual learning resource about content systems, workflows, websites, AI agents and MCP. |
| **[Agent Harness Kit](https://github.com/RolePlayingTech/agent-harness-kit)** | A CLI for designing, generating and checking an evidence-based coding-agent harness for new or existing repositories. |
| **[MCP Surface Kit](https://github.com/RolePlayingTech/mcp-surface-kit)** | A CLI for describing and validating MCP tool surfaces, contracts and related skills. It does **not** replace server-side authorization. |

Read the [learning & open-source overview](https://roleplayingtech.com/en/education/) for context and examples.

## Find me online

**Personal profiles**

- [X / @rpl_0x](https://x.com/rpl_0x) — experiments, tools and commentary
- [LinkedIn](https://www.linkedin.com/in/grzegorz-stuczy%C5%84ski-764383131/) — professional profile
- [Instagram / RolePlayingLife](https://www.instagram.com/roleplayinglife_0x/) — beyond the screen
- [Substack / RolePlayingLife](https://roleplayinglife.substack.com/) — longer writing
- [GitHub / RolePlayingTech](https://github.com/RolePlayingTech) — public repositories

**Project channels**

- **Świadek Dziejów:** [Website](https://swiadek-dziejow.pl/) · [YouTube](https://www.youtube.com/@swiadek_dziejow) · [TikTok](https://www.tiktok.com/@swiadek_dziejow) · [Instagram](https://www.instagram.com/swiadek_dziejow/) · [Facebook](https://www.facebook.com/profile.php?id=61588448017737)
- **Crewly:** [Website](https://crewly.pl/) · [Instagram](https://www.instagram.com/crewly.pl/) · [Facebook](https://www.facebook.com/profile.php?id=61573482406605)
- **Mumro:** [Website](https://mumro.io/) · [Academy](https://academy.mumro.io/)

I also started a **free Discord community for AI creators**. Invitations open periodically and are announced on my social profiles; there is no permanent public invite URL.

For collaborations, email **[stuczynski.g@gmail.com](mailto:stuczynski.g@gmail.com)**.

## About this repository

This repository contains the **public source of the RolePlayingTech portfolio website**, **not** the source code of every project listed above.

It's deliberately lightweight: static HTML, CSS and a small vanilla-JavaScript file, served via **GitHub Pages** at [roleplayingtech.com](https://roleplayingtech.com/). There is no framework, package installation or build step.

| Location | Purpose |
| --- | --- |
| [`pl/`](pl/index.html) and [`en/`](en/index.html) | Polish and English pages |
| [`pl/education/`](pl/education/index.html) and [`en/education/`](en/education/index.html) | Learning & open-source pages |
| [`pl/about/`](pl/about/index.html) and [`en/about/`](en/about/index.html) | About pages |
| [`pl/work/`](pl/work/) and [`en/work/`](en/work/) | Project case studies |
| [`assets/minimal.css`](assets/minimal.css) | Active stylesheet |
| [`assets/site.js`](assets/site.js) | Progressive visual enhancements |
| [`docs/`](docs/README.md) | Editorial reference, design decisions and historical notes |
| [`AGENTS.md`](AGENTS.md) | Repository-specific editing instructions |

### Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

On Windows, use `py -m http.server 8000` instead.

Open [localhost:8000/en/](http://localhost:8000/en/) or [localhost:8000/pl/](http://localhost:8000/pl/). Use an HTTP server rather than opening HTML files directly, so root-relative assets resolve correctly.

### Making changes

- Keep **both Polish and English pages** in sync when updating public-facing content. The README is in English; the **site remains bilingual**.
- Check the [current public facts and editorial boundaries](docs/07_AKTUALNY_KONTEKST_PUBLICZNY.md) before updating project descriptions. Older documents in `docs/` describe past iterations and are not all current.
- Verify links, mobile layouts, keyboard accessibility and image behaviour before publishing.
- Never commit private credentials, personal data, unreleased product code, client material or private research data.
- Preserve [`CNAME`](CNAME) and [`.nojekyll`](.nojekyll) — the main branch is used for GitHub Pages.

> The original photographs and project assets are part of this personal portfolio. Do not assume they are licensed for reuse. Other linked open-source projects have their own licensing terms.
