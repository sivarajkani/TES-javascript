
//*************************
// Global Variables
//*************************
var quoteSearchTable;
var adduser = "";
var addtimestart = "0001-01-01";
var addtimeend = "0001-01-01";
var usefullcust;
var useinherit = 0;

//*************************
// Initialization
//*************************

// page setup for search.html
function setup(){
	clearInputs();
	clearVars();
	initDatepickers();
	initSpinners();
	initToolTipster();
	initDatatable();
	assignClickEvents();
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
		scrollY: 580,
		scrollCollapse: false,
		lengthChange: false,
		paging: false,
		drawCallback: function( settings ) {
			var colCount = $("#matchTable > tbody > tr:first-child td").length;
			var $newButton = 
				$("<tr><td class='newLikeThis' colspan='" + colCount + "'>+ New Quote</td></tr>");
			if ($("#searchBlock input").val() != "" || $("#searchBlock select > option:selected").val() != ""){
				$(".dataTables_empty").remove();
				$("#quoteTable tbody").append($newButton);
			}
		},
	    language: {
	    	search: "Filter records:",
			zeroRecords: "No quotes here!"
	    },
	    columns: [
	  	        {title: 'Quote', data: 'quotenum'},
	  	        {title: 'Lane', data: 'lanenumber'},
	  	        {title: 'Customer', data: 'custnumber'},
	  	        {title: 'Origin', data: 'origin', width: '30%'},
	  	        {title: 'Destination', data: 'destination', width: '30%'},
	  	        {title: 'Type', data: 'quotetype'}
	  	],
	  	order: [[ 5, 'desc' ], [0, 'desc']]
	});
	
	// Open match on click
	$('#quoteTable').on('click', 'td', function(event) {
		var mCell = quoteSearchTable.cell(this)[0][0];
		if (mCell){
			var d = quoteSearchTable.row(mCell.row).data();
			var viewProposalURL = "pricingcgi.pgm?quotenum=" + d.quotenum;
			
			// Only open link if clicking on proposal number
			if (mCell.column == 0){
				window.open(viewProposalURL);
			}
		}
	});
}

//*************************
// Click Events
//*************************

function assignClickEvents() {
	
	$("#searchButton").click( function () {
		
		searchQuotes();
	});
	
	$("#viewButton").click(function() {
		
		// redirect to pricing page if proposal number is entered
		var quoteNum = $("#searchProposal").val().trim();
		if (quoteNum != "") {	
			window.open("pricingcgi.pgm?quotenum=" + quoteNum, '_blank');
		}
		
	});
	
	$("#newButton").click(function() {
		
		// redirect to pricing page
		window.open("pricingcgi.pgm");
		
	});
	
	$("#resetButton").click(function(){
		clearInputs();
		geo.length = 0;
		rebuildQuoteTable()
	});
	
	$("#searchCustomer").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
		}
	});
	
	$("#searchOrigin").bind("keyup", function(e){
		
		var $selectedLI = $("#geoSearchList li.selected");
		
		switch (e.which) {
			case 13: //Enter
				if ($("#geoSearchList").css("display") != "none"){
					setGeoSelection($(this));
				} else {
					searchQuotes();
				}
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
	
	$("#searchDestn").bind("keyup", function(e){
		
		var $selectedLI = $("#geoSearchList li.selected");
		
		switch (e.which) {
			case 13: //Enter
				if ($("#geoSearchList").css("display") != "none"){
					setGeoSelection($(this));
				} else {
					searchQuotes();
				}
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
	
	$("#searchLaneType").bind("keyup", function(e){
		if (e.which == 13) { //Enter
			searchQuotes();
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
		buildNewQuoteTempFile();
		if (newQuoteXMLTemp != ""){
			window.open("http://cfidevelopment:8091/testlib12/pricingcgi.pgm?" +
					"quotenum=" + escapeXML(newQuoteXMLTemp));
		}
		
	});
}

//Search for Quotes
function searchQuotes(){
	clearVars();

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
	switch ($("#searchLaneType option:selected").text()) {
		case "All":
			quotetype = "";
			break;
		case "Inquiry":
			quotetype = "I";
			break;
		case "Proposal":
			quotetype = "P";
			break;
		case "Spot":
			quotetype = "S";
			break;
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
	
	retrieveQuotes();
	
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
					m["destination"] = $(this).attr("destination");
					
					switch ($(this).attr("quotetype")){
						case "I":
							m["quotetype"] = "Inq";
							break;
						case "S":
							m["quotetype"] = "Spot";
							break;
						case "P":
							m["quotetype"] = "Prop";
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
	
			
	xml = '<Quote>';
	xml += '<header' + 
	' idpqheader="0" ' +
	' status="A"' +  
	' cusprefix="' + cusprefix + '"' +
	' cusbase="'   + cusbase   + '"' + 
	' cussuffix="' + cussuffix + '"' +
	' contactid="0" ' +
	' custid="0" ' +
	' quotenum="" ' +
	' />';
	
		
	xml += '<detail' +
	' idpqlandtl="0" ' +
	' lanenumber="1" ' +
	' quotetype="I" ' +
	' effdate="0001-01-01" ' +
	' expdate="0001-01-01" ' +
	' rateddate="0001-01-01-00.00.00.000000" ' +
	' approvdsts="" ' +
	' approvddat="0001-01-01-00.00.00.000000" ' +
	' approvdusr="" ' +
	' />';
	
	if (!= $("#searchOrigin").val("")){
		xml += quote_xml_geography();
	};
	
	xml += '</Quote>';
	
	return xml;
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
	
	searchInfo = '<srch_info' + 
	' adduser="'      + adduser      + '"' +
	' addtimestart="' + addtimestart + '"' +  
	' addtimeend="'   + addtimeend   + '"' +
	' usefullcust="'  + usefullcust  + '"' +  
	' useinherit="'   + useinherit   + '"' +
	' />';
	
	return searchInfo;
}

//*************************
//Helpers
//*************************

function clearInputs() {
	clearVars();
	
	$("#searchProposal").val("");
	$("#searchCustomer").val("");
	$("#searchOrigin").val("");
	$("#searchDestn").val("");	
	$("#searchEffDate").val("");
	$("#searchExpDate").val("");
	$("#searchByUser").val("");	
	$("#searchEntryBDate").val("");
	$("#searchEntryEDate").val("");	
	$("#searchLaneType").prop("selectedIndex", 0);
	
	$("#geoSearchList").empty().hide();
}			

function clearVars() {
	match.length = 0;
	quoteNum = "";
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

function rebuildQuoteTable() {
	quoteSearchTable.clear();
	quoteSearchTable.rows.add(match);
	quoteSearchTable.draw();
}