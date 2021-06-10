// JavaScript Document
function setMouseTrap() {
	// Initialize
	$("input, select, textarea")
		// Everything will operate off the "`" or "~" key, so prevent it from being input anywhere
		.bind("keydown", function(e){
			// Retrieve Proposal Info on Enter
			if (e.which == 192) { //Tilde
				e.preventDefault();
				$(this).blur();
			}
		});
		
	
	// Bind shortcuts
	Mousetrap.bind('c', function(e) {
		$("#customerNumber").click();
		return false;
	});
	
	Mousetrap.bind('q', function(e) {
		$("#listDropIcon").click();
		return false;
	});	
	
	Mousetrap.bind('+', function(e) {
		if (!inLaneListMode){
			$("#laneNavPlus").click();
		}
		return false;
	});
	
	Mousetrap.bind('left', function(e){
		if (!inLaneListMode){
			$("#laneNavPrevious").click();
		}
		return false;
	});
	
	Mousetrap.bind('up', function(e){
		if (!inLaneListMode) {
			$("#laneNavFirst").click();
		}
		return false;
	});
	
	Mousetrap.bind('right', function(e){
		if (!inLaneListMode){
			$("#laneNavNext").click();
		}
		return false;
	});
	
	Mousetrap.bind('down', function(e){
		if (!inLaneListMode) {
			$("#laneNavLast").click();
		}
		return false;
	});
	
	Mousetrap.bind('l', function(e){
		//$("#laneNavNum").focus();
		$("#laneNavSpinner").focus();
		return false;
	});
	
	Mousetrap.bind('m', function(e) {
		$(".contactNameLabel").click();
		return false;
	});	
	
	Mousetrap.bind('o', function(e) {
		$("#originTag").click();           
		return false;
	});
	
	Mousetrap.bind('d', function(e) {
		$("#destTag").click();           
		return false;
	});	
	
	Mousetrap.bind('b', function(e) {
		$(".border:first").click();
		$("#borderSelect").focus();          
		return false;
	});		
	
	Mousetrap.bind('t', function(e) {
		if ($("#tempTag").css("display") != "none"){
			$("#tempTag").click();
		} else {
			$(".borderBox:first").click();
		}
		$("#geoEntry").focus();          
		return false;
	});	
	
	Mousetrap.bind('s', function(e) {
		$("#saveRates").click();           
		return false;
	});		
	
	Mousetrap.bind('a', function(e) {
		$("#getAccessorials").click();       
		return false;
	});		
	
	Mousetrap.bind('p', function(e) {
		$("#getShipCond").click();       
		return false;
	});			
	
//	Mousetrap.bind('n', function(e) {
//		$("#newButton").click();       
//		return false;		
//	});			
	
	Mousetrap.bind('e', function(e) {
		$("#emailButton").click();       
		return false;		
	});
	
	Mousetrap.bind('x', function(e) {
		$("#expirationDate").focus(); 
		return false;				
	});	
	
	Mousetrap.bind('k', function(e) {
		$( "#tabs" ).tabs( "option", "active", 0 );
		return false;				
    });	
    
    Mousetrap.bind('v', function(e) {
        $( "#tabs" ).tabs( "option", "active", 1 );
        return false;				
    });				

    Mousetrap.bind('g', function(e) {
        $( "#tabs" ).tabs( "option", "active", 2 );
        $("#commentBox").focus(); //works when notes already selected
        return false;				
    });
	
	Mousetrap.bind('h', function(e) {
		$( "#tabs" ).tabs( "option", "active", 3 );
		$("#logSearch").focus();
		return false;				
	});
	
	
	Mousetrap.bind('r', function(e) {
		rateGrid.gotoCell(0,8,true); 
		return false;				
	});	
	
	Mousetrap.bind('>', function(e) {
		$("#statsDetailMode").click();       
		return false;
	});
	Mousetrap.bind('<', function(e) {
		$("#statsEntryMode").click();       
		return false;
	});
}