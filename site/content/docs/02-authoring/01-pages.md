# Writing pages

Every `.md` file under a collection's `dir` is a page. Files and folders whose
names start with `_` or `.` are ignored.

## Titles

The title comes from, in order: the `title` frontmatter key, the first `# Heading`
of the file (which is then removed from the body, because the page renders the
title itself), or the file name.

## URLs

| File | Doc id | URL |
|---|---|---|
| `index.md` | `index` | `/docs` |
| `01-guides/index.md` | `guides/index` | `/docs/guides` |
| `01-guides/02-writing.md` | `guides/writing` | `/docs/guides/writing` |

A leading number prefix (`01-`, `2_`, `3.`) orders the file or folder and is dropped
from ids and URLs. `slug` in frontmatter overrides the URL: `/x` is relative to the
collection root, `x` to the file's folder.

## Frontmatter

```yaml
---
title: Writing pages
description: Shown under the title and in the page metadata.
sidebar_label: Pages
sidebar_position: 1
slug: /writing
draft: true                 # built in development only
hide_title: false
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 3
pagination_prev: null       # doc id, or null for no link
pagination_next: guides/sidebars
keywords: [docs, markdown]
---
```

Unknown keys are kept on `doc.frontmatter`, so a host can carry its own fields.
