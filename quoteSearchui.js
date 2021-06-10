
//*************************
// Global Variables
//*************************
var adduser = "";
var addtimestart = "0001-01-01";
var addtimeend = "0001-01-01";
var matchSummary = [];
var quoteSearchTable;
var quoteSearchSummaryTable;
var searchMode = "DETAIL";
var usefullcust;
var useinherit = 0;
var urlLoadNo = "";

//*************************
// Initialization
//*************************

// page setup for search.html
function setup(){

	retrieveWorkFlowStatus($('#searchWorkFlowStatus'), function(){
		// MultiSelect Setup for Work Flow Status
		$("#searchWorkFlowStatus").multiselect({
			classes: "searchWorkFlowMulti",
			header: false,
			noneSelectedText: "Status",
			open:  function(){
				searchWorkFlowStatus_values.length = 0;
			},
			close: function(){
				searchWorkFlowStatus_values = $("#searchWorkFlowStatus").multiselect("getChecked").map(function(){
					   return this.value;
					}).get();
				searchQuotes();
			},
			position: {
				my: 'left top',
				at: 'left bottom'
			}
		});

		$("#searchWorkFlowStatus").multiselect('uncheckAll');
	});

	initMultiSelect();
	clearInputs();
	clearVars();
	initDatepickers();
	initSpinners();
	initToolTipster();
	if (searchMode == "DETAIL"){
		initDatatable();
		$("#quoteSummaryTableBlock").addClass("tableHidden");
		$("#quoteTableBlock").addClass("tableDisplay");
		$('#searchModeButton span').html("Show Summary");
	} else {
		initSummaryDatatable();
		$("#quoteTableBlock").addClass("tableHidden");
		$("#quoteSummaryTableBlock").addClass("tableDisplay");
		$('#searchModeButton span').html("Hide Summary");
	}
	retrieveAllLaneUsers(function(){
		buildLaneUserTypeSelectOptions($("#searchUserType"));
	});
	assignClickEvents();

	checkURLParms();
	if (urlLoadNo){
		$("#useLoad").val(urlLoadNo);
		getLoadInfo();
	}
}

function initDatepickers() {
	$(".dateEntry input").datepicker({
		showOn: "button",
		buttonImage: "../images/calendar.gif",
		buttonImageOnly: true,
	});
}

