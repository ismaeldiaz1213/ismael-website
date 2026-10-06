---
title: "Computer Network Architecture (ECE 356)"
date: "2026-10-06"
tags: [Fall 2024, ECE, Prof: Gorlatova]
published: true
excerpt: "Can you fill in the blank from slide 27? We're supposed to be the next generation of engineers, not memorizers."
---

This is the class where you learn how the internet actually works. Slide by slide by slide.

## TLDR

- Lord have mercy, this class was all over the place. But I still learned a ton
- The content is **not** hard. I promise
- Lectures were slide after slide after slide, and the slides were basically the textbook
- Exams tested whether you memorized one sentence from one slide
- The final router project wasn't insanely hard. It was just a nightmare to debug, IN C
- I'm TA'ing this course now, and I have *opinions* on how to make it great. Stick around for the end

## What You Actually Learn

In hindsight, I don't understand how I learned so much from a class that felt this disorganized. But I did. Here's a sample:

- The layers of the internet, from apps all the way down to the wire
- Application protocols like HTTP and DNS
- Socket programming, with TCP and UDP
- Transport: reliable delivery and congestion control
- The network layer: IP addressing, forwarding, and routing
- Routing algorithms like Dijkstra's and Bellman-Ford
- The link layer: Ethernet, switches, and how frames actually move

The homework had some genuinely fun stuff too. You poke around in **Wireshark** and watch real packets fly by, and you implement your own **ping** and **traceroute**. In hindsight those were fine, just a tad surface level. Like, it's cool to rebuild ping, but I wanted to go *deeper*.

Kinda random but there was one lecture where our professor walked through Dijkstra's and Bellman-Ford step by step. Was a stange pause but it was on the exam, so I'll take it.

## What Makes It Hard

Let me be very clear: **the content is not hard.** Networking is a lot of vocabulary and a lot of "this layer hands it to that layer." Once it clicks, it clicks. The hard parts of this class were everything *around* the content.

### Slide after slide after slide

Lectures were slide after slide after slide after slide. I read so many freaking slides.

And the slides and the textbook looked almost identical. So I was essentially attending a live reading of the textbook. Riveting stuff.

### Slide 27

The exams and quizzes were basically: *"Can you fill in the blank of that one sentence from slide 27 of that one lecture on ____ which was briefly mentioned?"*

Broskie, I don't remember chapter 3, slide 27. I barely remember what time I woke up.

My point here is that we're supposed to be the next generation of engineers, not the next generation of memorizers.

### Python, then C, then a VM

I sucked at Python at the time, so the labs were rough for me. There was so much random syntax and so many functions I had to look up. I basically lived in office hours for the first half of the semester.

A list of the APIs we'd need would have been *so* nice. What they do, how to use them, and where to go to explore further. To do some of the labs, you had to download an Ubuntu image and run it as a VM. This was back when Apple Silicon was still kind of new, so getting that working on my Mac was its own side quest. It eventually worked, but developing on it was a mess.

And THEN the labs moved to C. If you thought socket programming in Python was goofy, try it in C.

### The router project

And then came the final boss: the router project.

You're a router. You send messages to other routers, and everything goes through a triangle of three switches. You program the whole simulation, from TCP down to the Ethernet frames. IN C!!!!!

Now, the project itself wasn't insanely hard. The concepts were all things we'd covered. But it was *brutal* to debug. Resources were slim, the provided test cases didn't work, and when your C code seg faults somewhere between "TCP" and "Ethernet," good luck figuring out which layer did it.

And this is where I take the L. My environment was being an SOB, I was just starting out as a TA for ECE 250, and my C skills weren't *that* good yet. So I spent most of the project fighting random seg faults, and for the first time in my life, I was the guy in the group project who didn't contribute much. I still feel bad about it. I'm pretty sure I didn't make any friends in that group, and I might have walked away with a bit of a negative rap. Lol. Damn.

## What Makes It Special

For all the chaos, I walked out of this class understanding how a message actually gets from one computer to another. Every layer of it. 

Funny story: I didn't even realize how much I'd learned until later, when I was talking to a friend about some networking basics. Somewhere in the middle of explaining it, I caught myself getting *so* passionate about it. Like, wait. I actually like this stuff?

At the time, the class felt so bleh. But the topic itself is interesting in practice. How it's all implemented, and the history of how the internet ended up this way, is worth learning.

And the router project, even though it humbled me, is a *great* idea. Building a stack from TCP down to Ethernet is exactly the kind of project that makes networking click. It just needed better tools for debugging it.

## Who Should Take It

- **Anyone curious about how the internet works.** The content is genuinely interesting, and it's not hard.
- **Get comfortable with C and Python first.** Sockets in Python and pointers in C, before the semester starts. Future you will thank you. But... you don't have to do labs in C so... this is old news
- **Set up your environment early.** Like, day one. Not the night before the lab is due. But again... this is no longer a thing so idk how useful this advice is to you anymore

## TA Perspective

Btw, I'm TA'ing this course right now.

