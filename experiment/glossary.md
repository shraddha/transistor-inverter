### Basic SPICE Commands

#### Circuit Elements
| Command | Description | Example |
|---------|-------------|---------|
| V | Voltage Source | `VDD vdd 0 DC 5V` |
| M | MOSFET | `M1 out in vdd vdd PMOS W=2.0u L=0.18u` |
| .MODEL | Device Model | `.MODEL NMOS NMOS (LEVEL=3 TOX=3.5E-9)` |

#### Analysis Commands
| Command | Description | Example |
|---------|-------------|---------|
| .DC | DC Sweep Analysis | `.DC VIN 0 5 0.01` |
| .TRAN | Transient Analysis | `.TRAN 0.1ns 100ns` |
| .PRINT | Output Variables | `.PRINT DC V(in) V(out)` |
| .END | End of Netlist | `.END` |

### MOSFET Parameters

#### Basic Parameters
| Parameter | Description | Typical Values |
|-----------|-------------|----------------|
| W | Channel Width | 0.5μm - 10μm |
| L | Channel Length | 0.1μm - 1.0μm |
| VTO | Threshold Voltage | NMOS: 0.5V, PMOS: -0.5V |

#### Model Parameters
| Parameter | Description | Typical Values |
|-----------|-------------|----------------|
| LEVEL | Model Level | 3 (for BSIM3) |
| TOX | Oxide Thickness | 3.5E-9 m |
| GAMMA | Body Effect | 0.2 |
| PHI | Surface Potential | 0.6 V |

### Common Units
| Unit | Description | Example |
|------|-------------|---------|
| V | Volts | `5V` |
| u | Microns | `2.0u` |
| ns | Nanoseconds | `1ns` |

### Node Naming Conventions
| Node | Description | Example |
|------|-------------|---------|
| vdd | Power Supply | `vdd` |
| gnd | Ground | `0` |
| in | Input | `in` |
| out | Output | `out` |

### Analysis Types

#### DC Analysis
- Used for: Static characteristics, VTC curves
- Command: `.DC`
- Example: `.DC VIN 0 5 0.01`

#### Transient Analysis
- Used for: Time-domain response, switching behavior
- Command: `.TRAN`
- Example: `.TRAN 0.1ns 100ns`

### Common Error Messages and Solutions

| Error Message | Possible Cause | Solution |
|---------------|----------------|----------|
| "Missing VDD definition" | Power supply not defined | Add `VDD vdd 0 DC 5V` |
| "Invalid VDD value" | Negative or zero voltage | Use positive voltage value |
| "Missing transistor parameters" | W/L not specified | Add W and L values |
| "Missing model definition" | .MODEL statement missing | Add .MODEL statements |
| "Missing analysis command" | No .DC or .TRAN | Add analysis command |
| "Missing .END" | Netlist not terminated | Add .END statement |

### Online SPICE Resources

#### Official Documentation
1. **SPICE3 User's Manual**
   - URL: https://bwrcs.eecs.berkeley.edu/Classes/IcBook/SPICE3/
   - Comprehensive reference for SPICE3 syntax and commands
   - Includes detailed explanations of all analysis types
   - Contains model parameter descriptions

2. **LTspice Documentation**
   - URL: https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html
   - Detailed documentation for LTspice
   - Includes SPICE syntax and extensions
   - Provides example circuits and tutorials

#### Educational Resources
1. **All About Circuits SPICE Guide**
   - URL: https://www.allaboutcircuits.com/technical-articles/spice-simulation-series-part-1/
   - Beginner-friendly tutorials
   - Step-by-step examples
   - Common SPICE commands explained

2. **UC Berkeley SPICE Resources**
   - URL: https://bwrcs.eecs.berkeley.edu/Classes/IcBook/SPICE/
   - Academic resources
   - Detailed model parameters
   - Advanced simulation techniques

#### Community Resources
1. **SPICE User's Forum**
   - URL: https://groups.google.com/g/ltspice
   - Active community support
   - Common problems and solutions
   - Code examples and tips

2. **SPICE Syntax Reference**
   - URL: http://www.ecircuitcenter.com/SPICEsummary.htm
   - Quick reference guide
   - Common commands and syntax
   - Example circuits

#### Additional Tools
1. **SPICE Syntax Checker**
   - URL: https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html
   - Online syntax validation
   - Error checking
   - Code formatting

2. **SPICE Model Libraries**
   - URL: https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html
   - Device model collections
   - Parameter databases
   - Example circuits 