function initSpinners() {
	subCL = new CanvasLoader('sLoading');
	subCL.setColor('#5c5b6b'); // default is '#000000'
	subCL.setShape('spiral'); // default is 'oval'
	subCL.setDiameter(50); // default is 40
	subCL.setDensity(60); // default is 40
	subCL.setRange(1.2); // default is 1.3
	subCL.setSpeed(3); // default is 2
	subCL.show(); // Hidden by default
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

function initDatatable() {
	quoteSearchTable = $('#quoteTable').DataTable( {
		data: match,
		dom: 'T<"clear">lfrtip',
		scrollY: 595,
		scrollCollapse: false,
		lengthChange: false,
		paging: false,
		rowCallback: function(row, data) {
			if (data.rp) { // part of old rate proposal system
				$(row).addClass("oldRatePropSystem");
			}
		},
		drawCallback: function( settings ) {
			var colCount = settings.aoColumns.length;
			if ($("#useLoad").val() == "" ){
				var $newButton =
				$("<tr><td class='newLikeThis' colspan='" + colCount + "'>+ New Quote</td></tr>");
			} else {
				var $newButton =
					$("<tr><td class='newLikeThis' colspan='" + colCount + "'>+ New Quote from Load</td></tr>");
			}
			if ($("#searchCustomer").val() != "" || $("#contactSelection > span").text() != ""){
				$(".dataTables_empty").remove();
				$("#quoteTable tbody").append($newButton);
			}
		},
	    language: {
	    	search: "Filter records:",
			zeroRecords: "No quotes here!"
		},
		/*tableTools: {
			sSwfPath: "/applications/_globalSource/javascript/DataTables-1.10.4/extensions/TableTools/swf/copy_csv_xls.swf",
			aButtons: [
				{
					sExtends: "xls",
					sButtonClass: "exportXLSBtn",
					sButtonText: ""
				}
			]
		},*/
		buttons: [
        	'excelHtml5'
		],
	    columns: [
	  	        {title: 'Quote', data: 'quotenum'},
	  	        {title: 'Lane', data: 'lanenumber'},
	  	        {title: 'Customer', data: 'custnumber'},
	  	        {title: 'Origin', data: 'origin'},
				{title: 'Org <br/> Zone', data: 'originzone'},
	  	        {title: 'Dest', data: 'destination'},
				{title: 'Dest <br/> Zone', data: 'destinzone'},
	  	        {title: 'Type', data: 'quotetype'},
	  	        {title: 'Status', data: 'workflowstatus'},
	  	        {title: 'Effective', data: 'effdate'},
	  	        {title: 'Expiration', data: 'expdate'}
	  	],
	  	order: [[ 0, 'desc' ], [1, 'asc']]
	});

	quoteSearchTable.buttons().container().appendTo( $('#quoteTable_wrapper') );

	// Open match on click
	$('#quoteTable').on('click', 'td', function(event) {
		var mCell = quoteSearchTable.cell(this)[0][0];
		if (mCell){
			var d = quoteSearchTable.row(mCell.row).data();
			var viewProposalURL = "pricingcgi.pgm?quotenum=" + d.quotenum +
				"&lane=" + d.lanenumber;

			// Only open link if clicking on proposal number and the proposal
			// is not part of the old rate proposal system
			if (mCell.column == 0 && !d.rp){
				window.open(viewProposalURL);
			}
		}
	});
}
function initSummaryDatatable() {
	quoteSearchSummaryTable = $('#quoteSummaryTable').DataTable( {
	    data: matchSummary,
		dom: 'T<"clear">lfrtip',
		scrollY: 613,
		scrollCollapse: false,
		lengthChange: false,
		paging: false,
		rowCallback: function(row, data) {
			if (data.rp) { // part of old rate proposal system
				$(row).addClass("oldRatePropSystem");
			}
		},
		drawCallback: function( settings ) {
			var colCount = settings.aoColumns.length;
			if ($("#useLoad").val() == "" ){
				var $newButton =
				$("<tr><td class='newLikeThis' colspan='" + colCount + "'>+ New Quote</td></tr>");
			} else {
				var $newButton =
					$("<tr><td class='newLikeThis' colspan='" + colCount + "'>+ New Quote from Load</td></tr>");
			}
			if ($("#searchCustomer").val() != "" || $("#contactSelection > span").text() != ""){
				$(".dataTables_empty").remove();
				$("#quoteSummaryTable tbody").append($newButton);
			}
		},
	    language: {
	    	search: "Filter records:",
			zeroRecords: "No quotes here!"
	    },
		/*tableTools: {
			sSwfPath: "/applications/_globalSource/javascript/DataTables-1.10.4/extensions/TableTools/swf/copy_csv_xls.swf",
			aButtons: [
				{
					sExtends: "xls",
					sButtonClass: "exportXLSBtn",
					sButtonText: ""
				}
			]
		},*/
		buttons: [
        	'excelHtml5'
		],
	    columns: [
	  	        {title: 'Quote', data: 'quotenum'},
	  	        {title: 'Lane Count', data: 'laneCount'},
	  	        {title: 'Customer', data: 'custnumber'},
	  	        {title: 'Name', data: 'customerName'},
	  	        {title: 'Contact', data: 'contactName'}

	  	],
	  	order: [[ 0, 'desc' ], [1, 'asc']]
	});
	//
	$('#quoteSummaryTable').on('click', 'td', function(event) {
		var mCell = quoteSearchSummaryTable.cell(this)[0][0];
		if (mCell){
			var d = quoteSearchSummaryTable.row(mCell.row).data();
			var viewProposalURL = "pricingcgi.pgm?quotenum=" + d.quotenum +
				"&lane=1&lanelist=true";

			// Only open link if clicking on proposal number and the proposal
			// is not part of the old rate proposal system
			if (mCell.column == 0 && !d.rp){
				window.open(viewProposalURL);
			}
		}
	});
}
function initMultiSelect() {
	$("#searchLaneType").multiselect({
		classes: "searchLaneTypeMulti",
		header: false,
		noneSelectedText: "Type",

		open:  function(){
			searchLaneType_values.length = 0;
		},
		close: function(){
			searchLaneType_values = $("#searchLaneType").multiselect("getChecked").map(function(){
				   return this.value;
				}).get();
			searchQuotes();
		   },
		position: {
			my: 'left top',
			at: 'left bottom'
		}
	});
	$("#searchLaneType").multiselect('uncheckAll');


}

function checkURLParms() {
	urlLoadNo = getURLParameter('loadno');
}

//*************************
// Click Events
//*************************

function assignClickEvents() {
	// Hide menus
	$(document).click(function(e){
		if ($(e.target).parents("#contSearchList").length == 0) {
			$("#contSearchList").empty().hide();
		}

		if ($(e.target).parents("#custSearchList").length == 0) {
			$("#custSearchList").empty().hide();
		}

		if ($(e.target).parents("#geoSearchList").length == 0) {
			$("#geoSearchList").empty().hide();
		}
	});

	$("#searchButton").click( function () {
		$("#custSearchList").hide().empty();
		$("#geoSearchList").hide().empty();
		if ($("#useLoad").val() != "" ){
			// Get Load Information and Search Quotes
			getLoadInfo();
		} else {
			// Search Quotes from Selection Entered
			searchQuotes();
		};


	});

	// redirect to pricing page if proposal number is entered
	$("#viewButton").click(function() {

		var isValid = false;

		var quoteNum = $("#searchProposal").val().trim();

		// create the ajax url
		var url = "pqxml.pgm?" +
	      "func=getnavigation" +
	      "&quotenum=" + quoteNum +
	      "&lane=1";

		// ajax request to check if quote number is valid
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			success: function(response) {

				// check if the response has a <quotenum> tag
				$quoteNum = $(response).find("quotenum");
				if ($quoteNum.length > 0) {
					isValid = true;
				} else {
					isValid = false;
				}
			},

			complete: function(jqXHR, completeStatus) {

				if (isValid) {

					if ($("#searchProposal").hasClass("invalidField")) {
						$("#searchProposal").removeClass("invalidField");
					}
					$("#searchProposal").removeAttr("title");

					window.open("pricingcgi.pgm?quotenum=" +
						quoteNum + "&lane=1&lanelist=true", '_blank');

				} else {

					if (!$("#searchProposal").hasClass("invalidField")) {
						$("#searchProposal").addClass("invalidField");
					}
					$("#searchProposal").attr("title", "Invalid quote number");
					$("#searchProposal").focus();
				}

			},

			error: function(jqXHR, errorStatus, errorMessage) {

			}
		});
	});

	$("#newButton").click(function() {

		// redirect to pricing page
		window.open("pricingcgi.pgm");

	});

	// Set FancyBox click for help
	$("#helpButton").fancybox({
		beforeShow: function() {
			this.wrap.draggable();
		},
		helpers: { overlay: false }
	});

	$("#resetButton").click(function(){
		clearInputs();
		uncheckMultiSelect();
		geo.length = 0;
		rebuildQuoteTable();
		$("#searchCustomer").focus();
	});
	$("#searchModeButton").click(function(){
		if (searchMode == "DETAIL"){
			searchMode = "SUMMARY";
			// Hide Detail Table
			if ($("#quoteTableBlock").hasClass("tableDisplay")) {
				$("#quoteTableBlock").removeClass("tableDisplay");
				$("#quoteTableBlock").addClass("tableHidden");
			}
			if (quoteSearchSummaryTable  === undefined){
				initSummaryDatatable();
			}
			// Display Summary Table
			if ($("#quoteSummaryTableBlock").hasClass("tableHidden")) {
				$("#quoteSummaryTableBlock").removeClass("tableHidden");
				$("#quoteSummaryTableBlock").addClass("tableDisplay");
			}
			$('#searchModeButton span').html("Hide Summary");
		} else {
			searchMode = "DETAIL";
			// Hide Summary Table
			if ($("#quoteSummaryTableBlock").hasClass("tableDisplay")) {
				$("#quoteSummaryTableBlock").removeClass("tableDisplay");
				$("#quoteSummaryTableBlock").addClass("tableHidden");
			}
			if (quoteSearchTable  === undefined){
				initDatatable();
			}
			// Display Detail Table
			if ($("#quoteTableBlock").hasClass("tableHidden")) {
				$("#quoteTableBlock").removeClass("tableHidden");
				$("#quoteTableBlock").addClass("tableDisplay");
			}
			$('#searchModeButton span').html("Show Summary");
		}
		searchQuotes();

	});

	$("#searchProposal")
		.bind("keyup", function(e){
			switch (e.which) {
				case 13: //Enter
					$("#viewButton").click();
					break;
				case 27: //Escape
					$(this).val("");
					break;
			}

			// if the field is empty, make it valid again
			if ($(this).val().trim() == "") {
				if ($("#searchProposal").hasClass("invalidField")) {
					$("#searchProposal").removeClass("invalidField");
				}
				$("#searchProposal").removeAttr("title");
			}
		})
		.blur(function() {

			// if the field is empty, make it valid again
			if ($(this).val().trim() == "") {
				if ($("#searchProposal").hasClass("invalidField")) {
					$("#searchProposal").removeClass("invalidField");
				}
				$("#searchProposal").removeAttr("title");
			}
		});

	$("#searchCustomer")
		.focus(function(){
			$("#custSearchList").hide().empty();
		})
		.bind("keydown", function(e){
			var $selectedLI = $("#custSearchList li.selected");
			switch (e.which) {
				case 9: //Tab
					//Enter current selection if entered, otherwise leave
					if ($selectedLI.length > 0){
						setCustSelection($(this));
					} else {
						$("#custSearchList").hide().empty();
					}

					// Manually navigate if selected item is up
					if (!e.shiftKey){
						if ($("#contactSelection > span").text() != ""){
							e.preventDefault();
							$("#contactSelection > .removeSelectedItem").click();
						}
					}

					break;
			}
		})
		.bind("keyup", function(e){
			var $selectedLI = $("#custSearchList li.selected");

			switch (e.which) {
				case 9: //Tab
					//Default behavior
					break;
				case 13: //Enter
					if ($("#custSearchList").css("display") != "none"){
						setCustSelection($(this));
					} else {
						searchQuotes();
					}
					break;
				case 16: //Shift
					//Default behavior
					break;
				case 27: //Escape
					$("#searchCustomer").val("");
					$("#custSearchList").hide().empty();
					break;
				case 38: //Up arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.prev().length > 0){
							$selectedLI = $selectedLI.prev();
							$("#custSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");

                            if (!isElementInViewport($selectedLI)){
                                $selectedLI.parent().scrollTop(
                                    $selectedLI.parent().scrollTop() - $selectedLI.innerHeight());
                            }
						}
					}
					break;
				case 40: //Down arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.next().length > 0){
							$selectedLI = $selectedLI.next();
							$("#custSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");

                            if (!isElementInViewport($selectedLI)){
                                $selectedLI.parent().scrollTop(
                                    $selectedLI.parent().scrollTop() + $selectedLI.innerHeight());
                            }
						}
					} else {
						$("#custSearchList li").first().addClass("selected");
					}
					break;
				default: //All character keys not mentioned above
					var searchString = escape($(this).val());
					searchCustomer($(this));
					break;
			}
		});

	$("#searchContact")
		.focus(function(){
			$("#geoSearchList").hide().empty();
		})
		.bind("keydown", function(e){
			var $selectedLI = $("#contSearchList li.selected");
			switch (e.which) {
				case 9: //Tab
					//Enter current selection if entered, otherwise leave
					if ($selectedLI.length > 0){
						setContSelection($(this));
					} else {
						$("#contSearchList").hide().empty();
					}

					// Manually navigate if selected item is up
					if (!e.shiftKey){
						if ($("#originSelection > span").text() != ""){
							e.preventDefault();
							$("#originSelection > .removeSelectedItem").click();
						}
					}

					break;
			}
		})
		.bind("keyup", function(e){
			var $selectedLI = $("#contSearchList li.selected");

			switch (e.which) {
				case 9: //Tab
					// Default behavior
					break;
				case 13: //Enter
					if ($("#contSearchList").css("display") != "none"){
						setContSelection($(this));
						$("#searchOrigin").focus();
					} else {
						searchQuotes();
					}
					break;
				case 16: //Shift
					//Default behavior
					break;
				case 27: //Escape
					$("#searchContact").val("");
					$("#contSearchList").hide().empty();
					break;
				case 38: //Up arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.prev().length > 0){
							$selectedLI = $selectedLI.prev();
							$("#contSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");

                            if (!isElementInViewport($selectedLI)){
                                $selectedLI.parent().scrollTop(
                                    $selectedLI.parent().scrollTop() - $selectedLI.innerHeight());
                            }
						}
					}
					break;
				case 40: //Down arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.next().length > 0){
							$selectedLI = $selectedLI.next();
							$("#contSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");


                            if (!isElementInViewport($selectedLI)){
                                $selectedLI.parent().scrollTop(
                                    $selectedLI.parent().scrollTop() + $selectedLI.innerHeight());
                            }
						}
					} else {
						$("#contSearchList li").first().addClass("selected");
					}
					break;
				default: //All character keys not mentioned above
					var searchString = escape($(this).val());
					var $textBox = $(this);
					searchContacts($(this), $("#contSearchList"), function(){
						$("#searchOrigin").focus();
					});
					break;
			}
		});

	$("#searchOrigin")
		.focus(function(){
			$("#custSearchList").hide().empty();
			$("#geoSearchList").hide().empty();
		})
		.bind("keydown", function(e){
			var $selectedLI = $("#geoSearchList li.selected");
			switch (e.which) {
				case 9: //Tab
					//Enter current selection if entered, otherwise leave
					if ($selectedLI.length > 0){
						setGeoSelection($(this));
					} else {
						$("#geoSearchList").hide().empty();
					}

					// Manually navigate if selected item is up
					if (!e.shiftKey){
						if ($("#destinationSelection > span").text() != ""){
							e.preventDefault();
							$("#destinationSelection > .removeSelectedItem").click();
						}
					} else {
						if ($("#contactSelection > span").text() != ""){
							e.preventDefault();
							$("#contactSelection > .removeSelectedItem").click();
						}
					}

					break;
			}
		})
		.bind("keyup", function(e){

			var $selectedLI = $("#geoSearchList li.selected");

			switch (e.which) {
				case 9: //Tab
					//Default behavior
					break;
				case 13: //Enter
					if ($("#geoSearchList").css("display") != "none"){
						setGeoSelection($(this));
					} else {
						searchQuotes();
					}
					break;
				case 16: //Shift
					//Default behavior
					break;
				case 27: //Escape
					$("#searchOrigin").val("");
					$("#geoSearchList").hide().empty();
					break;
				case 38: //Up arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.prev().length > 0){
							$selectedLI = $selectedLI.prev();
							$("#geoSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");
						}
					}
					break;
				case 40: //Down arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.next().length > 0){
							$selectedLI = $selectedLI.next();
							$("#geoSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");
						}
					} else {
						$("#geoSearchList li").first().addClass("selected");
					}
					break;
				default: //All character keys not mentioned above
					$.each(geo, function(index, point){
						if (point.geotype == "ORG"){
							geo.splice(index, 1);
							return false;
						}
					});

					var searchString = escape($(this).val());
					searchGeography($(this));
					break;
			}
		});

	$("#searchDestn")
		.focus(function(){
			$("#custSearchList").hide().empty();
			$("#geoSearchList").hide().empty();
		})
		.bind("keydown", function(e){
			var $selectedLI = $("#geoSearchList li.selected");
			switch (e.which) {
				case 9: //Tab
					//Enter current selection if entered, otherwise leave
					if ($selectedLI.length > 0){
						setGeoSelection($(this));
					} else {
						$("#geoSearchList").hide().empty();
					}

					// Manually navigate if selected item is up
					if (e.shiftKey){
						if ($("#originSelection > span").text() != ""){
							e.preventDefault();
							$("#originSelection > .removeSelectedItem").click();
						}
					}

					break;
			}
		})
		.bind("keyup", function(e){
			var $selectedLI = $("#geoSearchList li.selected");

			switch (e.which) {
				case 9: //Tab
					if (e.shiftKey){
					}
					break;
				case 13: //Enter
					if ($("#geoSearchList").css("display") != "none"){
						setGeoSelection($(this));
					} else {
						searchQuotes();
					}
					break;
				case 16: //Shift
					//Default behavior
					break;
				case 27: //Escape
					$("#searchDestn").val("");
					$("#geoSearchList").hide().empty();
					break;
				case 38: //Up arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.prev().length > 0){
							$selectedLI = $selectedLI.prev();
							$("#geoSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");
						}
					}
					break;
				case 40: //Down arrow
					if ($selectedLI.length > 0){
						if ($selectedLI.next().length > 0){
							$selectedLI = $selectedLI.next();
							$("#geoSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");
						}
					} else {
						$("#geoSearchList li").first().addClass("selected");
					}
					break;
				default: //All character keys not mentioned above
					$.each(geo, function(index, point){
						if (point.geotype == "DST"){
							geo.splice(index, 1);
							return false;
						}
					});

					var searchString = escape($(this).val());
					searchGeography($(this));
					break;
			}
		});

	// generic selected item removal
	//$(".selectedListItem").click(function(){
	//	var $textBox = $(this).siblings("input");
	//	$(this).hide();
	//	$textBox.val("").fadeIn("fast").focus();
	//	$(this).children("span").html("");
	//	$(this).css("top", $textBox.outerHeight(true)).show();
	//});

	$(".removeSelectedItem").click(function(){
		var $selectedListItem = $(this).parent();
		var $textBox = $selectedListItem.siblings("input");

		$selectedListItem.hide();
		$textBox.val("").fadeIn("fast").focus();
		$selectedListItem.children("span").html("");
		$selectedListItem.css("top", $textBox.outerHeight(true)).show();
	});

	$("#loadSelection > .removeSelectedItem").click(function(){
		$(".selectedListItem").each(function(){
			//var $textBox = $(this).siblings("input");
			//$(this).hide();
			$(this).children(".removeSelectedItem").show();
			//$textBox.fadeIn("fast");
			//$(this).css("top", $textBox.outerHeight(true)).show();

		});
	});

	// specific item removal
	$("#contactSelection").click(function(){
		contId = 0;
	});
	$("#originSelection").click(function(){
		$.each(geo, function(index, point){
			if (point.geotype == "ORG"){
				geo.splice(index, 1);
				return false;
			}
		});
	});
	$("#destinationSelection").click(function(){
		$.each(geo, function(index, point){
			if (point.geotype == "DST"){
				geo.splice(index, 1);
				return false;
			}
		});
	});

	$("#searchLaneType").bind("keydown", function(e){
		switch (e.which) {
			case 13: //Enter
				searchQuotes();
				break;

			case 9: //Tab
				// Manually navigate if selected item is up
				if (e.shiftKey){
					if ($("#destinationSelection > span").text() != ""){
						e.preventDefault();
						$("#destinationSelection > .removeSelectedItem").click();
					}
				}

				break;
		}
	});

	$("#searchUserType")
		.bind("keydown", function(e){
			switch (e.which) {
				case 13: //Enter
					// Build User Profile Selection Options
					$("#searchUserProfile option").remove();
					switch ($("#searchUserType option:selected").text()) {
						case "SALES":
							buildLaneUserSelectOptions($("#searchUserProfile"),"SALES");
							break;
						case "PRICING":
							buildLaneUserSelectOptions($("#searchUserProfile"),"PRICING");
							break;
						case "PUBLISH":
							buildLaneUserSelectOptions($("#searchUserProfile"),"PUBLISH");
							break;
						}

					break;

			}
		})

		.change(function(){
			// Build User Profile Selection Options
			$("#searchUserProfile option").remove();
			switch ($("#searchUserType option:selected").text()) {
				case "SALES":
					buildLaneUserSelectOptions($("#searchUserProfile"),"SALES");
					break;
				case "PRICING":
					buildLaneUserSelectOptions($("#searchUserProfile"),"PRICING");
					break;
				case "PUBLISH":
					buildLaneUserSelectOptions($("#searchUserProfile"),"PUBLISH");
					break;
				case "All":
					$("#searchUserProfile").append(
					"<option value=''>All</option>");
			    break;
				}
	    });

	$("#searchEffDate").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
		}
	});

	$("#searchExpDate").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
		}
	});

	$("#searchByUser").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
		}
	});

	$("#searchEntryBDate").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
		}
	});

	$("#searchEntryEDate").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
		}
	});

	// Create New Quote based on Search Selection on Click
	$('#quoteTable').on('click', '.newLikeThis', function(event) {
		if (cusprefix != "" || contPrefix != ""){
			if ($("#useLoad").val() == "" ){
				buildNewQuoteTempFile();
			} else {
				window.open("pricingcgi.pgm?quotenum=" + useLoadInfoXML);
			}
		};

	});
	// Create New Quote based on Search Selection on Click
	$('#quoteSummaryTable').on('click', '.newLikeThis', function(event) {
		if (cusprefix != "" || contPrefix != ""){
			if ($("#useLoad").val() == "" ){
				buildNewQuoteTempFile();
			} else {
				window.open("pricingcgi.pgm?quotenum=" + useLoadInfoXML);
			}
		};

	});

	// date validation
	$("#searchEffDate, #searchExpDate")
		.change(function(){
			validateEffRange();
		})
		.bind("keyup", function(e){
			if (e.which === 13) {
				$("#searchEffDate").trigger("blur");
			}
	});

	// date validation
	$("#searchEntryBDate, #searchEntryEDate")
		.change(function(){
			validateEnteredRange();
		})
		.bind("keyup", function(e){
			if (e.which === 13) {
				$("#searchEffDate").trigger("blur");
			}
	});

	$("#useLoad")
		.bind("keyup", function(e){
				switch (e.which) {
				case 13: //Enter
					getLoadInfo();
					break;
				case 27: //Escape
					$(this).val("");
					$("#searchCustomer").removeAttr('disabled');
					$("#searchOrigin").removeAttr('disabled');
					$("#searchDestn").removeAttr('disabled');
					break;
				}

		})
		.blur(function(){
			if ($("#useLoad").val() == ""){
				$("#searchCustomer").removeAttr('disabled');
				$("#searchOrigin").removeAttr('disabled');
				$("#searchDestn").removeAttr('disabled');
			}
	});
}

