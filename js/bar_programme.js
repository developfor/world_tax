"use strict";
//function to wrap the axis labels into the width of the bar
//from Mike Bostock example
var wrap = (function(text, width) {
	text.each(function() {
		var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1, // ems
		y = text.attr("y"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
});

//Build bars the arguments are data: the data, this_div: the div to append the svg to
//this_value: The particular value to be shown by the height of the bars
var BuildBars = (function(data, this_div, this_value){

	//creates initial variables and creates an svg in #viz element
	var margin = {top:20, right: 20, bottom: 55, left: 40};

	var width = 350 - margin.right - margin.left,
		height = 350 - margin.top - margin.bottom,
		padding = 20;

	//xScales returns an ordinal scale function
	function xScales(data){
		return d3.scale.ordinal()
		.domain(data.map(function(d){ return d.economy; }))
		.rangeRoundBands([0, width], .1);
	};

	//yScales returns a linear scale function
	function yScales(data){
		return d3.scale.linear()
				.domain([0, d3.max(data, function(d){ return +d[this_value]; })])
				.range([height, 0])
				.nice();
	};
	//returns an x axis function, the data is passed to the xScales function
	function xA(data){
		return d3.svg.axis()
			.scale(xScales(data))
			.ticks(3)
			.tickSize(6,0);//the second argument takes the first and last tick off
	}

	//returns a y axis function
	function yA(data){
		return d3.svg.axis()
			.scale(yScales(data))
			.orient("left")
			.ticks(10)
			.tickSize(5,0); //the second argumnet takes the first and last tick off
	}

	//the colors are mapped to the economy name
	var color = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.economy; }))
		.range(['#591E23', '#D94E67', '#ff7a92', '#F2D8A7', '#A68572', '#73503C', '#4f382b']);


	var svg = d3.select(this_div)
		.append('svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
    .call(xA(data))
		.selectAll(".tick text")
  	.call(wrap, xScales(data).rangeBand()); //call the wrap function to 
  											//wrap the text to the width of the bar

    svg.append("g")
        .attr("class", "y axis")
    .call(yA(data));

    //update needs to be called so the bars show up initially
    //and the function needs to be passed the data
     update(data);

	//The return function is the update for the bars
	//It takes in the data as its argument.
	//the building of the bars happens in this function
	function update(data){
		//each time an empty array is initialsed
		var data_set = [];

		//run through the data object that has been passed into the function
		//if the entry object is not empty then the data is pushed to the
		//dataset array
		//the dataset array is used in the rest of the funciton for the data
	 	data.forEach(function(entry){
	 		if (jQuery.isEmptyObject( entry ) === false){
	 			data_set.push(entry);
	 		}
	 	})
	
		//these variables hold the updated scales which have been
		//passed the new data_set
		var xScale = xScales(data_set);
		var yScale = yScales(data_set);

		var chart = svg.selectAll('rect')
			.data(data_set);

		chart.enter()
			.append('rect')
			.attr("fill", function(d){ return color(d.economy)})
			.attr('class', 'bar');

		chart.transition()
			.duration(1000)
			.attr({
			x: function(d){ return xScale(d.economy);},
			width: xScale.rangeBand(),
			y: function(d){ return yScale(+d[this_value])},
			height: function(d){ return height - yScale(+d[this_value]);},
			fill: function(d){ return color(d.economy)}
		});

		chart.exit()
		.transition()
		.duration(1000)
		.attr('x', width + xScale.rangeBand())
		.remove();

		//updates the axis
		svg.select(".x.axis")
		.call(xA(data_set))
			 .selectAll(".tick text")
  		.call(wrap, xScales(data_set).rangeBand()); //the wrap function is called to wrap
  													//the tick text within the width of the bar

		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yA(data_set));
	}

	//return update
	return {
    	update:update
    };

});//END OF BUILD FUNCTION