# v21 — privacy: all visible emails removed, contact form only

- Removed EVERY visible email address (was ~1,698 occurrences of
  info@mynumerologycharts.com) and all 5 mailto: links across all 425 pages.
- Organization JSON-LD schema: the exposed "email" field was replaced with a
  contactPoint that points to /contact.html (valid schema, no address).
- Shared FAQ answers and page copy (contact, privacy, data-deletion, editorial,
  terms, accessibility) now route people to "our contact form" instead of the
  address; grammar cleaned (e.g. contact page now reads "Use the form below.").
- New post-build step tools/strip-email.mjs guarantees zero visible emails on
  every future build.
- Contact form UNCHANGED: still posts to api/contact.php, which delivers to the
  address held ONLY in api/config.php (server-side). The Reason dropdown already
  covers General support / Calculation feedback / Privacy request / Content
  correction.

Verified: 0 visible email strings, 0 mailto links, form action intact,
api/config.php retains the address. 425 pages, 0 QA failures, similarity 0.7175.
