---
title: "Instructions Unclear: A PICO-8 Game"
published: true
date: "2026-10-04"
tags: [PICO-8, Lua, Game Jam, Claude Code]
excerpt: "A top-down shooter disguised as a tutorial that doesn't want you to finish it. What building it taught me about making mechanics feel natural."
category: "Devlog"
cover: "/projects/instructions-unclear/cover.png"
---

## Overview

**[Play it here](/games)** before you read this. It takes a few minutes, it runs in your browser, and some of this post will make more sense once you've been yelled at by the narrator.

*Instructions Unclear* is my entry for a PICO-8 game jam with the theme **"worst tutorial ever."** It's a top-down shooter disguised as a tutorial that does not want you to finish it. A government narrator hands you a weapon that only stuns, tells you to never press G, and gets less composed every time you ignore him.

My take on the theme was that the tutorial never ends, and the person giving it is the antagonist. Every instruction he gives is designed to keep you from discovering anything. The tutorial *is* the obstacle.

This post covers how I built it, and the lesson the playtests drilled into me: **a game's mechanics have to feel natural to the player, even when the game is trying to mess with them.**

## Where the idea came from

As a kid I loved watching OfficialNerdCubed play *The Stanley Parable*. A narrator who tells you exactly what you're about to do, and then gets upset when you don't do it, stuck with me. Watching other YouTubers play it made it clear the joke works differently for every player, because everyone disobeys in their own way. I always wanted to make a game with that kind of concept one day.

When the jam theme turned out to be "worst tutorial ever," it was the perfect excuse. What's worse than a tutorial whose narrator is actively working against you?

## Drafting the idea, then scoping it down

My first draft was way too big. That's the thing about a narrator game: every idea feels like it needs its own room, its own line of dialogue, its own joke. The first real step was cutting it down to the one mechanic that carries the whole concept:

- The narrator teaches you **G** once, because he needs a red wall opened.
- Then he spends the rest of the game asking you never to press it again.
- The move he taught you is the only move that makes real progress possible.

So obeying the tutorial means never using what the tutorial taught you. Everything else in the game exists to support that one joke.

## Opening Claude Code and prompting the details

With the scope set, I opened Claude Code in VS Code. The cartridge pulls in seven Lua files with `#include`: utilities, dialogue, the title, the intro, the main rooms, the ending, and the main loop. I described what I wanted each system to do in as much detail as I could, reviewed what came back, and asked for changes. I directed the design, the writing, and the difficulty tuning myself.

Then I scoped it down *again*. Having an assistant that can write code quickly makes it really tempting to keep adding things. Most of the discipline in this project was saying no to features that didn't serve the narrator.

## Drawing the assets

Every sprite, animation frame, and room is mine, drawn in PICO-8's sprite and map editors. No external art, code, or tutorials. The sound effects and music were written for the game too, with Claude Code helping write some of the patterns directly into the cartridge's sound format.

One decision paid off more than anything else: **the map is the level editor.** Walls, enemies, bosses, coins, doors, and scenery are all ordinary tiles, identified by sprite flags. At startup the game scans the map, turns those tiles into objects, and writes the correct floor tile back underneath so nothing leaves a hole. Adding an enemy or a door means painting one tile, with no code change.

