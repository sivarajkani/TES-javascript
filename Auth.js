// JavaScript Document

//****************
// Variables
//****************
var inLaneListMode = false;
var laneListTable;
var laneListEditor;
var laneListAnimated = false;
var shiftHeldDown = false;
var controlHeldDown = false;
var laneRollbackVal;
var laneSave;

//****************
// Events
//****************
$(document).ready(function() {

	initNeedToSaveBoxes();

	$("#laneNavFirst").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		promptForSave( function() {

			var lane = $("#laneListTable tr:first-child")
				.focus()
				.click()
				.find("td:first-child")
				.html();

			$("#laneNavNum").val(lane);
		});
	});

	$("#laneNavPrevious").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		promptForSave( function() {

			var lane = $("#laneListTable tr.loaded")
				.prev("tr")
				.focus()
				.click()
				.find("td:first-child")
				.html();

			$("#laneNavNum").val(lane);
		});
	});

	$("#laneNavNext").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		promptForSave( function() {

			var lane = $("#laneListTable tr.loaded")
				.next("tr")
				.focus()
				.click()
				.find("td:first-child")
				.html();

			$("#laneNavNum").val(lane);
		});
	});

	$("#laneNavLast").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		promptForSave( function() {

			var lane = $("#laneListTable tr:last-child")
				.focus()
				.click()
				.find("td:first-child")
				.html();

			$("#laneNavNum").val(lane);
		});
	});

	$("#laneNavNew, #laneNavPlus").click(function(e) {
		if ($(this).hasClass("laneDisabled"))
			return;

		if ($(this).hasClass("tempDisabled"))
			return;

		if ($(this).hasClass("close")){
			if (lanes.length != 0){
				$(this).removeClass("close");
				$(this).attr("title", "Add New Lane");
				// roll back to previous lane
				retrieveProposal(quotenum, laneRollbackVal);
				return;
			}
		}

		if (!$("#saveRates").hasClass("disabled")) {

			if (quotenum == "") {
				if (validateContMethod(e)) {
					$("#needToSaveBox3").dialog("open");
				}
			} else {
				$("#needToSaveBox3").dialog("open");
			}

		} else {
			// set the rollback lane value to allow user to hit the back button
			laneRollbackVal = lanenumber;

			createNewLane();
			rebuildLaneNav();

			$(this).addClass("close");
			$(this).attr("title", "Cancel New Lane");
		}
	});

	$("#laneNavNum").bind("keyup", function(e){

		if (e.which == 13){  // enter key is pressed

			laneSave = parseInt($("#laneNavNum").val());

			promptForSave( function() {

				lane = laneSave;

				var first = $("#laneListTable tr:first-child td:first-child").html();
				var last  = $("#laneListTable tr:last-child td:first-child").html();


				if (lane >= first && lane <= last && lane != NaN) {

					$("#laneListTable > tbody > tr").each(function() {
						if ($(this).find("td:first-child").html() == lane) {
							$(this).focus().click();
						}
					})

					$("#laneNavNum").removeClass("invalidLane");
					$("#laneNavNum").attr("title", "");
				} else {
					$("#laneNavNum").addClass("invalidLane");
					$("#laneNavNum").attr("title", "Invalid Lane");
				}
			});
		}
	}).blur(function() {
		var lane

		lane = $(this).val();
		if (lane != lanenumber) {
			$(this).val(lanenumber);
		}
	});


	// Setup Lane Navigation Widget

	$("#proposalMenu").hover(
		function(){
			$("#laneNavButtons").show();
		},
		function(){
			$("#laneNavButtons").hide();
		}
	);

	$("#laneNavSpinner")
		.bind("mousewheel", function(event, delta) {
			var i = laneListNavIndex.indexOf(this.value);
			if (delta > 0) {
				if ((i + 1) <= laneListNavIndex.length - 1){
					this.value = laneListNavIndex[i + 1];
				}
				//this.value = parseInt(this.value) + 1;
			} else {
				//if (parseInt(this.value) > 0) {
					//this.value = parseInt(this.value) - 1;
				if (i > 0){
					this.value = laneListNavIndex[i - 1];
				}
			}
			return false;
		})
		.bind("keyup", function(e){
			if (e.which == 13){  // enter key is pressed

				laneSave = parseInt($("#laneNavSpinner").val());

				promptForSave( function() {

					lane = laneSave;

					var first = $("#laneListTable tr:first-child td:first-child").html();
					var last  = $("#laneListTable tr:last-child td:first-child").html();


					if (lane >= first && lane <= last && lane != NaN) {

						$("#laneListTable > tbody > tr").each(function() {
							if ($(this).find("td:first-child").html() == lane) {
								$(this).focus().click();
								return false;
							}
						})

						$("#laneNavSpinner").removeClass("invalidLane");
						$("#laneNavSpinner").attr("title", "");
					} else {
						$("#laneNavSpinner").addClass("invalidLane");
						$("#laneNavSpinner").attr("title", "Invalid Lane");
					}
				});
			}
		}).blur(function() {
			var lane

			lane = $(this).val();
			if (lane != lanenumber) {
				if (lanenumber != 0){
					$(this).val(lanenumber);
				} else {
					$(this).val("New");
				}
			}
		});

	$("#laneNavButtons > .navUp").click(function(){
		if ($(this).hasClass("laneDisabled"))
			return;

		promptForSave( function() {

			var lane = $("#laneListTable tr.loaded")
			.prev("tr")
			.focus()
			.click()
			.find("td:first-child")
			.html();

			$("#laneNavSpinner").val(lane);
		});
	});

	$("#laneNavButtons > .navDown").click(function(){
		if ($(this).hasClass("laneDisabled"))
			return;

		promptForSave( function() {

			var lane = $("#laneListTable tr.loaded")
			.next("tr")
			.focus()
			.click()
			.find("td:first-child")
			.html();

			$("#laneNavSpinner").val(lane);
		});
	});

	$("#userAssignmentButton").click(function(e){
		assessLanePos();
		if ($("#userAssignmentPanel").css("display") == "block"){
			$("#userAssignmentPanel").hide("drop", {direction: "down"}, "fast");
		} else {
			$("#userAssignmentPanel").show("drop", {direction: "up"}, "fast");
		}
	});

	$("#listDropIcon").click(function(e){
		// if they have not entered an origin/destination  yet
		//if (quotenum == "" && $("#saveRates").hasClass("disabled")) {
		//	return // do not allow them to enter the lane list drop down
		//}


		// Hide mass update pane if open
		if ($("#massUpdateBlock").css("display") != "none"){
			hideMassUpdateForm(true);
		}
		// Hide User assignment pane if open
		if ($("#userAssignmentPanel").css("display") != "none"){
			$("#userAssignmentPanel").hide();
		}
		// Hide Publish update pane if open
		if ($("#publishPanel").css("display") != "none"){
			hidePublishForm(true);
		}
		// Hide Audit pane if open
		if ($("#auditPanel").css("display") != "none"){
			hideAuditForm();
		}
		if (importMode){

			// Cancel Import Spread Sheet
			spreadsheetLanes.length = 0;
			for (var x = 0; x < lanes.length; x++) {
				// Restore Changed Lanes to Original Values
				if (lanes[x].type == "Chg"){
					lanes[x].type = lanes[x].saveType;
					lanes[x].proposedrate = lanes[x].saveProposedRate;
					lanes[x].proposeduom = lanes[x].saveProposedUOM;
					lanes[x].priminchr = lanes[x].savePriMinChr;
                    lanes[x].pricedfscrate = lanes[x].savePricedFscRate;
                    lanes[x].pricedfscuom = lanes[x].savePricedFscUOM;
                    lanes[x].pricedmxcarrierrate = lanes[x].savePricedMxCarrierRate;
                    lanes[x].pricedmxfsc = lanes[x].savePricedMxFsc;
                    lanes[x].pricedmxbordercrossingfee = lanes[x].savePricedMxBorderCrossingFee;
				};
				if (lanes[x].type == "New"){
					lanes.splice(x, lanes.length - x);
				};
			}

			importMode = false;
			$("#listDropIcon").removeClass("close");
			//$(".laneContainer, #proposalMenu").css("z-index", 1);
			$("#laneListEditorMask").fadeTo("slow", 0, function(){
				$("#laneListEditor, #laneListEditorMask").css("display", "none");
			});

			$("#laneListTable_wrapper > .dataTables_scroll > .dataTables_scrollBody").css("height", "500px");
			$("#laneListDropDown").css("height", "80%");

			if (lanes.length > 0){
				$("#geoBlock").fadeIn();
			}

			if (quotenum != ""){
                // Set Authorized Action Buttons
                setAuthorizedActions(false);
				//$("#emailButton").removeClass("disabled");
				//$("#downloadButton").removeClass("disabled");
				//if (saveAuthorized == true){
                //$("#massUpdateButton").removeClass("disabled");
				//	$("#auditButton").removeClass("disabled");
				//}
                //if (publishAuthorized == true){
                //    $("#publishButton").removeClass("disabled");
                //}
				rebuildLaneListDatatable();
			} else {
                // Disable All Action Buttons & Do Not Fade Out
                disableActions(false);
				//$("#emailButton").addClass("disabled");
				//$("#downloadButton").addClass("disabled");
				//$("#massUpdateButton").addClass("disabled");
				//$("#publishButton").addClass("disabled");
				//$("#auditButton").addClass("disabled");
				//$("#saveRates").addClass("disabled");

				$("#laneListDropDown > .hoverMask").fadeTo("fast", 1, function(){rebuildLaneListDatatable()});
			};

		} else {

			if (!inLaneListMode && !$("#saveRates").hasClass("disabled") && !$("#saveRates").hasClass("lockDisable")) {

				if (quotenum == "") {
					if (validateContMethod(e)) {
						$("#needToSaveBox2").dialog("open");
					}
				} else {
					$("#needToSaveBox").dialog("open");
				}

			} else if (!inLaneListMode && lanenumber == 0) {
				if (lanes.length != 0){
					// roll back to previous lane
					retrieveProposal(quotenum, laneRollbackVal);
					animateLaneList();
				} else {
					animateLaneList();
					$("#laneListDropDown > .hoverMask").fadeTo("fast", 1);
				}
			} else {
				if (lanenumber != 0){
					retrieveProposal(quotenum, lanenumber);
				}
				animateLaneList();
			}
		}
	});

	$("#laneListTable").bind("keydown", function(e){
		if (!importMode && !massUpdateMode && !publishMode && e.target.type != "text"){
			switch (e.which){
				case 13: //Enter key
					e.preventDefault();
					var lane = $(this).find("tr:focus").find("td:first-child").html();
					if (lane == lanenumber) {
						$("#listDropIcon").click();
					} else {
						retrieveProposal(quotenum, lane);
						clearLoadedRow();
						setLoadedRow(lane);
					}
					break;
				case 38: //Up arrow
					e.preventDefault();
					if (!$(this).find("tr:focus").is("tr:first-child")) {
						$(this).find("tr:focus").prev("tr").focus();
						$(this).find("tr:focus").trigger("click", true);
					}
					break;
				case 40: //Down arrow
					e.preventDefault();
					if (!$(this).find("tr:focus").is("tr:last-child")) {
						$(this).find("tr:focus").next("tr").focus();
						$(this).find("tr:focus").trigger("click", true);
					}
					break;
				case 9: //Tab
					e.preventDefault();
					if (shiftHeldDown) {
						if ($(this).find("tr:focus").is("tr:first-child")) {
							$(this).find("tr:focus").trigger("click", true);
							$('#laneListTable_filter input').focus();
						} else {
							$(this).find("tr:focus").prev("tr").focus();
							$(this).find("tr:focus").trigger("click", true);
						}
					} else {
						if ($(this).find("tr:focus").is("tr:last-child")) {
							$(this).find("tr:focus").trigger("click", true);
							$('#laneListTable_filter input').focus();
						} else {

							var $hasFocus = $(":focus");
							var tagName = $hasFocus.prop("tagName");
							console.log(tagName);
							$(this).find("tr:focus").next("tr").focus();
							$(this).find("tr:focus").trigger("click", true);
						}
					}
					break;
				case 16://Shift
					shiftHeldDown = true;
					break;
				case 17: //Control
					controlHeldDown = true;
			}
		}

	}).bind("keyup", function(e) {
		switch (e.which) {
		case 16: // Shift
			shiftHeldDown = false;
			break;
		case 17: // Control
			controlHeldDown = false;
			break;
		}
	});
});