//Search for Quotes
function searchQuotes(){


	clearVars();

	if (!validateEffRange() || !validateEnteredRange()) {
		return;
	}

	// get the customer number from the screen
	var custNum = $("#searchCustomer").val().trim();
	if (custNum != "") {
		custNum = custNum.replace(/-/g,"");
		custNum = custNum.toUpperCase();
		if (custNum.length == 6) {

			cusprefix = custNum.substring(0,1);
			cusbase = custNum.substring(1,6);
			cussuffix = "000";
			usefullcust = 0;

		} else if (custNum.length == 9) {

			cusprefix = custNum.substring(0,1);
			cusbase = custNum.substring(1,6);
			cussuffix = custNum.substring(6,9);
			usefullcust = 1;

		}
	}

// get type from the screen
	//switch ($("#searchLaneType option:selected").text()) {
	//	case "All":
	//		quotetype = "";
	//		break;
	//	case "Bid":
	//		quotetype = "B";
	//		break;
	//	case "Inquiry":
	//		quotetype = "I";
	//		break;
	//	case "Proposal":
	//		quotetype = "P";
	//		break;
	//	case "Review":
	//		quotetype = "R";
	//		break;
	//	case "Spot":
	//		quotetype = "S";
	//		break;
	//}
	// Get Work Flow Status from Screen
	//approvdsts = $("#searchWorkFlowStatus option:selected").attr("value");

	quotetype = "";
	// MultiSelect Quote Types - Load selection into array
	searchLaneType_values = $("#searchLaneType").multiselect("getChecked").map(function(){
		   return this.value;
		}).get();

	// MultiSelect Work Flow Status - Load selection into array
	searchWorkFlowStatus_values = $("#searchWorkFlowStatus").multiselect("getChecked").map(function(){
		   return this.value;
		}).get();
	if (searchWorkFlowStatus_values.length == 0){
		approvdsts = "*";
	} else {
		approvdsts = "";
	}




	// get the effective and expiration dates from the screen
	var effective  = $("#searchEffDate").val().trim();
	var expiration = $("#searchExpDate").val().trim();
	if (effective != "") {
		var effMoment = new moment(effective, "MM-DD-YYYY");
		effdate = effMoment.format("YYYY-MM-DD");
	}
	if (expiration != "") {
		var expMoment = new moment(expiration, "MM-DD-YYYY");
		expdate = expMoment.format("YYYY-MM-DD");
	}

	// get the "entered by" user id from the screen
	var user = $("#searchByUser").val().trim();
	if (user != "") {
		adduser = user;
	}

	// get the "entered range" from the screen
	var beginDate = $("#searchEntryBDate").val().trim();
	var endDate   = $("#searchEntryEDate").val().trim();
	if (beginDate != "") {
		var beginMoment = new moment(beginDate, "MM-DD-YYYY");
		addtimestart = beginMoment.format("YYYY-MM-DD");
	}
	if (endDate != "") {
		var endMoment   = new moment(endDate, "MM-DD-YYYY");
		addtimeend   = endMoment.format("YYYY-MM-DD");
	}
	if (searchMode == "DETAIL"){
		retrieveQuotes();
	} else {
		retrieveSummaryQuotes();
	}

}

