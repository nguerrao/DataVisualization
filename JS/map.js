function displayMap() {
  // The map was inspired by the following code:
  // http://bl.ocks.org/micahstubbs/535e57a3a2954a129c13701fe61c681d
  // We then added all the additional functionalities (click, slider) to make it
  // interactive

  let currentCountryHTML, currentCountryID, svg_barChart, y_barChart, yaxis_barChart, stackedData, prev_height,
  totalEmissionPerSector;

  d3.json("data/world_countries.json", function(error1, map_data) {
    d3.json("data/emissions_full_dataset.json", function(error2, emissions_data) {

      let nameById = {}

      map_data.features.map(x => {
        nameById[x.id] = x.properties.name
      })

      const format = d3.format(',');

      const margin = {top: 0, right: 0, bottom: 0, left: 0};
      const width = 1000 - margin.left - margin.right;
      const height = 550 - margin.top - margin.bottom;

      // -------------- choropleth map --------------

      const svg = d3.select('#worldmap')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('class', 'map');


      const projection = d3.geoRobinson()
      .scale(180)
      .rotate([352, 0, 0])
      .translate( [width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      currentCountryHTML = "";
      currentCountryID = "";

      const color = d3.scaleThreshold()
      .domain([
        -0.01,
        0,
        50,
        150,
        300,
        600,
        900,
        1200,
        2400,
        3600,
        5000
      ])
      .range([
        'rgb(82, 183, 136)',
        'rgb(255, 255, 255)',
        'rgb(252, 225, 225)',
        'rgb(249, 195, 195)',
        'rgb(245, 162, 162)',
        'rgb(242, 132, 132)',
        'rgb(240, 101, 101)',
        'rgb(237, 75, 75)',
        'rgb(238, 41, 41)',
        'rgb(202, 11, 11)',
        'rgb(130, 0, 0)'
      ]);

      // legend with the color

      const legendElement = legend({
        color: color,
        title: "Emissions MtCO2e",
        tickSize: 0
      })
      // and then append to some element
      document.querySelector("#colorLegend").append(legendElement);

      // -------------- Bar Chart for sectors data --------------

      // append the svg object to the body of the page
      // set the dimensions and margins of the graph
      var margin_barChart = {top: 20, right: 50, bottom: 20, left: 50},
      width_barChart = 200 - margin_barChart.left - margin_barChart.right,
      height_barChart = 480 - margin_barChart.top - margin_barChart.bottom;

      svg_barChart = d3.select(".mapLeft").select("#sectorChart")
      .append("svg")
      .attr("width", width_barChart + margin_barChart.left + margin_barChart.right)
      .attr("height", height_barChart + margin_barChart.top + margin_barChart.bottom)
      .append("g")
      .attr("transform", "translate(" + margin_barChart.left + "," + margin_barChart.top + ")")
      .attr("class", "barChart");

      // Add Y axis
      y_barChart = d3.scaleLinear()
      .domain([0, 100])
      .range([width_barChart, 0]);

      yaxis_barChart = svg_barChart.append("g")
      yaxis_barChart.call(d3.axisLeft(y_barChart));

      // legend for the bar chart

      // select the svg area
      var legendsBarChart = d3.select("#sectorLegend").append("svg").attr("height", 300).attr("width", 450)

      // create a list of keys
      var keys = ["Energy", "Industry", "Transportation", "Other", "Agriculture"]

      var colors = ['#fca311', '#495057', '#023e8a', '#abc4ff', '#4daf4a']

      // Add one dot in the legend for each name.
      var size = 20
      const xPos = keys.map(function (d, i) {
        if (d == "Energy") return 45
        if (d == "Industry") return 110
        if (d == "Transportation") return 200
        if (d == "Other") return 285
        if (d == "Agriculture") return 355
        return 50 + i*(size+60)})
      legendsBarChart.selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", function(d,i) { return xPos[i]})
      .attr("y", 10) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d,i){ return colors[i]})

      // Add one text in the legend for each name.
      legendsBarChart.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", function(d,i) {
        if (d == "Agriculture") return xPos[i] - 28
        if (d == "Industry") return xPos[i] - 18
        if (d == "Energy") return xPos[i] - 15
        if (d == "Transportation") return xPos[i] - 40
        if (d == "Other") return xPos[i] - 11
        })
      .attr("y", 10 + size * 2) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", "black")
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .attr("font-family", "Helvetica")
      .style("alignment-baseline", "middle")

      // -------------- Slider to select the year --------------

      var dataTime = d3.range(0, 28, 3).map(function (d) {
        return new Date(1990 + d, 10, 3);
      });

      var sliderTime = d3
          .sliderHorizontal()
          .min(d3.min(dataTime))
          .max(d3.max(dataTime))
          .step(1000 * 60 * 60 * 24 * 365)
          .width(350)
          .tickFormat(d3.timeFormat('%Y'))
          .tickValues(dataTime)
          .default(new Date(2017, 10, 3))
          .on('end', (val) => {
            d3.select('#value-time').text(d3.timeFormat('%Y')(val));
            const year = d3.timeFormat('%Y')(val)
            ready(year)
          });

      var gTime = d3.select('div#slider-time')
          .append('svg')
          .attr('width', 400)
          .attr('height', 100)
          .append('g')
          .attr('transform', 'translate(30,30)');

      gTime.call(sliderTime);

      d3.select('#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));


      ready("2017")

      ready("2017")

      function ready(year) {

        if (currentCountryID != "") {
          drawBarChart(year, nameById[currentCountryID], emissions_data[currentCountryID][year])
          updateBar(year, nameById[currentCountryID], emissions_data[currentCountryID][year])
        }
        else {
          drawBarChart(year, "World", emissions_data["WOR"][year])
          updateBar(year, "World", emissions_data["WOR"][year])
        }


        map_data.features.forEach(d => {
          const countryData = emissions_data[d.id]
          if (countryData != null) {
            var total = countryData[year]["total"]
            d.emissions = total
          }});

          svg.append('g')
          .attr('class', 'countries')
          .selectAll('path')
          .data(map_data.features)
          .enter().append('path')
          .attr('d', path)
          .style('fill', d => {
            if (d.emissions == null) {
              return "grey"
            }
            else {
              return color(emissions_data[d.id][year].total)
            }

          })
          .style('stroke', 'black')
          .style('opacity', 1)
          .style('stroke-width', function (d) {
            if (currentCountryID == d.id)
            {return 3}
            else
            {return 0.3}
          })
          // tooltips
          .on('mouseover',function(d){
            tip.show(d);
            d3.select(this)
            .style('opacity', 0.8)
          })
          .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
            .style('opacity', 1)
          })
          .on('click', function(d) {
            if (event.defaultPrevented) return;
            tip.show(d);

            if (currentCountryID == d.id) {
              currentCountryHTML.style('stroke-width', 0.3)
              d3.select(this).style('stroke-width', 0.3)
              currentCountryHTML = ""
              currentCountryID = ""

              updateBar(year, "World", emissions_data["WOR"][year])
              return;
            }

            else if (currentCountryID != "") {
              currentCountryHTML.style('stroke-width', 0.3)
              currentCountryHTML = d3.select(this)
              currentCountryID = d.id
              currentCountryHTML.style('stroke-width', 3)
              .style('stroke', "black");

              if (emissions_data[currentCountryID])
              updateBar(year, nameById[currentCountryID], emissions_data[currentCountryID][year])
              else updateBar(year, "World", emissions_data["WOR"][year])
            }


            if (currentCountryID == "") {
              currentCountryHTML = d3.select(this)
              currentCountryHTML.style('stroke-width', 3)
              .style('stroke', "black");
              currentCountryID = d.id
              if (emissions_data[currentCountryID])
              updateBar(year, nameById[currentCountryID], emissions_data[currentCountryID][year])
              else updateBar(year, "World", emissions_data["WOR"][year])
            }

            if (currentCountryID != "") {
              if (emissions_data[currentCountryID])
              updateBar(year, nameById[currentCountryID], emissions_data[currentCountryID][year])
              else updateBar(year, "World", emissions_data["WOR"][year])
            }
          });
          // Set tooltips
          const tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(d => {
            if (d.emissions != null) {
              return `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Emissions: </strong><span class='details'>${format(d.emissions)} MtCO<sub>2</sub>e</span>`
            }
            else {
              return `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Emissions: </strong><span class='details'>not available</span>`
            }
          });

          svg.call(tip);

          svg.append('path')
          .datum(topojson.mesh(map_data.features, (a, b) => a.id !== b.id))
          .attr('class', 'names')
          .attr('d', path);

        }
      });
    });

    function updateBar(year, countryName, countryData) {

      document.getElementById("countryName").innerHTML = countryName
      document.getElementById("countryEmission").innerHTML = countryData.total.toFixed(2) + " MtCO<sub>2</sub>e"

      let margin = {top: 50, right: 50, bottom: 50, left: 50},
      height = 500 - margin.top - margin.bottom;

      let total = countryData.total

      let lowerRange = 0
      let upperRange = 100

      if (total < 0) {
        total = -total
      }

      const energy_per = countryData.energy / total * 100
      const industry_per = countryData.industry / total * 100
      let agriculture_per = countryData.agriculture / total * 100
      const transport_per = countryData.transport / total * 100
      const other_per = countryData.other / total * 100

      if (agriculture_per < 0) {
        lowerRange = agriculture_per
        agriculture_per = -agriculture_per
        upperRange = energy_per + industry_per + transport_per + other_per
      }


      stackedData = [agriculture_per,
        other_per,
        transport_per,
        industry_per,
        energy_per].reverse()

        totalEmissionPerSector = [
          countryData.agriculture,
          countryData.other,
          countryData.transport,
          countryData.industry,
          countryData.energy
        ].reverse()

        prev_height = [0,
          stackedData[0],
          stackedData[0] +  stackedData[1],
          stackedData[0] +  stackedData[1] +  stackedData[2],
          stackedData[0] +  stackedData[1] +  stackedData[2] + stackedData[3],
          stackedData[0] +  stackedData[1] +  stackedData[2] + stackedData[3] + stackedData[4]
        ];

        y_barChart = d3.scaleLinear()
        .domain([lowerRange, upperRange])
        .range([height, 0])
        yaxis_barChart.call(d3.axisLeft(y_barChart));

        //Update all rects
        svg_barChart.selectAll("rect")
        .data(stackedData)
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .attr('height', function(d){
          return height - y_barChart(d + lowerRange);})
          .attr('y',function(d, i){
            return height - y_barChart(prev_height[i] + lowerRange); })
          }


    function drawBarChart(year, countryName, countryData) {


      // append the svg object to the body of the page
      // set the dimensions and margins of the graph
      let margin = {top: 50, right: 0, bottom: 50, left: 50},
      width = 300 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


      const total = countryData.total
      const energy_per = countryData.energy / total * 100
      const industry_per = countryData.industry / total * 100
      const agriculture_per = countryData.agriculture / total * 100
      const transport_per = countryData.transport / total * 100
      const other_per = countryData.other / total * 100

      totalEmissionPerSector = [
        countryData.agriculture,
        countryData.other,
        countryData.transport,
        countryData.industry,
        countryData.energy
      ].reverse()

      stackedData = [agriculture_per,
        other_per,
        transport_per,
        industry_per,
        energy_per].reverse()

        prev_height = [0,
          stackedData[0],
          stackedData[0] +  stackedData[1],
          stackedData[0] +  stackedData[1] +  stackedData[2],
          stackedData[0] +  stackedData[1] +  stackedData[2] + stackedData[3],
          stackedData[0] +  stackedData[1] +  stackedData[2] + stackedData[3] + stackedData[4]
        ];


        let colors = ['#4daf4a', '#abc4ff', '#023e8a', '#495057', '#fca311'].reverse()

        y_barChart = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])
        yaxis_barChart.call(d3.axisLeft(y_barChart));

        // create a tooltip
        let Tooltip = d3.select(".mapLeft").select("#sectorChart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "d3-tip")
        .style("width", "150px")
        .style("background-color", "white")

        let rects = svg_barChart.selectAll("rect").data(stackedData)

        rects
        .enter()
        .append('rect')
        .attr('height', function(d){
          return height - y_barChart(d);})
          .attr('y',function(d, i){
            return height - y_barChart(prev_height[i]); })
            .attr('fill', function(d, i){ return colors[i]; })
            .attr('x', 5)
            .attr("width", width / 4)
            .on("mouseover", function() {
              Tooltip
              .style("opacity", 1)
              d3.select(this)
              .style("stroke", "black")
              .style("opacity", 0.8); })
              .on("mouseout", function() {
                Tooltip
                .style("opacity", 0)
                d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1) })
                .on("mousemove", function(d, i) {
                  Tooltip
                  .html("<span class='details'>" + d.toFixed(2) + " %<br>" + totalEmissionPerSector[i].toFixed(2) + " MtCO<sub>2</sub>e</span>")
                  .style("top", (d3.event.pageY) + "px")
                  .style("left", (d3.event.pageX)+"px")
                });
              }
                  }


