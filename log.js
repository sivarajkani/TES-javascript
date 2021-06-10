//---------------------
// FOR TESTING ONLY
//---------------------
//$(document).ready(function () {
//	
//	$('#tabs a[href="#logTab"]').click(function(){
//	    rebuildLog();
//	});
//	
//});

//log[0] = {};
//log[0].user   = "GSUTTON";
//log[0].date   = "2014-10-10"
//log[0].time   = "08:00:00";
//log[0].table  = "LanDtl";
//log[0].field  = "Origin";
//log[0].desc   = "This is the description";
//log[0].before = "Joplin, MO";
//log[0].after  = "Web City, MO";
//
//log[1] = {};
//log[1].user   = "GSUTTON";
//log[1].date   = "2014-10-10"
//log[1].time   = "08:00:00";
//log[1].table  = "LanDtl";
//log[1].field  = "Destination";
//log[1].desc   = "This is the description";
//log[1].before = "Dallas, TX";
//log[1].after  = "Fort Worth, TX";
//
//log[2] = {};
//log[2].user   = "GSUTTON";
//log[2].date   = "2014-10-07"
//log[2].time   = "07:00:00";
//log[2].table  = "LanDtl";
//log[2].field  = "Stop";
//log[2].desc   = "This is the description";
//log[2].before = "";
//log[2].after  = "Tulsa, OK";
//
//log[3] = {};
//log[3].user   = "GSUTTON";
//log[3].date   = "2014-10-03"
//log[3].time   = "02:00:00";
//log[3].table  = "LanDtl";
//log[3].field  = "Accessorial";
//log[3].desc   = "This is the description";
//log[3].before = "Team Surcharge";
//log[3].after  = "";
//
//log[4] = {};
//log[4].user   = "KROBERTSON";
//log[4].date   = "2014-10-03"
//log[4].time   = "08:00:00";
//log[4].table  = "LanDtl";
//log[4].field  = "Accessorial";
//log[4].desc   = "This is the description";
//log[4].before = "Team Surcharge";
//log[4].after  = "";
//
//log[5] = {};
//log[5].user   = "KROBERTSON";
//log[5].date   = "2014-10-03"
//log[5].time   = "08:00:00";
//log[5].table  = "LanDtl";
//log[5].field  = "Accessorial";
//log[5].desc   = "This is the description";
//log[5].before = "Hazardous Material Surcharge";
//log[5].after  = "";

//---------------------
// END TESTING
//---------------------


// assign click functions
$(document).ready(function () {
	$("#logSearch").keyup(function(){
	    filterLog();
	});
});

function filterLog() {
	
	var field;
	var before;
	var after;
	var output = "";
	var isEmpty = false;
	var $daySections;
	var logDate;
	var convertedDate = "";
	var now;
	
	searchText = $("#logSearch").val().toLowerCase().trim();
		
	// get every log entry
	$logEntries = $(".logEntry");
	
	// hide the ones that don't contain the search text
	$logEntries.each(function() {
		field  = $(this).find(".logField").html().toLowerCase();
		before = $(this).find(".logBefore").html().toLowerCase();
		after  = $(this).find(".logAfter").html().toLowerCase();
		
		if (field.indexOf(searchText)  == -1 &&
			before.indexOf(searchText) == -1 &&
			after.indexOf(searchText)  == -1) {
			$(this).addClass("logHidden");
		} else {
			$(this).removeClass("logHidden");
		}
	});
	
	
	// get all user sections
	$userSections = $(".logUserSection");
	
	// if user or time contains search text, then show all log entries
	$userSections.each(function() {
		user = $(this).find(".logUser").html().toLowerCase();
		time = $(this).find(".logTime").html().toLowerCase();
		
		if (user.indexOf(searchText) != -1 ||
			time.indexOf(searchText) != -1) {
			
			$userLogEntries = $(this).find(".logEntry");
			
			$userLogEntries.each(function() {
				$(this).removeClass("logHidden");
			});
		}
		
	});
	
	var convertedSearchText = "";
	
	// add slashes if there is a possibility the search text is a date
	if (!isNaN(searchText)){
		if (searchText.length > 2 && searchText.length < 5) {
			convertedSearchText = searchText.substring(0,2) + "/" + searchText.substring(2);
		} else if (searchText.length > 4) {
			convertedSearchText = searchText.substring(0,2) + "/" + searchText.substring(2,4) +
				"/" + searchText.substring(4);
		} else {
			convertedSearchText = searchText;
		}
	} else {
		convertedSearchText = searchText;
	}
	
	// get all day sections
	$daySections = $(".logDaySection");
	
	// if date contains search text, then show all log entries
	$daySections.each(function() {
		logDate = $(this).find(".logDate").html().toLowerCase();
		
		// convert the words "today" and "yesterday" to actual dates
		convertedDate = "";
		if (logDate == "today") {
			now = new moment();
			convertedDate = now.format("MM/DD/YYYY");
		} else if (logDate == "yesterday") {
			now = new moment();
			now.subtract(1, 'days');
			convertedDate = now.format("MM/DD/YYYY");
		}
		
		if (logDate.indexOf(searchText) != -1 ||
			convertedDate.indexOf(searchText) != -1 ||
			logDate.indexOf(convertedSearchText) != -1 ||
			convertedDate.indexOf(convertedSearchText) != -1) {
			
			$userLogEntries = $(this).find(".logEntry");
			
			$userLogEntries.each(function() {
				$(this).removeClass("logHidden");
			});
		}
		
	});
	
	
	// get all user sections
	$logUserLists = $(".logUserSection");
	
	// hide the user sections that have only hidden log entries
	$logUserLists.each(function() {
		
		$userEntries = $(this).find(".logEntry");
		
		isEmpty = true;
		$userEntries.each(function() {
			if (!$(this).hasClass("logHidden")) {
				isEmpty = false;
				return;
			}
		})
		
		if (isEmpty) {
			$(this).addClass("logHidden");
		} else {
			$(this).removeClass("logHidden");
		}
	});
	
	// get all day sections
	$logDaySections = $(".logDaySection");
	
	// hide all day sections that have only hidden log entries
	$logDaySections.each(function() {
		
		$dayEntries = $(this).find(".logEntry");
		
		isEmpty = true;
		$dayEntries.each(function() {
			if (!$(this).hasClass("logHidden")) {
				isEmpty = false;
				return;
			}
		})
		
		if (isEmpty) {
			$(this).addClass("logHidden");
		} else {
			$(this).removeClass("logHidden");
		}
	});
}