//*************************
// AJAX
//*************************

function retrieveQuotes() {

	var errMessage;
	var error = false;
	var i = -1;
	var url;
	var postXML;
	var matchCount = 0;
	var duplicateCount = 0;

	// Display Spinner
	if ($("#sMask").css('display') != "block"){
		$("#sMask").toggle();
		subCL.show();
		$("#sLoading").css('display','block');
	};

	postXML = buildQuoteRequest();

	match.length = 0;

	url = "PQxml.pgm?Func=QuoteRequest&Action=MATCH";

	$.ajax({
		type: "POST",
		url: url,
		data: postXML,
		dataType: "xml",
		cache: false,
		success: function(xml) {

			// Check for Error Messages
			errMessage = $(xml).find('Error').attr('message');
			if (errMessage){
				alert (errMessage);
				error = true;
			} else {
				// Move Matched Lanes into variable Match array
				$(xml).find('match').each(function(){
					i++;
					var m = (match[i] = {});

					m["quotenum"] = $(this).attr("quotenum");
					m["lanenumber"] = $(this).attr("lanenumber");
					m["custnumber"] = $(this).attr("custnumber");
					m["origin"] = $(this).attr("origin");
					m["originzone"] = $(this).attr("originzone");
					m["destination"] = $(this).attr("destination");
					m["destinzone"] = $(this).attr("destinzone");
					m["rp"] = ($(this).attr("rp") === "true"); // parse to bool

					// Lane Work Flow Status
					m["workflowstatus"] = $(this).attr("sdesc");

					var effMoment = moment($(this).attr("effdate"), 'YYYY-MM-DD');
					var expMoment = moment($(this).attr("expdate"), 'YYYY-MM-DD');

					m["effdate"] = effMoment.format('MM/DD/YYYY');
					m["expdate"] = expMoment.format('MM/DD/YYYY');

					switch ($(this).attr("quotetype")){
						case "B":
							m["quotetype"] = "Bid";
							break;
						case "I":
							m["quotetype"] = "Inq";
							break;
						case "P":
							m["quotetype"] = "Prop";
							break;
						case "R":
							m["quotetype"] = "Revw";
							break;
						case "S":
							m["quotetype"] = "Spot";
							break;

						default:
							m["quotetype"] = "Inq";
							break;
					}
				});
			}
		},

		complete: function() {
			rebuildQuoteTable();

			// Hide Spinner
			if ($("#sMask").css('display') == "block"){
				$("#sMask").toggle();
				subCL.hide();
				$("#sLoading").css('display','none');
			};

		},

		error: function() {
			alert("Error during quote search");
		}
	});

}
function retrieveSummaryQuotes() {
	var errMessage;
  	var error = false;
  	var i = -1;
  	var url;
  	var postXML;

  	// Display Spinner
  	if ($("#sMask").css('display') != "block"){
  		$("#sMask").toggle();
  		subCL.show();
  		$("#sLoading").css('display','block');
  	};

  	postXML = buildQuoteRequest();

  	matchSummary.length = 0;

  	url = "PQxml.pgm?Func=QuoteRequest&Action=MATCHSUM";

  	$.ajax({
  		type: "POST",
  		url: url,
  		data: postXML,
  		dataType: "xml",
  		cache: false,
  		success: function(xml) {

  			// Check for Error Messages
  			errMessage = $(xml).find('Error').attr('message');
  			if (errMessage){
  				alert (errMessage);
  				error = true;
  			} else {
  				// Move Quote Summary into variable Match Summary array
  				$(xml).find('summary').each(function(){
  					i++;
  					var m = (matchSummary[i] = {});

  					m["quotenum"] = $(this).attr("quotenum");
  					m["laneCount"] = $(this).attr("lanecount");
  					m["custnumber"] = $(this).attr("formattedcust");
  					m["customerName"] = $(this).attr("custname");
  					m["contactName"] = $(this).attr("primarycontact");


  				});
  			}
  		},

  		complete: function() {
  			rebuildQuoteTable();

  			// Hide Spinner
  			if ($("#sMask").css('display') == "block"){
  				$("#sMask").toggle();
  				subCL.hide();
  				$("#sLoading").css('display','none');
  			};

  		},

  		error: function() {
  			alert("Error during summary quote search");
  		}
  	});

}
function buildNewQuoteTempFile() {

	var errMessage;
	var error = false;
	var i = -1;
	var url;
	var postXML;
	var success = true;



	postXML = buildQuoteTempRequest();


	url = "PQxml.pgm?Func=NEWQUOTETEMPFILE";

	$.ajax({
		type: "POST",
		url: url,
		data: postXML,
		dataType: "xml",
		cache: false,
		success: function(xml) {

			// Check for Error Messages
			errMessage = $(xml).find('Error').attr('message');
			if (errMessage){
				alert (errMessage);
				error = true;
			} else {
				// Extract New Temporary XML File Name from Response
				success = $(xml).find('success').text();
				if (success){
					newQuoteXMLTemp = $(xml).find('newquotefile').text();
					if (newQuoteXMLTemp != ""){
						window.open("pricingcgi.pgm?quotenum=" + newQuoteXMLTemp);
					}
				} else {
					alert ("'Error building new Quote XML Request.")
				}

			}
		},

		complete: function() {




		},

		error: function() {
			alert("Error during building new Quote XML Request.");
		}
	});

}