// function used to draw the legend of the map
// taken from https://observablehq.com/@d3/color-legend
function legend({
  color,
  title,
  tickSize = 6,
  width = 320,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .style("overflow", "visible")
  .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
    .attr("x", marginLeft)
    .attr("y", marginTop)
    .attr("width", width - marginLeft - marginRight)
    .attr("height", height - marginTop - marginBottom)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
    .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
    {range() { return [marginLeft, width - marginRight]; }});

    svg.append("image")
    .attr("x", marginLeft)
    .attr("y", marginTop)
    .attr("width", width - marginLeft - marginRight)
    .attr("height", height - marginTop - marginBottom)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
    = color.thresholds ? color.thresholds() // scaleQuantize
    : color.quantiles ? color.quantiles() // scaleQuantile
    : color.domain(); // scaleThreshold

    const thresholdFormat
    = tickFormat === undefined ? d => d
    : typeof tickFormat === "string" ? d3.format(tickFormat)
    : tickFormat;

    x = d3.scaleLinear()
    .domain([-1, color.range().length - 1])
    .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
    .selectAll("rect")
    .data(color.range())
    .enter().append('rect')
    .attr("x", (d, i) => x(i - 1))
    .attr("y", marginTop)
    .attr("width", (d, i) => x(i) - x(i - 1))
    .attr("height", height - marginTop - marginBottom)
    .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
    .domain(color.domain())
    .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
    .selectAll("rect")
    .data(color.domain())
    .join("rect")
    .attr("x", x)
    .attr("y", marginTop)
    .attr("width", Math.max(0, x.bandwidth() - 1))
    .attr("height", height - marginTop - marginBottom)
    .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x)
  .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
  .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
  .tickSize(tickSize)
  .tickValues(tickValues))
  .call(tickAdjust)
  .call(g => g.select(".domain").remove())
  .call(g => g.append("text")
  .attr("x", marginLeft)
  .attr("y", marginTop + marginBottom - height - 6)
  .attr("fill", "currentColor")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text(title));

  return svg.node();
}
