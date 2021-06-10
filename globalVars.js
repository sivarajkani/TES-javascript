// JavaScript Document
 	// Authorization
	var emailAuthorized = false;
    var inquiryOnly = false;
	var saveAuthorized = false;
    var publishedAuthorized = false;
    var pricingAuthErrors = false;
    var ds_Auth = {};
    var salesPerson = false;
	var inTerritory = false;

	//vars for working with border cities
	var count = 0;
	var len = 0;
	var updateDst = false;
	var remove = 0;

	//counter used for building import xml
	var imp = 0;

    //Global region vars
    var regionName;
    var regionDesc;
    var regionEffDate;
    var regionClient;
    var regionZone;
    var regionPrec;
    var regionCityId;
    var regionCityNm;
    var regionCntyId;
    var regionCntyNm;
    var regionZipcode;

    // Proposal Header
	var contactid = 0;
	var cusbase = 0;
	var cusprefix = '';
	var cussuffix = 0;
	var custid = 0;
	var idpqheader = 0;
	var quotenum = '';
	var idpqcontme = 0;
	var status = 'A';
	var publishcustomer = '';

	// Proposal Lane Detail
	var idpqlandtl = 0;
	var approvddat = '0001-01-01-00.00.00.000000';
	var approvdusr = '';
	var workFlowStatus = '';
	var approvdsts = '';
	var effdate = '0001-01-01';
	var expdate = '0001-01-01';
	var idpqlandtl = 0;
	var lanenumber = 0;
	var quotetype = 'I';
	var rateddate = '0001-01-01-00.00.00.000000';
	var statorig = '';
	var statdest = '';
	var statbegdt = '0001-01-01';
	var statenddt = '0001-01-01';
	var custrefno = '';
	var auditdate = '0001-01-01';
	var auditreslt = '';
	var originalWorkFlowStatus;

	// Lane navigation
	var laneListNavIndex = [];
	var laneNavMessage = "";
	var laneNext = 0;
	var lanePrevious = 0;
	var laneFirst = 0;
	var laneLast = 0;
	var selectedLaneIndex = 0;

	// Temp Search variables
	var searchFor = "origin";
	var laneSectionTarget;
	var contPrefix = "";
	var contBase = 0;
	var contSuffix = 0;
	var contId = 0;
	var newQuoteXMLTemp;
	var loadNumber;
	var useLoadInfoXML;
	var searchLaneType_values = [];
	var searchWorkFlowStatus_values = [];

	// Mass Update Variables
	var	updlanetype;
	var updWorkFlowStatus;
	var updWorkFlowStatusCode;
	var	updlinehaulrate;
	var	updlinehauluom;
	var updMinRate;
	var updMexRate;
	var	updeffectiveDate;
	var	updexpireDate;
	var	updOrigin;
	var updDestination;
	var updBorder;
	var updgeo = [];
	var updcond = [];
	var lanesToUpdate = [];
    var updUserType;
    var updUser;
    var massRerate = false;

    // Publish Valiables
    var pubEffectiveDate;
    var pubExpireDate;
    var lanesNotPublished = [];

    //Volumetrics;
    var ds_Volumetrics = [],
        volumetricScacs = [],
        volumetricErrors = false,
        volumetricsBarChart;
    //Analytics
    var ds_Analytics = {},
        ds_AnalyticTabLayout = [],
        ds_Sandbox = {},
        calcMonthSlider = "6",
        calcOrigGeoCode = "ZN",
        calcDestGeoCode = "ZN",
        calcService = "",
        calcSource = "",
        calcRateRecord = false;


	// Ajax XMLHttpRequest Objects
	var rmsRateXHR;
	var retrievePropXHR;
	var getLanesXHR;
	var getAnalyticsXHR;
	var lockXHR;
	var logXHR;
	var geoSearchXHR;
	var custSearchXHR;
	var contSearchXHR;
	var checkTBPublishLanesXHR;

	// Grid Objects
	var rateGrid;
	var regionalGrid;

	// DataViews
	var rateDataView;
	var regionalDataView;

	// Spinner vars
	var subCL;
    var analyticsCL;
	var saveInputVal;

	// Tabs
	var noteType;
	var statToggle;

	// Flags
	var initialLoad;
	var contDone = false;
	var accessorialsChanged = false;
	var shipCondChanged = false;
	var deficitsChanged = false;
	var getPrimaryCustContact = true;
	var importMode = false;
	var importErrors = false;
	var viewDeficits = false;


	// Arrays
	var chrg = [];
	var cond = [];
	var data = [];
	var geo = [];
	var stat = [];
	var rules = [];
	var notes = [];
	var custNotes = [];
	var auth = [];
	var match = [];
	var log = [];
	var lanes = [];
	var loads = [];
	var laneUsers = [];
	var custDefaultUsers = [];
	var quoteLaneUsers = [];

	var spreadsheetLanes = [];

	var laneLayout = [];

	var shipCondCodes = [];

	var accessorialCodes = [];

	var warningRecords = [];
	
	var workFlowStatus_values = [];
	
	var deficitCodes = {};
	var deficitRules = {};

	// variables used to send an email message
	var emailTo;
	var emailSubject;
	var emailBody;

	// Quote Match Variables
	var duplicateCount;

	// DataTables
	var matchTable;

	// used when checking if changing a spot affects any loads
	var checkLoads = true;

	// Rate Grid columns and options
	var rateColumns;
	if (typeof Slick != "undefined"){
	rateColumns = [
		{id: "rmsitem", name: "Item#", field: "rmsitem", minWidth: 38, width: 55, sortable: false, focusable: false, selectable: false },
    	//{id: "pricingid", name: "Rate Record#", field: "pricingid", minWidth: 30, width: 30, sortable: false, focusable: false, selectable: false },
    	{id: "puborigin", name: "Origin", field: "puborigin", minWidth: 45, width: 75, sortable: false, focusable: false, selectable: false, toolTip: "Publication Origin" },
    	//{id: "pubdest", name: "Dest", field: "pubdest", minWidth: 45, width: 75, sortable: false, focusable: false, selectable: false, toolTip: "Publication Destination" },
    	{id: "pubdest", name: "Dest", field: "pubdest", minWidth: 45, width: 75, sortable: false, focusable: false, selectable: false, formatter: Slick.Formatters.DestCell, toolTip: "Publication Destination" },
       	{id: "description", name: "Charge Type", field: "description", minWidth: 120, width: 140, sortable: false, focusable: false, selectable: false },
       	{id: "scalerate", name: "Scale Rate", field: "scalerate", minWidth: 55, width: 65, sortable: false, focusable: false, selectable: false, toolTip: "Scale Rate" },
       	{id: "rmsuom", name: "Pub UOM", field: "rmsuom", minWidth: 35, width: 40, sortable: false, focusable: false, selectable: false, toolTip: "RMS Published Unit of Measure" },
    	{id: "rmsqty", name: "Pub Qty", field: "rmsqty", minWidth: 40, width: 50, sortable: false, focusable: false, selectable: false, toolTip: "RMS Calculated Quantity" },
	   	{id: "rmsrate", name: "Pub Rate", field: "rmsrate", minWidth: 60, width: 70, sortable: false, focusable: false, selectable: false, toolTip: "RMS Published Rate" },
	   	{id: "propuom", name: "Priced UOM", field: "propuom", minWidth: 30, width: 60, sortable: false, editable: true, options: "MLS,F/R,PCT", editor: Slick.Editors.SelectUOM, toolTip: "Miles, Flat Rate, Percent of Linehaul, Hours, Hundred Weight", cssClass: "highlightEditable"  },
    	{id: "propqty", name: "Priced Qty", field: "propqty", minWidth: 50, width: 60, sortable: false, editable: true, editor: Slick.Editors.PriceQty, formatter: Slick.Formatters.PriceQtyCell, toolTip: "Priced Quantity", cssClass: "highlightEditable"  },
     	{id: "proprate", name: "Priced Rate", field: "proprate", minWidth: 55, width: 75, sortable: false, editable: true, editor: Slick.Editors.PriceRate, formatter: Slick.Formatters.PriceRateCell, toolTip: "Proposed Rate", cssClass: "highlightEditable"   },
		{id: "propamt", name: "Extended Rate", field: "propamt", minWidth: 70, width: 80, sortable: false,  focusable: false, selectable: false, toolTip: "Extended Rate per Mile = Rate * Quantity, Extended Flat Rate = Flat Rate, Extended Percent = Percent * Linehaul" }

	]};
	var rateOptions = {
		asyncEditorLoading: false,
		autoEdit: false,
		editable: true,
		enableAddRow: false,
		enableCellNavigation: true,
		enableTextSelectionOnCells: true,
		forceFitColumns: true,
		leaveSpaceForNewRows: true,
		multiColumnSort: false,
		rowHeight: 23
	};

	// Regional Grid columns and options
	var regionalColumns = [
		{id: "driverNum", name: "Driver #", field: "driverNum", minWidth: 50, width: 50, sortable: false },
		{id: "driverName", name: "Name", field: "driverName", minWidth: 50, width: 50, sortable: false }
	];
	var regionalOptions = {
		asyncEditorLoading: false,
		autoEdit: false,
		editable: false,
		enableAddRow: false,
		enableCellNavigation: true,
		enableTextSelectionOnCells: true,
		forceFitColumns: true,
		multiColumnSort: true,
		rowHeight: 23
	};


	$.extend({
		getUrlVars: function(){
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++){
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		},
		getUrlVar: function(name){
			return $.getUrlVars()[name];
		}
	});

	// clear all global variables
	function clearGlobalVars() {

		// clear proposal header variables
		contactid = 0;
		cusbase = 0;
		cusprefix = 0;
		cussuffix = 0;
		custid = 0;
		idpqheader = 0;
		quotenum = '';
		idpqcontme = 0;
		status = 'A';

		// clear proposal lane detail variables
		idpqlandtl = 0;
		approvddat = '0001-01-01-00.00.00.000000';
		approvdusr = '';
		approvdsts = '';
		//effdate = '0001-01-01';
		//expdate = '0001-01-01';
		effdate = moment().format("YYYY-MM-DD");
		expdate = moment().add(45, 'days').format("YYYY-MM-DD");
		custrefno = '';

		idpqlandtl = 0;
		lanenumber = 0;
		// Set Quote Type to Inquiry
		quotetype = 'I';
		$(".laneType").val('I');
		setAuthorizedQuoteTypes(function(){
	        // Disable Proposal and Spot for new quote with no price
	        $(".laneType option:contains('Proposal')").attr('disabled','disabled');
	        $(".laneType option:contains('Spot')").attr('disabled','disabled');
	    });
		//$(".laneType option:contains('Bid')").removeAttr('disabled');
		//$(".laneType option:contains('Inquiry')").removeAttr('disabled');
		//$(".laneType option:contains('Proposal')").attr('disabled','disabled');
		//$(".laneType option:contains('Review')").removeAttr('disabled');
		//$(".laneType option:contains('Spot')").attr('disabled','disabled');

		rateddate = '0001-01-01-00.00.00.000000';

		// Set workflow status to NEW
		$("#workFlowStatus").val("");
		setAuthorizedWorkFlow();

		auditdate = '0001-01-01';
		auditreslt = '';

		// clear arrays
		chrg.length = 0;
		cond.length = 0;
		data.length = 0;
		geo.length = 0;
		stat.length = 0;
		notes.length = 0;
		custNotes.length = 0;
		match.length = 0;
		custDefaultUsers.length = 0;
		quoteLaneUsers.length = 0;
        ds_Volumetrics.length = 0;
        volumetricScacs.length = 0;

		// Hide Matches
		$("#matchIndicator").css("display","none");


	}