// Get Load Information XML File
function getLoadInfo() {

	var errMessage;
	var error = false;
	var url;

	loadNumber = $("#useLoad").val();

	useLoadInfoXML = "";
	$("#useLoad").removeClass("invalidField");

	url = "PQxml.pgm?" +
	"Func=GETLOADINFORMATION&loadnum=" + loadNumber;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(xml) {

		    // Check for Success
			errMessage = $(xml).find('message').text();
			if (errMessage){
				$("#useLoad").addClass("invalidField");

				error = true;
			} else {

				// Extract New Temporary XML File Name with Loads Information from Response
				useLoadInfoXML = $(xml).find('filename').text();
				if (useLoadInfoXML == ""){
					error = true;
				}
			}
		},

		complete: function() {

			if (error == true){
				$("#useLoad").addClass("invalidField");
			} else {
				buildSearchFromLoad();
			};

		},

		error: function() {
			$("#useLoad").addClass("invalidField");

		}

	});

}

// Get Load Information XML File
function buildSearchFromLoad() {
	var i = -1;
	var errMessage;
	var error = false;
	var url;
	var formattednumber = "";
	var loadOrigin = "";
	var loadDestn = "";

	// Get Load Information from Temp File
	url = "/applications/_globalTemp/" + useLoadInfoXML;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(xml) {
			// Cover Load Number with modal box
			blockInput($("#useLoad"), $("#useLoad").val());
			$(".removeSelectedItem").hide();
			$("#loadSelection > .removeSelectedItem").show();

			// Customer Number Search Field
			cusprefix = $(xml).find('header').attr("cusprefix");
			cusbase = $(xml).find('header').attr("cusbase");
			cussuffix = $(xml).find('header').attr("cussuffix");
			formattedNumber = cusprefix + "-" +  cusbase + "-" + cussuffix;

			// Cover Customer with modal box
			blockInput($("#searchCustomer"), formattedNumber);

			// Effective Date Search Field
			var loadDate = $(xml).find('detail').attr("effdate");
			var effMoment = moment(loadDate, 'YYYY-MM-DD');
			var loadEffDate = effMoment.format('MM/DD/YYYY');
			$("#searchEffDate").val(loadEffDate);

            // Expiration date
            var loadedExpDate = $(xml).find('detail').attr("expdate");
            var expMoment = moment(loadedExpDate, 'YYYY-MM-DD');
            var loadExpDate = expMoment.format('MM/DD/YYYY');
            $("#searchExpDate").val(loadExpDate);


			// Move Lane Geography into variable Geo array
			$(xml).find('geography').each(function(){
				i++;
				var g = (geo[i] = {});
				g["idpqlangeo"] = $(this).attr("idpqlangeo");
				g["sequence"] = $(this).attr("sequence");
				g["geotype"] = $(this).attr("geotype");

				g["pointsrc"] = $(this).attr("pointsrc");
				g["idcity"] = $(this).attr("idcity");
				g["cityname"] = $(this).attr("cityname");
				g["idcounty"] = $(this).attr("idcounty");
				g["countyname"] = $(this).attr("countyname");
				g["state"] = $(this).attr("state");
				g["country"] = $(this).attr("country");
				g["idzip"] = $(this).attr("idzip");
				g["zipcode"] = $(this).attr("zipcode");
				g["zone"] = $(this).attr("zone");
				g["idregion"] = $(this).attr("idregion");
				g["region"] = $(this).attr("region");
				g["segment"] = $(this).attr("segment");
				g["applycarr"] = $(this).attr("applycarr");

				// Load the Origin/Dest Search Box with Load Origin & Dest
				switch ($(this).attr("geotype")){
					case "ORG":
						if ($(this).attr("countyname") != ""){
							loadOrigin = $(this).attr("cityname") + ", " +
							             $(this).attr("state") + ", " +
									     $(this).attr("countyname");
						} else {
							loadOrigin = $(this).attr("cityname") + ", " +
				             $(this).attr("state");
						};

						// clear the origin input if it has a value
						//if ($("#originSelection > span").html() != "") {
						//	$("#originSelection > .removeSelectedItem").triggerHandler("click");
						//}

						// Cover Origin with modal box
						blockInput($("#searchOrigin"), loadOrigin);

						break;
					case "DST":
						if ($(this).attr("countyname") != ""){
							loadDestn = $(this).attr("cityname") + ", " +
										$(this).attr("state") + ", " +
										$(this).attr("countyname");
						} else {
							loadDestn = $(this).attr("cityname") + ", " +
				             $(this).attr("state");
						};

						// clear the destination input if it has a value
						//if ($("#destinationSelection > span").html() != "") {
						//	$("#destinationSelection > .removeSelectedItem").triggerHandler("click");
						//}

						// Cover Dest with modal box
						blockInput($("#searchDestn"), loadDestn);
						break;
					default:
						break;
				};

			});

		},
		complete: function(xml) {
			searchQuotes();
		},
		error: function() {

		}
	});
}

