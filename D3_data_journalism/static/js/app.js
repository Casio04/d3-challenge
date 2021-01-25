// Define SVG area
let svgWidth = 1000;
let svgHeight = 600;

// Define margins for each side
let margin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 100
}

// Define the area where the plot is going to be inside the SVG
let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom

// Create the SVG tag and append the element, using the values defined before
let svg = d3
.select("#chart")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight)

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Import Data
d3.csv("resources/data.csv").then(function(data){
  data.forEach(function(d){
    d.poverty = +d.poverty
    d.healthcare = +d.healthcare
    
  })
  // Create scale functions to have domain and range for both X and Y axes
  // The -1 increases the axis by 1 unit so the first circle is not so close to the Axis and it looks better
  let xLinearScale = d3.scaleLinear()
  .domain(d3.extent([d3.min(data, d=>d.poverty) -1 ,d3.max(data, d=> d.poverty)])).nice()
  .range([0, width])

  let yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(data, d=>d.healthcare) + 2])
  .range([height, 0])
    
  // Create axes functions - defining ticks of x Axis to be the half of the difference
  // between max and min in data
  let xAxis = d3.axisBottom(xLinearScale).ticks((d3.max(data, d=> d.poverty) -d3.min(data, d=>d.poverty)) / 2 )
  let yAxis = d3.axisLeft(yLinearScale)

  // append axes to the chart
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis)

  chartGroup.append("g")
  .call(yAxis)

  // Create circles
  let circles = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d=> yLinearScale(d.healthcare))
  .attr("r", "12")
  .attr("fill", "#000066")
  .attr("opacity", ".8")

  // Create text tags inside circles
  let text = chartGroup.append("text")
  .selectAll("tspan")
  .style("font-family", "Sans-serif")
  .data(data)
  .enter()
  .append("tspan")
  .attr("x", d => xLinearScale(d.poverty - 0.12))
  .attr("y", d => yLinearScale(d.healthcare - 0.20))
  .attr("font-size", "10")
  .attr("fill","white")
  .text(d=> d.abbr)

  // Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healtchare (%)")

  chartGroup.append("text")
  .attr("transform", `translate(${width /2.3}, ${height + margin.top + 20})`)
  .attr("class", "axisText")
  .text("In poverty (%)");
})