//-----------------------------------------
// Data entry functions
//-----------------------------------------


	function initializeTools(){
		moment.lang('en', {
			calendar : {
				lastDay : '[Yesterday]',
				sameDay : '[Today]',
				nextDay : 'L',
		        lastWeek : 'L',
        		nextWeek : 'L',
				sameElse: 'L'
			}
		});
	}


	// Check that all lower tabbed grids have finished initialization
	function checkInitialDone(){
		if (contDone == false){
			return false;
		} else {
			return true;
		}
	}

	function comparer(a, b) {
		var x = a[sortcol], y = b[sortcol];
		return (x == y ? 0 : (x > y ? 1 : -1));
	}

	function getURLParm(name){
		var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
		if (results) {
    		return decodeURIComponent(results[1]) || "error";
		} else {
			return "error";
		}
	}

	function dateToISO(dateString){
		var datePieces = [];

		datePieces = dateString.split("/");
		if (datePieces.length < 3){
			datePieces = dateString.split("-");
		}

		if (datePieces.length == 3){
			if (datePieces[0].length == 4){
				dateString = datePieces[0] + "-" + datePieces[1] + "-" + datePieces[2];
			} else if (datePieces[2].length == 4){
				dateString = datePieces[2] + "-" + datePieces[0] + "-" + datePieces[1];
			} else if (datePieces[0].length == 2 && datePieces[2].length == 2){
				dateString = $.datepicker.formatDate('yy-mm-dd', $.datepicker.parseDate('mm/dd/yy', dateString));
			}

			return dateString;
		} else {
			return "";
		}
	}

	function pad (str, max) {
		return str.length < max ? pad("0" + str, max) : str;
	}

	function formatPhone (str) {
		if (str.substring(0, 5) == "00000"){
			return str.substring(5).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
		} else {
			return str.substring(5).replace(/(\d{5})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
		}
	}

	function isElementInViewport (el) {
		//special bonus for those using jQuery
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		var rect = el.getBoundingClientRect();

		//console.log(rect.top + " | " + el.clientHeight + " | " + rect.bottom);
		//console.log(rect.top + " | " + el.parentNode.getBoundingClientRect().top);
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight ) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) && /*or $(window).width() */

			// container element
			rect.top >= el.parentNode.getBoundingClientRect().top &&
			rect.bottom - el.clientHeight >= 0 &&
			//rect.bottom <= el.parentNode.clientHeight
			rect.bottom <= el.parentNode.getBoundingClientRect().bottom
		);
	}

	$.fn.ignore = function(sel){
		  return this.clone().find(sel).remove().end();
	};

	function addGeoPointInfo(selectedLI, originTrue){

		var pointSrc = selectedLI.attr("pointsrc");
		var cityName = selectedLI.attr("cityname");
		var state = selectedLI.attr("state");
		var zone = selectedLI.attr("zone");
		var zipCode = selectedLI.attr("zipcode");
		var countyName = selectedLI.attr("countyname");
		var country = selectedLI.attr("country");

		if (originTrue){
			// Additional Origin Information
			switch (pointSrc){
			case "CC":
				switch (country){
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
				$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				break;

			case "CL":
				$("#originLabel").append($("<span>"+zone+" / "+zipCode+"</span>"));
				break;
			case "RG":
				//$("#originLabel").append($("<span>Region</span>"));
				$("#originLabel").append($('<div id="regionOrgInfoIcon" class="regionInfoIcon" href="#regionForm"></div>'));
				$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zipCode+"</span>"));
				$('#regionOrgInfoIcon').css("display", "inline-block");
				$("#regionOrgInfoIcon").click(function(e){
					e.stopPropagation();

					var idRegion;

					if (geo.length > 0){
						idRegion = geo[0].idregion;
					} else {
						idRegion = laneLayout[0].points[0].idregion;
					}

					getRegionDetail(idRegion, function(){
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
				if (countyName != ""){
					$("#originLabel").append($("<span>"+cityName + ", " + countyName+" / "+zipCode+"</span>"));
				} else {
					$("#originLabel").append($("<span>"+cityName + " / "+zipCode+"</span>"));
				}
				break;
			case "Z3":
				if (countyName != ""){
					$("#originLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
				} else {
					$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				}
				break;
			case "Z5":
				if (countyName != ""){
					$("#originLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
				} else {
					$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				}
				break;

			}

		} else {
			// Additional Destination Information
			switch (pointSrc){
				case "CC":
					switch (country){
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
					$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
					break;
				case "CL":
					$("#destLabel").append($("<span>"+zone+" / "+zipCode+"</span>"));
					break;
				case "RG":
					//$("#destLabel").append($("<span>Region</span>"));
					$("#destLabel").append($('<div id="regionDestInfoIcon" class="regionInfoIcon" href="#regionForm"></div>'));
					$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zipCode+"</span>"));
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
					if (countyName != ""){
						$("#destLabel").append($("<span>"+cityName + ", " + countyName+" / "+zipCode+"</span>"));
					} else {
						$("#destLabel").append($("<span>"+cityName + " / "+zipCode+"</span>"));
					}
					break;
				case "Z3":
					if (countyName != ""){
						$("#destLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
					} else {
						$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
					}
					break;
				case "Z5":
					if (countyName != ""){
						$("#destLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
					} else {
						$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
					}
					break;
			};

		};

	};
