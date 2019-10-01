var svgWidth = 960;
var svgHeight = 500;
var margin = { top: 20, right: 40, bottom: 100, left: 120 };
var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
var chart = svg.append("g")
    .attr("transform", "translate(${margin.left}, ${margin.top}))");
//Import data
d3.csv("assets/data/data.csv"
        .then(function(healthData) {
            healthData.forEach(function(data) {
                data.poverty = +data.poverty;
                data.healthcare = +data.healthcare;
            });


            // Create scale functions
            var yLinearScale = d3.scaleLinear().range([height, 0]);
            var xLinearScale = d3.scaleLinear().range([0, width]);

            // Create axis functions
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);


            // append an SVG group for x-axis and display x-axis
            chart.append("g")
                .attr("transform", `translate(0, ${height})`)
                //  .attr("class", "x-axis")
                .call(bottomAxis);

            // append a group for y-axis and display y-axis
            chart.append("g")
                .call(leftAxis);
            //text inside circles
            var textGroup = chart.append("text")
                .style("text-anchor", "middle")
                .selectAll(tspan)
                .data(healthData)
                .enter()
                .append("tspan")
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("r", 12)
                .text(d => d.abrr);

            // Circles
            var circles = chart.selectAll("circles")
                .data(healthData)
                .enter()
                .append("circles")
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("r", 15)
                .attr("fill", "white")
                .attr("opacity", ".5");

            // Tool tip
            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([80, -60])
                .html(function(d) {
                    return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
                });​
            // Create tooltip in the chart
            chart.call(toolTip);​
            // Event listeners 
            circles.on("click", function(data) {
                    toolTip.show(data, this);
                })
                // onmouseout event
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);
                });​
            // Create axes labels
            chart.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Lacks Healthcare (%)");​
            chart.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .text("In poverty (%)");
        });