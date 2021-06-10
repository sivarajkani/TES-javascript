//function clearGlobalVars() {
//
//	clearHeader();
//	clearLaneDetail();
//	clearArrays();
//
//	$(".laneType").val('I');
//	$(".laneType option:contains('Inquiry')").removeAttr('disabled');
//	$(".laneType option:contains('Proposal')").attr('disabled','disabled');
//	$(".laneType option:contains('Spot')").attr('disabled','disabled');
//
//	// Hide Matches
//	$("#matchIndicator").css("display","none");
//}

function clearHeader() {
	contactid = 0;
	cusbase = 0;
	cusprefix = '';
	cussuffix = 0;
	custid = 0;
	idpqheader = 0;
	quotenum = '';
	status = 'A';
}

function clearLaneDetail() {
	idpqlandtl = 0;
	approvddat = '0001-01-01-00.00.00.000000';
	approvdusr = '';
	approvdsts = '';
	effdate = moment().format("YYYY-MM-DD");
	expdate = moment().add(45, 'days').format("YYYY-MM-DD");
	idpqlandtl = 0;
	lanenumber = 0;
	quotetype = 'I';
	rateddate = '0001-01-01-00.00.00.000000';
	statorig = '';
	statdest = '';
	statbegdt = '0001-01-01';
	statenddt = '0001-01-01';
}

function clearArrays() {
	chrg.length = 0;
	cond.length = 0;
	data.length = 0;
	geo.length = 0;
	stat.length = 0;
	rules.length = 0;
	notes.length = 0;
	auth.length = 0;
	match.length = 0;
	log.length = 0;
}

function clearAuthorization() {
	emailAuthorized = false;
	saveAuthorized = false;
}

function clearBorderCityVars() {
	count = 0;
	len = 0;
	updateDst = false;
	remove = 0;
}

function clearLaneNav() {
	laneNavMessage = "";
	laneNext = 0;
	lanePrevious = 0;
	laneFirst = 0;
	laneLast = 0;
}

function clearEmail() {
	emailTo = "";
	emailSubject = "";
	emailBody = "";
}
