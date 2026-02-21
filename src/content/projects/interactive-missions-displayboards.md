---
title: "Interactive Missions Display Boards"
date: "2026-02-21"
tags: [React, Church]
excerpt: "Creating a digital platform for church members to read, learn, and pray for missionaries that the church supports"
---

## Beginnings

Summer of 2023, I had just graduated from high school and was getting ready for my college experience at Duke. But like the previous summer, I enjoyed helping out with projects here and there at the church and was getting familiar with our church IT infrastructure.

It started with an idea my pastor had while I was eating with him and the music director, Manny Robles. It was something along the lines of, *"Would you be able to make a display where we can see information on all the missionaries?"* That right there seemed like an awesome idea, and like any excited wannabe software engineer, I said, *"Yes! That sounds like it could totally be done."*

Under the direction of Brother Manny, we started researching what this would look like. The options were to use our existing Joomla website or build something new entirely. Naturally, I wanted to write software. But we quickly realized that from a maintainability perspective, very few people at the church would be able to modify custom code if I left for school. So we chose what felt like the most maintainable option at the time:

PowerPoint.

And honestly, we maximized PowerPoint.

---

## The Physical Build

### Choosing the Hardware

When we started looking for hardware, we knew we needed touch screens. But not just some 14-inch 2-in-1 laptop. We were thinking big. Smart-board big.

Brother Manny found used smart boards on Facebook Marketplace, which honestly felt like a miracle in itself. They were large, interactive, and perfect for a church hallway display. Once we got them, we had to mount them directly onto brick walls in the corridor.

Before mounting anything, we did a small foot-traffic study. We observed which hallway most people walked through on their way in and out of the auditorium. One corridor clearly had the highest traffic, and that became our display location.

> 📸 **Image Placeholder — Mounted Smart Board in Hallway**  
> *Apparently I have never taken a picture of this project. Shocking. Once I'm back in Houston, I'll be sure to update this*

### Mini PCs & BIOS Configuration

We ordered mini PCs (I forget the exact models), and when they arrived, I immediately went into the BIOS and configured them to automatically power on when they received electricity. That way, if power was ever cut, they would boot back up without anyone needing to press a button.

But that wasn’t the end of it.

### Automating the Entire Boot Process

We connected everything to Kasa smart plugs. These allowed us to control power remotely and schedule on/off cycles for both the smart boards and the mini PCs. When the plugs turned on, power flowed, the mini PCs auto-booted thanks to the BIOS configuration, and the system came to life.

Inside Windows, I configured Task Scheduler to automatically open the PowerPoint presentation at a certain time each day and automatically shut down at night. The file was saved as a PowerPoint Show file (`.ppsx`), which launches directly into presentation mode when opened. That allowed the machine to boot, open the slideshow in full-screen mode automatically, and essentially behave like a dedicated kiosk system.

It felt very professional. And honestly, it was.

> 📸 **Image Placeholder — Behind-the-Scenes Wiring + Mini PC Setup**  
> *Again. Somehow I don't have a picture of this but I plan to have an image here for you all to see!*

---

## The PowerPoint “Application”

### Application Flow

The presentation itself was carefully designed to behave like an app.

When idle, a looping video would continuously play. This acted as the “attract screen.” When a user touched the display, it moved them to a region selection page where they could choose a continent.

![Region Selection](/projects/interactive-missions-displayboards/region_selection.jpeg)
> Region selection screen with different buttons to tap for navigation

From there, they selected a specific missionary they were interested in learning more about.

![Continent Selection](/projects/interactive-missions-displayboards/continent.jpeg)
> Example of North American continent with 9 missionaries displayed per page

Once selected, the embedded slides for that missionary would open. Some slides contained video previews, others had photos and prayer requests.

> 📸 **Image Placeholder — Individual Missionary Slide**  
> *(Example slide showing prayer requests + images)*

We even implemented an internal idle timer. If the screen was untouched for 30–45 seconds, the slideshow would automatically navigate back to the looping intro video. PowerPoint was doing things I don’t think it was ever meant to do.

