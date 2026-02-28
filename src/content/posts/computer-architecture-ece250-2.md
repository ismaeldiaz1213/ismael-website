---
title: "Computer Architecture (ECE 250)"
date: "2026-02-14"
tags: [Spring 2024, Prof: Dan Sorin]
published: true
excerpt: "10/10 would take again. Maybe I should TA this class? Hmmmmmmm"
---

This is the class where you understand what a computer is actually doing.

## TLDR

- You learn how computers actually work — from C memory models to building a processor
- Plan for the assignments to take up a _decent_ amount of your time on some weeks!
    - Especially the MIPS assignment!!!
- Caches are hard :(
- Creating a CPU was really cool
- Pipelining is neat

## What You Actually Learn

At a high level, this class walks you from programming in C all the way down to designing a processor. You start at an abstraction layer most of us are comfortable with, and then slowly peel that abstraction back until you’re basically staring at wires and control signals.

This is a sample of all the things the course covers and there may be things I'm missing here.

- Different Architectures, RISC vs CISC
- Architecture vs Microarchitecture
- Intro to C programming (stack, heap, memory model)
- Writing MIPS assembly
- Digital Logic Intro
- Finite State Machines (Moore)
- Processor Design
- Caches
- Virtual Memory
- I/O
- Pipelining

Ok this is about to sound pretty nerdy, but I really mean this -- this course had me hooked near the very beginning. It started by explaining the different architecture differences and the different layers to a computer that we would explore throughout the course. For the first time, I understood that “architecture” isn’t just a buzzword — it’s the contract between software and hardware.

I had always heard of C and how it was a more challenging language to use but never really knew why. I can see why now. Managing and working with pointers can get a little funky if you don't understand what the different C pointer operators do. It probably wasn't until I was a TA that I better understood how those operators worked! The first project the course throws at you is in C and having come from a rough time in CS 201, I struggled thinking through how to do insertion sort! I wanted to blame 201 for not preparing me for implementing a sorting algorithm, but I got over it after a TA let me figure it out in office hours. I definitely felt a sense of accomplishment once I had seen all green on the autograder.

On the conceptual side, you learn that memory is not abstract. The stack and heap are not just vocabulary words. Pointers are not magic. You are responsible for what they point to. And if you're not careful... you can do some bad stuff. 

The digital logic portion of the course (truth tables, muxes, and finite state machines) was a great introduction and preparation before I dived into ECE 350. Tri-state buffers are odd to think about but the water tap analogy they give in class clears things up for the most part... until you implement it in your processor. Then you have to think about it again. Then it makes sense again.

The I/O topic was okay, but there's not all that much that is "interesting" about it. Kind of just one of those things computers need to do, otherwise they aren't nearly as useful.

## What Makes It Hard

Of course, none of this comes easy.

Before jumping into the course, I was told that it was a time-consuming class. Maybe not as time-consuming as ECE 350 (which I will have a post on that later) but still time-consuming. I centered my schedule around this course, making sure that I could focus on the projects and boy was I glad I did that! Seriously, that MIPS assignment was a long one.

Perhaps now is a good time to talk about the MIPS assignment. Writing the code wasn't all that problematic. It sucked I didn't have variable names to work with, but it still works like a regular programming language (unlike our HDL friends). I think I got lucky when writing my assembly code because I did not understand calling conventions that well. I made the choice to use all \$t registers which meant I only had to deal with the caller saving t registers and the callee saving \$ra. But if I had decided to use \$s registers, I most certainly would have had points taken off because I would not have saved those at the callee (again, one of those things I solidified once I was a TA).

The hardest part was just being a human compiler, and managing which register holds the pointer to stuff. It was really easy to lose a pointer if I wasn't careful which is why I was often working on that assignment in other classes because I kept getting "Bad address" errors in SPIM. When that happens, you realize very quickly that the machine does exactly what you tell it to do and not what you _meant_ to tell it to do.

The caching and virtual memory topics did not click with me and as good as my recitation TA's were, I still wasn't grasping how I'm supposed to take an address and look something up in the cache. I think part of my issue was that I kept thinking of caches as “smart memory” instead of as structured hardware indexed by specific bits of an address. Though, once we started looking at the whole idea of virtually indexed physically tagged (and variations of this), I was more lost.

The last cachesim project was probably harder than I expected and I managed to finish it righttttttt before the deadline (please start that one early). Suffice it to say, I got those questions wrong on my final exam (though this was a consequence of my overconfidence and lack of studying for that final). There is a new recitation that introduces caching much better so that should help future students!

This will make more sense to those who took the course, but I didn't simplify my boolean algebra logic when implementing my finite state machine. Yeah... That pain was unnecessary. I spent half an hour just placing gates, making tunnels, and routing wires in Logism!

## What Makes It Special

For all the difficulty, this class has some of the most rewarding moments I've had in college.

Figuring out that MIPS assignment was truly such a wonderful feeling that has only ever been topped by the completion of my ECE 350 processor. There is something deeply satisfying about writing assembly that actually works and knowing exactly why it works.

The processor assignment was truly one of the best projects I had done. Just working on it and going instruction by instruction you really get an idea of how your processor functions (to some degree). You stop seeing instructions as lines of code and start seeing them as data moving through stages.

Pipelining was one of the few moments I was ever in awe at a lecture. I don't mean that to sound that nerdy but for real! The idea that someone thought one day... "One instruction is so yesterday. Let's make a processor act like assembly line" is crazy. Thanks to these lectures, I knew I had to take ECE 552 (Adv. Comp Arch I) at some point (and I did).


## Who Should Take It

Maybe useful context... I took this class during my freshman spring because I was still unsure if my switch into Pratt was a good idea. Since this course was cross-listed, my Trinity advisor (at the time) agreed this was a safe decision incase I had any regrets about Pratt and wanted back in to Trinity.

- If you're more of an E in the ECE, perhaps this can get a little too programming heavy, but I'd argue the concepts of this course are just good to know. 
- If you're a CS major deciding between CS 210 and 250 and can commit the time, take it. 

## TA Perspective

So perhaps I am biased in my suggestion since, yeah, I liked this class enough that I wanted to TA the class. I really didn't need the money (though it was a plus) but wanted to have an avenue to help people in ways I hadn't done since high school. The greater emphasis for me was that I was going to learn so much more about the course through teaching it. I still wasn't satisfied with the gaps in my knowledge, especially with caches.

Teaching it forced me to confront the parts I had glossed over the first time. I solidified my understanding of MIPS calling conventions, C pointers, virtual memory, and those pesky cache concepts that weren't clicking. It was a great time overall though, and I continue to enjoy my time TAing the course:)

## Final Take

I didn't expect to enjoy this course so much. The CS 201 pre-requisite scared me into thinking this is going to be another programming class that I was going to struggle badly in (and I did struggle, but the good kind), and I came out the other end so fascinated I almost wanted to pursue a career in the field. One thing was certain though and that was that I had to take more classes similar to this (and I have).

_As always, these are simply opinions about how I felt about the course. I do not share opinions on professors. Use Rate my Professor for that nonsense._
