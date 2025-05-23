// CMOS Inverter Simulation JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tabs
  initTabs();
  
  // Initialize sliders
  initSliders();
  
  // Set up event listeners for simulation buttons
  initButtons();
  
  // Initialize demo plots
  initDemoPlots();
  
  // Generate initial SPICE code
  updateSpiceCode();
  
  // Add event listeners for parameter validation
  document.getElementById('check-params').addEventListener('click', validateParameters);
  
  // Add event listeners for SPICE code validation
  document.getElementById('validate-spice').addEventListener('click', validateSpiceCode);
  document.getElementById('restore-spice').addEventListener('click', function() {
    updateSpiceCode();
    document.getElementById('spice-feedback').className = 'spice-feedback';
  });
  
  // Add event listeners for results analysis
  document.getElementById('run-dc-sim').addEventListener('click', function() {
    runDCSimulation();
    analyzeResults();
  });
  
  document.getElementById('run-transient-sim').addEventListener('click', function() {
    runTransientSimulation();
    analyzeResults();
  });
  
  // Add input event listeners for real-time feedback
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.addEventListener('input', function() {
      // Clear feedback when parameters change
      document.getElementById('parameter-feedback').className = 'parameter-feedback';
    });
  });
  
  // Add SPICE code editing event listener
  const spiceCode = document.getElementById('spice-code-text');
  spiceCode.addEventListener('input', function() {
    document.getElementById('spice-feedback').className = 'spice-feedback';
  });
});

// Tab functionality
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabs.length === 0 || tabContents.length === 0) {
    console.warn('Tab elements not found in the document');
    return;
  }
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => {
        if (content) content.classList.remove('active');
      });
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const contentId = tab.getAttribute('data-tab');
      const contentElement = document.getElementById(contentId);
      if (contentElement) {
        contentElement.classList.add('active');
      } else {
        console.warn(`Element with id ${contentId} not found`);
      }
    });
  });
  
  // Activate first tab by default
  if (tabs.length > 0) {
    tabs[0].click();
  }
}

// Initialize sliders and their display values
function initSliders() {
  const sliders = document.querySelectorAll('input[type="range"]');
  
  if (sliders.length === 0) {
    console.warn('No slider inputs found in the document');
    return;
  }
  
  sliders.forEach(slider => {
    const display = document.getElementById(`${slider.id}-value`);
    if (display) {
      display.textContent = `${slider.value} ${slider.dataset.unit || ''}`;
    }
    
    slider.addEventListener('input', () => {
      if (display) {
        display.textContent = `${slider.value} ${slider.dataset.unit || ''}`;
      }
      
      // Update SPICE code when parameters change
      updateSpiceCode();
      
      // Clear any simulation results when parameters change
      clearSimulationResults();
    });
  });
}

// Initialize simulation buttons
function initButtons() {
  const dcSimBtn = document.getElementById('run-dc-sim');
  const transientSimBtn = document.getElementById('run-transient-sim');
  const resetBtn = document.getElementById('reset-params');
  
  if (dcSimBtn) {
    dcSimBtn.addEventListener('click', runDCSimulation);
  } else {
    console.warn('DC simulation button not found');
  }
  
  if (transientSimBtn) {
    transientSimBtn.addEventListener('click', runTransientSimulation);
  } else {
    console.warn('Transient simulation button not found');
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetParameters);
  } else {
    console.warn('Reset parameters button not found');
  }
}

// Reset parameters to default values
function resetParameters() {
  const sliders = document.querySelectorAll('input[type="range"]');
  
  sliders.forEach(slider => {
    slider.value = slider.dataset.default || slider.min;
    const display = document.getElementById(`${slider.id}-value`);
    if (display) {
      display.textContent = `${slider.value} ${slider.dataset.unit || ''}`;
    }
  });
  
  // Update SPICE code with default values
  updateSpiceCode();
  
  // Clear simulation results
  clearSimulationResults();
}

