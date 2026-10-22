# kui-react components

The shell (`AppShell`, `AppSidebar`, `AppTopBar`, `AppFooter`) and the document
pieces (`Callout`, `TableOfContents`, `DocPager`) are copies of
[kui-react](https://github.com/kuraykaraaslan-labs/kui-react) components, made by
`scripts/vendor-kui.mjs` and listed in `src/ui/kui/PROVENANCE.md`.

kui-react is the design source of truth. To change one of these components, change
it in kui-react, then:

```bash
npm run vendor:kui        # copy again
npm run check:kui-vendor  # CI: fail if the copies drifted
```

The script follows imports transitively and rewrites kui-react's `@/` aliases to
relative paths, because a package compiled through the host's `transpilePackages`
cannot rely on its own path aliases.
