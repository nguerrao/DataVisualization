function industry() {
  // set the dimensions and margins of the graph
  const margin = {top: 50, right: 30, bottom: 40, left: 50},
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
  const svg = d3.select("#industryviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom )
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
  d3.csv("data/industry.csv", function(data) {

    // List of groups = header of the csv files
    const keys = data.columns.slice(1)

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 35 )
        .attr("font-family", "Helvetica")
        .attr("font-weight", "bold")
        .text("Year");

    // Add X axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 12])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));
    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+15)
        .attr("x", -margin.top+100)
        .text("Total emissions (in billion of tons of CO2)")
        .attr("font-family", "Helvetica")
        .attr("font-weight", "bold")

    // color palette
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeBrBG[8]);

    const stackedData = d3.stack()
        .keys(keys)
        (data)

    // create a tooltip
    let tip = d3.tip().attr('class', 'd3-tip industryTooltip').html((i) => {
      return `<span class='details'>${(keys[i])}</span>`
    });
    svg.call(tip);

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function() {
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
    }
    const mousemove = function(d,i) {
      tip.show(i);
    }
    const mouseleave = function(d,i) {
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");
      tip.hide(i);
    }

    // Area generator
    const area = d3.area()
        .x(function(d) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

    // Show the areas
    svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
  })
}
