var massUpdateMode = false;
var massUpdateAccessorial_values = [];

// Set Click event for display button
	$(function(){
		$("#massUpdateButton").click(function(){
			if (! $(this).hasClass("disabled")){
				if ($("#massUpdateBlock").css("display") == "none"){
					$("#updAllButton").removeClass("disabled");
					showMassUpdateForm();
				} else {
					hideMassUpdateForm();
				}
			}
		});
				
		$("#updAllButton").click(function(){
			
			if (validateLineHaul() && validateUpdDates() && validateMRates()){
				
				if (lanesToUpdate.length == 0) {
					alert ("Lanes have not been selected for update");
				
				} else {
					updateMassLanes();
					
				}
				
			}
				
		});
		
		// Border -  keyboard/mouse functions
		$("#updBorder").change(function(){
			updBorder = $("#updBorder option:selected").text();
			var selectedBorder = $("#updBorder option:selected");
			// Update updGeo with Border Selection
			// Search Update Geo for Border
			var i = -1;
			for (var x = 0; x < updgeo.length; x++) {
				if (updgeo[x].geotype == "BRD"){
					i = x;
					break;
				}
			};
			// Border Previous Selected and Now Selection is Blanks
			if ((updBorder == " ") && (i != -1)){
				updgeo.splice(i, 1); 
			}
			
			if (updBorder != " "){
				// Set Index for New Update Geo  
				if (i == -1){
					i = updgeo.length;
					updgeo[i] = {};
				};
				updgeo[x].geotype = "BRD";
				updgeo[i].sequence = 0;
				updgeo[i].idpqlangeo = 0;
				updgeo[i].pointsrc = "CL";
				updgeo[i].idcity = selectedBorder.attr("value");
				updgeo[i].cityname = selectedBorder.attr("cityname");
				updgeo[i].idcounty = 0;
				updgeo[i].countyname = "";
				updgeo[i].state = selectedBorder.attr("state");
				updgeo[i].country = selectedBorder.attr("country");
				updgeo[i].idzip = selectedBorder.attr("idzip");
				updgeo[i].zipcode = selectedBorder.attr("zipcode");
				updgeo[i].zone = "";
				updgeo[i].idregion = 0;
				updgeo[i].region = "";
				updgeo[i].segment = "";
				updgeo[i].applycarr = "";
			}
			
		});
		
		// Update Line Haul Unit of Measure -  keyboard/mouse functions
		$("#updlinehauluom").change(function(){
			validateLineHaul();
		});
		
		// Update Line Haul Rate -  keyboard/mouse functions
		$("#updlinehaulrate").blur(function(){
			if ($("#updlinehauluom option:selected").val() != ""){
				validateLineHaul();
			}
		});
		
		// Update Minimum Rate -  keyboard/mouse functions
		$("#updMinRate").blur(function(){
			validateMRates();
		});
		
		// Update Mexico Rate -  keyboard/mouse functions
		$("#updMexRate").blur(function(){
			validateMRates();
		});
		
		 //massupdate lane users  
        $("#massUpdateUserType").change(function (e) {
            $("#massUpdateUser option").remove();
        	updUserType = $("#massUpdateUserType option:selected").attr("value");
        	buildLaneUserSelectOptions($("#massUpdateUser"),updUserType);            
        }); 
		
		// Update Origin - keyboard/mouse functions
		$("#updOrigin").unbind("keyup");
		$("#updOrigin")
			.focus()
			.select()
			.bind("keyup", function(e){
				var $selectedLI = $("#updGeoSearchList li.selected");
	
				switch (e.which) {
					case 13: //Enter
						if ($("#updGeoSearchList").css("display") != "none"){
							setGeoUpdSelection($(this));
						}		
						break;
					case 27: //Escape
						$("#updOrigin").val("");
						$("#updGeoSearchList").remove();
						break;
	
					case 38: //Up
						if ($selectedLI.length > 0){
							if ($selectedLI.prev().length > 0){
								$selectedLI = $selectedLI.prev();
								$("#updGeoSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");
							}
						}
	
						break;
	
	
					case 40: //Down
						if ($selectedLI.length > 0){
							if ($selectedLI.next().length > 0){
								$selectedLI = $selectedLI.next();
								$("#updGeoSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");
							}
						} else {
							$("#updGeoSearchList li").first().addClass("selected");
						}
	
						break;
	
					default:
						// Add Geo Validation
						if ($("#updGeoSearchList").length == 0){
							var $geoSearchList = $('<ul id="updGeoSearchList" class="searchResults"></ul>');
							$("#originFlipper").after($geoSearchList);
						}
						
						var searchString = escape($(this).val());
						searchGeography(searchString, $("#updGeoSearchList"), $(this));
						break;
				}
				
			})
			.bind("keydown", function(e){
				var $selectedLI = $("#updGeoSearchList li.selected");

				switch (e.which) {
					case 13: //Enter
						$(this).val($selectedLI.ignore("span").text());
						break;
					default:
						break;
				}
			});
		
		// Update Destination - keyboard/mouse functions
		$("#updDestination").unbind("keyup");
		$("#updDestination")
			.focus()
			.select()
			.bind("keyup", function(e){
				var $selectedLI = $("#updGeoSearchList li.selected");
	
				switch (e.which) {
					case 13: //Enter
						if ($("#updGeoSearchList").css("display") != "none"){
							setGeoUpdSelection($(this));
						}		
						break;
					case 27: //Escape
						$("#updDestination").val("");
						$("#updGeoSearchList").remove();
						break;
	
					case 38: //Up
						if ($selectedLI.length > 0){
							if ($selectedLI.prev().length > 0){
								$selectedLI = $selectedLI.prev();
								$("#updGeoSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");
							}
						}
	
						break;
	
	
					case 40: //Down
						if ($selectedLI.length > 0){
							if ($selectedLI.next().length > 0){
								$selectedLI = $selectedLI.next();
								$("#updGeoSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");
							}
						} else {
							$("#updGeoSearchList li").first().addClass("selected");
						}
	
						break;
	
					default:
						// Add Geo Validation
						if ($("#updGeoSearchList").length == 0){
							var $geoSearchList = $('<ul id="updGeoSearchList" class="searchResults"></ul>');
							$("#destFlipper").after($geoSearchList);
						}
						
						var searchString = escape($(this).val());
						searchGeography(searchString, $("#updGeoSearchList"), $(this));
						break;
				}
				
			})
			.bind("keydown", function(e){
				var $selectedLI = $("#updGeoSearchList li.selected");

				switch (e.which) {
					case 13: //Enter
						$(this).val($selectedLI.ignore("span").text());
						break;
					default:
						break;
				}
			});
		
		
		$(".removeSelectedItem").click(function(){
			var $selectedListItem = $(this).parent();
			var $textBox = $selectedListItem.siblings("input");
			var geoInputID = $selectedListItem.siblings("input").attr("id");
			
			if ($selectedListItem.children("span").text() != ""){
				$selectedListItem.hide();
				$textBox.val("").fadeIn("fast").focus();
				$selectedListItem.children("span").html("");
				
				$selectedListItem.css("top", $textBox.outerHeight(true)).show();
			}
			// Remove Geo Update Entry from geoupd array
			for (var x = 0; x < updgeo.length; x++) {
				if (updgeo[x].geotype == "ORG" && geoInputID == "updOrigin"){
					updgeo.splice(x, 1); 
					break;
				}
				if (updgeo[x].geotype == "DST" && geoInputID  == "updDestination"){
					updgeo.splice(x, 1); 
					break;
				}
			};
		});
	
	});

