# Design review

Open index.html directly in a browser. No server, package install, image download or external fonts are needed.

For viewing from another device on the same network, start a disposable container on the remote machine:

```sh
cd /home/marco/src/coffeeanddata
docker compose -f preview/compose.yaml run --rm --service-ports preview
```

Visit http://192.168.2.100:8765/preview/ in your browser. Ctrl+C stops the foreground server and removes the disposable container. The server binds to the specified LAN address, mounts the source read-only and serves only the preview paths and their shared stylesheet. Other devices must be able to reach this private network address.

Switch among warm editorial, minimal technical and dark technical, then compare the homepage and SQL review article at desktop and 390px mobile widths. The open-in-new-tab link gives each preview the full browser width.

All three use the same real titles, dates, introductory text and SQL excerpt. Links to articles not included in the prototype point to the current blog. The signup form points to the existing Mailchimp audience; submitting it begins a real subscription.

These are HTML/CSS design studies. They share the rewrite's base CSS, with prototype-only style overrides. They do not establish that Astro compiles, that its Markdown renderer produces identical HTML, or that the layouts have been visually checked in a browser.

Choose one direction before integrating its overrides into the production stylesheet. The prototype does not add a three-theme preference switch to the public website.
