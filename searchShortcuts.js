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
	Mousetrap.bind('o', function(e) {
		//$("#searchOrigin").focus();
		$("#originSelection > .removeSelectedItem").click();
		return false;
	});
	Mousetrap.bind('c', function(e) {
		$("#searchCustomer").focus();
		return false;
	});
	
	Mousetrap.bind('m', function(e) {
		//$("#searchContact").focus();
		$("#contactSelection > .removeSelectedItem").click();
		return false;
	});	
	
	Mousetrap.bind('d', function(e) {
		//$("#searchDestn").focus();
		$("#destinationSelection > .removeSelectedItem").click();
		return false;
	});
	Mousetrap.bind('u', function(e) {
		$("#searchByUser").focus();
		return false;
	});
	Mousetrap.bind('r', function(e) {
		$("#searchEntryBDate").focus();
		return false;
	});
	Mousetrap.bind('f', function(e) {
		$("#searchEffDate").focus();
		return false;
	});
	Mousetrap.bind('y', function(e) {
		$("#searchLaneType").focus();
		return false;
	});
	Mousetrap.bind('n', function(e) {
		$("#newButton").click();
		return false;
	});
	Mousetrap.bind('p', function(e) {
		$("#searchProposal").focus();
		return false;
	});
	Mousetrap.bind('l', function(e) {
		$("#useLoad").focus();
		return false;
	});
	Mousetrap.bind('q', function(e) {
		if ($("#quoteTable .newLikeThis").length != 0){
			$(".newLikeThis").click();
		};
		return false;
	});
	Mousetrap.bind('x', function(e) {
		$("#resetButton").click();
		return false;
	});
	
}