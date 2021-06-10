
// Click events

$(document).ready(function() {

	$("#laneNavFirst").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		if (laneFirst != 0) {
			retrieveProposal(quotenum, laneFirst);
		}
	});

	$("#laneNavPrevious").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		if (lanePrevious != 0) {
			retrieveProposal(quotenum, lanePrevious);
		}
	});

	$("#laneNavNext").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		if (laneNext != 0) {
			retrieveProposal(quotenum, laneNext);
		}
	});

	$("#laneNavLast").click(function() {
		if ($(this).hasClass("laneDisabled"))
			return;

		if (laneLast != 0) {
			retrieveProposal(quotenum, laneLast);
		}
	});

	$("#laneNavNew").click(function() {

		// set the previous lane to allow user to hit the back button
		lanePrevious = lanenumber;

		createNewLane();
		rebuildLaneNav();
	});

	$("#laneNavNum").bind("keyup", function(e){
		var lane;

		if (e.which == 13){  // enter key is pressed

			lane = parseInt($(this).val());

			if (lane >= laneFirst && lane <= laneLast && lane != NaN) {
				retrieveProposal(quotenum, lane);

				$("#laneNavNum").removeClass("invalidLane");
				$("#laneNavNum").attr("title", "");
			} else {
				$("#laneNavNum").addClass("invalidLane");
				$("#laneNavNum").attr("title", "Invalid Lane");
			}
		}
	}).blur(function() {
		var lane

		lane = $(this).val();
		if (lane != lanenumber) {
			$(this).val(lanenumber);
		}
	});
});

function rebuildLaneNav() {

	if (lanenumber == 0) {
		$("#laneNavNum").val("New");
	} else {
		$("#laneNavNum").val(lanenumber);
	}

	if (quotenum.length == 11 && !isNaN(quotenum) && lanenumber != 0) {
		getLaneNav();
		enableNavButtons();
	} else {
		enableNavButtons();
	}
}

function enableNavButtons() {

	var $next     = $("#laneNavNext")
	var $previous = $("#laneNavPrevious");
	var $first    = $("#laneNavFirst");
	var $last     = $("#laneNavLast");

	if (laneNext == 0) {
		$next.addClass("laneDisabled");
		$next.css("cursor", "default");
	} else {
		$next.removeClass("laneDisabled");
		$next.css("cursor", "pointer");
	}

	if (lanePrevious == 0) {
		$previous.addClass("laneDisabled");
		$previous.css("cursor", "default");

	} else {
		$previous.removeClass("laneDisabled");
		$previous.css("cursor", "pointer");
	}

	if (laneFirst == 0 || laneLast == 1 || lanenumber == laneFirst) {
		$first.addClass("laneDisabled");
		$first.css("cursor", "default");
	} else {
		$first.removeClass("laneDisabled");
		$first.css("cursor", "pointer");
	}

	if (laneLast == 0 || laneLast == 1 || lanenumber == laneLast) {
		$last.addClass("laneDisabled");
		$last.css("cursor", "default");
	} else {
		$last.removeClass("laneDisabled");
		$last.css("cursor", "pointer");
	}

	if (lanenumber == 0) {
		if (!$next.hasClass("laneDisabled")) {
			$next.addClass("laneDisabled");
		}
		if (!$last.hasClass("laneDisabled")) {
			$last.addClass("laneDisabled");
		}
	}
}

function getLaneNav() {

	var url = "pqxml.pgm?" +
		      "func=getnavigation" +
		      "&quotenum=" + quotenum +
		      "&lane=" + lanenumber;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		cache: false,
		success: function(response) {

			// read the log entries into an array
			$navigation = $(response).find('navigation');

			laneNavMessage  = $navigation.find('message').text();
			laneNext        = parseInt($navigation.find('next').text());
			lanePrevious    = parseInt($navigation.find('previous').text());
			laneFirst       = parseInt($navigation.find('first').text());
			laneLast        = parseInt($navigation.find('last').text());
		},

		complete: function(jqXHR, completeStatus) {
			enableNavButtons();
		},

		error: function(jqXHR, errorStatus, errorMessage) {

		}
	});

}

function getLanes() {

	var url = "pqxml.pgm?" +
		      "func=getlanedetail" +
		      "&quotenum=" + quotenum;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		cache: false,
		success: function(response) {

			var i = 0;

			// put the response into global variables
			$(response).find('lanedetail').each(function() {

				var d = (lanes[i] = {});
				d["lanenumber"] = $(this).attr("lanenumber");

				switch ($(this).attr("type")){
				case "I":
					d["type"] = "Inq";
					break;
				case "S":
					d["type"] = "Spot";
					break;
				case "P":
					d["type"] = "Prop";
					break;
				default:
					d["type"] = "Inq";
					break;
				}

				d["origin"] = $(this).attr("origin");
				d["originsource"] = $(this).attr("originsource");
				d["originzone"] = $(this).attr("originzone");
				d["destination"] = $(this).attr("destination");
				d["destinationsource"] = $(this).attr("destinationsource");
				d["destinationzone"] = $(this).attr("destinationzone");
				d["proposeduom"] = $(this).attr("proposeduom");
				d["proposedrate"] = $(this).attr("proposedrate");
				d["accessorials"] = $(this).attr("accessorials");

				i++;
			});
		},

		complete: function(jqXHR, completeStatus) {
			rebuildLaneListDatatable();
		},

		error: function(jqXHR, errorStatus, errorMessage) {

		}
	});
}

function createNewLane() {

	clearLaneDetail();
	clearArrays();
	clearLaneNotes();

	// clear the slickgrid
	rateDataView.beginUpdate();
    rateDataView.setItems([]);
    rateDataView.endUpdate();
    rateGrid.render();

    // clear rate total
    $("#rateTotal span").html("");

    $("#matchIndicator").hide();

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
}

function clearArrays() {
	chrg.length = 0;
	cond.length = 0;
	data.length = 0;
	geo.length = 0;
	stat.length = 0;
	rules.length = 0;

	auth.length = 0;
	match.length = 0;
	log.length = 0;
}