//****************
// Functions
//****************

function initNeedToSaveBoxes() {

	$("body").append("<div id=\"needToSaveBox\" style=\"display: none\">" +
			"<p>Do you want to save the current quote?</p><p>If you do not save, " +
			"then the changes will be discarded.</p></div");

	// create the dialog box
	$("#needToSaveBox").dialog({
		autoOpen: false,
		dialogClass: "noclose",
		title: "Save",
		position: "center",
		buttons: {
			"Save": function () {
				checkLoads = true;
				saveProposal(function() {
					animateLaneList();
				});
				$("#saveRates").addClass("disabled");
				$(this).dialog("close");
			},
			"Don't Save": function() {
				$(this).dialog("close");
				if (lanenumber == 0){
					lanenumber = 1;
				}
				retrieveProposal(quotenum, lanenumber, function() {
					animateLaneList();
					clearLoadedRow();
					setLoadedRow(lanenumber);
				});
			},
			"Cancel": function() {
				$(this).dialog("close");
				return;
			}
		}
	});


	$("body").append("<div id=\"needToSaveBox2\" style=\"display: none\">" +
			"<p>Do you want to save the current quote?</p></div");

	// create the dialog box
	$("#needToSaveBox2").dialog({
		autoOpen: false,
		dialogClass: "noclose",
		title: "Save",
		position: "center",
		buttons: {
			"Save": function () {
				checkLoads = true;
				saveProposal(function() {
					animateLaneList();
				});
				$("#saveRates").addClass("disabled");
				$(this).dialog("close");
				return;
			},
			"Cancel": function() {
				$(this).dialog("close");
				return;
			}
		}
	});

	$("body").append("<div id=\"needToSaveBox3\" style=\"display: none\">" +
			"<p>Do you want to save changes to the current quote?</p><p>If you do not save, " +
			"then the changes will be discarded.</p></div");

	// create the dialog box
	$("#needToSaveBox3").dialog({
		autoOpen: false,
		dialogClass: "noclose",
		title: "Save",
		position: "center",
		buttons: {
			"Save": function () {

				// call the save function and after it completes, create a new lane
				checkLoads = true;
				saveProposal(function() {
					laneRollbackVal = lanenumber;
					createNewLane();
					rebuildLaneNav();
					$("#laneNavNew, $laneNavPlus").addClass("laneDisabled");
				});
				$("#saveRates").addClass("disabled");

				$(this).dialog("close");
			},
			"Don't Save": function() {

				// create the new lane without calling the save function
				laneRollbackVal = lanenumber;
				createNewLane();
				rebuildLaneNav();
				$("#laneNavNew, #laneNavPlus").addClass("laneDisabled");

				$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
				return;
			}
		}
	});
}

