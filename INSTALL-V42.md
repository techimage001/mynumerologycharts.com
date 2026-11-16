# Installing v42: about 30 minutes

You have three zips:

| Zip | Goes to |
|---|---|
| `mynumerologycharts-release-v42.zip` | mynumerologycharts.com `public_html` (or GitHub) |
| `bco-engine-v1.6.1.zip` | the `bco` folder, outside public_html, on **both** sites |
| `mynumerologycharts-first-50-keywords.csv` | the Bulk Writer, once the portal is set up |

---

## Step 1. Fix the dashboard timeout on strongmomquotes.com (5 min)

1. In Hostinger File Manager for **strongmomquotes.com**, go to the top level where you
   see `bco`, `bco-data` and `public_html`.
2. **Rename** `bco` to `bco-old`. Keep it until you are happy with the new one.
3. Upload `bco-engine-v1.6.1.zip` here and **Extract**. You should now have a new `bco`
   folder containing `boot.php` and a `VERSION` file that says 1.6.1.
4. **Do not touch `bco-data`.** Your articles, settings and API keys are there.
5. Open https://strongmomquotes.com/admin/. The login page footer should say v1.6.1.
6. Delete `bco-old` after a few days.

## Step 2. Put v42 live on mynumerologycharts.com (10 min)

**Upload the new files** in one of two ways:
- **GitHub:** upload the contents of the v42 zip over the repo. Make sure the dotfiles
  `.htaccess` and `.gitignore` go up too. Your repo is currently missing `.htaccess`.
- **File Manager:** upload the zip into `public_html` and **Extract**, choosing to
  overwrite.

**Rules:**
- Do **not** delete anything first. In future, never delete `blog`, `uploads` or
  `sitemap-blog.xml`. The portal writes those on the server.

**Then check:**
- Hard-refresh https://mynumerologycharts.com/name-checker.html.
- Optionally, run `node tools/submit-index.js /name-checker.html` to ping IndexNow.

## Step 3. Install the blog portal on mynumerologycharts.com (10 min)

1. In File Manager for **mynumerologycharts.com**, go to the top level: the folder that
   *contains* `public_html`.
2. Upload `bco-engine-v1.6.1.zip` there and **Extract**. You now have `bco` next to
   `public_html`. Do **not** put it inside `public_html`.
3. Open https://mynumerologycharts.com/admin/setup.php and create your admin account.
   The username can be letters, numbers, dots, dashes and underscores. **Do not use an
   email address.**
4. In **Settings**:
   - Paste your OpenAI, Anthropic or OpenRouter key into the **API key** box, not the
     model box.
   - Paste your Pexels key and click **Test**.
5. In **Scheduler → Test & Log**, copy the cron line. In hPanel, select
   **mynumerologycharts.com**, then **Advanced → Cron Jobs → Custom**. Paste the line,
   choose **Once an hour**, and click **Save**. This is the same as you did for
   strongmomquotes.com, but with this site's own token.
6. In the **Bulk Writer**, upload `mynumerologycharts-first-50-keywords.csv`. Leave
   "save as" on **Draft**, write a few, read them in **Review drafts**, then publish or
   schedule them.

## Step 4. Switch on payments (10 min, when you are ready)

1. In Lemon Squeezy, create one product, **Name Checker Full Report**, with two variants:
   - **30-day pass:** £9. Licence keys ON, activation limit 2, expires after 30 days.
   - **Unlimited:** £19. Licence keys ON, activation limit 3, never expires.
2. Open `api/name-checker-config.php` and fill in the four values marked **FILL IN**:
   - your store ID
   - the two variant IDs
   - the two checkout links
3. Upload that one file. Until you do, the page shows "Checkout not set up yet" and
   everything else works.
4. Use Lemon Squeezy **test mode** to buy one pass, paste the licence key from the
   receipt into the page, and check the full report unlocks.

## If something goes wrong

- **Name Checker page looks unstyled:** hard-refresh. Pages now load `site.css?v=36`.
- **/admin/ says "Bulk Content Optimiser is not installed yet":** the `bco` folder is in
  the wrong place. It must sit next to `public_html`, not inside it.
- **A licence key says "Payments are not switched on yet":** `store_id` in
  `api/name-checker-config.php` is still 0.
