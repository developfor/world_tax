var instructions = function(){
	'use strict;'
	var clicked = 0;
	$("#toggle-instructions").on("click", function(){
		$("#block-instructions-toggle").slideToggle();
		if(clicked === 0){
			$("#toggle-instructions").empty().append("show introduction");
			$(".info-text-instructions").css({"background-color": "#2E5879","color":"white"} );
			clicked = 1;
		}else{
			$("#toggle-instructions").empty().append("hide introduction");
			$(".info-text-instructions").css({"background-color": "#F8BD00","color":"black"} );
			clicked = 0;
		}
	});
}