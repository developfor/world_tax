var BuildPie = (function(data){
	'use strict';

	var margin = {top:10, right: 10, bottom: 10, left: 10},
		width = 300 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom,
		radius = Math.min(width, height) / 2;

	var svg = d3.select('#viz').append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")		
				.attr('class', 'pie_svg');

	var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius - 70);

	var pie = d3.layout.pie()
			.sort(null)
			.value(function(d){ return d.total_tax; });

	var color = d3.scale.ordinal()
	.domain(data.map(function(d) { return d.economy; }))
	.range(['#591E23', '#D94E67', '#ff7a92', '#F2D8A7', '#A68572', '#73503C', '#4f382b']);

	var path = svg.selectAll('path')
				.data(pie(data))
				.attr('fill', 'white')
				.enter()
				.append("path")
				.attr('class', 'pie-path');

	path.attr('fill', function(d,i){ return color(i);})
		.attr('d', arc)
		.each(function(d) { this._current = d;});
	//the animation for the changing pieces of the pie
	var arcTween = (function(a){
	
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t){
				return arc(i(t));
			}
	});

	//the change function is return when BuildPie is created
	var change = (function(data){
		//an empty object that matches the objects in the
		//data array but with empty values
		//need this so that data that is no longer there can 
		//be set to 0 so can be interpolated by the change 
		//and arcTween functions
		var emptyObject = {"economy": " ",
		"hours_per_year": 0,
		"payments_per_year": 0,
		"total_tax":0 };

		//empty the data set
		var data_set = [];

		//create the new data set
		//put the empty object into the array is the object is {}
		//else push the unempty data object into the array
	 	data.forEach(function(entry){
	 		if (jQuery.isEmptyObject(entry) === true){
	 			data_set.push(emptyObject);
	 		} else {
	 			data_set.push(entry);
	 		}
	 	})
	 	//pass the new data through the pie funciton
	 	//then transition between the old data and the new
	 	//by calling arcTween
		path.data(pie(data_set));
		path.transition().duration(750).attrTween("d", arcTween);
	});
	
	return{
		change:change
	}
});