For a while, it worked beautifully. In fact, you can still view it here: https://iblibertad.sharepoint.com/:p:/s/IBLMediaContent/IQAJVo4GnintTqoWZaUemEN6Aa6WAEw24hUGaT1cxFw02gU?e=F3Ivcf


---

## The Problems That Slowly Grew

But scale always shows up eventually.

The file grew to over 1 GB. Updating it over OneDrive became painful, especially when the network was under heavy load. Sync delays, long uploads, and occasional version conflicts became routine. PowerPoint itself started to slow down. Changing something as simple as a color scheme meant editing slides across the entire file.

Then came the Microsoft pains. If for any reason the machine got signed out of the Microsoft account, a massive login screen would appear mid-presentation. In a church hallway. On a giant smart board.

Yikes.

What initially felt maintainable had slowly become fragile. I had chosen a platform that wasn’t built to scale. And now scale was biting back.

---

## Moving Away from PowerPoint

This all lined up with finishing my second internship at Amazon. After spending months thinking about scalable systems, clean abstractions, and maintainable architectures, I came back looking at this project differently.

I realized I had made the classic early-engineer mistake: I optimized for short-term convenience over long-term scalability.

At Amazon, I learned to think in terms of:

- Separation of concerns  
- Stateless systems  
- Reducing single points of failure  
- Designing for future growth  
- Automating failure recovery  

PowerPoint violated most of those principles. It tightly coupled content, presentation, media, navigation logic, and deployment into a single 1 GB binary file.

So naturally, I decided to rebuild it as a React application.

---

## Re-Architecting the System

### New Philosophy: Design for Scale

Instead of one massive presentation file, the new system would separate concerns properly.

#### Frontend (React)
- UI components for region selection, missionary pages, and media display  
- Clean routing between screens  
- A proper idle timer implemented in JavaScript  
- Centralized styling for instant theme changes  

#### Data Layer
- Missionary information stored in structured JSON  
- Media assets stored independently  
- Future CMS integration possibility  

Instead of editing slides, I would edit structured data. Instead of re-uploading 1 GB, I would deploy lightweight updates. Instead of relying on Microsoft login states, I would control the runtime environment entirely.

The key here is **SCALE**.

---

## Budget & Real-World Constraints

One of the most underrated parts of this project was budgeting. I seriously had to consider reasonable pricing and did everything I could to stay within a ~$1000 budget. That meant used hardware, smart purchasing decisions, and making sure every component had a purpose.

Engineering in the real world isn’t just about writing clean code. It’s about tradeoffs — performance vs cost, simplicity vs flexibility, speed vs longevity.

This project forced me to think about all of it.

---

## Lessons Learned

Looking back, this project taught me more about engineering tradeoffs than I expected.

The fastest solution is not always the most scalable one. “Non-technical maintainability” and “technical maintainability” are not the same thing. Binary files are not your friend. If something is 1 GB, it probably shouldn’t be responsible for your application logic.

Most importantly, I learned to think ahead. Not just “Can I build this?” but “What happens when this grows?”

Small church projects can surface real-world engineering constraints just as much as internships can. Sometimes more.

---

## Current State

The React version is still in active development. Internships and school definitely get in the way at times. But when I have time — or when I’m procrastinating something else — I give this project attention.

If you want to follow along with the progress, you can check out the repository here:

https://github.com/ismaeldiaz1213/missions-displays

The repository will keep you up to date on what phase I’m in during the rework of this project. I’ll definitely be updating this post in the future as well — especially with details on new decisions I make, hopefully with better hindsight.

## Gratitude & Mentorship

I owe a deep gratitude to my Pastor for backing the project from day one. His trust made the whole thing possible.

And most importantly, I owe a lot to Manny Robles. He mentored me through the planning and design of this entire mini engineering project. I learned a tremendous amount about project planning, execution, and thinking through details because of him. A lot of my engineering intuition honestly traces back to the way he approached problems.
