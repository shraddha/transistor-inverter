### Common SPICE Errors and Solutions

#### 1. Power Supply Issues

##### Error: "Missing or incorrect VDD power supply definition"
**Symptoms:**
- Simulation fails to start
- Error message about missing VDD

**Solutions:**
1. Check if VDD is properly defined:
   ```spice
   VDD vdd 0 DC 5V
   ```
2. Verify node names (vdd and 0)
3. Ensure DC value is positive

##### Error: "Invalid VDD value"
**Symptoms:**
- Error message about invalid VDD
- Simulation won't run

**Solutions:**
1. Check VDD value is positive
2. Verify unit specification (V)
3. Example of correct format:
   ```spice
   VDD vdd 0 DC 5V
   ```

#### 2. Transistor Definition Issues

##### Error: "Missing or incorrect PMOS/NMOS transistor definition"
**Symptoms:**
- Error about missing transistor
- Circuit won't simulate

**Solutions:**
1. Check transistor definitions:
   ```spice
   M1 out in vdd vdd PMOS W=2.0u L=0.18u
   M2 out in 0 0 NMOS W=1.0u L=0.18u
   ```
2. Verify node connections
3. Check transistor type (PMOS/NMOS)

##### Error: "Missing W and L parameters"
**Symptoms:**
- Error about missing parameters
- Transistor not properly defined

**Solutions:**
1. Add W and L parameters
2. Check units (u for microns)
3. Verify parameter values are positive

#### 3. Model Definition Issues

##### Error: "Missing NMOS/PMOS model definition"
**Symptoms:**
- Error about missing model
- Simulation fails

**Solutions:**
1. Add model definitions:
   ```spice
   .MODEL NMOS NMOS (LEVEL=3 TOX=3.5E-9 VTO=0.5 GAMMA=0.2 PHI=0.6)
   .MODEL PMOS PMOS (LEVEL=3 TOX=3.5E-9 VTO=-0.5 GAMMA=0.2 PHI=0.6)
   ```
2. Check model parameters
3. Verify model type (NMOS/PMOS)

#### 4. Analysis Command Issues

##### Error: "Missing analysis command"
**Symptoms:**
- No simulation results
- Error about missing analysis

**Solutions:**
1. Add appropriate analysis command:
   ```spice
   .DC VIN 0 5 0.01
   ```
   or
   ```spice
   .TRAN 0.1ns 100ns
   ```
2. Check analysis parameters
3. Verify input source name

##### Error: "Missing .PRINT command"
**Symptoms:**
- No output data
- Simulation runs but no results

**Solutions:**
1. Add print command:
   ```spice
   .PRINT DC V(in) V(out)
   ```
2. Verify variable names
3. Check analysis type matches

#### 5. General Syntax Issues

##### Error: "Missing .END statement"
**Symptoms:**
- Simulation won't complete
- Error about missing .END

**Solutions:**
1. Add .END statement at the end
2. Check for proper placement
3. Verify no code after .END

### Best Practices

1. **Code Organization**
   - Group related components
   - Use comments for sections
   - Maintain consistent formatting

2. **Parameter Values**
   - Use reasonable values
   - Check units
   - Verify ranges

3. **Node Names**
   - Use consistent naming
   - Avoid reserved words
   - Keep names descriptive

4. **Model Parameters**
   - Use standard values
   - Check parameter ranges
   - Verify model type

### Debugging Tips

1. **Start Simple**
   - Begin with basic circuit
   - Add components gradually
   - Test each addition

2. **Check Connections**
   - Verify node names
   - Check for shorts
   - Ensure proper grounding

3. **Parameter Values**
   - Start with default values
   - Make small changes
   - Document effects

4. **Analysis Setup**
   - Choose appropriate analysis
   - Set reasonable ranges
   - Check output variables 