// Update SPICE code based on current parameter values
function updateSpiceCode() {
  const spiceCodeElement = document.getElementById('spice-code-text');
  if (!spiceCodeElement) return;
  
  // Get parameters from sliders
  const vdd = document.getElementById('vdd-slider')?.value || 5;
  const pmosWidth = document.getElementById('pmos-width-slider')?.value || 2.0;
  const nmosWidth = document.getElementById('nmos-width-slider')?.value || 1.0;
  const mosfetLength = document.getElementById('mosfet-length-slider')?.value || 0.18;
  
  // Generate SPICE code
  const spiceCode = `* CMOS Inverter SPICE Netlist

* Power Supply
VDD vdd 0 DC ${vdd}V

* Input Voltage Source (for DC sweep)
VIN in 0 DC 0V

* PMOS Transistor
M1 out in vdd vdd PMOS W=${pmosWidth}u L=${mosfetLength}u

* NMOS Transistor
M2 out in 0 0 NMOS W=${nmosWidth}u L=${mosfetLength}u

* MOSFET Model Parameters
.MODEL NMOS NMOS (LEVEL=3 TOX=3.5E-9 VTO=0.5 GAMMA=0.2 PHI=0.6)
.MODEL PMOS PMOS (LEVEL=3 TOX=3.5E-9 VTO=-0.5 GAMMA=0.2 PHI=0.6)

* Analysis Commands
.DC VIN 0 ${vdd} 0.01
.PRINT DC V(in) V(out)

.END`;
  
  spiceCodeElement.textContent = spiceCode;
}

// Generate transient analysis SPICE code
function getTransientSpiceCode() {
  // Get parameters from sliders
  const vdd = document.getElementById('vdd-slider')?.value || 5;
  const pmosWidth = document.getElementById('pmos-width-slider')?.value || 2.0;
  const nmosWidth = document.getElementById('nmos-width-slider')?.value || 1.0;
  const mosfetLength = document.getElementById('mosfet-length-slider')?.value || 0.18;
  
  return `* CMOS Inverter SPICE Netlist - Transient Analysis

* Power Supply
VDD vdd 0 DC ${vdd}V

* Input Voltage Source (pulse)
VIN in 0 PULSE(0 ${vdd} 0ns 1ns 1ns 20ns 40ns)

* PMOS Transistor
M1 out in vdd vdd PMOS W=${pmosWidth}u L=${mosfetLength}u

* NMOS Transistor
M2 out in 0 0 NMOS W=${nmosWidth}u L=${mosfetLength}u

* MOSFET Model Parameters
.MODEL NMOS NMOS (LEVEL=3 TOX=3.5E-9 VTO=0.5 GAMMA=0.2 PHI=0.6)
.MODEL PMOS PMOS (LEVEL=3 TOX=3.5E-9 VTO=-0.5 GAMMA=0.2 PHI=0.6)

* Analysis Commands
.TRAN 0.1ns 100ns
.PRINT TRAN V(in) V(out)

.END`;
}

// Run DC simulation (demo with representative data)
function runDCSimulation() {
  const resultContainer = document.getElementById('dc-results');
  const resultsSection = document.getElementById('results-section');
  
  if (!resultContainer) {
    console.error('DC results container not found');
    return;
  }
  
  // Get parameters from sliders
  const vddSlider = document.getElementById('vdd-slider');
  const pmosWidthSlider = document.getElementById('pmos-width-slider');
  const nmosWidthSlider = document.getElementById('nmos-width-slider');
  
  const vdd = parseFloat(vddSlider?.value || 5);
  const pmosWidth = parseFloat(pmosWidthSlider?.value || 2.0);
  const nmosWidth = parseFloat(nmosWidthSlider?.value || 1.0);
  
  // Calculate switching threshold based on the ratio
  const ratio = pmosWidth / nmosWidth;
  let switchingThreshold = vdd / 2;
  
  // Simulate the effect of different Wp/Wn ratio
  if (ratio > 2) {
    switchingThreshold = vdd * (0.5 + 0.05 * Math.log(ratio / 2));
  } else if (ratio < 2) {
    switchingThreshold = vdd * (0.5 - 0.05 * Math.log(2 / ratio));
  }
  
  // Calculate noise margins
  const vil = switchingThreshold * 0.7;
  const vih = switchingThreshold * 1.3;
  const vol = 0.1;
  const voh = vdd - 0.1;
  const nml = vil - vol;
  const nmh = voh - vih;
  
  // Generate HTML for the results
  resultContainer.innerHTML = `
    <h3>DC Analysis Results</h3>
    <div class="plot-container" id="vtc-plot"></div>
    
    <table class="parameter-table">
      <tr>
        <th>Parameter</th>
        <th>Value</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>Switching Threshold (VM)</td>
        <td>${switchingThreshold.toFixed(2)} V</td>
        <td>Input voltage at which output transitions</td>
      </tr>
      <tr>
        <td>Low Input Voltage (VIL)</td>
        <td>${vil.toFixed(2)} V</td>
        <td>Maximum input voltage recognized as logic LOW</td>
      </tr>
      <tr>
        <td>High Input Voltage (VIH)</td>
        <td>${vih.toFixed(2)} V</td>
        <td>Minimum input voltage recognized as logic HIGH</td>
      </tr>
      <tr>
        <td>Low Output Voltage (VOL)</td>
        <td>${vol.toFixed(2)} V</td>
        <td>Output voltage representing logic LOW</td>
      </tr>
      <tr>
        <td>High Output Voltage (VOH)</td>
        <td>${voh.toFixed(2)} V</td>
        <td>Output voltage representing logic HIGH</td>
      </tr>
      <tr>
        <td>Low Noise Margin (NML)</td>
        <td>${nml.toFixed(2)} V</td>
        <td>Immunity to noise for LOW state</td>
      </tr>
      <tr>
        <td>High Noise Margin (NMH)</td>
        <td>${nmh.toFixed(2)} V</td>
        <td>Immunity to noise for HIGH state</td>
      </tr>
    </table>
  `;
  
  // Draw VTC plot using demo data
  drawVTCPlot(vdd, switchingThreshold);
  
  // Show results section
  if (resultsSection) {
    resultsSection.style.display = 'block';
  }
  
  // Add results analysis
  analyzeResults();
}