function promptForSave(callback) {

	if (!$("#saveRates").hasClass("disabled")) {

		$("body").append("<div id=\"needToSaveBox\" style=\"display: none\">" +
				"<p>Do you want to save the current proposal?</p><p>If you do not save, " +
				"then the proposal will be discarded.</p></div");

		$("#needToSaveBox").dialog({
			dialogClass: "noclose",
			title: "Save",
			buttons: {
				"Save": function () {
					checkLoads = true;
					saveProposal();
					$("#saveRates").addClass("disabled");
					$("#needToSaveBox").dialog("close");
					return;
				},
				"Don't Save": function() {
					$("#needToSaveBox").dialog("close");
					callback();
					return;
				},
				"Cancel": function() {
					$("#needToSaveBox").dialog("close");
					return;
				}
			},
			position: "center",
			close: function () {
				$("#needToSaveBox").remove();
			},
			open: function () {
				$(".ui-dialog-titlebar-close").hide();
			}
		});
	} else {
		callback();
	}
}

function getLanes() {
	if (quotenum == "") {
		return;
	}
	var wrkfl = 0;
	var url = "pqxml.pgm?" +
		      "func=getlanedetail" +
		      "&quotenum=" + quotenum;

	if(getLanesXHR && getLanesXHR.readyState != 4){
		getLanesXHR.abort();
	}

	getLanesXHR =
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			success: function(response) {

				var i = 0;

				// put the response into global variables
				$(response).find('lanedetail').each(function() {

					var l = (lanes[i] = {});
					l["lanenumber"] = $(this).attr("lanenumber");
					l["idpqlandtl"] = $(this).attr("idpqlandtl");

					switch ($(this).attr("type")){
					case "B":
						l["type"] = "Bid";
						break;
					case "I":
						l["type"] = "Inq";
						break;
					case "P":
						l["type"] = "Prop";
						break;
					case "R":
						l["type"] = "Revw";
						break;
					case "S":
						l["type"] = "Spot";
						break;

					default:
						l["type"] = "Inq";
						break;
					}

					l["workflowstatus"] = $(this).attr("sdesc");
					l["origin"] = $(this).attr("origin");
					l["originsource"] = $(this).attr("originsource");
					l["originzone"] = $(this).attr("originzone");
					l["destination"] = $(this).attr("destination");
					l["destinationsource"] = $(this).attr("destinationsource");
					l["destinationzone"] = $(this).attr("destinationzone");
					l["proposeduom"] = $(this).attr("proposeduom");
					l["proposedrate"] = $(this).attr("proposedrate");
					l["custrefno"] = $(this).attr("custrefno");
					l["accessorials"] = $(this).attr("accessorials");
					l["selectedForMassUpdate"] = false;
					l["selectedToPublish"] = false;
					l["auditreslt"] = $(this).attr("auditreslt");
					l["auditdate"] = $(this).attr("auditdate");
					l["priminchr"] = "";
					l["rateValid"] = "";
					l["uomValid"] = "";
					l["minChrValid"] = "";
                    l["pricedfscuom"] = "";
                    l["pricedfscrate"] = "";
                    l["pricedmxcarrierrate"] = "";
                    l["pricedmxfsc"] = "";
                    l["pricedmxbordercrossingfee"] = "";

					i++;
				});

				rebuildLaneListDatatable();

				if ($("#sMaskLanes").css('display') == "block"){
					$("#sMaskLanes").toggle();
					lanesCL.hide();
					$("#sLoadingLanes").css('display','none');
				};
			},

			complete: function(jqXHR, completeStatus) {
				if (lanes.length > 0 && inLaneListMode){
                    // Set Authorized Action Buttons & Fade In
                    setAuthorizedActions(true);

					//$("#downloadButton").fadeIn();
					//if (saveAuthorized == true){
				//		$("#massUpdateButton").fadeIn();
				  //  	$("#auditButton").fadeIn();
				//	}
                  //  if (publishAuthorized == true){
                    //    $("#publishButton").fadeIn();
                    //} else {
                      //  $("#publishButton").fadeIn();
            //            $("#publishButton").addClass("disabled");
              //      }
				}

			},

			error: function(jqXHR, errorStatus, errorMessage) {
				if (errorStatus != "abort"){
					alert("An error occurred trying to contact the server.");
				}
			}
		});
}

