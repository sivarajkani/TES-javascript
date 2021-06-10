// JavaScript Document

	function setup(){
		//retrieveAuth();
        retrieveAuthority(function(){
        	setAuthorizedQuoteTypes();
        	if (!ds_Auth.showDeficit){
        		$("#viewDeficitDetails").addClass("disabled");
        		$("#getDeficits").addClass("disabled");
         	}
        });
		assignClickFunctions();
		assignShipConditionClick();
		retrieveBorderCities($('#borderSelect, #updBorder'));
		retrieveWorkFlowStatus($('#updWorkFlowStatus, #workFlowStatus'));
		retrieveAllLaneUsers(function(){
			buildLaneUserSelectOptions($("#salesUser"),"SALES");
			buildLaneUserSelectOptions($("#publishUser"),"PUBLISH");
			buildLaneUserSelectOptions($("#priceUser"),"PRICING");
		});
		retrieveRateGridRules();
		retrieveShipCondCodes();
		getAccessorialCodes();
		retrieveDeficitCodes();
		retrieveDeficitRules();
		retrieveContactMethods();
		retrieveCommentTypes($('#custCommentType'));
		buildRateGrid();
		initSpinners();
		rebuildLaneListDatatable();
		initDatepickers();
		overrideAlertBox();
        retrieveVolumetricsColumns();
        retrieveVolumetricsUOM(function(){
            buildVolumetricsUOM_Select($(".volumetricSelectRate"),"rate");
            buildVolumetricsUOM_Select($(".volumetricSelectProp"),"prop");
        });

        retrieveAnalyticsTabLayout();

		// initialize lane nav number to "New"
		$("#laneNavNum, #laneNavSpinner").val("New");

		//rebuildLaneNav();
		$("#tabs").tabs({
			activate: function(event, ui){
				var selectedTab = $(ui.newPanel[0]).attr('id');
				if (selectedTab == "notesTab"){
					$("#commentBox").focus();
					$("#notesTabAsterisk").css("visibility","hidden");
				} else {
					$("#notesTabAsterisk").css("visibility","visible");
				}
				if (selectedTab == "volumetricsTab"){
					$("#volumetricsTabAsterisk").css("visibility","hidden");
				} else {
					$("#volumetricsTabAsterisk").css("visibility","visible");
				}
			}
		});
		initToolTipster();
		initializeTools();
		assignTabFunctions();

		var quote = getURLParm('quotenum');
		var lane = getURLParm('lane');
		var laneList = getURLParm('lanelist');
		
		// Default Lane Type to Inquiry
		quotetype = 'I';
		$(".laneType").val('I');
		disableQuoteTypes(function(){
			setAuthorizedQuoteTypes(function(){
				// Disable Proposal and Spot for new quote with no price
			    $(".laneType option:contains('Proposal')").attr('disabled','disabled');
			    $(".laneType option:contains('Spot')").attr('disabled','disabled');
			})
		})
		
		if (quote != 'error'){
			$("#logo").switchClass("splashPosition", "cornerPosition");

            $("#helpButton").show();

			if (lane != 'error'){
				if ($("#sMaskLanes").css('display') != "block"){
					$("#sMaskLanes").toggle();
					lanesCL.show();
					$("#sLoadingLanes").css('display','block');
				}
			};

			retrieveProposal(quote, lane, function(){
				if (laneList == "true"){
					$("#listDropIcon").click();
				}

				$("#customerBlock").css("visibility", "visible");
				$("#contactBlock").css("visibility", "visible");
			});
		} else {
			$("#logo").show();
			$("#startForm").show();
			$("#startCustEntry").focus();


		}

	    // Set workflow status to NEW
//		$("#workFlowStatus").val("");
//		setAuthorizedWorkFlow();



		// Hide Lane Users on Lane Line
		$("#miniLaneUsers").css("visibility", "hidden");
		$("#miniRates").css("visibility", "hidden");



	}

