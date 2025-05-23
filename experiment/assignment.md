### Part 1: Basic Understanding
Complete these questions to demonstrate your understanding of CMOS inverter fundamentals.

1. **CMOS Inverter Operation**
   - Explain how a CMOS inverter works when the input is LOW (0V)
   - Describe the role of PMOS and NMOS transistors in the circuit
   - What happens to the output when the input transitions from LOW to HIGH?

2. **SPICE Netlist Components**
   - List the essential components needed in a CMOS inverter SPICE netlist
   - Explain the purpose of each component
   - Why is the .MODEL statement necessary?

### Part 2: Practical Exercises

#### Exercise 1: Basic CMOS Inverter Simulation
Create a SPICE netlist for a CMOS inverter with the following specifications:
- VDD = 5V
- PMOS: W = 2.0μm, L = 0.18μm
- NMOS: W = 1.0μm, L = 0.18μm
- Input voltage sweep from 0V to 5V

Tasks:
1. Write the complete SPICE netlist
2. Run the simulation
3. Plot the VTC curve
4. Measure and report:
   - Switching threshold (VM)
   - Output voltage levels (VOH, VOL)
   - Noise margins (NML, NMH)

#### Exercise 2: Parameter Effects
Modify the netlist from Exercise 1 to investigate the effects of transistor sizing:

1. **PMOS Width Variation**
   - Create three versions of the circuit with PMOS widths of 1.0μm, 2.0μm, and 4.0μm
   - Keep NMOS width constant at 1.0μm
   - Compare and explain the effects on:
     - Rise time
     - Switching threshold
     - Power consumption

2. **NMOS Width Variation**
   - Create three versions of the circuit with NMOS widths of 0.5μm, 1.0μm, and 2.0μm
   - Keep PMOS width constant at 2.0μm
   - Compare and explain the effects on:
     - Fall time
     - Switching threshold
     - Power consumption

#### Exercise 3: Performance Analysis
Using the circuit from Exercise 1:

1. **Propagation Delay**
   - Add a transient analysis
   - Apply a square wave input (0V to 5V, 100MHz)
   - Measure and report:
     - Rise time (tr)
     - Fall time (tf)
     - Propagation delay (tp)

2. **Power Consumption**
   - Calculate and report:
     - Dynamic power consumption
     - Static power consumption
     - Total power consumption

### Part 3: Design Challenge

#### Challenge: Optimize a CMOS Inverter
Design a CMOS inverter that meets the following specifications:
- VDD = 5V
- Maximum propagation delay: 100ps
- Minimum noise margin: 0.5V
- Minimum power efficiency

Tasks:
1. Determine appropriate W/L ratios for PMOS and NMOS
2. Justify your design choices
3. Verify the design meets all specifications
4. Document any trade-offs made