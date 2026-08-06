# v23 — all action buttons consolidated below the results

- Moved "Print or Save PDF", "Save on This Device", "Saved Charts" and
  "Copy Private-Safe Link" out of the top input panel and into the bottom
  action panel, so all EIGHT buttons now sit together after the results:
  Preview Image, Share, Download PNG, Download JPG, Print or Save PDF,
  Save on This Device, Saved Charts, Copy Private-Safe Link.
- The PDF button was never removed - it had been left at the top when the
  share buttons were moved down. Now unified in one place.

NOTE (server-side, not in this zip): the contact/signup 500 is because the
mnc_private directory does not exist on the server. Create mnc_private one level
above public_html (writable) with secrets.php inside; that fixes both forms.

425 pages, 0 QA failures, similarity 0.7175, logo + email-removal intact.