function retrieveLog() {
	
	var request;
	var url;
	var i;
	
	request = buildLogRequest();
	
	url = "PQxml.pgm?Func=GetLog"; 	
	
	// Abort active log request if one is in progress
	if(logXHR && logXHR.readyState != 4){
		logXHR.abort();
	}
	
	logXHR = 
		$.ajax({
			type: "POST",
			url: url,
			data: request,
			dataType: "xml",
			cache: false,
			success: function(response) {
				
				// read the log entries into an array
				$logEntries = $(response).find('logentry');
				
				i = 0;
				$logEntries.each( function () {
					
					log[i] = {};
					
					log[i].user   = $(this).attr('user');
					log[i].date   = $(this).attr('date');
					log[i].time   = $(this).attr('time');
					log[i].table  = $(this).attr('table');
					log[i].field  = $(this).attr('field');
					log[i].desc   = $(this).attr('desc');
					log[i].before = $(this).attr('before');
					log[i].after  = $(this).attr('after');	
					
					i++;
				});
				
				rebuildLog();			
			},
		
			complete: function(jqXHR, completeStatus) {
			},
						
			error: function(jqXHR, errorStatus, errorMessage) {
				if (errorStatus != "abort"){
				}
			}
		});
}

function buildLogRequest() {

	var xml = "";

	xml += "<logid>";
	
	xml += "<headerid>";
	xml += idpqheader
	xml += "</headerid>";
	xml += "<detailid>";
	xml += idpqlandtl;
	xml += "</detailid>";
	
	xml += "</logid>";
	
	return xml;
}

// Rebuild the log (history)
function rebuildLog (){
	var logList = $('#logList');
	var logDtl;
	var logUL;
	var logLI;
	
	var saveUser;
	var saveTime;
	var saveDate;
	var newDaySection = false;
	
	var statBegDtMoment;
	var statEndDtMoment;
	
	initToolTipster();
	
	logList.empty();
	
	// display a message if the log is empty
	if (log.length == 0){
		logList.append($("<li class='logEmpty'>No history available</li>"));
	}
	
	// step though each log entry
	for (i = 0; i < log.length; i++) {
		
		var date = moment(log[i].date,"YYYY-MM-DD").calendar();
		
		// if the date is different than previous record then
		// output a date header, otherwise do nothing
		if (log[i].date != saveDate){
			
			dayLI = $("<li class='logDaySection'></li>");		
			dayLI.append($("<div class='logDate'>"+ date + "</div>"));
			
			userList = $("<ul class='logUserList'></ul>");
			dayLI.append(userList);
			
			logList.append(dayLI);
			
			saveDate = log[i].date;	
			
			newDaySection = true;
			
		}
		
		// output a user/time header if necessary
		if (log[i].time != saveTime ||
			log[i].user != saveUser ||
			newDaySection){
				
			newDaySection = false;
			
			userLI = $("<li class='logUserSection'></li>");
			
			userHeader = $("<div class='logUserHeader'></div>");
			userHeader.append($("<span class='logUser'>"+log[i].user+"</span>"));
			userHeader.append($("<span class='logTime'>"+log[i].time+"</span>"));
			userLI.append(userHeader);
			
			logEntryList = $("<ul class='logEntryList'></ul>");
			userLI.append(logEntryList);
			
			userList.append(userLI);
			
			saveTime = log[i].time;
			saveUser = log[i].user;
		}
			
		logEntry = $("<li class='logEntry'></li>");
		
		if (log[i].before != "" && log[i].after != "") {	
			logEntry.append($("<span class='logField'>"+log[i].desc+"</span>"));
			logEntry.append($("<span class='logBefore'>"+log[i].before+"</span>"));
			logEntry.append($("<div class='logArrow'></span>"));
			logEntry.append($("<span class='logAfter'>"+log[i].after+"</span>"));
			
		} else if (log[i].before == "") {
			logEntry.append($("<span class='logField'>"+log[i].desc+"</span>"));
			logEntry.append($("<span class='logBefore logAdded'>+</span>"));
			logEntry.append($("<span class='logAfter'>"+log[i].after+"</span>"));
		} else if (log[i].after == "") {
			logEntry.append($("<span class='logField'>"+log[i].desc+"</span>"));
			logEntry.append($("<span class='logAfter logRemoved'>x</span>"));
			logEntry.append($("<span class='logBefore'>"+log[i].before+"</span>"));
		}
		
		
		logEntryList.append(logEntry);
	}	
}
