var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([29, d3.max(healthData, d => d.age) + 2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.smokes) + 1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br> Age (Median): ${d.age}<br>Smokers(%): ${d.smokes}`);
      });

    // Step 6: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    
  // Step 5: Create Circles
    // ==============================
    var circleGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
    //creates the circles
    circleGroup
      .append("circle")
      .attr("cx", d => xLinearScale(d.age))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "13")
      .attr("fill", "darkcyan")
      .attr("opacity", ".5");
    //creates text and event listener for tooltip
    circleGroup
      .append("text")
      .attr("font-size", "13px")
      .attr("font-weight", "700")
      .attr("fill", "white")
      .attr("x", d => xLinearScale(d.age) - 9)
      .attr("y", d => yLinearScale(d.smokes) + 7)
      .text(function(d) {
        return d.abbr;})
      .on("mouseover", function(data) {
        toolTip.show(data, this);
      })
      .on("mouseout", toolTip.hide);
    

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Smokers (%)");


    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Age (Median)");
  }).catch(function(error) {
    console.log(error);
  });
