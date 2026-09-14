# Success Meter Website

A static replica of the Success Meter marketing site (originally built on 10web.io),
rebuilt as plain HTML/CSS/JS so it can be self-hosted anywhere, with a lightweight
CMS ([Decap CMS](https://decapcms.org/)) for ongoing content edits.

## Structure

```
index.html          Home page
solutions.html       Solutions page
security.html         Security page
pricing.html          Pricing page
assets/
  css/styles.css       Shared styles
  js/main.js           Nav toggle behavior
  js/content.js         Loads content/*.json into the page at runtime
  images/               Logo, icons, screenshots
content/
  settings.json         Site-wide: logo, name, email, phone, booking URL, footer text
  home.json             Home page text/content
  solutions.json         Solutions page text/content
  security.json           Security page text/content
  pricing.json            Pricing page text/content
admin/
  index.html              Decap CMS app shell
  config.yml              Defines the editable fields, mapped to content/*.json
```

All page text is loaded dynamically from the JSON files in `content/` via
`assets/js/content.js`. This is what lets the CMS (or hand-editing the JSON)
update the site without touching HTML.

## Viewing locally

```powershell
cd "Success Meter Website"
python -m http.server 8080
```

Then open `http://localhost:8080/index.html` (and `/solutions.html`,
`/security.html`, `/pricing.html`).

## Setting up the CMS (one-time)

Decap CMS needs a Git host + a way to log you in. The easiest path is Netlify:

1. **Push this folder to a GitHub repo.**
   ```powershell
   git remote add origin https://github.com/<you>/success-meter-website.git
   git branch -M main
   git push -u origin main
   ```
2. **Create a Netlify site** from that repo (netlify.com → "Add new site" →
   "Import an existing project" → pick the repo). Build command: none needed
   (leave blank or `echo "no build"`); publish directory: `/` (repo root).
3. In the Netlify site dashboard, go to **Site configuration → Identity** and
   click **Enable Identity**.
4. Under Identity → **Registration**, set it to **Invite only** (so random
   people can't sign up).
5. Under Identity → **Services**, enable **Git Gateway**. This lets Decap CMS
   commit changes to your repo on your behalf without you needing a personal
   GitHub token.
6. Go to the **Identity** tab of your site dashboard and **invite yourself**
   (your email). You'll get an email to set a password.
7. Visit `https://<your-site>.netlify.app/admin` and log in. You'll see a
   friendly form-based editor for Site Settings, Home, Solutions, Security,
   and Pricing content — no code required.

Every save in `/admin` commits directly to your GitHub repo, and Netlify
auto-redeploys the site with the new content (usually live within ~30–60
seconds).

## Updating the "Schedule a demo" link

Once you have your zcal (or Calendly) link, open `/admin` → **Site Settings**
→ **Booking / Scheduling URL**, paste it in, and save. Every "Schedule a
demo" / "Book a demo" / "Book a Meeting" button across the site will use it
automatically. Until it's set, those buttons link to the pricing page's
`#demo` section.

## Editing content without the CMS

You can also just hand-edit the files in `content/*.json` directly (any text
editor) and redeploy — the CMS is a convenience layer on top of these same
files, not a requirement.
