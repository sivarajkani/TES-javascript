//Shipment Conditions and Deficits 

//Build Shipment Conditions List 
function buildShipCondList(){
	var x = 0;

		
	for (x = 0; x < shipCondCodes.length; x++) {
		$("#shipCondDropdown").css("display", "block");
		// Build Day of Week List if "DOW" is Valid Shipment Condition
		if (shipCondCodes[x].rpcode == "DOW"){ 
			buildDOWList();
		}
		// Build Load List if "LOAD" is Valid Shipment Condition
		if (shipCondCodes[x].rpcode == "LOAD"){ 
			buildLoadList();
		}
	};
}
	
function buildDOWList(){
	var x=0;
	var dayName;
	var dayNameSpan;
	var dowDtl;
	var dowUL = $('#dayOfWeekList');

	//dowUL.empty();
	dowUL.show();
				
	// Check the Box when the Day Name exists in the Conditions Array
	$("#dayOfWeekList input").prop('checked', false);
	$.each(cond,function(){
		if (this.code == "DOW" && this.codetype == "S" ) {
			$("input[qualifier='" + this.qualifier1 + "']").prop('checked', true);
		} 
	});

	$('#dayOfWeekList > li > input[type=checkbox]').unbind();
	$('#dayOfWeekList > li > input[type=checkbox]')
	.bind("keyup", function(e){
		switch (e.which) {
			case 27: //Escape
				$("getShipCond").click();
				break;
		}
	})
	.change(function () {
		if ($(this).prop("checked")) {

			// Add the Shipment DOW Code to Conditions Array when Checked
			var i = (cond.length-1) + 1;
			var c = (cond[i] = {});
			c["idpqcond"] = 0;
			c["codetype"] = "S";
			c["code"] = "DOW";
			c["qualifier1"] = $(this).attr("qualifier");
			c["qualifier2"] = "";
			c["exclcond"] = "";


		} else {
			// Remove the Shipment DOW Code from the Conditions Array when Un-Checked
			var currentCheckbox = $(this);
			$.each(cond,function(index,value){
				if (this.qualifier1 == currentCheckbox.attr("qualifier")) {
					cond.splice(index,1);
				} 
			});

		}
		// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
		if (saveAuthorized == true){
			if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
				$("#saveRates").removeClass("disabled");
			}
		};
		$("#emailButton").addClass("disabled");
		shipCondChanged = true;

	});
		
}
	
function buildLoadList(){
	
		var loadListUL = $('#loadList');
		var loadListLI;
		
				
		loadListUL.empty();
		$("#loadBox").val('');
		
		$("#loadListControls").show();
				  
		for (i = 0; i < cond.length; i++){
			
			
			
			// Build Load List from Shipment Conditions 
			if (cond[i].codetype == "S" && cond[i].code == "LOAD"){
				
				loadListLI = $("<li class='load' qualifier='" +cond[i].qualifier1+ "' loadId='" +i+"'></li>");
				
				loadListLI.append($("<span'>"+cond[i].qualifier1+"</span>"));
							
				// Add Load editing features - Delete Only
				var $loadListControls = 
						$(
						    "<div class='loadListControls'>" + 
								"<div class='deleteLoad'></div>" +
							"</div>"
						);
					
				loadListLI.append($loadListControls);
				
			
				loadListUL.append(loadListLI);
				
			};
		};
		
		
		assignLoadEditFunctions();
		
		
}
	
	// Set UI functions
function assignLoadEditFunctions() {
				
		$(".loadListControls .deleteLoad").click(function(){
			var loadNumber = $(this).parents(".load").attr("loadId");
			cond[loadNumber].load = "";
			cond.splice(loadNumber, 1);
			// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
			if (saveAuthorized == true){
				if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
					$("#saveRates").removeClass("disabled");
				}
			};
			$("#emailButton").addClass("disabled");
			shipCondChanged = true;
			buildLoadList();
		});
		
		$("#loadList .load")
			.mouseenter(function(){
				$(this).children(".loadListControls").show();
			})
			.mouseleave(function(){
				$(this).children(".loadListControls").hide();
			});
		
}
function assignShipConditionClick(){
	

	$("#loadBox")
	.click(function(e){
		e.stopPropagation();
	})
	
	.bind("keypress", function(e){
		// Save Load 
		if (e.which == 13) { //Enter
			e.preventDefault();
			
			
			if ($("#loadBox").hasClass("invalidField")) {
				$("#loadBox").removeClass("invalidField");
				$("#LoadBox").removeAttr("title");
			};
			
			var newLoad = $("#loadBox").val();
			
			// Check for Duplicate Load in Conditions Array
			for (i = 0; i < cond.length; i++){
				if (cond[i].codetype == "S" && cond[i].code == "LOAD" && cond[i].qualifier1 == newLoad){
					$("#loadBox").val('');
					newLoad = "";
				};
			};
			
			if (newLoad != ""){  
				validateLoad(newLoad, function(loadValid){
			
				if (loadValid == "true"){
					var newCond = {};
					newCond["qualifier1"] = newLoad;
					newCond["idpqcond"] = 0;
					newCond["codetype"] = "S";
					newCond["code"] = "LOAD";
					newCond["qualifier2"] = "";
					newCond["exclcond"] = "";
					cond.unshift(newCond);
							
				// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
					if (saveAuthorized == true){
						if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
							$("#saveRates").removeClass("disabled");
						}
					};
					$("#emailButton").addClass("disabled");
					shipCondChanged = true;
					buildLoadList();
				
							
					return false;
				}else{
					$("#loadBox").addClass("invalidField");
					$("#loadBox").attr("title", "Valid Load Number is Required.");
				};
				});
			};
		}
		// clear on Esc
		if (e.which == 27) {
			e.preventDefault();
			$("#loadBox").click();			
		}
	});
	
}