![The whole facility, rendered straight from the cartridge's map data](/projects/instructions-unclear/facility_map.png)

## One room at a time

Because the map drives everything, I built the game one room at a time. I'd paint a room, play through it, adjust it, and only then move to the next. The narrator's dialogue triggers are tied to rooms too, so each new room was also a new chance for him to say something.

![The first rooms. Red doors only open to a lethal shot](/projects/instructions-unclear/first_rooms.png)

## The weapon modes and the little details

The weapon is the **Duplexer MK-12** (full name: *the duplexer mk-12-5000XYG221039994v3*, as the narrator proudly announces). It has two modes:

- **Stun (default):** enemies sleep for three seconds and then get back up. That's the narrator's proof that nothing in the building dies. Stunning an enemy also restores some of your health.
- **G mode:** pressing G opens a five-second window where your shots become lethal, burn through red doors, and are the only thing that can damage a boss. It's followed by a three-second cooldown, and every press fills a contamination meter. Fifteen presses and you're done.

So the ability that makes the game winnable is also the one that ends it. Players learn to ration it instead of spamming it.

Then there are the details I had the most fun with:

- **Three enemy types.** Drones rotate on a timer and fire in whatever direction they face. Blobs spit at you when their mouth-open frame comes around. Bosses take five hits and alternate between firing and resting.
- **Four kinds of door.** Red doors (lethal shots only), a coin door that needs the five coins the narrator told you not to collect, a trap door that disables your gun once you walk through, and a barrier that drops behind you in the boss room.
- **The narrator is the feedback system.** There's no quest log and no objective marker. You measure progress by how annoyed he sounds. Stun a drone and he praises you. Kill something and he complains about the equipment budget. Pick up a coin and you get a lecture about patriotism.
- **The dialogue box types one letter at a time**, so his pauses do as much work as his words.
- **The music shifts with him.** A calm loop, a patriotic march during the "legal stuff," and a distorted version whenever you use the forbidden mode.

![The back of the facility, where the bosses are](/projects/instructions-unclear/boss_wing.png)

## The playtests

This is where I learned the most, by far.

In early builds, **Z did two jobs: it fired the weapon, and it skipped dialogue.** In a shooter, people mash the fire button. So players were skipping straight past the narrator's lines without meaning to, and those lines were the only place the game told them what to do.

That was a much bigger problem than I first realized. The whole game hinges on the player eventually pressing G. G isn't on the controls list, and the narrator only teaches it once. The chances of a player discovering G on their own were basically zero. **My narration was the only signpost, and my own controls were letting players skip it.**

The fix was simple: skip moved to **Q**, off the fire button, so mashing Z can't eat a line anymore. Playtesting led to a few other changes too:

- **Enemies hold their fire for two seconds when you enter a room**, because testers were dying before they could even see the layout.
- **Stunning restores health**, so the non-violent, obedient path stays survivable.

The other big one was **difficulty**. The game was just too tough, and the blobs were the worst of it. They fired too fast for players who were still getting used to the controls. New players didn't know how to avoid them, so instead of learning, they got confused and then got mad. I lowered both the blobs' fire rate and the speed of their shots. That one change made a significant difference: players had more time to read the room and more room for error while they adjusted.

## What I learned: mechanics have to feel natural

The big takeaway was how much a game's mechanics need to feel natural to the player, *especially* when the game is designed to frustrate them.

Think about games like *I Am Bread* or *Getting Over It*. They're rage bait, but their mechanics are simple, and they frustrate you **in obvious ways**. When you fail, you know exactly why. You're mad at yourself, not confused about the game.

My game was frustrating in *non-obvious* ways. Players weren't failing because the challenge was hard. They were failing because a key piece of information got skipped by the button they were already pressing. That isn't the narrator messing with you. That's the controls messing with you, and it doesn't feel fair or funny.

The blobs were the same lesson from another angle. Getting hit is fine when you can see why it happened and what to do differently next time. When the shots come faster than a new player can react, all they learn is that the game is unfair. Tuning the difficulty down didn't make the game less of a challenge. It gave players enough time to understand the challenge in the first place.

The narrator can be unreliable, but the game itself has to be readable. A player should always understand what their buttons do, even if they don't trust the voice telling them what to do with them.

## Gaps I still want to fill

- **Teaching without text.** The game leans almost entirely on dialogue to communicate. I want to get better at teaching through level design, so the room itself tells you what to try.
- **Playtesting earlier.** The Z/Q problem was obvious the moment someone else played it. I should have had people play much earlier and more often.
- **Sound and music.** This is the area where I leaned on Claude the most. I'd like to be able to write a soundtrack fully on my own.

## Go play it

**[Instructions Unclear is playable right here on the site.](/games)** Click the game once so it picks up your keyboard, then follow the instructions. Or don't. The narrator is paying very close attention either way.
