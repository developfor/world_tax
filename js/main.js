(function(window, document, undefined){
	'use strict;'

	d3.json("data/tax_data.json", function(error, data){
		if(error){
			console.log(error)
		} else {

			//data_set will hold the parsed data from the 
			//imported data as an array of objects
			//once instanciated it will not be changed
			//an array of objects

			// data_set_filter will hold the data when filters 
			// applied so will change, this will be passed to 
			// funcitons that build the visualisations
			//an array of objects

			//country_names will hold the full 
			// list of country names from parsed data, 
			// it will not change once instanciated
			// an array of strings

			// country_names_filter will hold list of 
			// filtered country names, an array of strings
			// an array of objects
			
			var data_set = [],
			data_set_filter = [],
			country_names = []; //
			country_names_filter = []; 

			//parse the data so just the data needed is passed into an object
			//then pushed to the new array data_set
			//country_names and country_names_filter will also be filled
			data.forEach(function(entry){
				var temp_obj = {};
				temp_obj["economy"] = entry.economy;
				temp_obj["payments_per_year"] = entry.payments_per_year;
				temp_obj["hours_per_year"] = entry.time_hours_per_year;
				temp_obj["total_tax"] = entry.total_tax_rate;

				data_set.push(temp_obj);

				country_names.push(entry.economy);
				country_names_filter.push(entry.economy);
			});

			//creates the info at the top of the page
			instructions();

			//create the objects for each of the visualisations
			var bars_data = new BuildBars(data_set, '#viz2', 'payments_per_year');
			var bars_data2 = new BuildBars(data_set, '#viz3', 'hours_per_year');
			var pie_data =  new BuildPie(data_set);
			var table_data = new tableVisualisation(data_set);

			//start of checkbox creation
			var display = d3.select("#display")

			var checks = display.append("div")
			.classed("check", true)
			.selectAll("div.check")
			.data(data_set)
			.enter()
			.append("div")
			.attr('class', "checkbox_main");
			checks
			.append("input")
			.attr({
				"type": "checkbox",
				"checked": true
			})
			.attr('id', function(d){ return d.economy;})
			.on("change", function(d,i) {
				//the id of the clicked checkbox is the 
				//economy name
				var clicked = this.id;

				//if the box is being checked
				if(this.checked){
					//add the name of the clicked economy 
					//to the country_name_filter array
					country_names_filter.push(clicked);
					//create the updated data
					//and call the update functions for the visualisations
					make_filter();

				}else{ //the else is if the box is being unchecked
					//if there are more then 1 check boxes checked
					if($('.check :checkbox:checked').length > 0){
						//get the index number of the country name to be removed
						//from the country_names_filter array
						var remove_this = $.inArray(clicked, country_names_filter);
						//remove the clicked country name from the array
						country_names_filter.splice(remove_this, 1);
						//create the updated data
						//and call the update functions for the visualisations
						make_filter();

					} else {
						//if the last checked checked box has been clicked
						//make it stay clicked
						this.checked = true;
					}
				}

				function make_filter(){
					//reset the dataset filter to empty
					data_set_filter = [];

					//loop through the unchanging country name list
					country_names.forEach(function(entry, index){
						//check if the entry is in country_names_filter
						//-1 will be return if it is not
						var in_array = $.inArray(entry, country_names_filter);
						//if the entry is in the filtered names then
						//add the object with the same index from data_set 
						//to data_set_filter
						if(in_array >= 0){
							data_set_filter.push(data_set[index])
						} else{
							//if its not then add an empty object
							data_set_filter.push({})
						}
					})
					//call the update functions for all the visualisations
					bars_data.update(data_set_filter);
					bars_data2.update(data_set_filter);
					pie_data.change(data_set_filter);
					table_data.makeTable(data_set_filter);
				}

			});//END OF ON CHANGE
			//add the text to the checkboxes
			checks.append("span")
			.text(function(d) { return d.economy; });
			//put an id on each of the checkboxes
			checks.append("span")
				.attr('class', "country_span")
				.attr('id', function(d, i) {return "span" + i;})	

		}
	})

})(this, document);