// Deficits

function buildDeficitCodeDropDown(){
	
	var deficitDtl;
	var deficitUL = $('#deficits');
	
	
	deficitUL.empty();
	$("#deficitsDropdown").show();	
	
	for (var x = 0; x < deficitCodes.length; x++) {
	
			
		deficitDtl = $("<li></li>");
					
		deficitCheckbox = $("<input type='checkbox' deficitCode='" + deficitCodes[x].code +
				"' deficitLineCodeType='D' deficitDesc='" + deficitCodes[x].description + "'/>'");
		deficitCheckbox.prop('checked', false);
		// Check the Box when the Deficit Code exists in the Charges Array
		for (var y = 0; y < chrg.length; y++) {
			if (deficitCodes[x].code == chrg[y].linecode && chrg[y].linecodetype == 'D'){
				deficitCheckbox.prop('checked', true);
			}
		}
		// Check the Box when the Deficit Code exists in the Conditions Array as Accessorial
		for (y = 0; y < cond.length; y++) {
			if (deficitCodes[x].code == cond[y].code && cond[y].codetype == 'A'){
				deficitCheckbox.prop('checked', true);
			}
		}
					
	   	deficitDtl.append(deficitCheckbox);
	   	deficitDtl.append($("<span>"+deficitCodes[x].description+"</span>"));
	 	deficitUL.append(deficitDtl);
					
	}								
	 		
		
	$('#deficits > li > input[type=checkbox]')
		.bind("keyup", function(e){
			switch (e.which) {
				case 27: //Escape
					$("#getDeficits").click();
					break;
			}
		})
		.change(function () {
			if ($(this).prop("checked")) {
							
				// Add the Deficit Code to Charges Array when Checked unless it's in the Conditions
				// Check the Box when the Deficit Code exists in the Conditions Array as Accessorial
				var inCondArray = false;
				for (var y = 0; y < cond.length; y++) {
					if ($(this).attr("deficitCode") == cond[y].code && cond[y].codetype == 'A'){
						inCondArray = true;
					}
				}
				if (!inCondArray){
					var i = (chrg.length-1) + 1;
					var c = (chrg[i] = {});
					c["id"] = "charge_" + i;
					c["idpqlanchr"] = "0";
					c["sequence"] = "" + (i + 1);	
					c["segment"] = "LH";	
					c["linecodetype"] = $(this).attr("deficitLineCodeType");
					c["linecode"] = $(this).attr("deficitCode");
					c["description"] = $(this).attr("deficitDesc");
					c["rmssection"] = "";	
					c["rmsitem"] = "";
					c["rmsqty"] = chrg[0].rmsqty;
					c["rmsuom"] = chrg[0].rmsuom;	
					c["rmsrate"] = ".00";
					c["rmsamount"] = "0";
					c["rmsminchg"] = ".00";
					c["rmspubrpm"] = ".0000";
					c["proprate"] = "0";
					if (chrg[0].propuom != ""){
						c["propuom"] = chrg[0].propuom;
						if (c["propuom"] == "MLS"){
							c["propqty"] = chrg[0].rmsqty;
						}else{
							c["propqty"] = "1";
						}
					}else{
						c["propuom"] = chrg[0].scaleuom;
						c["propqty"] = chrg[0].scaleqty;
					}
					
					c["propamt"] = ".00";
					c["exclchrg"] = "1";
					c["adjustpct"] = ".000";
					c["pricedminchr"] = ".00";
					c["pricingid"] = "0";
					c["puborigin"] = "";
					c["pubdest"] = "";
					c["scaleqty"] = chrg[0].rmsqty;		
					c["scaleuom"] = chrg[0].scaleuom;	
					c["scalerate"] = ".00";	
					c["scaleprcid"] = "0";
					c["scaleorigin"] = "";
					c["scaledest"] = "";
					c["scaleamt"] = ".00";		
					c["scaleminchr"] = ".00";
				}
				
			} else {
				// Remove the Deficit Code & Accessorial from the Charges Array when Un-Checked
				var currentCheckbox = $(this);
				$.each(chrg,function(index,value){
					// Remove Deficit and Accessorial from Charges Array
					//if (this.linecode == currentCheckbox.attr("deficitCode") && this.linecodetype == 'D') {
					if (this.linecode == currentCheckbox.attr("deficitCode")) {	
						chrg.splice(index,1);
					} 
				})
				// Remove the Accessorial Code from the Conditions Array when Deficit is Un-Checked
					
				$.each(cond,function(index,value){
					if (this.code == currentCheckbox.attr("deficitCode")) {
						cond.splice(index,1);
						
					} 
				})
				
					
			}
						
			deficitsChanged = true;
					
		});
				
	// User clicks the checkbox text it will automatically click the checkbox as well
	$("#deficits > li > span").click(function() {
		$(this).prev().click();
	});
				

}