//*************************
// XML
//*************************

function buildQuoteRequest() {

	var xml;

	xml = '<Quote>';
	xml += quote_xml_header();
	xml += quote_xml_detail();
	xml += quote_xml_geography();
	xml += quote_xml_search_info();
	xml += '</Quote>';

	return xml;
}

function buildQuoteTempRequest() {

	var xml;
	var newPrefix = "";
	var newBase = 0;
	var newSuffix = 0;
    var todaysDate = new Date();
    var todayResult = todaysDate.toISOString().substring(0,10);
    //var ninetydayslaterMoment = new moment().add(90, 'days').calendar();
    var fortyfivedayslater = moment().add(45, 'days').format("YYYY-MM-DD");

	if (cusprefix != ""){
		newPrefix = cusprefix;
		newBase = cusbase;
		newSuffix = cussuffix;
	} else {
		newPrefix = contPrefix;
		newBase = contBase;
		newSuffix = contSuffix;
	};

	quotetype = 'I';

	xml = '<Quote>';
	xml += '<header' +
	' idpqheader="0" ' +
	' status="A"' +
	' cusprefix="' + newPrefix + '"' +
	' cusbase="'   + newBase   + '"' +
	' cussuffix="' + newSuffix + '"' +
	' contactid="' + contId + '"' +
	' custid="0" ' +
	' quotenum="" ' +
	' idpqcontme="0"' +
	' />';


	xml += '<detail' +
	' idpqlandtl="0" ' +
	' lanenumber="0" ' +
	' quotetype="I" ' +
	' effdate="' + todayResult + '"' +
	' expdate="' + fortyfivedayslater + '"' +
	' rateddate="0001-01-01-00.00.00.000000" ' +
	' approvdsts="" ' +
	' approvddat="0001-01-01-00.00.00.000000" ' +
	' approvdusr="" ' +
	' statorig="" ' +
	' statdest="" ' +
	' statbegdt="0001-01-01" ' +
	' statenddt="0001-01-01" ' +
	' custrefno="" ' +
	' />';

	var fromSearchScreen = true;
	var addPortOfEntry = false;
	var addPortOfExit = false;
	var geoSequence = 0;
	if ($("#searchOrigin").val() != ""){
		var geography = '';
		for (var i = 0; i < geo.length; i++) {

			// Check for Port of Exit Border City Requirements
			if (geo[i].geotype == "DST" && geo[i].country == "MX"){
				geoPoint = retrieveDefaultBorder(geo[i].state, "O", 2, fromSearchScreen);
				geoSequence += 1;
				xml += tempQuote_xml_Border("PEX",geoPoint,geoSequence);
			}
			geoSequence += 1;
			geography += '<geography' +
			' idpqlangeo="' + geo[i].idpqlangeo + '"' +
			' segment="' + geo[i].segment + '"' +
			' sequence="' + geoSequence + '"' +
			' geotype="' + geo[i].geotype + '"' +
			' pointsrc="' + geo[i].pointsrc + '"' +
			' idcity="' + geo[i].idcity + '"' +
			' cityname="' + geo[i].cityname + '"' +
			' idcounty="' + geo[i].idcounty + '"' +
			' countyname="' + geo[i].countyname + '"' +
			' state="' + geo[i].state + '"' +
			' country="' + geo[i].country + '"' +
			' idzip="' + geo[i].idzip + '"' +
			' zipcode="' + geo[i].zipcode + '"' +
			' zone="' + geo[i].zone + '"' +
			' idregion="' + geo[i].idregion + '"' +
			' region="' + geo[i].region + '"' +
			' applycarr="' + geo[i].applycarr + '"' +
			' />';

			// Check for Port of Entry Border City Requirements
			if (geo[i].geotype == "ORG" && geo[i].country == "MX"){
				geoPoint = retrieveDefaultBorder(geo[i].state, "I", 1, fromSearchScreen);
				geoSequence += 1;
				xml += tempQuote_xml_Border("PEN",geoPoint,geoSequence);
			}
		};


		xml += geography;
	};

	xml += '</Quote>';

	return xml;
}