And the course looks pretty different now. The router project is gone. Apparently enough students complained about it that the conclusion was, *"Eh, let's get rid of the project."* Now it's quizzes, a midterm, a final, and about half as many homeworks as I had.

It's kind of become a "yeah, you can ignore this class for a while" class. And honestly? I think that's a bit disrespectful to the content. Networking is the reason you can read this post right now. It deserves better than being the class people forget about until the midterm.

Getting rid of the project was the wrong conclusion in my opinion. The project was never the problem. Debugging it with slim resources was. If you're going to have a project like that, **give it the support to match**, and keep it.

## How I Would Fix It

Alright, I promised opinions. Here's how I'd make this course one of the best in the department. Of course, this is in my infinite resource world view. And also assuming the ECE department doesn't go broke again and needs to rename their department after another rich guy.

### Steal from the best

Other schools teach the same material and get students hyped about it:

- **Stanford's CS144** has students [build an entire TCP/IP stack](https://csdiy.wiki/en/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/CS144/) in C++, one checkpoint at a time: a byte stream, then the TCP receiver, then the sender. Then they swap their TCP in for the real Linux one, and finish with the network interface (with ARP) and an IP router. Their TCP even has to talk to real-world TCP implementations. That's basically our router project, split into pieces that each get tested on their own.
- **Berkeley's CS168** has [three projects](https://csdiy.wiki/en/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/CS168/), traceroute, routing, and TCP transport, mostly in Python. The focus stays on the ideas instead of fighting the language.
- **Brown's CS1680** starts with a [solo warm-up project, Snowcast](https://cs.brown.edu/courses/csci1680/f23/policies/) (a music streaming server), then moves on to IP and TCP projects in pairs. Students pick C, C++, Go, or Rust.

The common thread: **the big project is still there, but it's broken into milestones, and every milestone has tests that work.**

### Plug into the real world

My favorite part of CS144's approach is that your code has to work with *real* stuff. That's what our homework was missing. Rebuilding ping is cool, but it'd be way more fun to interface with something that already exists:

- Write a DNS resolver that queries real DNS servers
- Build an HTTP client that loads a real website
- Make your TCP talk to your laptop's actual TCP, and watch it happen in Wireshark

When your code talks to the real internet and *works*, that's a "lol, I did that?" moment you don't get from a toy simulation.

### Three ways to restructure it

Here are three options (and I had AI help me cuz did you really think I could come up with that stuff myself??), from "fix what's there" to "rethink the whole thing":

| | Option 1: Build the stack | Option 2: Protocols in Python | Option 3: Network design studio |
| --- | --- | --- | --- |
| **The idea** | Bring back the router project, split into checkpoints across the semester (like CS144) | Do the projects in Python with a provided simulator (like CS168), with C as an optional challenge | Treat it like a system design course. Design, critique, and defend real network designs |
| **Projects** | One stack, built layer by layer, each piece tested on its own | Three or four standalone protocol projects | Design docs, packet-trace analysis, and design reviews |
| **Exams** | Questions about *your* implementation and its tradeoffs | Scenario-based questions about protocol behavior | Case studies: here's a design, find its weaknesses |
| **Best for** | Students who want deep, low-level skills | Getting everyone comfortable with the concepts first | Prepping for real engineering jobs |
| **The catch** | Only works if the tests and environment are rock solid | Less low-level depth | Less hands-on coding |

If it were up to me, I'd take Option 1's project and Option 3's exams. Something like this:

[![A proposed course structure: four modules, application, transport, network, and link, each running a learn, build, break, defend loop, ending in a capstone router project, built on a shared dev environment](/writing/ece356/course-redesign.svg)](/writing/ece356/course-redesign.svg)
> Tap the diagram to open it full size.

### Treat us like big bois

Most of all, stop asking whether we memorized a certain slide. Give us a proposed design and let us tear it apart. Ask how we'd make it better. Give us scenarios like:

> *"Your coworker says we should switch all our traffic to UDP because it's faster. Why are they wrong? When are they right?"*

> *"A user says the website is down, but you can ping the server. Walk through what could be going on, layer by layer."*

> *"Here's a network diagram for a new office. What breaks first when it grows to 10x the users?"*

You can't answer those by memorizing a slide. You have to actually *get* it. That's how a vocabulary-heavy course turns into a fun one.

### The basics

- **One dev container** that runs the same on Intel, Apple Silicon, and Windows. No more VM side quests.
- **An API cheat sheet** for every lab.
- **Test cases that work,** checked on every platform before a project goes out.
- **Lectures that show, not read.** Live packet captures, demos, and the *why*. The textbook already has the definitions.

## Final Take

ECE 356 was a wild ride. I read approximately one million slides, fought a VM, lost a war against seg faults, and was the weak link in a group project for the first time ever. Oof.

But I also learned how the internet works, and now I get to help teach it. Which is exactly why I care so much about this one. The content isn't hard, and it's genuinely cool. It deserves a course that treats it like it matters: keep the big project, give it real support, plug it into the real world, and test us like the engineers we're about to be.

_As always, these are simply opinions about how I felt about the course. I do not share opinions on professors. Use Rate my Professor for that nonsense._
