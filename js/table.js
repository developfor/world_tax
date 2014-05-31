var tableVisualisation = (function(data){

	var makeTableCircles = function(data_set){
		//variables to hold width and height.
		//scaleRangeMin and scaleRangeMax are the radius min and max
		var width = 30,
		height = 30;

		//The color scale takes the minimum and maximum magnitude values
		//the range is two colors
	// var color = d3.scale.ordinal()
	// 	.domain(data_set.map(function(d) { return d.economy; }))
	// 	.range(['#591E23', '#D94E67', '#ff7a92', '#F2D8A7', '#A68572', '#73503C', '#4f382b']);

    	//selects the span in the magnitude column in datatable
    	//the data is attached to it and a width and height given
		var svg = d3.selectAll(".circle-table")
		.data(data_set)
		.append("svg:svg")
		.attr('width', width)
		.attr('height', height);

		//a circle is appended to the selection and the size and color of the circle
		//is from the magnitude data passed throug the radius and color functions
		//the cx and cy of the cirlce is the width and height divided by 2
		svg.append("circle")
		.attr("r", 20)
		.attr("cx", width/2)
		.attr("cy", height/2)
		.attr("fill", function(d){ 
			if(d.economy === "East Asia & Pacific"){
				return '#591E23';
			}else if(d.economy === "Europe & Central Asia"){
				return '#D94E67';
			}if(d.economy === "Latin America & Caribbean"){
				return '#ff7a92';
			}if(d.economy === "Middle East & North Africa"){
				return '#F2D8A7';
			}if(d.economy === "OECD high income"){
				return '#A68572';
			}if(d.economy === "South Asia"){
				return '#73503C';
			}if(d.economy === "Sub Saharan Africa"){
				return '#4f382b';
			}
		});
	};

	//function to make the table
	var makeTable = function(data){



		var data_set = [];

	 	data.forEach(function(entry){
	 		if (jQuery.isEmptyObject(entry) !== true){
	 			data_set.push(entry);
	 		} 
	 	})

		//CBody holds the id of the table body

		$('#table-body-id').empty();
		var cBody = $('#table-body-id');

		//iterate through the data
		data_set.forEach(function(entry){
			//the variable row initial holds the <tr> tag
			//It is added on to with the time, magnitude, place and latitude
			//the final element added is the </tr> tag
			var row = '<tr>';

			//spans are added with a class- the first span holds the magnitude text
			//the second span holds the d3 svg and is used in the makeTableCircles function
			//the table-mag class styles the text so it sits well with the svg element
			// row += '<td>' + entry.economy + '</td>';
			row += '<td><span class = "table-mag">' + entry.economy + '</span><span class = "circle-table"></span>' + '</td>';  
			 
			row += '<td>' + entry.payments_per_year + '</td>';
			row += '<td>' + entry.hours_per_year + '</td>';
			row += '<td>' + entry.total_tax + '</td>';      
			
			row +='</tr>'; 
			//row is appended to the table body
			cBody.append(row);
		});

		//call the function that creates the d3 svg magnitude circles
		makeTableCircles(data_set);

	};

	makeTable(data);
		return{
		makeTable:makeTable
	}
});
