# One-time image import

The 22 articles have already been converted to native Markdown. This directory has no renderer, adapter, content loader or Jekyll parser. It only imports the original binary image files into src/assets/images so Astro can optimize local Markdown images normally.

Run npm run import:images once in a network-enabled Node 24 environment. Existing files are left alone. Missing images download from the pinned original commit and are verified against their Git blob checksums before being saved.

Commit the imported images alongside the Markdown. Subsequent builds read local files through Astro; no articles are fetched or translated. The importer can be deleted once all original images are committed.

All 67 referenced images are now imported and verified against their original Git blob checksums. The importer is retained only for recovery/reproducibility; it skips the existing files and is not required for normal builds.