// Run transient simulation (demo with representative data)
function runTransientSimulation() {
  const resultContainer = document.getElementById('transient-results');
  const resultsSection = document.getElementById('results-section');
  
  if (!resultContainer) {
    console.error('Transient results container not found');
    return;
  }
  
  // Get parameters
  const vddSlider = document.getElementById('vdd-slider');
  const pmosWidthSlider = document.getElementById('pmos-width-slider');
  const nmosWidthSlider = document.getElementById('nmos-width-slider');
  
  const vdd = parseFloat(vddSlider?.value || 5);
  const pmosWidth = parseFloat(pmosWidthSlider?.value || 2.0);
  const nmosWidth = parseFloat(nmosWidthSlider?.value || 1.0);
  
  // Calculate propagation delays based on W/L ratios
  // These are simplified calculations for demonstration
  const ratio = pmosWidth / nmosWidth;
  let tpLH = 2.0; // ns
  let tpHL = 2.0; // ns
  
  // Simulate effect of different ratios
  if (ratio > 2) {
    tpHL = 2.0 * (ratio / 2);
    tpLH = 2.0 / (ratio / 2);
  } else if (ratio < 2) {
    tpHL = 2.0 / (2 / ratio);
    tpLH = 2.0 * (2 / ratio);
  }
  
  // Update SPICE code for transient analysis
  const spiceCodeElement = document.getElementById('spice-code-text');
  if (spiceCodeElement) {
    spiceCodeElement.textContent = getTransientSpiceCode();
  }
  
  // Generate HTML for the results
  resultContainer.innerHTML = `
    <h3>Transient Analysis Results</h3>
    <div class="plot-container" id="transient-plot"></div>
    
    <table class="parameter-table">
      <tr>
        <th>Parameter</th>
        <th>Value</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>Low-to-High Propagation Delay (tPLH)</td>
        <td>${tpLH.toFixed(2)} ns</td>
        <td>Delay when output transitions from LOW to HIGH</td>
      </tr>
      <tr>
        <td>High-to-Low Propagation Delay (tPHL)</td>
        <td>${tpHL.toFixed(2)} ns</td>
        <td>Delay when output transitions from HIGH to LOW</td>
      </tr>
      <tr>
        <td>Average Propagation Delay (tP)</td>
        <td>${((tpLH + tpHL) / 2).toFixed(2)} ns</td>
        <td>Average of tPLH and tPHL</td>
      </tr>
    </table>
  `;
  
  // Draw transient plot using demo data
  drawTransientPlot(vdd);
  
  // Show results section
  if (resultsSection) {
    resultsSection.style.display = 'block';
  }
  
  // Add results analysis
  analyzeResults();
}

// Clear simulation results
function clearSimulationResults() {
  const dcResults = document.getElementById('dc-results');
  const transientResults = document.getElementById('transient-results');
  const resultsSection = document.getElementById('results-section');
  
  if (dcResults) dcResults.innerHTML = '';
  if (transientResults) transientResults.innerHTML = '';
  
  if (resultsSection) {
    resultsSection.style.display = 'none';
  } else {
    console.warn('Results section not found');
  }
}

// Initialize demo plots (placeholder function for when there are no results yet)
function initDemoPlots() {
  // This function could be used to initialize empty plot containers
  // or show placeholder images until real simulation is run
}