//Rebuild Lane List Table
function rebuildLaneListDatatable(){

	if (laneListTable === undefined){
		laneListTable = $('#laneListTable').DataTable( {
			data: lanes,
			deferRender: true,
			columns: [
	  	        {title: 'Lane', name: 'lanenumber', data: 'lanenumber'},
	  	        {title: 'Cust Lane Id', name: 'custrefno', data: 'custrefno', className: 'editCustLane', width: '1%'},
	  	        {title: 'Origin', name: 'origin', data: 'origin'},
	  	        {title: 'Org Zone', name: 'originzone', data: 'originzone'},
	  	        {title: 'Dest', name: 'destination', data: 'destination'},
	  	        {title: 'Dest Zone', name: 'destinationzone', data: 'destinationzone'},
	  	        {title: 'Type', name: 'type', data: 'type'},
	  	        {title: 'Status', name: 'workflowstatus', data: 'workflowstatus'},
	  	        {title: 'UOM', name: 'proposeduom', data: 'proposeduom'},
	  	        {title: 'Rate', name: 'proposedrate', data: 'proposedrate'},
	  	        {title: 'Minimum', name: 'priminchr', data: 'priminchr'}
	  		],
			paging: false,
			//responsive: true,
			scrollY: importMode?600:440,
			scrollCollapse: false,
			dom: 'T<"clear">lfrtipS',
	        tableTools: {
	            "sRowSelect": "os",  // add ability to CTRL+click to select multiple
	            "aButtons": []       // remove all buttons
	        },
	        createdRow: function( row, data, dataIndex) {

	        	/*$(row).click(function(e, triggeredByCode){
					//e.preventDefault();

					// Get index of selected row
					if (!importMode && !controlHeldDown && !shiftHeldDown){
						if (laneListTable){
							selectedLaneIndex = laneListTable.row(this).index();
						}

						if (!triggeredByCode) {
							var lane = $(this).find("td:first-child").html();

							if (lane != lanenumber) { // check if user is re-clicking on current lane
								retrieveProposal(quotenum, lane);
								clearLoadedRow();
								setLoadedRow(lane);
							}
						}
					}

				}).dblclick(function(e){
					if (!importMode){
						var lane = $(this).find("td:first-child").html();

						// Get index of selected row
						selectedLaneIndex = laneListTable.row(this).index();

						clearLoadedRow(lane);
						retrieveProposal(quotenum, lane);
						setLoadedRow(lane);
						$("#listDropIcon").click();
					}
				});*/


				// Color invalid cells
				if (importMode){
					laneListTable.column([3, 5, 7 ]).visible( false );
					laneListTable.column([8, 10]).visible( true );

					if (data.originValid != "true" && data.type == "New") {
						var originColumn = 2;

						$('td', row).eq(originColumn).addClass("invalidField");

					};

					if (data.destinationValid != "true" && data.type == "New") {
						var destinationColumn = 3;

						$('td', row).eq(destinationColumn).addClass("invalidField");

					};
					if (data.rateValid != "true" && data.type == "Chg") {
						var rateColumn = 6;

						$('td', row).eq(rateColumn).addClass("invalidField");

					};
					if (data.uomValid != "true" && data.type == "Chg") {
						var uomColumn = 5;

						$('td', row).eq(uomColumn).addClass("invalidField");

					};
					if (data.minChrValid != "true" && data.type == "Chg") {
						var minChrColumn = 7;

						$('td', row).eq(minChrColumn).addClass("invalidField");

					};
				}

				// Highlight Rows in Error from Mass Update
				if (massUpdateMode){
					if (data.upderror){
						$(row).addClass("upderrors");
						$(row).prop("title", data.updmessage);
					}
					// Hide Rows Not Selected for Mass Update
					if (! data.selectedForMassUpdate){
						$(row).hide();
					} else {
						$(row).addClass("selected");
						$(row).addClass("DTTT_selected");
						$(row).addClass("disableClick");
					}
				}

				// Highlight Rows in Error from Publishing
				if (publishMode){
					if (data.upderror){
						$(row).addClass("upderrors");
						$(row).prop("title", data.updmessage);
					}
					// Hide Rows Not Selected for Publishing
					if (! data.selectedToPublish){
						$(row).hide();
					} else {
						$(row).addClass("selected");
						$(row).addClass("DTTT_selected");
						$(row).addClass("disableClick");
					}
				}

				// Audit - add success/fail icon to background display
				if (!importMode){
					var statusColumn = 7;
					switch (data.auditreslt){
					case "P":
						$('td', row).eq(statusColumn).addClass("auditPassed").attr("title","Audit Passed");
						break;
					case "F":
							$('td', row).eq(statusColumn).addClass("auditFailed").attr("title","Audit Failed");
						break;
					}

				}
	        	// this is a bug fix for Internet Explorer
	        	// if a td is clicked it steals the focus even if its tabindex = -1
	        	// so this gives the focus back to the parent tr element
	        	/*$(row).find("td").click(function() {
	        		$(this).parent().focus();
	        	});*/

	        },
			rowCallback: function(row, data) {
		  		// make each row focusable
		  	    /*$(row).attr("tabindex", "0");

		  	    if ($(row).hasClass("loaded") &&
		  	    	$(row).find("td:first-child").html() != lanenumber) {
		  	    	$(row).removeClass("loaded");
		  	    }*/
		  	},
		  	headerCallback: function( thead, data, start, end, display ) {
		  		// give all column headers a tabindex of -1
		  		$(thead).find('th').each(function() {
		  	    	$(this).attr("tabindex", "-1");
		  	    });
		  	},
		  	drawCallback: function(settings) {
		  		// make the scrollbody non-focusable
		  		$(".dataTables_scrollBody").attr("tabindex", "-1");
				// add click events to rows except for Mass Update Mode
				var $tableRows = $("#laneListTable > tbody > tr");

				$tableRows.unbind("click");
				$tableRows.unbind("dblclick");
				$tableRows
					.click(function(e, triggeredByCode){

						if ($(this).hasClass("disableClick")) {
							e.stopPropagation()
						}else{

							// Get index of selected row
							if (!importMode && !massUpdateMode && !publishMode && !controlHeldDown && !shiftHeldDown && e.target.type != "text"){
								if (laneListTable){
									selectedLaneIndex = laneListTable.row(this).index();
								}

								if (!triggeredByCode) {
									var lane = $(this).find("td:first-child").html();

									if (lane != lanenumber) { // check if user is re-clicking on current lane
										retrieveProposal(quotenum, lane);
										clearLoadedRow();
										setLoadedRow(lane);
									}
								}
							}
						}

					})
					.dblclick(function(e){
						if (!importMode && !massUpdateMode && e.target.type != "text"){
							var lane = $(this).find("td:first-child").html();

							// Get index of selected row
							selectedLaneIndex = laneListTable.row(this).index();

							clearLoadedRow(lane);
							retrieveProposal(quotenum, lane);
							setLoadedRow(lane);
							$("#listDropIcon").click();
						}
					});

				// Populate lane navigation index array
				laneListNavIndex.length = 0;
				$tableRows.each(function(index, row){
					laneListNavIndex[index] = $(row).children("td").first().html();
				});

				// this is a bug fix for Internet Explorer
	        	// if a td is clicked it steals the focus even if its tabindex = -1
	        	// so this gives the focus back to the parent tr element
				$tableRows.children("td").unbind("click");
	        	$tableRows.children("td").click(function(e) {
	        		console.log(e.target);
	        		if (!$(e.target).is("input") && !$(e.target).is("select")){
	        			$(this).parent().focus();
	        		}
	        	});

				// make each row focusable
		  	    $tableRows.attr("tabindex", "0");

				$("#laneListTable > tbody > tr.loaded").each(function(){
		  	    	if ($(this).find("td:first-child").html() != lanenumber) {
		  	    		$(this).removeClass("loaded");
					}
		  	    });

		    },
		    initComplete: function(settings, json) {

		    	$("#laneListTable > tbody > tr").each(function() {
		  			if ($(this).find("td:first-child").html() == lanenumber &&
		  				!$(this).hasClass("selected") && !importMode) {
		  				$(this).focus().trigger("click", true);
		  				clearLoadedRow();
		  				setLoadedRow(lanenumber);
		  			}
		  		});

		    	// keydown event for Datatable search textbox
		    	$('#laneListTable_filter input').bind("keydown", function(e){
		    		switch (e.which) {
		    		case 9: //Tab
		    			e.preventDefault();

		    			if (shiftHeldDown) {
		    				$("#laneListTable tr:last-child").focus();

		    				if (!$("#laneListTable tr:focus").hasClass("selected")) {
		    					$("#laneListTable tr:focus").trigger("click", true);
		    				}
		    			} else {
		    				$("#laneListTable tr:first-child").focus();

		    				if (!$("#laneListTable tr:focus").hasClass("selected")) {
		    					$("#laneListTable tr:focus").trigger("click", true);
		    				}
		    			}
		    			$(this).blur();

		    			break;
		    		case 16: //Shift
		    			shiftHeldDown = true;
		    			break;
		    		case 17: // Control
		    			controlHeldDown = true;
		    			break;
		    		}
		    	}).bind("keyup", function(e){
		    		switch (e.which) {
		    		case 16: //Shift
		    			shiftHeldDown = false;
		    			break;
		    		case 17: // Control
		    			controlHeldDown = false;
		    			break;
		    		}
		    	});

		    	// create the "select all" and "deselect all" buttons and set events for them
		    	$("#laneListTable_filter").append('<span id="selectAll">Select All</span>');
		    	$("#laneListTable_filter").append('<span id="deselectAll">Deselect All</span>');

		    	$("#selectAll").click(function() {
		    		var tableTools = TableTools.fnGetInstance('laneListTable');
		    	    tableTools.fnSelectAll();
		    	});

		    	$("#deselectAll").click(function() {
		    		var tableTools = TableTools.fnGetInstance('laneListTable');
		    	    tableTools.fnSelectNone();
		    	});
		    }
		});

		if (laneListEditor === undefined){
			laneListEditor = new $.fn.dataTable.Editor({
				ajax: function ( method, url, data, sccess, error ) {
					$.each(lanes, function(index, lane) {

						var lanenumberStr = lane.lanenumber.toString();
						var $selectedLI = $("#editorGeoSearchList li.selected");
						var inputObject;
						var inputID;

						if ($(".DTE_Field_Input").children("input").length > 0){
							inputObject = $(".DTE_Field_Input").children("input");
							inputID = $(".DTE_Field_Input").children("input").attr("id").replace("DTE_Field_", "");
						} else if ($(".DTE_Field_Input").children("select").length > 0){
							inputObject = $(".DTE_Field_Input").children("select");
							inputID = $(".DTE_Field_Input").children("select").attr("id").replace("DTE_Field_", "");
						}

						// Update Table
						// Import Lane List - Update Geography
						if (lanenumberStr == data.data.lanenumber && $selectedLI.length > 0) {
							// Determine Origin or Destination
							var originInput = inputID.search("origin");
							if (originInput == 0){
								var originColumn = true;
							} else {
								var originColumn = false;
							};

							fillEditedImportLanes(index, $selectedLI, originColumn);

							// Remove RED Invalid Field
							//if (originColumn){
							//	removeLaneGeoInvalid(lane.lanenumber, 2);
							//} else {
							//	removeLaneGeoInvalid(lane.lanenumber, 3);
							//}
							$(".DTE_Field_Input").parents("td").removeClass("invalidField");

							// Activate Save Button when No Erros Exist
							if (!$("#laneListTable > tbody > tr > td").hasClass("invalidField")
								&& saveAuthorized == true){
									$("#saveRates").removeClass("disabled");
							};
						}

						// Lane List - Update Customer Lane Number
						if (lanenumberStr == data.data.lanenumber){
							//var thisIsCustLaneEditBox = inputID.search("custrefno");
							//if (thisIsCustLaneEditBox > 0){
							//	lane.custrefno = inputObject.val();
							//	// Save Customer Lane in database table PQLanDtlX for Existing Lane Only
							//	if (lane.idpqlandtl != 0){
							//		saveCustomerLane(lane.idpqlandtl,idpqheader,lane.custrefno);
							//	}
							//}

							switch (inputID){
								case "custrefno":
									lane.custrefno = inputObject.val();
									// Save Customer Lane in database table PQLanDtlX for Existing Lane Only
									if (lane.idpqlandtl != 0){
										saveCustomerLane(lane.idpqlandtl,idpqheader,lane.custrefno);
									}

									break;
								case "proposeduom":
									lane.proposeduom = inputObject.val();
									if (lane.idpqlandtl != 0){
										lane.proposeduom = inputObject.val();
										if (lane.proposeduom != "" && lane.proposeduom != null){
											$(".DTE_Field_Input").parents("td").removeClass("invalidField");
										}
									}

									break;
								case "proposedrate":

									// Validate Entered Propsed Rate
									lane.proposedrate = inputObject.val();
									if ( lane.proposedrate != "" && lane.proposedrate != null){
										if (! $.isNumeric(lane.proposedrate)){
											// Lane Rate must be numeric

										} else {
											// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM - Min Charge uses Line 100 & F/R
								        	rule_ratedecimals = 0;
								            for (r = 0; r < rules.length; r++) {
								            	if ((rules[r].linecode == "100") && (rules[r].uom == lane.proposeduom)){
								            		rule_ratedecimals = rules[r].ratedecprc;
								            	    break;
								            	};
								            }
								         // Calculate Decimal Precision Multiplier
								            if (rule_ratedecimals == 0){
								    	      	decimal_mult = 1;
								    	    } else {
								    	    	decimal_mult = Math.pow(10,rule_ratedecimals);
								    	    	// Remove Error only when valid UOM has been entered
								    	    	$(".DTE_Field_Input").parents("td").removeClass("invalidField");
								    	    }
								    	  // Replace Linehaul Rate with Correct Decimal Rate
								    	    var formattedRate = ((lane.proposedrate * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
								    	    lane.proposedrate  = formattedRate;
								    	    data.data.proposedrate = formattedRate;


										}
									} else {
										lane.proposedrate = "0";
										$(".DTE_Field_Input").parents("td").removeClass("invalidField");
									}

									break;
								case "priminchr":
									// Validate Entered Minimum Charge
									lane.priminchr = inputObject.val();
									if ( lane.priminchr != "" ){
										if (! $.isNumeric(lane.priminchr)){
											// Minimum Rate must be numeric

										} else {
											// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM - Min Charge uses Line 100 & F/R
								        	rule_ratedecimals = 0;
								            for (r = 0; r < rules.length; r++) {
								            	if ((rules[r].linecode == "100") && (rules[r].uom == "F/R")){
								            		rule_ratedecimals = rules[r].ratedecprc;
								            	    break;
								            	};
								            }
								         // Calculate Decimal Precision Multiplier
								            if (rule_ratedecimals == 0){
								    	      	decimal_mult = 1;
								    	    } else {
								    	    	decimal_mult = Math.pow(10,rule_ratedecimals)
								    	    }
								    	  // Replace Minimum Rate with Correct Decimal Rate
								    	    var formattedRate = ((lane.priminchr * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
								    	    lane.priminchr = formattedRate;
								    	    data.data.priminchr = formattedRate;
								    	    $(".DTE_Field_Input").parents("td").removeClass("invalidField");

										}
									} else {
										lane.priminchr = "0";
										$(".DTE_Field_Input").parents("td").removeClass("invalidField");
									}
									break;
								default:
									break;
							}


							// Activate Save Button when No Erros Exist
							if (!$("#laneListTable > tbody > tr > td").hasClass("invalidField")
								&& saveAuthorized == true){
								$("#saveRates").removeClass("disabled");
							};
						}

					});

					// Drop usual AJAX methodolgy and pass a success
//					$.ajax( {
//						type: method,
//						url:  url,
//						data: data,
//						dataType: "json",
//						success: function (json) {
							sccess({});
//						},
//						error: function (xhr, error, thrown) {
//							error( xhr, error, thrown );
//						}
//					} );
				},
				table: '#laneListTable',
				fields: [
					{label: 'Lane', name: 'lanenumber'},
					{label: 'Cust Lane Id', name: 'custrefno'},
					{label: 'Origin', name: 'origin'},
					{label: 'Zone', name: 'originzone'},
					{label: 'Destination', name: 'destination'},
					{label: 'Zone', name: 'destinationzone'},
					{label: 'Type', name: 'type'},
					{label: 'Status', name: 'workflowstatus'},
					{label: 'UOM', name: 'proposeduom',
						type: "select",
					 	ipOpts: [
				                    { label: "F/R", value: "F/R" },
				                    { label: "MLS", value: "MLS" }
				                ]},
					{label: 'Rate', name: 'proposedrate'},
					{label: 'Minimum', name: 'priminchr'}
				]
			});

			laneListEditor.on('close', function(){
			});

			// Activate an inline edit on click of a table cell
			$('#laneListTable').on( 'click', 'tbody td', function (e) {
				if ((importMode && $(this).hasClass("invalidField")) || $(this).hasClass("editCustLane")) {

					e.preventDefault();
					laneListEditor.inline(this);

					// Geography Search for Origin or Destination
					if ($(this).hasClass("invalidField")){
						var inputField = $(".DTE_Field_Input").children("input");
						var selectField = $(".DTE_Field_Input").children("select")
						var inputID;

						if (inputField.length != 0){
							inputID = $(".DTE_Field_Input").children("input").attr("id").replace("DTE_Field_", "");
						}

						if (selectField.length != 0){
							inputID = $(".DTE_Field_Input").children("select").attr("id").replace("DTE_Field_", "");
						}

						switch (inputID){
							case "origin":
							case "destination":
							// Check if field edit will result in search results falling off screen
								if ($(".DTE_Field", this).offset().top > 520){
									var fieldID = "#" + $(".DTE_Field input", this).attr("id");
									$("#laneListTable").parent().scrollTo(fieldID, 700, {offset:-250});
								}

							// Add Geo Validation
								if ($("#editorGeoSearchList").length > 0){
									$("#editorGeoSearchList").empty().remove();
								}

								$(".DTE_Field_Input > input").unbind("keyup");
								$(".DTE_Field_Input > input").unbind("keydown");
								$(".DTE_Field_Input > input")
									.focus()
									.select()
									.bind("keyup", function(e){
										var $selectedLI = $("#editorGeoSearchList li.selected");

										switch (e.which) {
											case 13: //Enter
												break;
											case 27: //Escape
												break;

											case 38: //Up
												if ($selectedLI.length > 0){
													if ($selectedLI.prev().length > 0){
														$selectedLI = $selectedLI.prev();
														$("#editorGeoSearchList li").removeClass("selected");
														$selectedLI.addClass("selected");
													}
												}

												break;


											case 40: //Down
												if ($selectedLI.length > 0){
													if ($selectedLI.next().length > 0){
														$selectedLI = $selectedLI.next();
														$("#editorGeoSearchList li").removeClass("selected");
														$selectedLI.addClass("selected");
													}
												} else {
													$("#editorGeoSearchList li").first().addClass("selected");
												}

												break;

											default:
												// Add Geo Validation
												if ($("#editorGeoSearchList").length == 0){
													var $geoSearchList = $('<ul id="editorGeoSearchList" class="searchResults"></ul>');
													$(".DTE_Field_Input").append($geoSearchList);
												}

												var searchString = escape($(this).val());
												searchGeography(searchString, $("#editorGeoSearchList"), $(this));
												break;
										}

									})

									.bind("keydown", function(e){
										var $selectedLI = $("#editorGeoSearchList li.selected");

										switch (e.which) {
											case 13: //Enter
												$(this).val($selectedLI.ignore("span").text());
												break;
											default:
												break;
										}
									});

								break;

							case "proposedrate":
								break;
							case "proposeduom":
								if (selectField.children("option").length == 0){
									selectField.append("<option value='F/R'>F/R</option>");
									selectField.append("<option value='MLS'>MLS</option>");

									selectField.on("click", function(){
										e.stopImmediatePropagation();
									});
								}

								selectField.blur(function(){
									laneListEditor.set('proposeduom', $(this).val()).submit();
								});

								break;
							case "priminchr":
								break;
						}
					}
				}
			});
		}

		//var $tableScrollBody = $("#laneListTable_wrapper > .dataTables_scroll > .dataTables_scrollBody");
		//$tableScrollBody.animate({height: "500px"}, "fast");

	} else {
		laneListTable.clear();
		laneListTable.rows.add(lanes);
		laneListTable.draw();

		$("#laneListTable > tbody > tr").not(".selected").each(function() {
  			if ($(this).find("td:first-child").html() == lanenumber){// &&
  				//!$(this).hasClass("selected")) {
  				$(this).focus();
  				$(this).trigger("click", true);
  				setLoadedRow(lanenumber);

				return false;
  			}
  		});
	}

	// Hide Zones and Rates for Import
	if (importMode){
		//laneListTable.column([2, 4, 6 ]).visible( false );

	} else {
		laneListTable.column([3, 5, 7, 9 ]).visible( true );
		laneListTable.column([8, 10]).visible( false );   // UOM and Min Charge only display during import mode
	};


}

function animateLaneList() {

	if (laneListAnimated) {
		console.log("click");
		return;
	}

	laneListAnimated = true;

	if (!$("#originTag").hasClass("pos1") && !$("#destTag").hasClass("pos1")){
		$("#closeGeoEntry").click();
	}

	if (inLaneListMode) {
		//$("#downloadButton").fadeOut();
		//if (saveAuthorized == true){
		//	$("#massUpdateButton").fadeOut();
		//	$("#publishButton").fadeOut();
		//	$("#auditButton").fadeOut();
		//}

        // Disable and Fade Out Buttons
        disableActions(true);
        if (emailAuthorized){
            $("#emailButton").removeClass("disabled");
        }


		$("#laneNavPlus").removeClass("tempDisabled", "fast");

		if ($("#laneListTable_wrapper").length > 0){
			$("#laneListTable_wrapper").fadeOut('fast', function(){
				showEntryMode();
			});
		} else {
			showEntryMode();
		}

		inLaneListMode = false;
	} else {
		if (lanes.length > 0){
            // Set Authorized Action Buttons & Fade In
            setAuthorizedActions(true);

			//$("#downloadButton").fadeIn();
			//if (saveAuthorized == true && publishAuthorized == true) {
            //  $("#publishButton").fadeIn();
//			  $("#massUpdateButton").fadeIn();
  //            $("#auditButton").fadeIn();
	//		} else if (saveAuthorized == true) {
      //        $("#massUpdateButton").fadeIn();
        //      $("#auditButton").fadeIn();
          //      $("#publishButton").fadeIn();
			//   $("#publishButton").addClass("disabled");
//			}
		}

		$("#laneNavPlus").addClass("tempDisabled", "fast").removeClass("close");
		$("#laneControls").fadeOut('fast');
		$("#rateBlock").fadeOut('fast', function(){
			shrinkEntryMode();
		});
		inLaneListMode = true;
	}

	function showEntryMode(){
		$("#geoBlock")
			.removeClass("disabled")
			.animate({
				marginTop: "50px",
				width: "100%"
			}, "fast");

		$("#miniLaneUsers").css("visibility", "hidden");
		$("#miniRates").css("visibility", "hidden");

		$("#laneListDropDown")
				.animate({
					height: "0%"
				}, "fast", function(){
					$("#geoBlock").show();
					$("#laneControls").fadeIn('fast');
					$("#rateBlock").fadeIn('fast', function(){
						laneListAnimated = false;
					});
				});

		$(".laneContainer").css("background-color","#ffffff");

		$("#laneMap")
		.animate({
			margin: "0% auto",
			width: "77%"
			}, "fast");
		$("#laneMap .tag")
			.animate({
				backgroundSize: "30px"
			}, "fast");
		$("#laneMap .label")
			.animate({
				fontSize:"1em",
				top:"55px"
			}, "fast");
		$("#laneMap .stopBox .stop")
			.animate({
				backgroundColor:"#FFFFFF",
				height: "20px",
				width: "20px",
				borderWidth: "6px",
				marginTop: "18px",
				marginBottom: "18px"
			}, "fast");
		$("#laneMap .stopBox .stopCounter")
			.animate({
				marginLeft: "-15px",
				marginTop: "0px"
			}, "fast");
		$("#laneMap .borderBox .border")
			.animate({
				borderWidth: "0 19px 32.9px",
				marginTop: "18px",
				marginBottom: "18px"
			}, "fast");
		$("#laneMap .borderCenter")
			.animate({
				borderBottomColor:"#FFFFFF"
			}, "fast");
		$("#laneLine")
			.animate({
				bottom: "32px"
			}, "fast");

		$(".miniLaneUsers")
			.animate({
				display: "none"
			}, "fast");


		//$("#geoBlock").css("visibility", "visible");
		if ($("#originTag").hasClass("pos1") || $("#destTag").hasClass("pos1")){
			$("#geoEntry").focus();
		}
	}

	function shrinkEntryMode(){
		// Update Lane Users
		$("#miniSalesUser").html($("#salesUser option:selected").attr("value"));
	    $("#miniPublishUser").html($("#publishUser option:selected").attr("value"));
		$("#miniPriceUser").html($("#priceUser option:selected").attr("value"));

		$("#miniLaneUsers").css("visibility", "visible");
		$("#miniRates").css("visibility", "visible");

		$("#laneListDropDown")
			.animate({
				height: "80%"
			}, "fast", function(){
				if ($("#laneListTable_wrapper").length > 0){
					$("#laneListTable_wrapper").fadeIn('fast', function(){
						laneListAnimated = false;
					});
				} else {
					laneListAnimated = false;
				}
				//$(".laneContainer").css("background-color", "#d5d5d5");

				if (laneListTable){
					$(".laneContainer").show();
					laneListTable.columns.adjust();
				}

				if ($("#laneListTable>tbody>tr.loaded").length > 0){
					if (!isElementInViewport($("#laneListTable>tbody>tr.loaded"))){
						$("#laneListTable").parent().scrollTop(
							$("#laneListTable>tbody>tr.loaded").position().top - $("#laneListTable").position().top - 100
						);
					};
				}
			});


		if (lanes.length == 0){
			//$("#geoBlock").css("visibility", "hidden");
			$("#geoBlock").hide();
		}

		$("#geoBlock")
			.addClass("disabled")
			.animate({
				marginTop: "40px",
				width: "100%"
			}, "fast");
		$("#laneMap")
			.animate({
				margin: "0% 7%",
				width: "45%"
			}, "fast");
		$("#laneMap .tag")
			.animate({
				backgroundSize: "21px"
			}, "fast");
		$("#laneMap .label")
			.animate({
				fontSize:".9em",
				top:"40px"
			}, "fast");
		$("#laneMap .stopBox .stop")
			.animate({
				height: "15px",
				width: "15px",
				borderWidth: "5px",
				marginTop: "3px",
				marginBottom: "3px"
			}, "fast");
		$("#laneMap .stopBox .stopCounter")
			.animate({
				marginLeft: "-16px",
				marginTop: "-15px"
			}, "fast");
		$("#laneMap .borderBox .border")
			.animate({
				borderWidth: "0 17px 30.9px",
				marginTop: "2px",
				marginBottom: "2px"
			}, "fast");
		$("#laneLine")
			.animate({
				bottom: "53px"
			}, "fast");
		$(".miniLaneUsers")
			.animate({
				display: "inline-block"
			}, "fast");
	}
}

function clearLoadedRow() {
	//$("#laneListTable > tbody > tr").each(function() {
	//	if ($(this).hasClass("loaded")) {
	//		$(this).removeClass("loaded")
	//	}
	//});
	$("#laneListTable > tbody > tr.loaded").removeClass("loaded");
}

function setLoadedRow(lane) {
	$("#laneListTable > tbody > tr").each(function() {
		if ($(this).find("td:first-child").html() == lane) {
			$(this).addClass("loaded");
			return false;
		}
	});
	if (inLaneListMode){
		$("#miniLaneUsers").css("visibility", "visible");
		$("#miniRates").css("visibility", "visible");
	} else {
		$("#miniLaneUsers").css("visibility", "hidden");
		$("#miniRates").css("visibility", "hidden");
	}
}

function fillEditedImportLanes(idx, $li, originColumn) {
	// Update Lanes with with Selected Geo for Edited Imported Lanes
	var i,
        rebuildLaneList = false,
        saveDestination,
        saveOrigin;

	if (originColumn){
        saveOrigin = lanes[idx].origin;
		lanes[idx].origin = $li.ignore("span").text();
		lanes[idx].originValid = "true";
		lanes[idx].origincityname = $li.attr("cityname");
		lanes[idx].origincountry = $li.attr("country");
		lanes[idx].origincountyname = $li.attr("countyname");
		lanes[idx].originidcity = $li.attr("idcity");
		lanes[idx].originidcounty = $li.attr("idcounty");
		lanes[idx].originidregion = $li.attr("idregion");
		lanes[idx].originidzip = $li.attr("idzip");
		lanes[idx].originsource = $li.attr("pointsrc");
		lanes[idx].originstate = $li.attr("state");
		lanes[idx].originzipcode = $li.attr("zipcode");
		lanes[idx].originzone = $li.attr("zone");

        // Correct all other Origins that Match Saved Origin to the Selected Geo
        for (i = 0; i < lanes.length; i++) {
            if (lanes[i].origin == saveOrigin){
                lanes[i].origin = $li.ignore("span").text();
                lanes[i].originValid = "true";
                lanes[i].origincityname = $li.attr("cityname");
                lanes[i].origincountry = $li.attr("country");
                lanes[i].origincountyname = $li.attr("countyname");
                lanes[i].originidcity = $li.attr("idcity");
                lanes[i].originidcounty = $li.attr("idcounty");
                lanes[i].originidregion = $li.attr("idregion");
                lanes[i].originidzip = $li.attr("idzip");
                lanes[i].originsource = $li.attr("pointsrc");
                lanes[i].originstate = $li.attr("state");
                lanes[i].originzipcode = $li.attr("zipcode");
                lanes[i].originzone = $li.attr("zone");

                rebuildLaneList = true;
            }
            // Correct all other Destinations that Match Saved Origin to the Selected Geo
            if (lanes[i].destination == saveOrigin){
                lanes[i].destination = $li.ignore("span").text();
                lanes[i].destinationValid = "true";
                lanes[i].destinationcityname = $li.attr("cityname");
                lanes[i].destinationcountry = $li.attr("country");
                lanes[i].destinationcountyname = $li.attr("countyname");
                lanes[i].destinationidcity = $li.attr("idcity");
                lanes[i].destinationidcounty = $li.attr("idcounty");
                lanes[i].destinationidregion = $li.attr("idregion");
                lanes[i].destinationidzip = $li.attr("idzip");
                lanes[i].destinationsource = $li.attr("pointsrc");
                lanes[i].destinationstate = $li.attr("state");
                lanes[i].destinationzipcode = $li.attr("zipcode");
                lanes[i].destinationzone = $li.attr("zone");

                rebuildLaneList = true;
            }
        }

	} else {
        saveDestination = lanes[idx].destination;
		lanes[idx].destination = $li.ignore("span").text();
		lanes[idx].destinationValid = "true";
		lanes[idx].destinationcityname = $li.attr("cityname");
		lanes[idx].destinationcountry = $li.attr("country");
		lanes[idx].destinationcountyname = $li.attr("countyname");
		lanes[idx].destinationidcity = $li.attr("idcity");
		lanes[idx].destinationidcounty = $li.attr("idcounty");
		lanes[idx].destinationidregion = $li.attr("idregion");
		lanes[idx].destinationidzip = $li.attr("idzip");
		lanes[idx].destinationsource = $li.attr("pointsrc");
		lanes[idx].destinationstate = $li.attr("state");
		lanes[idx].destinationzipcode = $li.attr("zipcode");
		lanes[idx].destinationzone = $li.attr("zone");
        // Correct all other Destinations that Match Saved Destination to the Selected Geo
        for (i = 0; i < lanes.length; i++) {
            if (lanes[i].destination == saveDestination){
                lanes[i].destination = $li.ignore("span").text();
                lanes[i].destinationValid = "true";
                lanes[i].destinationcityname = $li.attr("cityname");
                lanes[i].destinationcountry = $li.attr("country");
                lanes[i].destinationcountyname = $li.attr("countyname");
                lanes[i].destinationidcity = $li.attr("idcity");
                lanes[i].destinationidcounty = $li.attr("idcounty");
                lanes[i].destinationidregion = $li.attr("idregion");
                lanes[i].destinationidzip = $li.attr("idzip");
                lanes[i].destinationsource = $li.attr("pointsrc");
                lanes[i].destinationstate = $li.attr("state");
                lanes[i].destinationzipcode = $li.attr("zipcode");
                lanes[i].destinationzone = $li.attr("zone");

                rebuildLaneList = true;
            }
         // Correct all other Origins that Match Saved Destination to the Selected Geo
            if (lanes[i].origin == saveDestination){
                lanes[i].origin = $li.ignore("span").text();
                lanes[i].originValid = "true";
                lanes[i].origincityname = $li.attr("cityname");
                lanes[i].origincountry = $li.attr("country");
                lanes[i].origincountyname = $li.attr("countyname");
                lanes[i].originidcity = $li.attr("idcity");
                lanes[i].originidcounty = $li.attr("idcounty");
                lanes[i].originidregion = $li.attr("idregion");
                lanes[i].originidzip = $li.attr("idzip");
                lanes[i].originsource = $li.attr("pointsrc");
                lanes[i].originstate = $li.attr("state");
                lanes[i].originzipcode = $li.attr("zipcode");
                lanes[i].originzone = $li.attr("zone");

                rebuildLaneList = true;
            }
        }
	}

    // Rebuild the Lane List Data Table with Corrected Geo
    if (rebuildLaneList){
        rebuildLaneListDatatable();
    }


}

function rebuildLaneNav() {

	if (lanenumber == 0) {
		$("#laneNavNum, #laneNavSpinner").val("New");
	} else {
		$("#laneNavNum, #laneNavSpinner").val(lanenumber);
	}

	//if (laneListTable === undefined) {
	if (lanes.length == 0){
		getLanes();
	}

	enableNavButtons();

}

// enable or disable the lane navigation buttons
function enableNavButtons() {

	var $next     = $("#laneNavNext, #laneNavButtons > .navDown")
	var $previous = $("#laneNavPrevious, #laneNavButtons > .navUp");
	var $first    = $("#laneNavFirst");
	var $last     = $("#laneNavLast");

	var $loaded = $("#laneListTable tr.loaded");

	if ($loaded.is("tr:first-child")) {
		$previous.addClass("laneDisabled");
		$first.addClass("laneDisabled");
	} else {
		$previous.removeClass("laneDisabled");
		$first.removeClass("laneDisabled");
	}

	if ($loaded.is("tr:last-child")) {
		$next.addClass("laneDisabled");
		$last.addClass("laneDisabled");
	} else {
		$next.removeClass("laneDisabled");
		$last.removeClass("laneDisabled");
	}

	if (lanenumber == 0) { // it is a new proposal
		$next.addClass("laneDisabled");
		$last.addClass("laneDisabled");
		$previous.addClass("laneDisabled");
	}
}

function createNewLane() {

	clearLaneDetail();
	clearArrays();
	clearLaneNotes();

	// clear the rate grid
	rateDataView.beginUpdate();
    rateDataView.setItems([]);
    rateDataView.endUpdate();
    rateGrid.render();

    // clear rate total
    $("#rateTotal span").html("");

    $("#matchIndicator").hide();

 // Default Lane Type to Inquiry
	$(".laneType").val('I');
    quotetype = "I";
    setAuthorizedQuoteTypes(function(){
        // Disable Proposal and Spot
        $(".laneType option:contains('Proposal')").attr('disabled','disabled');
        $(".laneType option:contains('Spot')").attr('disabled','disabled');
    });
	//$(".laneType option:contains('Inquiry')").removeAttr('disabled');
	//$(".laneType option:contains('Proposal')").attr('disabled','disabled');
	//$(".laneType option:contains('Spot')").attr('disabled','disabled');
	//$(".laneType option:contains('Review')").removeAttr('disabled');
	//$(".laneType option:contains('Bid')").removeAttr('disabled');

	// Default Work Flow Status to NEW
	$("#workFlowStatus").val("");
    setAuthorizedWorkFlow();

	// Audit Results
	auditdate = '0001-01-01';
	auditreslt = '';

	$("#auditPass, #auditFail").hide();

	// Default Users
	for (i = 0; i < custDefaultUsers.length; i++){
		switch (custDefaultUsers[i].userType){
		case "SALES":
			$("#salesUser").val(custDefaultUsers[i].userProfile);
			break;
		case "PRICING":
			$("#priceUser").val(custDefaultUsers[i].userProfile);
			break;
		case "PUBLISH":
			$("#publishUser").val(custDefaultUsers[i].userProfile);
			break;
		}
	}

	// Minimum Charge
	$("#minChrgRate span").html(".00");
	$("#minChrgRPM span").html(".0000");
	$("#minChrgPricedRateSpan").html(".00");
	$("#minChrgPricedRateAmt").val(0);

	$("#miniPubMin").html(".00");
	$("#miniScale").html(".00");
	$("#miniPubRate").html(".00");

	// Reset ship condition flag
	$("#shipCondAsterisk").css("display","none");
	$("#getShipCond").css("padding-right", "2%");

	var effMoment = new moment(effdate, "YYYY-MM-DD");
	var expMoment = new moment(expdate, "YYYY-MM-DD");

	$("#effectiveDate").val(effMoment.format("MM/DD/YYYY"));
	$("#expirationDate").val(expMoment.format("MM/DD/YYYY"));

	$("#emailButton").removeClass("enabled");
	$("#emailButton").addClass("disabled");
	$("#saveRates").addClass("disabled");

	resetMapToOrg();

	rebuildLaneNav();

	$("#rateBlock").css("visibility", "hidden");

	$("#statsList").empty();
	$("#statInfo").css("display", "none");

	retrieveLog();
	rebuildNotes();

	$("#volumetricCustAvail").html("");
	$("#volumetricCustRate").html("");
    $("#custVolume .volumetricInput").html("");
	$("#xlftVolume .volumetricVal").html("");
    $("#xlftVolume .volumetricInput").html("");
	$("#xpolVolume .volumetricVal").html("");
    $("#xpolVolume .volumetricInput").html("");

	ds_Volumetrics.length = 0;
	buildVolumetricsChart();

    // Sandbox Values
    $("#propOrInput").val("");
    $("#propLHRPLMInput").val("");
    $("#estOR2Leg").html("");
    $("#estOR3Leg").html("");

}

function clearLaneNotes() {
	var commentLaneId;

	for (var i = 0; i < notes.length; i++) {

		commentLaneId = notes[i].cmtkey.slice(11);

		if (commentLaneId != "0000000000") {
			notes.splice(i,1);
			i--;
		}
	}

	$("#commentList").empty();
}

function clearLaneDetail() {
	idpqlandtl = 0;
	approvddat = '0001-01-01-00.00.00.000000';
	approvdusr = '';
	approvdsts = '';
	effdate    = moment().format("YYYY-MM-DD");
	expdate    = moment().add(45, 'days').format("YYYY-MM-DD");
	idpqlandtl = 0;
	lanenumber = 0;
	quotetype  = 'I';
	rateddate  = '0001-01-01-00.00.00.000000';
	statorig   = '';
	statdest   = '';
	statbegdt  = '0001-01-01';
	statenddt  = '0001-01-01';
	custrefno = "";
}

function clearArrays() {
	chrg.length = 0;
	cond.length = 0;
	data.length = 0;
	geo.length = 0;
	stat.length = 0;
	auth.length = 0;
	match.length = 0;
	log.length = 0;

}