// Retrieve Accessorial Codes 
	function getAccessorialCodes (){
		var i;
		var url;
		
		accessorialCodes.length = 0;
		
		// Build URL to Retrieve Accessorial Codes
		url = "PQxml.pgm?" +
              "Func=GetAccessorialShipConds&codetype=A&Code=*ALL";
    
		$.ajax({
			type: "GET",
				url: url,
				dataType: "xml",
				cache: false,
				
		    	success: function(xml){
		    		i = -1;
		    		$(xml).find('accshpcode').each(function(){
						i++;
						var s = (accessorialCodes[i] = {});
						s["codeType"] = $(this).attr("rpctyp");
						s["code"] = $(this).attr('rpcode');
						s["codeDesc"] = $(this).attr('rpcdsc');
					});
								
		    	},
			
				complete: function() {
					buildAccessorialCheckBox();
				},
			
				error: function() {
					alert('Cannot find Accessorial Codes.');
			   					
				}
		});
	}
	
	function buildAccessorialCheckBox(){
        
		var x=0;
		var accessorialDtl;
		
		var accessorialSelect = $('#accessorialsSelect');

		

		for (x = 0; x < accessorialCodes.length; x++) {
			
			
			accessorialSelect.append(
				"<option value='"+ accessorialCodes[x].code + 
				"' rpcode='" + accessorialCodes[x].code +
				"' rpctyp='" + accessorialCodes[x].codeType +
				"'>"+accessorialCodes[x].codeDesc.toLowerCase()+"</option>");
			
		};

		// MultiSelect Setup for Work Flow Status
		accessorialSelect.multiselect({
			classes: "accessMulti",
			header: false,
			noneSelectedText: "None",
			open:  function(){
				massUpdateAccessorial_values.length = 0; 
			},
			close: function(){
				massUpdateAccessorial_values = accessorialSelect.multiselect("getChecked").map(function(){
					return this.value;    
				}).get();
			},
			position: {
				my: 'left top',
				at: 'left bottom'
			}
		});
		
		accessorialSelect.multiselect('uncheckAll');
	}

	function showMassUpdateForm(){
        massUpdateAccessorial_values.length = 0;
		massUpdateMode = true;
		massRerate = false;
        
        // Disable All Actions - Do Not Fade Out
        disableActions(false);
        // Enable Only Mass Update Button
        $("#massUpdateButton").removeClass("disabled");
        
		//$("#downloadButton").addClass("disabled");
		//$("#publishButton").addClass("disabled");
		//$("#auditButton").addClass("disabled");
		//$("#saveRates").addClass("disabled");		
		//$("#emailButton").addClass("disabled");
		
		$("#geoBlock").fadeOut("fast", function(){
			$("#laneListDropDown").animate({
				height: "58%"
			}, "fast", function(){
				var displayType = (msIETest() ? "-ms-flexbox" : "flex");
				if (msIETest()){
					$("#massUpdateBlock").css("display", displayType);
				} else {
					$("#massUpdateBlock").css("display", displayType).hide().fadeIn("fast");
				}
			});
			$("#laneContainer").animate({
				backgroundColor:"#FFFFFF"
			}, "fast");
			$("#laneListTable_wrapper > .dataTables_scroll > .dataTables_scrollBody").animate({
				height:"280px"
			}, "fast");
		});
		
		// Clear Mass Update Variables
		updlanetype = "";
		updWorkFlowStatus = "";
		updWorkFlowStatusCode = "*";
		updlinehaulrate = 0;
		updlinehauluom = "";
		updMinRate = 0;
		updMexRate = 0;
		updeffectiveDate = '0001-01-01';
		updexpireDate = '0001-01-01';
		updOrigin = "";
		updDestination = "";
		updBorder = "";
		updgeo.length = 0;
		updcond.length = 0;
        updUserType = "";

		
		$("#updlanetype").val("");
		$("#updWorkFlowStatus").val("*");
		$("#updlinehaulrate").val("");
		$("#updlinehauluom").val("");
		$("#updMinRate").val("");
		$("#updMexRate").val("");
		$("#updeffectiveDate").val("");
		$("#updexpireDate").val("");
		$("#updOrigin").val("");
		$("#updDestination").val("");
		$("#updBorder").val("");
        $("#massUpdateUser").val("");
        $("#massUpdateUserType").val("");
		
		$("#accessorialsList input:checked").prop("checked", false);
		$("#accessorialsSelect").multiselect('uncheckAll');
		
		selectLanesForUpdate(function(){
			// Filter Display ONLY Selected Lanes
			rebuildLaneListDatatable();
			// Hide Search and Select/DeSelect & Add Mass Update Title
			$("#laneListTable_filter").children().css("visibility", "hidden");
			$("#laneListTable_filter > label").before("<span id='massUpdateTitle'>Mass Update</span>");
			$("#laneListTable_filter > label").before("<span id='massRerate'></span>");
			$("#laneListTable_filter").addClass("massUpdateFilterBling");
			$("#laneListTable_filter").removeClass("dataTables_filter");
			
			// Re-Rate Selected Lanes
			$("#massRerate").click(function(){
				massRerate = true;
				updateMassLanes();
			});
		});
		
	}

	function selectLanesForUpdate(callback){
		lanesToUpdate.length = 0;
		// Build Selected Lanes for Update and Mark Selected Lanes in Lane List
		$("#laneListTable tr.selected").each(function() {
			var selectedLane = ($(this).find("td:first-child").html());
			for (i = 0; i < lanes.length; i++) { 
	           	if (lanes[i].lanenumber == selectedLane){
	           		lanesToUpdate.push(lanes[i].idpqlandtl);
	           		lanes[i].selectedForMassUpdate = true;
	           		break;
	          	};
	        }
				
		});
		
		if (typeof callback === "function"){
			callback();
		}
		
	}
	

	function hideMassUpdateForm(immediately){
		massUpdateMode = false;
        // Set Authorized Action Buttons and Do Not FadeIn
        setAuthorizedActions(false);
        
		//$("#downloadButton").removeClass("disabled");
        //if (publishAuthorized == true) {
		//	$("#publishButton").removeClass("disabled");
		//}
		
		//$("#auditButton").removeClass("disabled");
		//$("#emailButton").removeClass("disabled");
		
		var speed = "fast";
		if (immediately){
			speed = 0;
		}
		
		for (var x = 0; x < lanes.length; x++) {
			lanes[x].upderror = false;
			lanes[x].updmessage = "";
		}
		
		lanesToUpdate.length = 0;
		for (i = 0; i < lanes.length; i++) { 
			lanes[i].selectedForMassUpdate = false;
        }
		// Show Search and Select/DeSelect 
		$("#laneListTable_filter").removeClass("massUpdateFilterBling");
		$("#laneListTable_filter").addClass("dataTables_filter");
		$("#massUpdateTitle").remove();
		$("#massRerate").remove();
		$("#laneListTable_filter").children().css("visibility", "visible");
		
		rebuildLaneListDatatable();
		
		$("#massUpdateGeo .removeSelectedItem").click();
		
		$("#updexpireDate").removeClass("invalidDate");
		$("#updeffectiveDate").removeClass("invalidDate");
		$("#updlinehauluom").removeClass("invalidField");
		$("#updlinehaulrate").removeClass("invalidField");
		$("#updMinRate").removeClass("invalidField");
		$("#updMexRate").removeClass("invalidField");
		
		$("#massUpdateBlock").fadeOut(speed, function(){
			$("#laneListDropDown").animate({
				height: "80%"
			}, speed, function(){
				$("#geoBlock").fadeIn(speed);
			});
			//$("#laneContainer").animate({
			//	backgroundColor:"#D5D5D5"
			//}, speed);
			$("#laneListTable_wrapper > .dataTables_scroll > .dataTables_scrollBody").animate({
				height:"440px"
			}, speed);
		});
		
		
	}
	
	function setGeoUpdSelection($target, $li){
		var selectedGeo = $("#updGeoSearchList li.selected");
				
		if (selectedGeo.length == 0){
			selectedGeo = $li;
		}
		
		if (selectedGeo){
						
			// Search Update Geo for Origin, Destination or Border
			var i = -1;
			for (var x = 0; x < updgeo.length; x++) {
				if (updgeo[x].geotype == "ORG" && $target.attr("id") == "updOrigin"){
					i = x;
					break;
				}
				if (updgeo[x].geotype == "DST" && $target.attr("id") == "updDestination"){
					i = x;
					break;
				}
			};
			
			// Set Index for New Update Geo  
			if (i == -1){
				i = updgeo.length;
				updgeo[i] = {};
			};
			
						
			switch ($target.attr("id")){			
				case "updOrigin":
					updgeo[i].geotype = "ORG";
					$("#updOrigin").val(selectedGeo.ignore("span").text());
					updOrigin = selectedGeo.ignore("span").text();
					break;
				case "updDestination":
					updgeo[i].geotype = "DST";
					$("#updDestination").val(selectedGeo.ignore("span").text());
					updDestination = selectedGeo.ignore("span").text();
					break;
			};
			
			updgeo[i].sequence = 0;
			updgeo[i].idpqlangeo = selectedGeo.attr("idpqlangeo");
			updgeo[i].pointsrc = selectedGeo.attr("pointsrc");
			updgeo[i].idcity = selectedGeo.attr("idcity");
			updgeo[i].cityname = selectedGeo.attr("cityname");
			updgeo[i].idcounty = selectedGeo.attr("idcounty");
			updgeo[i].countyname = selectedGeo.attr("countyname");
			updgeo[i].state = selectedGeo.attr("state");
			updgeo[i].country = selectedGeo.attr("country");
			updgeo[i].idzip = selectedGeo.attr("idzip");
			updgeo[i].zipcode = selectedGeo.attr("zipcode");
			updgeo[i].zone = selectedGeo.attr("zone");
			updgeo[i].idregion = selectedGeo.attr("idregion");
			updgeo[i].region = selectedGeo.attr("region");
			updgeo[i].segment = selectedGeo.attr("segment");
			updgeo[i].applycarr = selectedGeo.attr("applycarr");
			
			
			
			// set selected record overlay
			$target.siblings(".selectedListItem").children("span").text(selectedGeo.ignore("span").text());
			$target.fadeOut("fast", function(){
				$target.siblings(".selectedListItem").animate({
					top: 0
				}, "fast");
				$target.val(selectedGeo.ignore("span").text());
			});

			$("#updGeoSearchList").remove();
			
			// Set focus to next input box
			if ($target.attr("id") == "updOrigin"){
				$("#updDestination").focus();
			} else {
				$("#updBorder").focus();
			}
		}
	}
	
	function validateLineHaul(){
		
		// Clear Invalid Fields
		if ($("#updlinehaulrate").hasClass("invalidField")) {
			$("#updlinehaulrate").removeClass("invalidField");
			$("#updlinehaulrate").removeAttr("title");
		}
		if ($("#updlinehauluom").hasClass("invalidField")) {
			$("#updlinehauluom").removeClass("invalidField");
			$("#updlinehauluom").removeAttr("title");
		}
		
		
		// Validate Linehaul Rate and Unit of Measure
		var linehaulrate = $("#updlinehaulrate").val();
		var selecteduom = $("#updlinehauluom option:selected").val();
		var valid = true;
		
		if ( linehaulrate != "" ){
			if (! $.isNumeric(linehaulrate)){
				$("#updlinehaulrate").addClass("invalidField");
				$("#updlinehaulrate").attr("title", "Linehaul Rate must be Numeric.");
				valid = false;
			}
			if (selecteduom == ""){
				$("#updlinehauluom").addClass("invalidField");
				$("#updlinehauluom").attr("title", "Linehaul Unit of Measure Required.");
				valid = false;
			}
		} else {
			if (selecteduom != ""){
				$("#updlinehaulrate").addClass("invalidField");
				$("#updlinehaulrate").attr("title", "Linehaul Rate Required.");
				valid = false;
			}
		}
		
		
		
		if ((linehaulrate != "")  && (valid == true)){
			
			// Format Rate in Correct Decimal Precision
			// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM
        	var rule_ratedecimals = 0;
            for (i = 0; i < rules.length; i++) { 
            	if ((rules[i].linecode == "100") && (rules[i].uom == selecteduom)
            		&& (rules[i].linecodetype == "F")){
            		rule_ratedecimals = rules[i].ratedecprc;
            	    break;
            	};
            }
         // Calculate Decimal Precision Multiplier
            var decimal_mult;
    	    if (rule_ratedecimals == 0){
    	      	decimal_mult = 1;
    	    } else {
    	    	decimal_mult = Math.pow(10,rule_ratedecimals)
    	    };
    	  // Replace Line Haul Rate with Correct Decimal Rate
    	    var formattedRate = ((linehaulrate * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
    	    $("#updlinehaulrate").val(formattedRate);
   
		}
		
		if (valid && (linehaulrate != "" || (linehaulrate == "" && selecteduom == ""))){
			updlinehaulrate = linehaulrate;
			updlinehauluom = selecteduom;
		};
		
		if (!valid){
			$("#updAllButton").addClass("disabled");
		} else {
			if (! $("#updexpireDate").hasClass("invalidDate") && ! $("updeffectiveDate").hasClass("invalidDate") ){
				$("#updAllButton").removeClass("disabled");
			}
		};
		
		return valid;
	
	}
	
function validateMRates() {
	var decimal_mult = 1;
	var i = 0;
	var minRate = $("#updMinRate").val();
	var mexRate = $("#updMexRate").val();
	var rule_ratedecimals = 0;
	var valid = true;
	
	
	if ($("#updMinRate").hasClass("invalidField")) {
		$("#updMinRate").removeClass("invalidField");
		$("#updMinRate").removeAttr("title");
	}
	if ($("#updMexRate").hasClass("invalidField")) {
		$("#updMexRate").removeClass("invalidField");
		$("#updMexRate").removeAttr("title");
	}
	
	// Validate Minimum Rate
	if ( minRate != "" ){
		if (! $.isNumeric(minRate)){
			$("#updMinRate").addClass("invalidField");
			$("#updMinRate").attr("title", "Minimum Rate must be Numeric.");
			valid = false;
		} else {
			// Format Rate in Correct Decimal Precision
			// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM - Min Charge uses Line 100
        	rule_ratedecimals = 0;
            for (i = 0; i < rules.length; i++) { 
            	if ((rules[i].linecode == "100") && (rules[i].uom == "F/R")
            		&& (rules[i].linecodetype == "F")){
            		rule_ratedecimals = rules[i].ratedecprc;
            	    break;
            	};
            }
         // Calculate Decimal Precision Multiplier
            if (rule_ratedecimals == 0){
    	      	decimal_mult = 1;
    	    } else {
    	    	decimal_mult = Math.pow(10,rule_ratedecimals)
    	    };
    	  // Replace Line Haul Rate with Correct Decimal Rate
    	    var formattedRate = ((minRate * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
    	    $("#updMinRate").val(formattedRate);
		}
	}
	// Validate Mexico Rate
	if ( mexRate != "" ){
		if (! $.isNumeric(mexRate)){
			$("#updMexRate").addClass("invalidField");
			$("#updMexRate").attr("title", "Mexico Rate must be Numeric.");
			valid = false;
		} else {
			// Format Rate in Correct Decimal Precision
			// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM - Mexico Charge uses Line 275
        	rule_ratedecimals = 0;
            for (i = 0; i < rules.length; i++) { 
            	if ((rules[i].linecode == "275") && (rules[i].uom == "F/R")
            		&& (rules[i].linecodetype == "F")){
            		rule_ratedecimals = rules[i].ratedecprc;
            	    break;
            	};
            }
         // Calculate Decimal Precision Multiplier
            if (rule_ratedecimals == 0){
    	      	decimal_mult = 1;
    	    } else {
    	    	decimal_mult = Math.pow(10,rule_ratedecimals)
    	    };
    	  // Replace Line Haul Rate with Correct Decimal Rate
    	    var formattedRate = ((mexRate * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
    	    $("#updMexRate").val(formattedRate);
		}
	}
	
	return valid;
	
}
function validateUpdDates() {
		
		var effIsValid = true;
		var expIsValid = true;
		
		var effMoment;
		var effString;
		
		var expMoment;
		var expString;
		
		var yearLength;
		
		effString = $("#updeffectiveDate").val();
		if (effString != ""){
			if (effString.indexOf("/") != -1) {
				
				yearLength = (effString.length - 1) - effString.lastIndexOf("/");
				
				if (yearLength == 1 || yearLength == 2) {
					effMoment = new moment(effString, "MM-DD-YY");
				} else {
					effMoment = new moment(effString, "MM-DD-YYYY");
				}
			} else {
				if (effString.length == 6) {
					effMoment = new moment(effString, "MM-DD-YY");
				}
				else {
					effMoment = new moment(effString, "MM-DD-YYYY");
				}
			}
			
			// check to see if the effective date is valid
			if (effMoment.isValid()) {
				
				// clear if previously invalid
				if ($("#updeffectiveDate").hasClass("invalidDate")) {
					$("#updeffectiveDate").removeClass("invalidDate");
					$("#updeffectiveDate").removeAttr("title");
				}
				
				// set global variable
				updeffectiveDate = effMoment.format("YYYY-MM-DD");

				$("#updeffectiveDate").val(effMoment.format("MM/DD/YYYY"));
				
			} else {
				$("#updeffectiveDate").addClass("invalidDate");
				$("#updeffectiveDate").attr("title", "Invalid Date");
				effIsValid = false;
			}
		}
		

		expString = $("#updexpireDate").val();
		if (expString != ""){
			if (expString.indexOf("/") != -1) {
				
				yearLength = (expString.length - 1) - expString.lastIndexOf("/");
				
				if (yearLength == 1 || yearLength == 2) {
					expMoment = new moment(expString, "MM-DD-YY");
				} else {
					expMoment = new moment(expString, "MM-DD-YYYY");
				}
			} else {
				if (expString.length == 6) {
					expMoment = new moment(expString, "MM-DD-YY");
				}
				else {
					expMoment = new moment(expString, "MM-DD-YYYY");
				}
			}
			
			// check to see if the expiration date is valid
			if (expMoment.isValid()) {
				
				if ($("#updexpireDate").hasClass("invalidDate")) {
					$("#updexpireDate").removeClass("invalidDate");
					$("#updexpireDate").removeAttr("title");
				}
			
				// check to see if expiration date is greater than effective date
				if (effString != ""){
					if (expMoment < effMoment) {
						$("#updexpireDate").addClass("invalidDate");
						$("#updexpireDate").attr("title", "Expiration date must be after Effective date");
						expIsValid = false;
					} else {
						if ($("#updexpireDate").hasClass("invalidDate")) {
							$("#updexpireDate").removeClass("invalidDate");
							$("#updexpireDate").removeAttr("title");
						}
						
						
						updeffectiveDate = effMoment.format("YYYY-MM-DD");
						updexpireDate = expMoment.format("YYYY-MM-DD");
						
						
						$("#updeffectiveDate").val(effMoment.format("MM/DD/YYYY"));
						$("#updexpireDate").val(expMoment.format("MM/DD/YYYY"));
					}
				} else {
					updexpireDate = expMoment.format("YYYY-MM-DD");
					$("#updexpireDate").val(expMoment.format("MM/DD/YYYY"));
				}
				
			} else {
				$("#updexpireDate").addClass("invalidDate");
				$("#updexpireDate").attr("title", "Invalid Date");
				expIsValid = false;
			}					
		} 
		
		if (effIsValid && expIsValid) {
			if (! $("#updlinehauluom").hasClass("invalidField") && ! $("#updlinehaulrate").hasClass("invalidField") ){
				$("#updAllButton").removeClass("disabled");
			}
			
			return true;
		} else {
			$("#updAllButton").addClass("disabled");
			return false;
		}
		
		
		
}
function updateMassLanes(){
	var errMessage = false;
	var error = false;
	var massUpdateXML;
	var url;
	
	updlanetype = $("#updlanetype option:selected").text();
	updMexRate = $("#updMexRate").val();
	updMinRate = $("#updMinRate").val();
	updWorkFlowStatus = $("#updWorkFlowStatus option:selected").attr("sdesc");
	updWorkFlowStatusCode = $("#updWorkFlowStatus option:selected").attr("value");
    updUserType = $("#massUpdateUserType option:selected").attr("value");
    updUser = $("#massUpdateUser option:selected").attr("value");
	
	//Build Import XML includes header, detail and Lanes
	massUpdateXML = massUpdate_xml();
	
	url = "PQxml.pgm?Func=MASSUPDATE"; 	
	
	$.ajax({
		type: "POST",
			url: url,
			data: massUpdateXML,
			dataType: "xml",
			cache: false,
			
			success: function(xml) {
				
				if (!massRerate){
					// Update Lane List with Updated Fields 
					$(xml).find('lane').each(function(){
					
						for (var x = 0; x < lanes.length; x++) {
							if (lanes[x].idpqlandtl == $(this).attr("id")){
								// Check for Any Errors
								if ( $(this).attr("message") != ""){
									errMessage = true;
								} 
								
								// Check for Errors and Update Lane List with Updated Fields 
							
								if ( ($(this).attr("message") == "")  || 
									 ($(this).attr("message").search("QuoteType") < 0)	) {
										// Change Lane Type in Lane List
										if (updlanetype != ""){
											lanes[x].type = updlanetype;
										}
								}
								if ( ($(this).attr("message") == "")  || 
										 ($(this).attr("message").search("Status") < 0)	) {
											// Change Work Flow Status in Lane List
											if (updWorkFlowStatusCode != "*"){
												lanes[x].workflowstatus = updWorkFlowStatus;
											//	lanes[x].workflowstatuscode = updWorkFlowStatusCode;
											}
								}
								if ( ($(this).attr("message") == "")  || 
									 ($(this).attr("message").search("Rate") < 0)	) {
									// Change Linehaul Rate in Lane List
									if (updlinehaulrate != "" && updlinehauluom != 'MIN'){
										// Change Line Type in Lane List if Necessary
										if (updlinehaulrate == 0 && lanes[x].proposedrate != 0 && lanes[x].type == 'Prop'){
											lanes[x].type = 'Inq';
										} else {
											if (updlinehaulrate != 0 && lanes[x].proposedrate == 0 && lanes[x].type == 'Inq'){
												lanes[x].type = 'Prop';
											}
										} 
										lanes[x].proposedrate = updlinehaulrate;
										lanes[x].proposeduom = updlinehauluom;
									}
								}
								
								if ( ($(this).attr("message") == "")  || 
									 ($(this).attr("message").search("ORG") < 0)	) {
									// Change Origin in Lane List
									for (var y = 0; y < updgeo.length; y++) {
										if (updgeo[y].geotype == "ORG"){
											lanes[x].origin = updOrigin;
											lanes[x].originsource = updgeo[y].pointsrc;
											lanes[x].originzone = updgeo[y].zone;
										}
									}
								}
								
								if ( ($(this).attr("message") == "")  || 
									 ($(this).attr("message").search("DST") < 0)	) {
										// Change Destination in Lane List
									for (var y = 0; y < updgeo.length; y++) {
										if (updgeo[y].geotype == "DST"){
											lanes[x].destination = updDestination;
											lanes[x].destinationsource = updgeo[y].pointsrc;
											lanes[x].destinationzone = updgeo[y].zone;
										}
								
									}
									
								}
								
								// Error Messages Exist - Change Error Message Flag and Error Message in Lanes Array
								if ( $(this).attr("message") != ""){
									lanes[x].upderror = true;
									lanes[x].updmessage = $(this).attr("message");
								} else {
									lanes[x].upderror = false;
									lanes[x].updmessage = "";
									
									// Retrieve Selected Lane to Update Minimized Lane List
									if (lanes[x].lanenumber == lanenumber){
										retrieveProposal(quotenum, lanenumber);
									}
								}
								
							}
						}
								
	
					});
				}
				$("#propMessageSpinner").css("display", "none");
				if (errMessage){
						$("#propMessage").addClass("updError");
						// Show "Error" message
						$("#propMessage > span").html("Errors found").show();
                           $("#propMessage").css("display", "inline-block");                          
						$("#propMessage").show();
						setTimeout(function() {
							$("#propMessage").fadeOut();
							$("#propMessage").removeClass("updError");
							}, 1500);
				} else {
					if (massRerate){
						// Show "ReRate Submitted" message
						$("#propMessage > span").html("Re-Rate Submitted").show();
					}else{
					// Show "Complete" message
					$("#propMessage > span").html("Update Complete").show();
                    }
                    $("#propMessage").css("display", "inline-block");
					$("#propMessage").show();
					setTimeout(function() {
						$("#propMessage").fadeOut();
							
						}, 1500);
					hideMassUpdateForm();
				};
				rebuildLaneListDatatable();
					
				
			},
					
			complete: function() {
				
				
			},
					
			error: function() {
				alert('Could not Update Mass Data');
		
			}
	});
		
	
		
}

	