function displayAgriculturePlot() {
  // The code for this visualization was taken from https://github.com/vlandham/bubble_chart_v4
  // We added a new dataset, pictures for each bubble and changed the position of elements when grouped by food type

const dataset = {
    "children": [
 {'Food': 'Beef (beef herd)', 'Emissions': 59.6, 'Group': 'Meat', 'Image':'beef.png'},
 {'Food': 'Lamb & Mutton', 'Emissions': 24.5, 'Group': 'Meat', 'Image':'lamb.png'},
 {'Food': 'Cheese', 'Emissions': 21.2, 'Group': 'Dairy', 'Image':'cheese.png'},
 {'Food': 'Beef (dairy herd)', 'Emissions': 21.1, 'Group': 'Meat', 'Image':'beef.png'},
 {'Food': 'Chocolate', 'Emissions': 18.7, 'Group': 'Dairy', 'Image':'dark-chocolate.png'},
 {'Food': 'Coffee', 'Emissions': 16.5, 'Group': 'Plant', 'Image':'coffee-beans.png'},
 {'Food': 'Shrimps farmed', 'Emissions': 11.8, 'Group': 'Fish', 'Image':'shrimp.png'},
 {'Food': 'Palm Oil', 'Emissions': 7.6, 'Group': 'Oil', 'Image':'palm-oil.png'},
 {'Food': 'Pig Meat', 'Emissions': 7.2, 'Group': 'Meat', 'Image':'sausages.png'},
 {'Food': 'Chicken', 'Emissions': 6.1, 'Group': 'Meat', 'Image':'turkey.png'},
 {'Food': 'Olive Oil', 'Emissions': 6.0, 'Group': 'Oil', 'Image':'olive-oil.png'},
 {'Food': 'Soybean Oil', 'Emissions': 6.0, 'Group': 'Oil', 'Image':'soybean-oil.png'},
 {'Food': 'Fish farmed', 'Emissions': 5.1, 'Group': 'Fish', 'Image':'fish.png'},
 {'Food': 'Eggs', 'Emissions': 4.5, 'Group': 'Dairy', 'Image':'egg.png'},
 {'Food': 'Rice', 'Emissions': 4.0, 'Group': 'Grains', 'Image':'rice-bowl.png'},
 {'Food': 'Rapeseed Oil', 'Emissions': 3.7, 'Group': 'Oil', 'Image':'oil.png'},
 {'Food': 'Sunflower Oil', 'Emissions': 3.5, 'Group': 'Oil', 'Image':'sunflower-oil.png'},
 {'Food': 'Tofu', 'Emissions': 3.0, 'Group': 'Plant', 'Image':'tofu.png'},
 {'Food': 'Milk', 'Emissions': 2.8, 'Group': 'Dairy', 'Image':'milk.png'},
 {'Food': 'Cane Sugar', 'Emissions': 2.6, 'Group': 'Plant', 'Image':'sugar-cane.png'},
 {'Food': 'Groundnuts', 'Emissions': 2.4, 'Group': 'Nuts', 'Image':'walnut.png'},
 {'Food': 'Other Pulses', 'Emissions': 1.6, 'Group': 'Plant', 'Image':'agricultural.png'},
 {'Food': 'Oatmeal', 'Emissions': 1.6, 'Group': 'Grains', 'Image':'oatmeal.png'},
 {'Food': 'Wheat & Rye (Bread)', 'Emissions': 1.4, 'Group': 'Grains', 'Image':'grain.png'},
 {'Food': 'Tomatoes', 'Emissions': 1.4, 'Group': 'Plant', 'Image':'tomato.png'},
 {'Food': 'Wine', 'Emissions': 1.4, 'Group': 'Plant', 'Image':'wine.png'},
 {'Food': 'Beet Sugar', 'Emissions': 1.4, 'Group': 'Plant', 'Image':'sugar-beet.png'},
 {'Food': 'Maize', 'Emissions': 1.1, 'Group': 'Grains', 'Image':'corn.png'},
 {'Food': 'Barley (Beer)', 'Emissions': 1.1, 'Group': 'Grains', 'Image':'wheat.png'},
 {'Food': 'Berries & Grapes', 'Emissions': 1.1, 'Group': 'Plant', 'Image':'grapes.png'},
 {'Food': 'Soymilk', 'Emissions': 1.0, 'Group': 'Plant', 'Image':'soy-milk.png'},
 {'Food': 'Cassava', 'Emissions': 0.9, 'Group': 'Plant', 'Image':'yucca.png'},
 {'Food': 'Bananas', 'Emissions': 0.8, 'Group': 'Plant', 'Image':'banana.png'},
 {'Food': 'Peas', 'Emissions': 0.8, 'Group': 'Plant', 'Image':'peas.png'},
 {'Food': 'Other Fruit', 'Emissions': 0.7, 'Group': 'Plant', 'Image':'fruits.png'},
 {'Food': 'Other Vegetables', 'Emissions': 0.5, 'Group': 'Plant', 'Image':'vegetables.png'},
 {'Food': 'Brassicas', 'Emissions': 0.4, 'Group': 'Plant', 'Image':'flower-pot.png'},
 {'Food': 'Root Vegetables', 'Emissions': 0.3, 'Group': 'Plant', 'Image':'ginger.png'},
 {'Food': 'Potatoes', 'Emissions': 0.3, 'Group': 'Plant', 'Image':'potato.png'},
 {'Food': 'Apples', 'Emissions': 0.3, 'Group': 'Plant', 'Image':'apple.png'},
 {'Food': 'Onions & Leeks', 'Emissions': 0.3, 'Group': 'Plant', 'Image':'onion.png'},
 {'Food': 'Citrus Fruit', 'Emissions': 0.3, 'Group': 'Plant', 'Image':'lemon.png'},
 {'Food': 'Nuts', 'Emissions': 0.2, 'Group': 'Nuts', 'Image':'nuts.png'}]
};
const ImgPath = 'imgs/'

/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart() {
  // Constants for sizing
  const width = 1300;
  const height = 600;

  // tooltip for mouseover functionality
  const tooltip = floatingTooltip('agriculture_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var TypeCenter = {
    "Meat": { x: 1.5 * width / 7, y: height / 2 },
    "Dairy": {x: 2.6 * width / 7, y: height / 2 },
    "Fish": {x: 3.3 * width / 7, y: height / 2},
    "Oil": { x: 4.1 * width / 7, y: height / 2 },
    "Plant": { x: 4.8 * width / 7, y: height / 2 },
    "Grains": {x: 5.5 * width / 7, y: height / 2 },
    "Nuts": {x: 6 * width / 7, y: height / 2}
  };

  // X locations of the type titles.
  var typeTitleX = {
    "Meat": 165,
    "Dairy": 160 * 3.1,
    "Fish": width / 2,
    "Oil": 160 * 5,
    "Plant": 160 * 6.2,
    "Grains": 160 * 7.2,
    "Nuts": 160 * 7.8
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.03;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -1.4 * Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain(['Meat', 'Dairy', 'Fish', 'Oil', 'Plant', 'Grains', 'Nuts'])
    .range(['#d00000', '#f2e9e4', '#a2d2ff', '#f9c74f', '#90be6d', '#d4e09b', '#582f0e']);


  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    var maxAmount = d3.max(rawData, function (d) { return +d.Emissions; });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.

    var myNodes = rawData.map(function (d, i) {

      return {
        id: i,
        radius: 1.3 * radiusScale(+d.Emissions),
        emissions: +d.Emissions,
        food: d.Food,
        group: d.Group,
        x: Math.random() * 900,
        y: Math.random() * 800,
        img: ImgPath + d.Image
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.emissions - a.emissions; });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  const chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });


    const defs = svg.append("defs");
    defs.selectAll(".food")
      .data(nodes)
      .enter()
        .append("pattern")
        .attr("id", function(d) { return d.id; })
        .attr("class", "food")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("width", 1)
          .attr("height", 1)
          // xMidYMid: center the image in the circle
          // slice: scale the image to fill the circle
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("xlink:href", function(d) {
            return d.img;
          });


    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    const bubblesE = bubbles.enter()
    .append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) {
        return "url(#" + d.id + ")"
        return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);


    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  function nodeTypePos(d) {
    return TypeCenter[d.group].x;
  }


  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideTypeTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  function splitBubbles() {
    showTypeTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeTypePos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Hides Year title displays.
   */
  function hideTypeTitles() {
    svg.selectAll('.type').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showTypeTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    const typesData = d3.keys(typeTitleX);
    const types = svg.selectAll('.type')
      .data(typesData);

    types.enter().append('text')
      .attr('class', 'type')
      .attr('x', function (d) { return typeTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');
    d3.select(this).attr('stroke-width', '4');


    const content = '<strong class="name">Food: </strong><span class="details">' +
                  d.food +
                  '</span><br/>' +
                  '<strong class="name">Emissions (in kg of CO<sub>2</sub> per kg): </strong><span class="details">' +
                  addCommas(d.emissions) +
                  '</span><br/>' +
                  '<strong class="name">Group: </strong><span class="details">' +
                  d.group +
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());
      d3.select(this)
        .attr('stroke-width', '2');

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'type') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

const myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(data) {
  myBubbleChart('#agriculture_plot', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('.buttons-agriculture')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      const button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      const buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  const x = nStr.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? '.' + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// setup the buttons.
setupButtons();

display(dataset.children)



function floatingTooltip(tooltipId, width) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.
  const tt = d3.select('body')
    .append('div')
    .attr('class', 'd3-tip')
    .attr('id', tooltipId)
    .style('pointer-events', 'none');

  // Set a width if it is provided.
  if (width) {
    tt.style('width', width);
  }

  // Initially it is hidden.
  hideTooltip();

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3.event for positioning.
   */
  function showTooltip(content, event) {
    tt.style('opacity', 1.0)
      .html(content);

    updatePosition(event);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style('opacity', 0.0);
  }

  /*
   * Figure out where to place the tooltip
   * based on d3 mouse event.
   */
  function updatePosition(event) {
    const xOffset = 20;
    const yOffset = 10;

    const ttw = tt.style('width');
    const tth = tt.style('height');

    const wscrY = window.scrollY;
    const wscrX = window.scrollX;

    const curX = (document.all) ? event.clientX + wscrX : event.pageX;
    const curY = (document.all) ? event.clientY + wscrY : event.pageY;
    let ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
                 curX - ttw - xOffset * 2 : curX + xOffset;

    if (ttleft < wscrX + xOffset) {
      ttleft = wscrX + xOffset;
    }

    let tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
                curY - tth - yOffset * 2 : curY + yOffset;

    if (tttop < wscrY + yOffset) {
      tttop = curY + yOffset;
    }

    tt
      .style('top', tttop + 'px')
      .style('left', ttleft + 'px' );
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}
}