//-----------------------------------------------------------------------------------------------
// Control functions
//-----------------------------------------------------------------------------------------------
	function initSpinners() {
  		subCL = new CanvasLoader('sLoading');
		subCL.setColor('#5c5b6b'); // default is '#000000'
		subCL.setShape('spiral'); // default is 'oval'
		subCL.setDiameter(50); // default is 40
		subCL.setDensity(60); // default is 40
		subCL.setRange(1.2); // default is 1.3
		subCL.setSpeed(3); // default is 2
		subCL.show(); // Hidden by default

		// initialize the "Saving..." spinner
		savingCL = new CanvasLoader('propMessageSpinner');
		savingCL.setColor('#ffffff'); // default is '#000000'
		savingCL.setShape('spiral'); // default is 'oval'
		savingCL.setDiameter(14); // default is 40
		savingCL.setDensity(60); // default is 40
		savingCL.setRange(1.2); // default is 1.3
		savingCL.setSpeed(3); // default is 2
		savingCL.show(); // Hidden by default

		lanesCL = new CanvasLoader('sLoadingLanes');
		lanesCL.setColor('#5c5b6b'); // default is '#000000'
		lanesCL.setShape('spiral'); // default is 'oval'
		lanesCL.setDiameter(50); // default is 40
		lanesCL.setDensity(60); // default is 40
		lanesCL.setRange(1.2); // default is 1.3
		lanesCL.setSpeed(6); // default is 2
		lanesCL.show(); // Hidden by default

        analyticsCL = new CanvasLoader('analyticsSpinner');
        analyticsCL.setColor('#5c5b6b'); // default is '#000000'
        analyticsCL.setShape('spiral'); // default is 'oval'
        analyticsCL.setDiameter(50); // default is 40
        analyticsCL.setDensity(60); // default is 40
        analyticsCL.setRange(1.2); // default is 1.3
        analyticsCL.setSpeed(6); // default is 2
        analyticsCL.show(); // Hidden by default

	}

    function revealTabs(speed){
        if (speed == "fast"){
            $("#tabs").addClass("revealFast");
            $("#bodyContainer").addClass("fullSizeFast");
        } else {
            $("#tabs").addClass("revealSlow");
            $("#bodyContainer").addClass("fullSizeSlow");
        }

    }

	function popGeoArray(){
		var pointCount = 0;

		// need a temporary geo array to carry over
		// the lane geo ids
		var tempGeo = [];

		// save all the existing lan geo ids
		for (i = 0; i < geo.length; i++) {
			tempGeo[i] = {};
			tempGeo[i].geotype = geo[i].geotype;
			tempGeo[i].idpqlangeo = geo[i].idpqlangeo;
			tempGeo[i].idcity = geo[i].idcity;
			tempGeo[i].idregion = geo[i].idregion;
			tempGeo[i].sequence = geo[i].sequence;
		}

		geo.length = 0;

		$.each(laneLayout, function(i, section){
			$.each(section.points, function(j, point){

				switch (point.geotype) {
				case "ORG":
					for (k = 0; k < tempGeo.length; k++) {
						if (tempGeo[k].geotype == "ORG") {
							point.idpqlangeo = tempGeo[k].idpqlangeo;
						}
					}
					break;
				case "DST":
					for (k = 0; k < tempGeo.length; k++) {
						if (tempGeo[k].geotype == "DST") {
							point.idpqlangeo = tempGeo[k].idpqlangeo;
						}
					}
					break;
				case "SIT":
					for (k = 0; k < tempGeo.length; k++) {
						if (tempGeo[k].geotype == "SIT" && tempGeo[k].idcity == point.idcity
								&& tempGeo[k].sequence == point.sequence) {
							point.idpqlangeo = tempGeo[k].idpqlangeo;
						}
					}
					break;
				case "BRD":
					if (laneLayout[i-1].points[laneLayout[i-1].points.length-1].country == "US") {
						for (k = 0; k < tempGeo.length; k++) {
							if (tempGeo[k].geotype == "PEX") {
								point.idpqlangeo = tempGeo[k].idpqlangeo;
							}
						}
					} else {
						for (k = 0; k < tempGeo.length; k++) {
							if (tempGeo[k].geotype == "PEN") {
								point.idpqlangeo = tempGeo[k].idpqlangeo;
							}
						}
					}
					break;
				}

				var g = (geo[pointCount] = {});
				pointCount++;

				g["idpqlangeo"] = point.idpqlangeo;
				g["sequence"] = pointCount;

				if (point.geotype == "BRD"){
//					if (laneLayout[i-1].points[laneLayout[i-1].points.length-1].country == "US") {
					if (laneLayout[i-1].points[laneLayout[i-1].points.length-1].country != "MX") {
						// Port of Exit
						g["geotype"] = "PEX";
					} else {
						// Port of Entry
						g["geotype"] = "PEN";
					}
				} else {
					g["geotype"] = point.geotype;
				}

				g["pointsrc"] = point.pointsrc;
				g["idcity"] = point.idcity;
				g["cityname"] = point.cityname;
				g["idcounty"] = point.idcounty;
				g["countyname"] = point.countyname;
				g["state"] = point.state;
				g["country"] = point.country;
				g["idzip"] = point.idzip;
				g["zipcode"] = point.zipcode;
				g["zone"] = point.zone;
				g["idregion"] = point.idregion;
				g["region"] = point.region;
				g["segment"] = point.segment;
				g["applycarr"] = point.applycarr;
			});
		});
	}

	function geoToScreen(){
		laneLayout.length = 0;

		geo.sort(function(a, b){
			if (Number(a.sequence) < Number(b.sequence))
				return -1;
			if (Number(a.sequence) > Number(b.sequence))
				return 1;

			return 0;
		});

		// Populate LaneLayout
		var sectionNum = 0;
		$.each(geo, function(index, point){
			var geoPoint =
			{
				idpqlangeo: point.idpqlangeo,
				sequence:	point.sequence,
				geotype:	point.geotype,

				pointsrc:	point.pointsrc,
				idcity:		point.idcity,
				cityname:	point.cityname,
				idcounty:	point.idcounty,
				countyname:	point.countyname,
				state:		point.state,
				country:	point.country,
				idzip:		point.idzip,
				zipcode:	point.zipcode,
				zone:		point.zone,
				idregion:	point.idregion,
				region:     point.region,
				segment:	point.segment,
				applycarr:	point.applycarr
			}

			switch (point.geotype){
				case "ORG":
					sectionNum = 0;
					break;
				case "DST":
					sectionNum++;
					break;
				case "BRD":
					sectionNum++;
					break;
				case "PEN":
					geoPoint.geotype = "BRD";
					sectionNum++;
					break;
				case "PEX":
					geoPoint.geotype = "BRD";
					sectionNum++;
					break;
				case "SIT":
					if (geo[index-1].geotype != "SIT"){
						sectionNum++;
					}
					break;
			}
			addPointToLane(geoPoint, sectionNum, true);
		});

		// Set visuals
		// Determine if the Quote was created from Search has a Border City
		if (geo.length > 1 &&
		    geo[geo.length-1].geotype != "DST"){
			var borderFromSearch = true;
		} else {
			var borderFromSearch = false;
		}

		if ($("#entryBox:hidden").length == 0 && geo.length > 1 && ! borderFromSearch){
			$("#entryBox").animate({
				height: "toggle",
				opacity: "toggle"
			}, "100");
		} else if ($("#entryBox:hidden").length > 0 && (geo.length == 1 || borderFromSearch)) {
			$("#entryBox").animate({
				height: "toggle",
				opacity: "toggle"
			}, "100", function(){
				$("#laneMap").show();
				$("#borderSelect").hide();
				$("#entryBox .searchBox").show();
				searchFor = "dest";
				$("#geoEntryLabel").html("Enter a Destination");
				$("#geoEntry").focus();
			});
		}

		if ($("#originTag").hasClass("pos1")){
			$("#originTag").switchClass("pos1", "pos2", 0, function(){
				$("#originTag").switchClass("pos2", "pos3", 0 );
				$("#laneLine").switchClass("pos1", "pos2", 0, function(){

					// Set Origin Label - originlabel
					setGeoLabel(0, true);

				});
			});
		} else {

			// Set Origin Label - originlabel
			setGeoLabel(0, true);

		}


		if ($("#destTag").hasClass("pos1") && geo.length > 1 && ! borderFromSearch){
			$("#destTag").switchClass("pos1", "pos3", 0, function() {

				// Set Destination Label - destLabel
				setGeoLabel(geo.length-1, false);

			});

			//Show temp click area if necessary
			if ($(".mapPoint").length == 0){
				$("#tempTag").show();
			}
		} else if ($("#destTag").hasClass("pos3") && geo.length > 1 && ! borderFromSearch){

			// Set Destination Label - destLabel
			setGeoLabel(geo.length-1, false);

			//Show temp click area if necessary
			if ($(".mapPoint").length == 0){
				$("#tempTag").show();
			}
		} else if ($("#destTag").hasClass("pos1") && geo.length == 1) {

		}

		drawMap();

		if (geo.length > 1 && ! borderFromSearch){
			$("#rateBlock").css("visibility","visible");
		}

		function setGeoLabel(idx, originTrue){
			if (originTrue){
				// Set Origin Label
				switch (geo[idx].pointsrc){
				case "CC":
					switch (geo[idx].country){
					case "MX":
						$("#originLabel").html("<div>MEXICO</div>").show();
						break;
					case "US":
						$("#originLabel").html("<div>UNITED STATES</div>").show();
						break;
					case "CD":
						$("#originLabel").html("<div>CANADA</div>").show();
						break;
					}
					$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zone+"</span>"));
					break;
				case "CL":
					if (geo[idx].countyname != ""){
						$("#originLabel").html("<div>"+geo[idx].cityname + ", " + geo[idx].state + ", " + geo[idx].countyname+"</div>").show();
					} else {
						$("#originLabel").html("<div>"+geo[idx].cityname + ", " + geo[idx].state+"</div>").show();
					}
					$("#originLabel").append($("<span>"+geo[idx].zone+" / "+geo[idx].zipcode+"</span>"));
					break;
				case "RG":
					$("#originLabel").html("<div>"+geo[idx].region+"</div>").show();
					//$("#originLabel").append($("<span>Region</span>"));
					$("#originLabel").append($('<div id="regionOrgInfoIcon" class="regionInfoIcon" href="#regionForm"></div>'));
					$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zipcode+"</span>"));
					$('#regionOrgInfoIcon').css("display", "inline-block");
					$("#regionOrgInfoIcon").click(function(e){
						e.stopPropagation();
						getRegionDetail(geo[0].idregion,function(){
							$.fancybox($("#regionForm"), {
								//beforeShow: function() {
						    	//	this.wrap.draggable();
					    		//},
								helpers: {
									overlay: false
								}
							});
						});
					});
					break;
				case "ST":
					$("#originLabel").html("<div>"+geo[idx].state+"</div>").show();
					if (geo[idx].countyname != ""){
						$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].countyname+" / "+geo[idx].zipcode+"</span>"));
					} else {
						$("#originLabel").append($("<span>"+geo[idx].cityname + " / "+geo[idx].zipcode+"</span>"));
					}
					break;
				case "Z3":
					$("#originLabel").html("<div>"+geo[idx].zipcode+"</div>").show();
					if (geo[idx].countyname != ""){
						$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state + ", " + geo[idx].countyname+" / "+geo[idx].zone+"</span>"));
					} else {
						$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zone+"</span>"));
					}
					break;
				case "Z5":
					$("#originLabel").html("<div>"+geo[idx].zipcode+"</div>").show();
					if (geo[idx].countyname != ""){
						$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state + ", " + geo[idx].countyname+" / "+geo[idx].zone+"</span>"));
					} else {
						$("#originLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zone+"</span>"));
					}
					break;
				};
			} else {
				// Set Destination Label
				switch (geo[idx].pointsrc){
				case "CC":
					switch (geo[idx].country){
					case "MX":
						$("#destLabel").html("<div>MEXICO</div>").show();
						break;
					case "US":
						$("#destLabel").html("<div>UNITED STATES</div>").show();
						break;
					case "CD":
						$("#destLabel").html("<div>CANADA</div>").show();
						break;
					}
					$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zone+"</span>"));
					break;
				case "CL":
					if (geo[idx].countyname != ""){
						$("#destLabel").html("<div>"+geo[idx].cityname + ", " + geo[idx].state + ", " + geo[idx].countyname+"</div>").show();
					} else {
						$("#destLabel").html("<div>"+geo[idx].cityname + ", " + geo[idx].state).show();
					}
					$("#destLabel").append($("<span>"+geo[idx].zone+" / "+geo[idx].zipcode+"</span>"));
					break;
				case "RG":
					$("#destLabel").html("<div>"+geo[idx].region+"</div>").show();
					//$("#destLabel").append($("<span>Region</span>"));
					$("#destLabel").append($('<div id="regionDestInfoIcon" class="regionInfoIcon" href="#regionForm"></div>'));
					$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zipcode+"</span>"));
					$('#regionDestInfoIcon').css("display", "inline-block");
					$("#regionDestInfoIcon").click(function(e){
						e.stopPropagation();
						getRegionDetail(geo[geo.length-1].idregion,function(){
							$.fancybox($("#regionForm"), {
								//beforeShow: function() {
						    	//	this.wrap.draggable();
					    		//},
								helpers: {
									overlay: false
								}
							});
						});
					});
					break;
				case "ST":
					$("#destLabel").html("<div>"+geo[idx].state+"</div>").show();
					if (geo[idx].countyname != ""){
						$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].countyname+" / "+geo[idx].zipcode+"</span>"));
					} else {
						$("#destLabel").append($("<span>"+geo[idx].cityname + " / "+geo[idx].zipcode+"</span>"));
					}
					break;
				case "Z3":
					$("#destLabel").html("<div>"+geo[idx].zipcode+"</div>").show();
					if (geo[idx].countyname != ""){
						$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state + ", " + geo[idx].countyname+" / "+geo[idx].zone+"</span>"));
					} else {
						$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zone+"</span>"));
					}
					break;
				case "Z5":
					$("#destLabel").html("<div>"+geo[idx].zipcode+"</div>").show();
					if (geo[idx].countyname != ""){
						$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state + ", " + geo[idx].countyname+" / "+geo[idx].zone+"</span>"));
					} else {
						$("#destLabel").append($("<span>"+geo[idx].cityname + ", " + geo[idx].state+" / "+geo[idx].zone+"</span>"));
					}
					break;

				};


			};
		}

	}

	function initDatepickers() {
    	// turn the textboxes into datepickers
		$(".dateEntry input").datepicker({
			showOn: "button",
			buttonImage: "../images/calendar.gif",
			buttonImageOnly: true,
			onSelect: function(){
				//$("#effectiveDate").blur();
				$(this).change();
				if (laneLayout.length > 1){
					// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
			        if (saveAuthorized == true && !massUpdateMode && !publishMode){
			        	if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
			        		$("#saveRates").removeClass("disabled");
			        	}
			        };
					$("#emailButton").addClass("disabled");
				}
			}
		});

		// Setting the Effective date to current date and Expires 90 days later
		$("#effectiveDate").datepicker("setDate", "0");
		$("#expirationDate").datepicker("setDate", "+45");

		// get the value from the effective and expiration textboxes
		var efDate = new moment($("#effectiveDate").val(), "MM-DD-YYYY");
		var exDate = new moment($("#expirationDate").val(), "MM-DD-YYYY");

		// set the global variables
		effdate = efDate.format("YYYY-MM-DD");
		expdate = exDate.format("YYYY-MM-DD");
    }

	// Rebuild Screen
	function rebuildScreen (){
		if (quotenum == 0){
			document.title = "New Quote";
		} else {
			document.title = quotenum + "-" + lanenumber;
		};

		// Rebuild Proposal Header and Lane Detail
		rebuildHdrLaneDtl ();

		// Transfer contents of geo array to lane map
		emptyMap();
		if (geo.length != 0){
			geoToScreen();
		}

		// Check for matches
		if (geo.length > 1){
			retrieveMatchedQuotes();
		}

		// Rebuild Charges - Rate Grid
		rebuildCharges ();

		// Rebuild Notes - Tabs
		rebuildNotes();

		// Rebuild Statistics - Tabs
		//rebuildStats();


		// Disable Lane Type SPOT Select when Proposed Linehaul = 0
		if (chrg.length == 0){
			$(".laneType option:contains('Spot')").attr('disabled','disabled');
		} else {
			if (chrg[0].proprate == 0){
				$(".laneType option:contains('Spot')").attr('disabled','disabled');
			}
		};

	}

	// Rebuild Proposal Header and Lane Detail
	function rebuildHdrLaneDtl (){

        // Set Authorized Work Flow Status Selections based on Quote Type
        setAuthorizedWorkFlow(function(){
            // Set Value of Current Work Flow Status
            $("#workFlowStatus").val(approvdsts);
        });


		// Proposal Header
		// Populate Proposal Number HTML Element
		$('#proposalNumber span').html(quotenum);


		// Set Method of Contact Value
		$(".contMethod").val(idpqcontme);


		// Retrieve Customer Info - Populates Customer HTML
		var userCount = 0;
		customer = cusprefix + cusbase + cussuffix;
		if (customer != "") {
			if (contactid == 0){
				getPrimaryCustContact = true;
			} else {
				getPrimaryCustContact = false;
				retrieveContact(contactid);
			};

			retrieveCUST(customer, function(){


				if (quotenum != ""){
					 // Clear Lane Users
						$("#salesUser").val("");
						$("#priceUser").val("");
						$("#publishUser").val("");
						$("#miniSalesUser").html("");
					    $("#miniPriceUser").html("");
					    $("#miniPublishUser").html("");
					// Lane User from Proposal
					for (i = 0; i < quoteLaneUsers.length; i++){
						switch (quoteLaneUsers[i].usertype){
						case "SALES":
							$("#salesUser").val(quoteLaneUsers[i].userprofile);
							$("#miniSalesUser").html(quoteLaneUsers[i].userprofile);
							userCount++;
							break;
						case "PRICING":
							$("#priceUser").val(quoteLaneUsers[i].userprofile);
							$("#miniPriceUser").html(quoteLaneUsers[i].userprofile);
							userCount++;
							break;
						case "PUBLISH":
							$("#publishUser").val(quoteLaneUsers[i].userprofile);
							$("#miniPublishUser").html(quoteLaneUsers[i].userprofile);
							userCount++;
							break;
						}
					}
				}

				$("#proposalMenu").css("display", "block");
                $("#tabs").css("display", "inline-block");
                $("#analyticsSection").css("display", "inline-block");

				// Adjust mini lane display
				if (userCount != 0){
					$("#miniLaneUsers").show();
				}

                if ($(".miniLaneUser:visible").length == userCount){
					$(".miniLaneUser").each(function(){
						if ($(this).children(".miniUserVal").is(":hidden") && $(this).children(".miniUserVal").html() != ""){
							$(this).fadeIn("100");
						}
					});
				} else {
					$("#miniLaneUsers").animate({
						width: 11*userCount + "%"
					}, "fast", function(){
						$("#miniLaneUsers").animate({
							paddingLeft: (userCount == 0 ? "0px" : "10px")
						}, 50, function(){
							if (userCount == 0){
								$("#miniLaneUsers").hide();
							}
						});

						$(".miniLaneUser").each(function(){
							if ($(this).children(".miniUserVal").html() != ""){
								$(this).fadeIn("100");
							}
						});
					});
				}

				if ($("#miniSalesUser").html() == "") {
					$("#miniSalesUser").parent().hide();
				}
				if ($("#miniPriceUser").html() == "") {
					$("#miniPriceUser").parent().hide();
				}
				if ($("#miniPublishUser").html() == "") {
					$("#miniPublishUser").parent().hide();
				}

				if (userCount > 0){

                    if ($(".miniLaneUser:visible").length == userCount){
						$(".miniLaneUser").animate({width: (Math.floor(100 / userCount) - 8) + "%"}, "fast");
					}
				}

			});

		} else {

			$('#proposalNumber span').html("&nbsp;");
			$('#customerNumber span').html("Enter Customer");
		    $('#customerName').html("");
			$('#custStreet').html("");
			$('#custCityStZip').html("");
			$('.contactNameLabel').html("Enter Contact Name");
			$('#contactPhone').html("");
			$('#contactEmail').html("");

			$('#custInfoIcon').hide();
			$('#contInfoIcon').hide();
			$('#rateBlock').css("visibility", "hidden");
		 	$('#tabs').css("display", "none");
			$('#saveRates').css('display', 'none');
			$('#newButton').css('display', 'none');
			$('#emailButton').css('display', 'none');
		};

		// Set Authorized Quote Lane Type Values
        setAuthorizedQuoteTypes(function(){
            // Set Lane Type Select Values
            switch (quotetype){
            //Bid
                case "B":
                    $(".laneType").val('B');
                    //$(".laneType option:contains('Bid')").removeAttr('disabled');
                    //$(".laneType option:contains('Inquiry')").removeAttr('disabled');
                    //$(".laneType option:contains('Proposal')").removeAttr('disabled');
                    //$(".laneType option:contains('Review')").removeAttr('disabled');
                    //$(".laneType option:contains('Spot')").removeAttr('disabled');
                    // Disable Lane Type SPOT and Proposal when Proposed Linehaul = 0
                    if (chrg.length == 0){
                        $(".laneType option:contains('Spot')").attr('disabled','disabled');
                        $(".laneType option:contains('Proposal')").attr('disabled','disabled');
                    } else {
                        if (chrg[0].proprate == 0){
                            $(".laneType option:contains('Spot')").attr('disabled','disabled');
                            $(".laneType option:contains('Proposal')").attr('disabled','disabled');
                        }
                    };
                    break;
                //Inquiry
                case "I":
                    $(".laneType").val('I');
                    // Disable SPOT and Proposal even if User is Authorized because Proposed Linehaul Rate = 0
                    $(".laneType option:contains('Proposal')").attr('disabled','disabled');
                    $(".laneType option:contains('Spot')").attr('disabled','disabled');
                    //$(".laneType option:contains('Bid')").removeAttr('disabled');
                    //$(".laneType option:contains('Inquiry')").removeAttr('disabled');
                    //$(".laneType option:contains('Proposal')").attr('disabled','disabled');
                    //$(".laneType option:contains('Review')").removeAttr('disabled');
                    //$(".laneType option:contains('Spot')").attr('disabled','disabled');
                    break;
                //Proposal
                case "P":
                    $(".laneType").val('P');
                    //$(".laneType option:contains('Bid')").removeAttr('disabled');
                    //$(".laneType option:contains('Inquiry')").attr('disabled','disabled');
                    //$(".laneType option:contains('Proposal')").removeAttr('disabled');
                    //$(".laneType option:contains('Review')").removeAttr('disabled');
                    //$(".laneType option:contains('Spot')").removeAttr('disabled');
                    break;
                //Review
                case "R":
                    $(".laneType").val('R');
                    //$(".laneType option:contains('Bid')").removeAttr('disabled');
                    //$(".laneType option:contains('Inquiry')").removeAttr('disabled');
                    //$(".laneType option:contains('Proposal')").removeAttr('disabled');
                    //$(".laneType option:contains('Review')").removeAttr('disabled');
                    //$(".laneType option:contains('Spot')").removeAttr('disabled');

                    // Disable Lane Type SPOT and Proposal even if User is Authorized because Proposed Linehaul Rate = 0
                    if (chrg.length == 0){
                        $(".laneType option:contains('Spot')").attr('disabled','disabled');
                        $(".laneType option:contains('Proposal')").attr('disabled','disabled');
                    } else {
                        if (chrg[0].proprate == 0){
                            $(".laneType option:contains('Spot')").attr('disabled','disabled');
                            $(".laneType option:contains('Proposal')").attr('disabled','disabled');
                        }
                    };
                    break;
                //Spot
                case "S":
                    $(".laneType").val('S');
                    // Disables All Quote Types from Selection Except Inquiry
                    disableQuoteTypes();
                    $(".laneType option:contains('Spot')").removeAttr('disabled');
                    $(".laneType option:contains('Inquiry')").attr('disabled','disabled');

                    //$(".laneType option:contains('Bid')").attr('disabled','disabled');
                    //$(".laneType option:contains('Inquiry')").attr('disabled','disabled');
                    //$(".laneType option:contains('Proposal')").attr('disabled','disabled');
                    //$(".laneType option:contains('Review')").attr('disabled','disabled');
                    //$(".laneType option:contains('Spot')").removeAttr('disabled');
                    break;

            };

        });


		// set the datepickers
		if (effdate == '0001-01-01') {
			$("#effectiveDate").datepicker("setDate", "0");
		    $("#expirationDate").datepicker("setDate", "+45");
		} else {

			// a moment object must be used for date format conversion
		    $("#effectiveDate").datepicker("setDate",
		    		(new moment(effdate, "YYYY-MM-DD")).format("MM/DD/YYYY")
		    );
		    $("#effectiveDate").val((new moment(effdate, "YYYY-MM-DD")).format("MM/DD/YYYY"));

		    $("#expirationDate").datepicker("setDate",
		    		(new moment(expdate, "YYYY-MM-DD")).format("MM/DD/YYYY")
		    );
		    $("#expirationDate").val((new moment(expdate, "YYYY-MM-DD")).format("MM/DD/YYYY"));
		}




		$("#auditPass").hide();
		$("#auditFail").hide();

		switch (auditreslt){
			// Pass
			case "P":
				$("#auditPass .auditNote").html("Audit Passed");
				$("#auditPass").show();
				break;
			// Fail
			case "F":
				$("#auditFail .auditNote").html("Audit Failed");
				$("#auditFail").show();
				break;
			// Not Audited
			default:
				break;

			}


	}

	// Rebuild Charges - Rate Grid
	function rebuildCharges (){
		var errMessage;
		var error = false;
		var rateCount = chrg.length;

		// Display Minimum Charge Info from Linehaul - Line Code 100 - Index=0
		if (chrg.length != 0){
			$("#minChrgRate span").html(chrg[0].rmsminchg);
			$("#minChrgRPM span").html(chrg[0].rmspubrpm);
			$("#minChrgPricedRateAmt").val(chrg[0].pricedminchr);
			$("#minChrgPricedRateSpan").html(chrg[0].pricedminchr);

			$("#miniPubMin").html(chrg[0].rmsminchg);
			$("#miniScale").html(chrg[0].scalerate);
			$("#miniPubRate").html(chrg[0].rmsrate);
		} else {
			$("#minChrgRate span").html(0);
			$("#minChrgRPM span").html(0);
			$("#minChrgPricedRateAmt").val(0);
			$("#minChrgPricedRateSpan").html(0);

			$("#miniPubMin").html(".00");
			$("#miniScale").html(".00");
			$("#miniPubRate").html(".00");
		}



		// Rebuild Rate Grid - Stored in Global Array chrg[]
		$(".rateGrid").css("visibility","visible");
		rateDataView.beginUpdate();
		rateDataView.setItems(chrg);
		rateDataView.setFilterArgs({
		    viewDeficits: viewDeficits
		});
		rateDataView.setFilter(filterDeficits);
		rateDataView.endUpdate();
		rateGrid.invalidate();
		rateGrid.render();

		// Update Rate Total
		updateRateTotal();

		if ($("#sMask").css('display') == "block"){
			$("#sMask").toggle();
			subCL.hide();
			$("#sLoading").css('display','none');
		}

	}
	function filterDeficits(item, args) {
		if ((item["linecodetype"] == "D" && args.viewDeficits) || (item["linecodetype"] != "D")) {
			return true;
		} else {			  
			return false;
		}
	}

	function overrideAlertBox() {

		window.alert = function (message) {
			// create the dialog box div
			$("body").append("<div id=\"alertBox\" style=\"display: none\"><p>" + message + "</p></div");

			$("#alertBox").dialog({
				dialogClass: "noclose",
				title: "Message",
				text: message,
				buttons: {
					"Ok": function () {
						$("#alertBox").dialog("close");
					},
				},
				position: "center",
				close: function () {
					$("#alertBox").remove();
				},
				open: function () {
					$(".ui-dialog-titlebar-close").hide();
				}
			});
		};
	}

	function initToolTipster() {
		$(".shortDesc").tooltipster({
			animation: 'fade',
		    position: 'top-left',
			theme: 'tooltipster-light',
		    maxWidth: 200,
			offsetX: -30,
			offsetY: 5
		});
	}
