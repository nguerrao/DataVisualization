function energy_ridgeline(country) {
    // This file is not used by the site currently. We decided to take it out as it cluttered the energy graph too much
    // set the dimensions and margins of the graph
    var margin = {
            top: 70,
            right: 10,
            bottom: 50,
            left: 70,
        },
        width = 560 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let overlap = 0.8;

    d3.select("#energyRidgeline").html('');
    // append the svg object to the body of the page
    var svg = d3.select("#energyRidgeline")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(country);

    let x = function(d) { return d.year; },
        xScale = d3.scaleLinear().range([0, width]),
        xValue = function(d) { return xScale(x(d)); },
        xAxis = d3.axisBottom(xScale);

    const y = function(d) { return d.value; },
        yScale = d3.scaleLinear(),
        yValue = function(d) { return yScale(y(d)); };

    let src = function(d) { return d.key; },
        srcScale = d3.scaleBand().range([0, height]),
        srcValue = function(d) { return srcScale(src(d)); },
        srcAxis = d3.axisLeft(srcScale);

    let area = d3.area()
        .x(xValue)
        .y1(yValue);

    let line = area.lineY1();


    //read data
    d3.csv("JS/electricity_emissions.csv", function (data) {
        data = data.filter(function (object) {
            return object.Entity == country;
        });
        // Get the different categories and count them
        var categories = ["coal", "oil", "gas", "nuclear", "solar", "hydro", "wind", "other renewables"];
        var n = categories.length;

        let years = data.map(d => d['Year']);
        const coal = data.map (d => (d['coal'] !== "" ? d['coal'] : "0")),
        oil = data.map (d => (d['oil'] !== "" ? d['oil'] : "0")),
        gas = data.map (d => (d['gas'] !== "" ? d['gas'] : "0")),
        nuclear = data.map (d => (d['nuclear'] !== "" ? d['nuclear'] : "0")),
        solar = data.map (d => (d['solar'] !== "" ? d['solar'] : "0")),
        hydro = data.map (d => (d['hydro'] !== "" ? d['hydro'] : "0")),
        wind = data.map (d => (d['wind'] !== "" ? d['wind'] : "0")),
        other = data.map (d => (d['other renewables'] !== "" ? d['other renewables'] : "0"));
        let sourceArray = [coal, oil, gas, nuclear, solar, hydro, wind, other];

        let dataFlat = []
        categories.map((source, idx) => {
             years.map((year, id) => {
                dataFlat.push({
                    source: source,
                    year: parseInt(year),
                    value: parseFloat(sourceArray[idx][id]),
                });
            })
        })

        data = d3.nest()
            .key(function(d) { return d.source; })
            .entries(dataFlat);

        xScale.domain(d3.extent(dataFlat, x));

        srcScale.domain(data.map(function(d) { return d.key; }));

        let areaChartHeight = (1 + overlap) * (height / srcScale.domain().length);

        yScale.domain(d3.extent(dataFlat, y)).range([areaChartHeight, 0]);

        area.y0(yScale(0));

        svg.append('g').attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g').attr('class', 'axis axis--activity')
            .call(srcAxis);

        let gSrc = svg.append('g').attr('class', 'activities')
            .selectAll('.activity').data(data)
            .enter().append('g')
            .attr('class', function(d) { return 'activity activity--' + d.key; })
            .attr('transform', function(d) {
                let ty = srcValue(d) - srcScale.bandwidth() + 5;
                return 'translate(0,' + ty + ')';
            });

        const color = ["#a31621", "#FF890A", "#FCBF49", "#A6994F", "#4C7F4F", "#488B49", "#4AAD52", "#034732"];

        gSrc.append('path').attr('class', 'area')
            .datum(function(d) { return d.values; })
            .style('fill', function(d,idx) {return color[idx]})
            .attr('d', area);

        gSrc.append('path').attr('class', 'line')
            .datum(function(d) { return d.values; })
            .attr('d', line);
    });
}
