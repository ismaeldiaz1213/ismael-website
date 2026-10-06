---
title: "Interactive Missions Display Boards, Part 2: The Hard Part Isn't the Code"
published: true
date: "2026-10-06"
tags: [React, Firebase, Church, In Progress]
excerpt: "The PowerPoint is becoming a real website. A progress update on what's built, the feedback that stung, and the roadmap to letting any church copy it."
category: "Software"
cover: "/projects/interactive-missions-displayboards/web_north_america.jpg"
---

> **New here?** This is Part 2. [Part 1](/projects/interactive-missions-displayboards) covers how this started: smart boards from Facebook Marketplace, a 1 GB PowerPoint pretending to be an app, and why I decided to rebuild it.

## Where we left off

At the end of Part 1, I said the React version was "in progress (and almost ready)" and joked that you should stay tuned for the next five years. Here's the honest update: the migration from PowerPoint to a real website has started, it's live at **[misiones.iblibertad.org](https://misiones.iblibertad.org)**, and the code is basically the easy part now.

The hard part turned out to be people. That includes me.

---

## What's built so far

Everything the PowerPoint did, the website does now, and then some. Here's a walk through it.

### The world map

The kiosk still opens on a looping video as the attract screen. One tap takes you to a live world map with a button for every continent. The map is real (Leaflet with OpenStreetMap tiles), so you can zoom and pan around it.

![The region selection page: a world map with a button on each continent](/projects/interactive-missions-displayboards/web_region_selection.jpg)
> The new region selection page. Compare it to the PowerPoint version in Part 1.

From here you can also get to past missionaries, and there's a link that says *"¿Es misionero? Envíe su información"* (Are you a missionary? Send us your information). More on that link later, because it's become the most important button on the site.

### Continent pages

Each continent gets a grid of missionary cards next to a regional map, with each missionary's photo pinned where they serve. North America is the most complete one so far:

![The North America page: seven missionary cards and a regional map with photo pins](/projects/interactive-missions-displayboards/web_north_america.jpg)
> North America: seven missionaries, each pinned on the map. Pagination kicks in when a continent outgrows one screen.

### A page for every missionary

This is the part the PowerPoint never really pulled off. Every missionary gets their own mini-site with:

- **Their ministry at a glance:** location, sending organization, and how long they've been serving.
- **A description and special notes,** like a current prayer need.
- **A location map** zoomed into where they actually serve.
- **Local time and weather,** including how many hours ahead or behind they are from you. It's a small detail, but seeing that it's 8:31 AM and 61°F in San Luis Potosí makes them feel a lot less far away.
- **A photo gallery** with a full-screen viewer.
- **Their prayer letter** (PDF) and **contact info** in tabs on the side.
- **A QR code** so you can scan the page from the hallway board and keep reading on your phone. This might be my favorite feature. Nobody wants to stand in a hallway reading a long description, but they might read it on their phone during lunch.

![An example missionary page with chips, description, map, local time and weather, and photos](/projects/interactive-missions-displayboards/web_missionary_page.jpg)
> A missionary page. In Part 1 I couldn't even show you one of these because the old web version didn't support it.

### The kiosk details

Some things only matter when a website lives on a giant touchscreen in a hallway:

- **Idle reset.** After 3 minutes without a touch, the board goes back to the attract video. (The PowerPoint version had this too, built out of slide timings and stubbornness.)
- **Caching.** Photos and PDFs are cached so the board stays snappy when the church network is under load on a Sunday.
- **Untappable links.** Visitors kept tapping the little map attribution link in the corner, which sent them off to another website. The credit is still visible, but tapping it no longer does anything.
- **Mobile support,** because of those QR codes.

### The admin portal

This is the reason the rebuild exists. Updating a missionary used to mean editing slides in a 1 GB file and praying OneDrive would sync. Now it's a form.

- **Sign in with Google,** limited to church accounts. The restriction is enforced by the database's security rules, not just hidden in the UI.
- **Add, edit, or remove missionaries,** including their photos, prayer letters, and icons. Deleting a missionary cleans up all their files.
- **A storage indicator,** so we know how close we are to the free tier.
- **Page requests.** When a missionary sends in their information, it shows up as a request. Approving it creates a hidden draft page I can review before it goes public.

### And then it became a registration system

I didn't plan this one. Our church hosts a missions conference every year, and registration used to be scattered. Since I already had a site with a database, a login, and file uploads, the conference moved onto it.

![The 2026 missions conference landing page](/projects/interactive-missions-displayboards/web_conference_landing.jpg)
> The conference landing page, with its own harvest theme taken from this year's artwork. Fully bilingual.

Registration is a two-step flow in Spanish or English:

1. **Register.** Missionary, evangelist, pastor, or layman; how many adults and kids; which days; whether you need lodging and how you're arriving. A live summary on the side estimates the hotel cost as you go.
2. **Upload.** Missionaries and evangelists get a private link to upload their ministry presentation videos (MP4, up to 2 GB each). They can use the link again until the conference.

![The conference registration form with a live summary panel](/projects/interactive-missions-displayboards/web_registration.jpg)
> Registration, with the cost summary updating as you fill it in.

On the admin side, registrations can be exported to Excel or PDF, and there's a **pickup planner** with a map for coordinating airport and bus-station rides.

### The move from AWS to Firebase

The first version of the backend ran on AWS Amplify (DynamoDB, S3, and Cognito). It worked, but for a church with a volunteer IT department it was too many consoles and too many places for a bill to come from. In September I moved everything into one Google Cloud project with Firebase:

- **Hosting, database, file storage, and login** all live in one place, under the church's account.
- **Every push to `master` deploys automatically** through GitHub Actions, and pull requests get their own preview link.
- **It costs about $0–1 a month,** and around $5 in the conference month when all the videos come in. There's a budget alert in case anything ever goes sideways.

That last part matters a lot for the future of this project. More on that in the roadmap.

---

## The feedback that stung

A while back, I got some feedback on the project that was... not friendly.

The person giving it didn't know I was the one who built it, at least for the first half of the conversation. He told me it was pointless. Nobody uses it. There should be physical copies instead.

That was hard to swallow. It took a lot in me to push back, and when I did, all I had was "well, it's a work in progress." He came right back with:

> "Well, for how long? Cool idea, sure, but it means nothing if it's not done."

And that was painfully true.

He also said it was never announced, and on that one I disagree. It was announced. I just don't think he was paying attention. But I can't hide behind that. If a display hangs in a hallway for a long time without ever really being finished, people stop seeing it. "Work in progress" is a fine status for a week. It's not a fine status for a long time.

So I took the true part. **A cool idea means nothing if it's not done.** That's what this update is really about: getting this to done.

---

## The real bottleneck: getting the data

The software can make a beautiful page for every missionary. It can't write the page for them.

Right now, **nine missionary pages are live**: seven in North America, one in Central America, and one in South America. Every other continent is still waiting on information, and getting it has been the hardest part of this entire project.

Here's what I've tried:

- **Cold emails.** Mostly no response.
- **A public request form** at [misiones.iblibertad.org/misioneros/solicitud](https://misiones.iblibertad.org/misioneros/solicitud), linked from the map page. It tells missionaries exactly what we need: a photo, a short description, a recent prayer letter, prayer requests, and contact info. I made it as low-effort as I could think of. Even a voice memo or a link to an existing bio works.
- **A step built into conference registration.** After a missionary registers, the confirmation page shows them a step called *"Ayúdenos a crear su página de misionero"* (Help us create your missionary page), right next to their video upload link.

![The missionary page request form](/projects/interactive-missions-displayboards/web_page_request.jpg)
> The request form. It even includes an example page so missionaries can see what they're getting.

So far, still mostly nothing.

I'll be honest: I have some feelings about this. I'm building this to give our missionaries a platform in front of the church that supports them, and most of them are choosing to ignore it. That's frustrating.

But I also know missionaries are busy, a lot of them get more email than they can answer, and a form from a stranger at their supporting church is easy to put off. So my job is to make this even easier and to keep asking. Data collection is the project right now. The code can wait on the data, but not the other way around.

But alas! We move.

---

## The roadmap

Here's the plan, with dates. Putting dates in public is the best way I know to make sure "work in progress" doesn't become a permanent status.

| Phase | What it means | Target |
| --- | --- | --- |
| **1. Data collection** | Get every supported missionary's information entered and their page published | Hopefully completed by **December 2026** |
| **2. Feature push** | Finish what's still on the list, like English versions of the missionary pages (they're Spanish-only for now) and backend tests, and polish the kiosk experience | Hopefully completed by **December 2026** |
| **3. Formal launch** | Launch it properly to the whole church, so nobody can say it was never announced | **January 2027** |
| **4. Monitor engagement** | Watch real usage for a few months. Page views are already tracked with Google Analytics, so the next "nobody uses it" conversation can have actual numbers in it | **January – April 2027** |
| **5. Open-source launch** | Package it so another church can say "I want this for my church" and stand up their own copy | **May 2027** |

### The open-source "SaaS"

Phase 5 is the one I'm most excited about, and probably the one I should be most nervous about.

In Part 1, I said I wanted this to be open source and that I'd call the project complete once other churches could make quick clones of it. That's still the goal. This work is for God's ministry, and I see no reason to make money off it.

The Firebase move makes it a lot more realistic. Everything a church needs (hosting, database, storage, login) lives in a single project with a free tier that covers a church this size. In theory, another church needs a Google account, a fork of the repo, and a setup guide. In practice, getting there means:

- **Pulling everything specific to our church** (the name, logo, colors, conference details, and the email domain allowed into the admin portal) out into a single configuration file.
- **Writing a setup guide** a church volunteer can follow without being a developer.
- **Deciding how much is self-serve** versus how much I help set up. A true "click a button, get a missions site" SaaS is a much bigger undertaking than an open-source repo with good docs. I'd like to get to the first one eventually. I'll start with the second.

It might be hard. I want to do it anyway.

---

## Lessons so far

- **Done beats impressive.** A finished PowerPoint on the wall was doing more for the church than an unfinished website on my laptop. That's a humbling thing to admit after spending all of Part 1 explaining why the PowerPoint had to go.
- **Feedback still has truth in it when it's delivered badly.** I didn't love how that conversation went. I'm still glad it happened.
- **The bottleneck usually isn't the code.** I can build a page in an afternoon. Getting someone to send the information for it can take months.
- **Build where the people already are.** Nobody answered the cold emails. Missionaries do fill out conference registration, so the ask now lives there.

---

## Follow along

The site is live at **[misiones.iblibertad.org](https://misiones.iblibertad.org)**, and the code is at **[github.com/ismaeldiaz1213/missions-displays](https://github.com/ismaeldiaz1213/missions-displays)**.

If you're a missionary our church supports and you're reading this: please [send us your information](https://misiones.iblibertad.org/misioneros/solicitud). I promise it's quick, and I'd love to build your page.

And if you're from another church and want something like this for yours, reach out. You might be one of the first people Phase 5 is for.

Part 3 will be the launch. Hopefully sooner than five years.