function tempQuote_xml_Border(borderType, geoPoint, geoSequence){
	var border;
	border= '<geography' +
	' idpqlangeo="' + geoPoint.idpqlangeo + '"' +
	' segment="' + geoPoint.segment + '"' +
	' sequence="' + geoSequence + '"' +
	' geotype="' + borderType + '"' +
	' pointsrc="' + geoPoint.pointsrc + '"' +
	' idcity="' + geoPoint.idcity + '"' +
	' cityname="' + geoPoint.cityname + '"' +
	' idcounty="' + geoPoint.idcounty + '"' +
	' countyname="' + geoPoint.countyname + '"' +
	' state="' + geoPoint.state + '"' +
	' country="' + geoPoint.country + '"' +
	' idzip="' + geoPoint.idzip + '"' +
	' zipcode="' + geoPoint.zipcode + '"' +
	' zone="' + geoPoint.zone + '"' +
	' idregion="' + geoPoint.idregion + '"' +
	' region="' + geoPoint.region + '"' +
	' applycarr="' + geoPoint.applycarr + '"' +
	' />';
	return border;
}

function quote_xml_header() {
	var header;
	if (idpqheader == null) {idpqheader = 0};
	header = '<header' +
	' idpqheader="' + idpqheader + '"' +
	' status="'    + status    + '"' +
	' cusprefix="' + cusprefix + '"' +
	' cusbase="'   + cusbase   + '"' +
	' cussuffix="' + cussuffix + '"' +
	' contactid="' + contactid + '"' +
	' custid="'    + custid    + '"' +
	' quotenum="'  + quotenum  + '"' +
	' />';
	return header;
}

function quote_xml_detail() {
	var detail;
	if (idpqlandtl == null) {idpqlandtl = 0};
	if (lanenumber == null) {lanenumber = 0};
	detail = '<detail' +
	' idpqlandtl="' + idpqlandtl + '"' +
	' lanenumber="' + lanenumber + '"' +
	' quotetype="' + quotetype + '"' +
	' effdate="' + effdate + '"' +
	' expdate="' + expdate + '"' +
	' rateddate="' + rateddate + '"' +
	' approvdsts="' + approvdsts + '"' +
	' approvddat="' + approvddat + '"' +
	' approvdusr="' + approvdusr + '"' +
	' />';
	return detail;
}

function quote_xml_geography() {
	var geography = '';
	for (var i = 0; i < geo.length; i++) {
		geography += '<geography' +
		' idpqlangeo="' + geo[i].idpqlangeo + '"' +
		' segment="' + geo[i].segment + '"' +
		' sequence="' + geo[i].sequence + '"' +
		' geotype="' + geo[i].geotype + '"' +
		' pointsrc="' + geo[i].pointsrc + '"' +
		' idcity="' + geo[i].idcity + '"' +
		' cityname="' + geo[i].cityname + '"' +
		' idcounty="' + geo[i].idcounty + '"' +
		' countyname="' + geo[i].countyname + '"' +
		' state="' + geo[i].state + '"' +
		' country="' + geo[i].country + '"' +
		' idzip="' + geo[i].idzip + '"' +
		' zipcode="' + geo[i].zipcode + '"' +
		' zone="' + geo[i].zone + '"' +
		' idregion="' + geo[i].idregion + '"' +
		' applycarr="' + geo[i].applycarr + '"' +
		' />';
	}
	return geography;
}

function quote_xml_search_info() {

	var searchInfo;
	var quotetypeXML = '';
	var workflowXML = '';

	// Build XML for MultiSelect Quote Types
	if (searchLaneType_values.length != 0){
		for (var i = 0; i < searchLaneType_values.length; i++) {
			quotetypeXML += '<quotetype>' +
			searchLaneType_values[i] +
			'</quotetype>';
		};
	} else {
		quotetypeXML = "";
	}

	// Build XML for MultiSelect Work Flow Status
	if (searchWorkFlowStatus_values.length != 0){
		for (var i = 0; i < searchWorkFlowStatus_values.length; i++) {
			workflowXML += '<workflowstatus>' +
			searchWorkFlowStatus_values[i] +
			'</workflowstatus>';
		}
	} else {
		workflowXML = "";
	}

	searchInfo = '<srch_info' +
	' adduser="'      + adduser      + '"' +
	' addtimestart="' + addtimestart + '"' +
	' addtimeend="'   + addtimeend   + '"' +
	' usefullcust="'  + usefullcust  + '"' +
	' useinherit="'   + useinherit   + '"' +
	' contactid="'   + contId    + '"' +
    ' pqusrtype="' + $("#searchUserType option:selected").val() + '"'+
//    ' pquser="' + $("#searchUserProfile option:selected").attr("userprofile") + '"'+
    ' pquser="' + $("#searchUserProfile option:selected").val() + '" >'+
    quotetypeXML + workflowXML +
	'</srch_info>';

	return searchInfo;
}
//*************************
//Helpers
//*************************

function clearInputs() {
	clearVars();

	$("#searchProposal").val("");
	$("#searchCustomer").val("");
	$("#searchContact").val("");
	$("#searchOrigin").val("");
	$("#searchDestn").val("");
	$("#searchEffDate").val("");
	$("#searchExpDate").val("");
	$("#searchByUser").val("");
	$("#searchEntryBDate").val("");
	$("#searchEntryEDate").val("");
	//$("#searchLaneType").prop("selectedIndex", 0);
	//$("#searchWorkFlowStatus").prop("selectedIndex", 0);
	$("#searchUserType").prop("selectedIndex", 0);
	$("#searchUserProfile option").remove();
	$("#searchUserProfile").append(
		"<option value=''>All</option>");
	$("#useLoad").val("");

	$("#searchCustomer").removeAttr('disabled');
	$("#searchOrigin").removeAttr('disabled');
	$("#searchDestn").removeAttr('disabled');

	$(".removeSelectedItem").click();


	$("#geoSearchList").empty().hide();
	$("#custSearchList").hide().empty();
	$("#contSearchList").hide().empty();
	geo.length = 0;
	searchLaneType_values.length = 0;
	searchWorkFlowStatus_values.length = 0;

	contPrefix = "";
	contBase = 0;
	contSuffix = 0;
	contId = 0;

}

function clearVars() {
	match.length = 0;
	matchSummary.length = 0;
	quoteNum = "";
	contactid = 0;
	custNum = 0;
	cusprefix = "";
	cusbase = 0;
	cussuffix = 0;
	quoteType = "";

	adduser = "";
	addtimestart = "0001-01-01";
	addtimeend = "0001-01-01";
	effdate = "0001-01-01";
	expdate = "0001-01-01";

}

function uncheckMultiSelect() {
	$("#searchLaneType").multiselect('uncheckAll');
	$("#searchWorkFlowStatus").multiselect('uncheckAll');
}

function rebuildQuoteTable() {
	if (searchMode == "DETAIL"){
		quoteSearchTable.clear();
		quoteSearchTable.rows.add(match);
		quoteSearchTable.draw();
		quoteSearchTable.columns.adjust();
	} else {
		quoteSearchSummaryTable.clear();
		quoteSearchSummaryTable.rows.add(matchSummary);
		quoteSearchSummaryTable.draw();
		quoteSearchSummaryTable.columns.adjust();
	}
}

