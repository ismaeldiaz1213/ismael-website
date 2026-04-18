---
title: "IEEE Floating-Point Single Precision Approximate Adder"
published: true
date: "2026-04-18"
tags: [gem5, Computer Architecture]
category: "Hardware"
excerpt: "Creating an IEEE-like floating point approximate adder for my ECE 552 course"
---

As part of the ECE 552: Advanced Computer Architecture course, we had a final project where the prompt was quite simple: create or replicate a paper on a processor improvement. My partner, Zane, and I got to working on several ideas, breaking them down by which stage of the classic 5-stage pipeline they would impact.

After some discussion, we settled on creating a new instruction backed by a custom functional unit. And so began the first idea!

---

## The First Idea (and Why It Didn’t Work)

Originally, we set out to design a **Montgomery Modular Exponentiation RISC-V extension**. The goal was ambitious: accelerate cryptographic workloads directly in hardware by introducing a custom instruction for modular exponentiation.

On paper, this sounded like the perfect ECE 552 project—algorithmically interesting, hardware-heavy, and highly relevant.

But very quickly, reality set in.

We struggled just to understand the math involved. It felt like we were missing entire layers of prerequisite knowledge. Still, we pushed forward for nearly half the semester until I spoke with Dr. Sorin at Duke. After walking through the design, it became clear:

- The design complexity was massive  
- The latency was extremely high (~200 cycles per operation)  
- Integration into gem5 would be difficult  
- Verification alone would take too long  

At some point, we had to be honest with ourselves:

> **This wasn’t going to get finished in time.**

So we pivoted.

---

## The Pivot: Rethinking Performance

Instead of focusing on *one large instruction*, we asked:

> *What is something small, fundamental, and used everywhere… but still inefficient?*

That answer was **floating-point operations**.

Even IEEE-754 floating-point addition is surprisingly expensive. A single addition requires:

- Exponent alignment  
- Mantissa shifting  
- Carry propagation  
- Normalization  
- Rounding and exception handling  

Prior work (Hemmert & Underwood, *Fast, Efficient Floating-Point Adders and Multipliers for FPGAs*) shows that FPGA implementations can require **up to 9 pipeline stages** and consume **70–80% of FPGA resources**.

That’s when things clicked:

> Many workloads don’t actually need perfect IEEE-754 accuracy.

---

## Enter Approximate Computing

Applications like:

- Digital signal processing  
- Audio and image pipelines  
- Machine learning inference  

can tolerate small numerical errors.

This leads to **approximate computing**, where we trade a bit of accuracy for:

- Lower latency  
- Higher clock frequency  
- Reduced hardware cost  

And this became our project:

> **Design an approximate IEEE-like floating-point adder and integrate it into a RISC-V processor.**

---

## The Core Idea: Approximate Mantissa Addition

The bottleneck in floating-point addition is the **mantissa carry chain**.

We based our design on:

> *Sridhar & Kanhe, "Approximate Floating Point Precise Carry Prediction Adder for FIR Filter Applications"*

This design splits the mantissa into:

1. **Precise region (MSBs)**  
2. **Imprecise region (middle bits)**  
3. **Truncated region (LSBs)**  

![Floating Point Approximate Adder](/projects/floating-point-approximate-adder/floating_point_approx.png)

The approximate logic replaces full adders with:

- Sum ≈ A OR B OR Cin  
- Carry ≈ A AND B  

This removes long carry chains and dramatically reduces delay.

---

## Breaking IEEE-754 (On Purpose)

We also simplified the IEEE pipeline:

- Removed guard/round/sticky bits  
- Eliminated denormals  
- Skipped exception handling  
- Simplified normalization  

This reduced the pipeline from **~6–10 stages → 3 stages**.

![Floating Point Approximate Adder Pipeline](/projects/floating-point-approximate-adder/pipeline_diagram.png)

Pipeline:

1. Operand unpacking + alignment  
2. Approximate mantissa addition  
3. Normalization + result assembly  

---

## Building It (Verilog → FPGA)

We implemented the design in Verilog and synthesized it on a Xilinx Artix-7.

![VIVADO RESULTS](/projects/floating-point-approximate-adder/vivado_impl_table.png)
![MAX FREQ](/projects/floating-point-approximate-adder/max_freq.png)


Key observations:

- More approximation → higher frequency  
- Peak frequency ≈ **534 MHz**  
- Area remained stable  
- Power efficiency improved  

---

## Accuracy vs Performance Tradeoff

We measured:

- MAE  
- MSE  

![MAE_MSE_TABLE](/projects/floating-point-approximate-adder/mae_mse_table.png)

![mae_stuff](/projects/floating-point-approximate-adder/mae_vs_precise_bits.png)


FRom this we can see the following results:

- Error drops exponentially with more precise bits  
- Sweet spot: **10–12 precise bits**
  - <1% error  
  - Strong frequency gains  

---

## Bringing It to a Processor (gem5)

We added a custom instruction called `FADDFAST` into gem5 and saw results such as:

- ~**1.33× speedup** across microbenchmarks  
- Lower latency  
- Higher throughput  

![CPI MICROBENCHMARKS](/projects/floating-point-approximate-adder/cpi_microbenchmarks.png)


---

## Full Project Report

I don't want to overexplain things that have already been explained in the technical report. So if  you'd like to see the full technical writeup:

[View Full Report (PDF)](/projects/floating-point-approximate-adder/552_Final_Project_Document.pdf)

---

## What I Learned

- Big ideas aren’t always the best ideas  
- Simple optimizations scale better  
- Hardware/software co-design matters  
- IEEE-754 is powerful—but expensive  

---

## Debugging & Challenges (Personal Reflection)

One unexpected challenge was just **getting back into Verilog**. It had been a while, and there’s definitely a ramp-up period to thinking in hardware again—especially when debugging timing and pipeline behavior.

But the **real pain point** was SPEC benchmarking.

We ran into major issues trying to compile some SPEC benchmarks for RISC-V in our environment. Some simply wouldn’t build, and debugging the toolchain became a project of its own. Unfortunately, this came down to timing as we ran out of time before we could fully resolve it and get complete benchmark coverage.

If I had more time, this is probably the first thing I would fix.

---

## What I’d Improve (Future Work)

- Runtime configurable precision  
- Approximate multiplication  
- Partial IEEE compliance  
- Real ML/DSP workloads  
- ASIC comparison  
- Fix SPEC benchmarking pipeline  

---

## Code

<!-- TODO: Explain several code snippets here so that it can be a bit more detailed -->

Full repo here:  
https://gitlab.oit.duke.edu/id55/ieee754-floating-point-approximation/-/tree/83dd0290fbc40d2e063cdbb90c05e93c5bd53da4

---

## Final Thoughts

This project started as an overly ambitious cryptography accelerator and ended as something much more practical:

> A fast, flexible, and *good-enough* floating-point adder.

And honestly, that tradeoff—**perfect vs practical**—is what computer architecture is all about :)

---

## References

- Sridhar, C., & Kanhe, A. (2024). *Approximate Floating Point Precise Carry Prediction Adder for FIR Filter Applications*.  
- Hemmert, K. S., & Underwood, K. D. (2010). *Fast, Efficient Floating-Point Adders and Multipliers for FPGAs*.  
- IEEE Standards Association. (2019). *IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)*.  
- Beaumont-Smith, A., et al. (1999). *Reduced Latency IEEE Floating-Point Standard Adder Architectures*.  
