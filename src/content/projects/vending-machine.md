---
title: "Vending Machine"
published: true
date: "2026-04-18"
tags: [Digital Systems, FPGA]
excerpt: "My final project for ECE 350 was creating a Vending Machine!"
category: "Hardware"
---

## Overview

My ECE 350 final project was worked on in collaboration with Aashika Jagadeesh. This was a group project where we each poured many many many hours into it. Our goal became to design and develop a small snack vending machine powered by our custom processor. The idea was to take everything we learned throughout the course (assembly, memory-mapped I/O, hardware integration) and actually build something physical that worked end-to-end. The biggest constraint given to us was that we had to write a minimum of 100 lines of assembly code that our processors would have to run. Yes, we designed a 5-stage pipelined processor in Verilog! The architecture was MIPS-like. Anyways...

At a high level, the machine needed to take user input, process payments, and dispense a snack reliably.

---

## MVP

Our minimum viable product (MVP) was simple: press a button → get a snack.

To get there, we needed to implement:

- Stepper motors to spin coils and release snacks  
- Button inputs for item selection  
- Payment system (coin slot)  

We also had a few post-MVP ideas (the bells and whistles):

- IR sensor for detecting when a snack actually falls  
- Servos for more precise control  
- LCD / VGA / seven-segment display for UI  
- LED strip for lighting  
- Display (planned, but not fully implemented)  
- A custom currency system using NFC  
- Speaker for feedback when dispensing  


In the final version, we successfully implemented the motors, buttons, LED strip, speaker, and payment system. We also got the IR sensor working, which was a big upgrade over just hardcoding motor rotations.  

The display ended up being the main thing we couldn’t finish. Between I2C issues and limited FPGA pins, it just wasn’t realistic within the time we had.

Still, the machine worked end-to-end: press a button, insert coins, and a snack gets dispensed reliably.

---

## Mechanical Structure

We built the machine inside a 2ft × 2ft enclosure with four slots (a bit bigger than necessary). The goal was to keep everything accessible while not making it too cramped to wire or debug.

Key CAD components:

- **Coil** – main mechanism that pushes snacks forward  
- **Snack container** – holds the snacks and allows for easy restocking  
- **Stepper motor insert** – connects the motor shaft to the coil  

![Coil CAD Model](/projects/vending-machine/couil_cad_model.png)
>Figure 1: Coil used to push snacks forward.

![Container CAD Model](/projects/vending-machine/container.png)
>Figure 2: Container design for housing snacks and electronics.

![Motor Insert](/projects/vending-machine/coil_motor_connector.png)
>Figure 3: Insert used to connect the stepper motor to the coil.

The coil design worked well, but post-processing was a bit unsafe due to the way the supports had to be snapped apart. Safety glasses were definitely a must. The container ended up being printed in two parts and glued together, which made assembly easier overall.

---

## Circuit Design

We designed multiple circuits to handle different parts of the system.

### Motor Controller Circuit

![Motor Controller Circuit](/projects/vending-machine/motor_controller_circuit.png)
> Figure 4: Motor drivers controlling four stepper motors. Uses separate VMOT and logic voltages.

### Coin Slot Circuit

![Coin Slot Circuit](/projects/vending-machine/coin_slot_circuit.png)
> Figure 5: Coin acceptor providing impulse signals to the FPGA.*

### Push Button Circuit

![Push Button Circuit](/projects/vending-machine/push_button_circuit.png)
> Figure 6: Buttons wired with pull-down resistors, sending 3.3V signals to the FPGA.

### IR Sensor Circuit

![IR Sensor Circuit](/projects/vending-machine/ir_sensor_circuit.png)
> Figure 7: IR transmitter/receiver pair used to detect when a snack is dispensed.

These circuits all interfaced directly with the FPGA through memory-mapped I/O, which made it easier to manage everything from assembly.

---

## FPGA Connections

![FPGA Connections](/projects/vending-machine/fpga_connections.png)
> Figure 8: Overview of FPGA connections including motor control, buttons, IR sensor, and coin input.

We used the FPGA as the central controller, with:

- Button inputs  
- Coin sensor input  
- IR sensor input  
- Motor control outputs  
- Speaker output  

---

## I/O

- 4 push buttons for snack selection  
- Speaker output to indicate successful payment / vending  

Simple, but enough to make the system interactive.

---

## Processor Modifications

We didn’t end up modifying the processor itself. Everything was done using the existing instruction set.

That said, if I had known that I could give pseudo-instructions to my assembler I would have used `move` far more often. Having to do `addi $rd, $rs, 0` was annoying to have to constantly type.

---

## Challenges

There were several challenges and issues that presented themselves in this project.

### Wire Management / Current Issues

Wire management was honestly one of our biggest problems.

- Poor insulation made it easy to accidentally short connections  
- Low gauge wires couldn’t handle the motor current  
- Screw terminals with solid core wires weren’t very stable  

We also ran into weird behavior with motors drawing too much current (~0.2 A at 6V), which we think was caused by voltage instability and missing capacitors on some drivers.

In hindsight, a PCB or at least a better protoboard setup would have saved us a lot of time.

---

### I2C (LCD Issues)

We tried to get an LCD working but ran into issues with:

- Device addressing  
- Initialization  
- General communication over I2C  

We tested multiple approaches (changing addresses, adding pull-ups, test benches), but couldn’t get it working reliably in time.

---

### Timing (Coin Slot)

The coin slot outputs a signal with:

- ~100 ms period  
- ~50% duty cycle  

This didn’t match well with a 44 MHz processor, so we had to count clock cycles in Verilog to interpret the signal correctly.

We ended up detecting negative edges to identify impulses, then mapping those to coin values that our assembly code would handle.

---

## Testing

Most of our testing was focused on making sure a single slot worked reliably.

We ran multiple tests (~15 runs), checking:

- Button presses were detected  
- Money was tracked correctly (in binary on LEDs)  
- Enough money triggered vending  

The onboard FPGA LEDs were actually super helpful here as they basically acted as debug outputs showing where we were in the program.

---

## Assembly Code Overview

The assembly code breaks down into three main parts:

1. **Button Reading**  
   Uses memory-mapped I/O to detect which button is pressed and assign a price.

2. **Impulse Reader (Coins)**  
   Verilog handles signal timing, while assembly maps impulses to coin values.

3. **Vending State**  
   - Plays a sound  
   - Activates motor  
   - Waits for IR sensor confirmation  
   - Resets system  

The system continuously loops, allowing users to change selections before completing a purchase. You can view the code here: https://gitlab.oit.duke.edu/id55/vending-machine/-/blob/e44be486e6091534ebef9749ac1183e96082135d/assembler-main/finalFinalProject.s


---

## Improvements

If I were to redo this project, I would:

- Design a PCB for cleaner motor controller connections  
- Use JST connectors instead of screw terminals especially because solid core and screw hole aren't friendly with each other
- Prevent vending when insufficient funds for more expensive items are requested
- Add a dedicated output slot for snacks  
- Cover exposed wiring  

---

## Conclusion

In the end, the system worked where each button maps to a motor, and once enough money is detected, the processor enables that motor until the IR sensor confirms the item has fallen. And that was it!

There are certainly various takewaways from this experience. One of them in particular is to START EARLY!!! I was ill for the first half but there were still opportunities to start early. We certainly could have worked out all the tiny bugs with that earlier start time. Another takeaway was how quickly hardware issues (wiring, voltage, timing) can dominate over clean logic design. The electrical engineering fundamentals had to be strong enough to help debug circuit issues. 

Overall, I'm still proud of what was accomplished. It's still amazing to think that every piece of logic was built by us from the processor to the hardware, to the extra Verilog logic required to have everything run. Truly one of the best learning experiences I've had at Duke. I would certainly do it again... and in a way I did. I got to mentor groups as a TA which have accomplished far greater than I did. But I'm happy that my experience helped them push beyond the intial hurdles I experienced.  

---

## Appendix A: Final Build

![Final Machine](/projects/vending-machine/final_result.png)
> Figure 9: Final vending machine with multiple slots and internal wiring visible.