// Draw VTC plot using demo data that represents a realistic CMOS inverter characteristic
function drawVTCPlot(vdd, vm) {
  const plotContainer = document.getElementById('vtc-plot');
  if (!plotContainer) {
    console.error('VTC plot container not found');
    return;
  }
  
  // Create VTC plot if Plotly is available
  if (typeof Plotly !== 'undefined') {
    createVTCPlot(vdd, vm);
  } else {
    console.error('Plotly library not loaded');
    plotContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Error: Plotting library not available.</p>';
  }
}

// Create VTC plot with Plotly
function createVTCPlot(vdd, vm) {
  // Generate data points for a realistic VTC curve
  const xValues = [];
  const yValues = [];
  
  for (let x = 0; x <= vdd; x += 0.01) {
    xValues.push(x);
    
    // Generate an S-shaped curve centered at vm
    let y;
    if (x < vm - 0.8) {
      y = vdd;
    } else if (x > vm + 0.8) {
      y = 0;
    } else {
      // Create a smooth transition in the middle
      const k = 5; // Steepness factor
      y = vdd / (1 + Math.exp(k * (x - vm)));
    }
    
    yValues.push(y);
  }
  
  const data = [{
    x: xValues,
    y: yValues,
    mode: 'lines',
    name: 'VTC',
    line: {
      color: 'blue',
      width: 2
    }
  }, {
    // Add a point at the switching threshold
    x: [vm],
    y: [vdd / 2],
    mode: 'markers',
    name: 'VM',
    marker: {
      color: 'red',
      size: 8
    }
  }];
  
  const layout = {
    title: {
      text: 'Voltage Transfer Characteristic (VTC)',
      font: {
        size: 14
      }
    },
    xaxis: {
      title: 'Input Voltage (V)',
      range: [0, vdd],
      showgrid: true,
      gridcolor: '#ddd',
      zerolinecolor: '#999'
    },
    yaxis: {
      title: 'Output Voltage (V)',
      range: [0, vdd],
      showgrid: true,
      gridcolor: '#ddd',
      zerolinecolor: '#999'
    },
    margin: {
      l: 50,
      r: 20,
      t: 40,
      b: 50
    },
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      orientation: 'h'
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('vtc-plot', data, layout, config);
}

// Draw transient plot using demo data
function drawTransientPlot(vdd) {
  const plotContainer = document.getElementById('transient-plot');
  if (!plotContainer) {
    console.error('Transient plot container not found');
    return;
  }
  
  // Create transient plot if Plotly is available
  if (typeof Plotly !== 'undefined') {
    createTransientPlot(vdd);
  } else {
    console.error('Plotly library not loaded');
    plotContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Error: Plotting library not available.</p>';
  }
}

// Create transient plot with Plotly
function createTransientPlot(vdd) {
  // Generate time points
  const timePoints = [];
  for (let t = 0; t <= 100; t += 0.1) {
    timePoints.push(t);
  }
  
  // Generate input waveform (square wave)
  const inputVoltage = [];
  for (let t of timePoints) {
    if ((Math.floor(t / 20) % 2) === 0) {
      inputVoltage.push(0);
    } else {
      inputVoltage.push(vdd);
    }
  }
  
  // Generate output waveform (inverted with delay)
  const outputVoltage = [];
  let lastInputState = inputVoltage[0];
  let transitionTime = -100;
  
  for (let i = 0; i < timePoints.length; i++) {
    const t = timePoints[i];
    const currentInput = inputVoltage[i];
    
    if (currentInput !== lastInputState) {
      transitionTime = t;
      lastInputState = currentInput;
    }
    
    if (currentInput === 0) {
      if (t < transitionTime + 2) {
        outputVoltage.push(outputVoltage.length > 0 ? outputVoltage[outputVoltage.length - 1] : 0);
      } else if (t < transitionTime + 5) {
        const progress = (t - (transitionTime + 2)) / 3;
        outputVoltage.push(vdd * progress);
      } else {
        outputVoltage.push(vdd);
      }
    } else {
      if (t < transitionTime + 1.5) {
        outputVoltage.push(outputVoltage.length > 0 ? outputVoltage[outputVoltage.length - 1] : vdd);
      } else if (t < transitionTime + 4.5) {
        const progress = (t - (transitionTime + 1.5)) / 3;
        outputVoltage.push(vdd * (1 - progress));
      } else {
        outputVoltage.push(0);
      }
    }
  }
  
  const data = [{
    x: timePoints,
    y: inputVoltage,
    mode: 'lines',
    name: 'Input',
    line: {
      color: 'blue',
      width: 2
    }
  }, {
    x: timePoints,
    y: outputVoltage,
    mode: 'lines',
    name: 'Output',
    line: {
      color: 'red',
      width: 2
    }
  }];
  
  const layout = {
    title: {
      text: 'Transient Response',
      font: {
        size: 14
      }
    },
    xaxis: {
      title: 'Time (ns)',
      range: [0, 80],
      showgrid: true,
      gridcolor: '#ddd',
      zerolinecolor: '#999'
    },
    yaxis: {
      title: 'Voltage (V)',
      range: [0, vdd],
      showgrid: true,
      gridcolor: '#ddd',
      zerolinecolor: '#999'
    },
    margin: {
      l: 50,
      r: 20,
      t: 40,
      b: 50
    },
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      orientation: 'h'
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('transient-plot', data, layout, config);
}

// Add window resize handler
window.addEventListener('resize', function() {
  // Redraw all active plots
  const vtcPlot = document.getElementById('vtc-plot');
  const transientPlot = document.getElementById('transient-plot');
  
  if (vtcPlot && vtcPlot.querySelector('.js-plotly-plot')) {
    Plotly.Plots.resize(vtcPlot);
  }
  
  if (transientPlot && transientPlot.querySelector('.js-plotly-plot')) {
    Plotly.Plots.resize(transientPlot);
  }
});

// Parameter validation and feedback
function validateParameters() {
  const vdd = parseFloat(document.getElementById('vdd-slider').value);
  const pmosWidth = parseFloat(document.getElementById('pmos-width-slider').value);
  const nmosWidth = parseFloat(document.getElementById('nmos-width-slider').value);
  const mosfetLength = parseFloat(document.getElementById('mosfet-length-slider').value);
  
  const feedback = document.getElementById('parameter-feedback');
  let messages = [];
  let status = 'success';
  
  // Check VDD range
  if (vdd < 1.8) {
    messages.push('Warning: VDD below 1.8V may cause unreliable operation');
    status = 'warning';
  } else if (vdd > 3.3) {
    messages.push('Warning: VDD above 3.3V may exceed transistor ratings');
    status = 'warning';
  }
  
  // Check W/L ratios
  const pmosRatio = pmosWidth / mosfetLength;
  const nmosRatio = nmosWidth / mosfetLength;
  
  if (pmosRatio < 2) {
    messages.push('PMOS W/L ratio is too small, may cause slow rise time');
    status = 'warning';
  }
  
  if (nmosRatio < 1) {
    messages.push('NMOS W/L ratio is too small, may cause slow fall time');
    status = 'warning';
  }
  
  // Check symmetry
  const widthRatio = pmosWidth / nmosWidth;
  if (widthRatio < 1.5 || widthRatio > 2.5) {
    messages.push('PMOS/NMOS width ratio should be around 2:1 for symmetrical operation');
    status = 'warning';
  }
  
  // Check minimum length
  if (mosfetLength < 0.18) {
    messages.push('Warning: Channel length below 0.18μm may cause short-channel effects');
    status = 'warning';
  }
  
  // Display feedback
  if (messages.length > 0) {
    feedback.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
    feedback.className = `parameter-feedback ${status}`;
  } else {
    feedback.innerHTML = '<p>Parameters are within recommended ranges.</p>';
    feedback.className = 'parameter-feedback success';
  }
}

// SPICE code validation
function validateSpiceCode() {
  const spiceCode = document.getElementById('spice-code-text').textContent;
  const feedback = document.getElementById('spice-feedback');
  let messages = [];
  let status = 'success';
  
  // Helper function to check if a line contains a specific pattern
  const hasLine = (pattern) => {
    return spiceCode.split('\n').some(line => line.trim().match(pattern));
  };
  
  // Helper function to extract parameter value
  const getParameterValue = (line, param) => {
    // Handle both DC and W/L parameters
    if (param === 'DC') {
      const match = line.match(/DC\s+([\d.]+)V?/);
      return match ? parseFloat(match[1]) : null;
    } else {
      const match = line.match(new RegExp(`${param}=([\\d.]+)u?`));
      return match ? parseFloat(match[1]) : null;
    }
  };
  
  // Check for required components and their parameters
  const lines = spiceCode.split('\n');
  
  // Check VDD definition
  const vddLine = lines.find(line => line.includes('VDD') && line.includes('DC'));
  if (!vddLine) {
    messages.push('Error: Missing or incorrect VDD power supply definition');
    status = 'error';
  } else {
    const vddValue = getParameterValue(vddLine, 'DC');
    if (vddValue === null) {
      messages.push('Error: VDD value must be a valid number');
      status = 'error';
    } else if (vddValue <= 0) {
      messages.push('Error: VDD value must be a positive number');
      status = 'error';
    }
  }
  
  // Check input voltage source
  const vinLine = lines.find(line => line.includes('VIN') && line.includes('DC'));
  if (!vinLine) {
    messages.push('Error: Missing or incorrect input voltage source (VIN)');
    status = 'error';
  }
  
  // Check PMOS transistor
  const pmosLine = lines.find(line => line.includes('M1') && line.includes('PMOS'));
  if (!pmosLine) {
    messages.push('Error: Missing or incorrect PMOS transistor (M1) definition');
    status = 'error';
  } else {
    const pmosW = getParameterValue(pmosLine, 'W');
    const pmosL = getParameterValue(pmosLine, 'L');
    if (pmosW === null || pmosL === null) {
      messages.push('Error: PMOS transistor must have W and L parameters');
      status = 'error';
    }
  }
  
  // Check NMOS transistor
  const nmosLine = lines.find(line => line.includes('M2') && line.includes('NMOS'));
  if (!nmosLine) {
    messages.push('Error: Missing or incorrect NMOS transistor (M2) definition');
    status = 'error';
  } else {
    const nmosW = getParameterValue(nmosLine, 'W');
    const nmosL = getParameterValue(nmosLine, 'L');
    if (nmosW === null || nmosL === null) {
      messages.push('Error: NMOS transistor must have W and L parameters');
      status = 'error';
    }
  }
  
  // Check MOSFET models
  const hasNmosModel = hasLine(/\.MODEL\s+NMOS\s+NMOS/);
  const hasPmosModel = hasLine(/\.MODEL\s+PMOS\s+PMOS/);
  
  if (!hasNmosModel) {
    messages.push('Error: Missing NMOS model definition');
    status = 'error';
  }
  if (!hasPmosModel) {
    messages.push('Error: Missing PMOS model definition');
    status = 'error';
  }
  
  // Check analysis commands
  const hasDCAnalysis = hasLine(/\.DC\s+VIN/);
  const hasTransientAnalysis = hasLine(/\.TRAN\s+/);
  
  if (!hasDCAnalysis && !hasTransientAnalysis) {
    messages.push('Error: Missing analysis command (.DC or .TRAN)');
    status = 'error';
  }
  
  // Check print commands
  const hasPrintCommand = hasLine(/\.PRINT\s+(DC|TRAN)/);
  if (!hasPrintCommand) {
    messages.push('Error: Missing .PRINT command for output variables');
    status = 'error';
  }
  
  // Check for .END statement
  if (!spiceCode.trim().endsWith('.END')) {
    messages.push('Error: Missing .END statement');
    status = 'error';
  }
  
  // Display feedback
  if (messages.length > 0) {
    feedback.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
    feedback.className = `spice-feedback ${status}`;
  } else {
    feedback.innerHTML = '<p>SPICE code is valid and contains all required components.</p>';
    feedback.className = 'spice-feedback success';
  }
}

// Results analysis and feedback
function analyzeResults() {
  const feedback = document.getElementById('results-feedback');
  const vdd = parseFloat(document.getElementById('vdd-slider').value);
  const pmosWidth = parseFloat(document.getElementById('pmos-width-slider').value);
  const nmosWidth = parseFloat(document.getElementById('nmos-width-slider').value);
  
  let messages = [];
  let status = 'success';
  
  // Analyze VTC characteristics
  const ratio = pmosWidth / nmosWidth;
  if (ratio < 1.5 || ratio > 2.5) {
    messages.push('The VTC curve shows asymmetry due to non-optimal Wp/Wn ratio');
    status = 'warning';
  }
  
  // Analyze propagation delays
  if (pmosWidth < 1.5) {
    messages.push('Rise time is slow due to small PMOS width');
    status = 'warning';
  }
  
  if (nmosWidth < 0.8) {
    messages.push('Fall time is slow due to small NMOS width');
    status = 'warning';
  }
  
  // Display feedback
  if (messages.length > 0) {
    feedback.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
    feedback.className = `results-feedback ${status}`;
  } else {
    feedback.innerHTML = '<p>Results show good performance characteristics.</p>';
    feedback.className = 'results-feedback success';
  }
}