function validateEffRange() {

	var effStartIsValid = false;
	var effEndIsValid = false;

	var $effStartDate = $("#searchEffDate");
	var $effEndDate = $("#searchExpDate");

	var yearLength;
	var effStartString;
	var effEndString;

	// check the effective date
	if ($effStartDate.val() != "") {

		effStartString = $effStartDate.val();

		if (effStartString.indexOf("/") != -1) {

			yearLength = (effStartString.length - 1) - effStartString.lastIndexOf("/");

			if (yearLength == 1 || yearLength == 2) {
				effStartMoment = new moment(effStartString, "MM-DD-YY");
			} else {
				effStartMoment = new moment(effStartString, "MM-DD-YYYY");
			}
		} else {
			if (effStartString.length == 6) {
				effStartMoment = new moment(effStartString, "MM-DD-YY");
			}
			else {
				effStartMoment = new moment(effStartString, "MM-DD-YYYY");
			}
		}

		if (effStartMoment.isValid()) {

			// clear if previously invalid
			if ($effStartDate.hasClass("invalidDate")) {
				$effStartDate.removeClass("invalidDate");
				$effStartDate.removeAttr("title");
			}

			effStartIsValid = true;

			$effStartDate.val(effStartMoment.format("MM/DD/YYYY"));

		} else {
			$effStartDate.addClass("invalidDate");
			$effStartDate.attr("title", "Invalid Date");
		}
	} else {
		// clear if previously invalid
		if ($effStartDate.hasClass("invalidDate")) {
			$effStartDate.removeClass("invalidDate");
			$effStartDate.removeAttr("title");
		}

		effStartIsValid = true;
	}

	if ($effEndDate.val() != "") {

		effEndString = $effEndDate.val();

		if (effEndString.indexOf("/") != -1) {

			yearLength = (effEndString.length - 1) - effEndString.lastIndexOf("/");

			if (yearLength == 1 || yearLength == 2) {
				effEndMoment = new moment(effEndString, "MM-DD-YY");
			} else {
				effEndMoment = new moment(effEndString, "MM-DD-YYYY");
			}
		} else {
			if (effEndString.length == 6) {
				effEndMoment = new moment(effEndString, "MM-DD-YY");
			}
			else {
				effEndMoment = new moment(effEndString, "MM-DD-YYYY");
			}
		}

		// check to see if the expiration date is valid
		if (effEndMoment.isValid()) {

			// clear if previously invalid
			if ($effEndDate.hasClass("invalidDate")) {
				$effEndDate.removeClass("invalidDate");
				$effEndDate.removeAttr("title");
			}

			// check to see if start date is greater than end date
			if ($effStartDate.val() != "" && effEndMoment < effStartMoment) {
				$effEndDate.addClass("invalidDate");
				$effEndDate.attr("title", "End date must be after start date");
			} else {

				// clear if previously invalid
				if ($effEndDate.hasClass("invalidDate")) {
					$effEndDate.removeClass("invalidDate");
					$effEndDate.removeAttr("title");
				}

				effEndIsValid = true;

				$effEndDate.val(effEndMoment.format("MM/DD/YYYY"));
			}

		} else {
			$effEndDate.addClass("invalidDate");
			$effEndDate.attr("title", "Invalid Date");
		}

	} else {
		// clear if previously invalid
		if ($effEndDate.hasClass("invalidDate")) {
			$effEndDate.removeClass("invalidDate");
			$effEndDate.removeAttr("title");
		}

		effEndIsValid = true;
	}

	if (effStartIsValid && effEndIsValid) {
		return true;
	} else {
		return false;
	}
}

function validateEnteredRange() {

	var entStartIsValid = false;
	var entEndIsValid = false;

	var $entStartDate = $("#searchEntryBDate");
	var $entEndDate = $("#searchEntryEDate");

	var entStartString;
	var entEndString;

	var entStartMoment;
	var entEndMoment;

	// check the effective date
	if ($entStartDate.val() != "") {

		entStartString = $entStartDate.val();

		if (entStartString.indexOf("/") != -1) {

			yearLength = (entStartString.length - 1) - entStartString.lastIndexOf("/");

			if (yearLength == 1 || yearLength == 2) {
				entStartMoment = new moment(entStartString, "MM-DD-YY");
			} else {
				entStartMoment = new moment(entStartString, "MM-DD-YYYY");
			}
		} else {
			if (entStartString.length == 6) {
				entStartMoment = new moment(entStartString, "MM-DD-YY");
			}
			else {
				entStartMoment = new moment(entStartString, "MM-DD-YYYY");
			}
		}

		if (entStartMoment.isValid()) {

			// clear if previously invalid
			if ($entStartDate.hasClass("invalidDate")) {
				$entStartDate.removeClass("invalidDate");
				$entStartDate.removeAttr("title");
			}

			entStartIsValid = true;

			$entStartDate.val(entStartMoment.format("MM/DD/YYYY"));

		} else {
			$entStartDate.addClass("invalidDate");
			$entStartDate.attr("title", "Invalid Date");
		}
	} else {
		// clear if previously invalid
		if ($entStartDate.hasClass("invalidDate")) {
			$entStartDate.removeClass("invalidDate");
			$entStartDate.removeAttr("title");
		}

		entStartIsValid = true;
	}

	if ($entEndDate.val() != "") {

		entEndString = $entEndDate.val();

		if (entEndString.indexOf("/") != -1) {

			yearLength = (entEndString.length - 1) - entEndString.lastIndexOf("/");

			if (yearLength == 1 || yearLength == 2) {
				entEndMoment = new moment(entEndString, "MM-DD-YY");
			} else {
				entEndMoment = new moment(entEndString, "MM-DD-YYYY");
			}
		} else {
			if (entEndString.length == 6) {
				entEndMoment = new moment(entEndString, "MM-DD-YY");
			}
			else {
				entEndMoment = new moment(entEndString, "MM-DD-YYYY");
			}
		}

		// check to see if the expiration date is valid
		if (entEndMoment.isValid()) {

			// clear if previously invalid
			if ($entEndDate.hasClass("invalidDate")) {
				$entEndDate.removeClass("invalidDate");
				$entEndDate.removeAttr("title");
			}

			// check to see if start date is greater than end date
			if ($entStartDate.val() != "" && entEndMoment < entStartMoment) {
				$entEndDate.addClass("invalidDate");
				$entEndDate.attr("title", "End date must be after start date");
			} else {

				// clear if previously invalid
				if ($entEndDate.hasClass("invalidDate")) {
					$entEndDate.removeClass("invalidDate");
					$entEndDate.removeAttr("title");
				}

				entEndIsValid = true;

				$entEndDate.val(entEndMoment.format("MM/DD/YYYY"));
			}

		} else {
			$entEndDate.addClass("invalidDate");
			$entEndDate.attr("title", "Invalid Date");
		}

	} else {
		// clear if previously invalid
		if ($entEndDate.hasClass("invalidDate")) {
			$entEndDate.removeClass("invalidDate");
			$entEndDate.removeAttr("title");
		}

		entEndIsValid = true;
	}

	if (entStartIsValid && entEndIsValid) {
		return true;
	} else {
		return false;
	}
}

function blockInput($input, value){
	// Cover Input with modal box
	$input.siblings(".selectedListItem").children("span").text(value);
	$input.fadeOut("fast", function(){
		$input.siblings(".selectedListItem").animate({
			top: 0
		}, "fast");
	});

	$input.val(value);

}
