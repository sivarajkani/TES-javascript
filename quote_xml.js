
// Build Complete xml document for saving a Pricing Quote
function quote_forSave_xml() {
	var xml;
	
	// Load Minimum Charge Amount for Linehaul into Charge Array 
	if (chrg.length != 0){
		//chrg[0].pricedminchr = $("#minChrgPricedRateAmt").val();
		chrg[0].pricedminchr = $("#minChrgPricedRateSpan").text();
	}
	
	var xml = '<Quote>' + quote_xml_header() + quote_xml_detail()
	+ quote_xml_geography() + quote_xml_condition()
	                       // remove statistics       + quote_xml_statistic() + quote_xml_charge() + //
	+ quote_xml_charge() + 
	quote_xml_comments() + quote_xml_loads() + quote_xml_users() +'</Quote>';
	return xml;
}

// Build xml document with sufficient information to perform a Rating
function quote_forRating_xml() {
	var xml;

	xml = '<Quote>' + quote_xml_header();
	xml += quote_xml_detail();
	xml += quote_xml_geography();
	xml += quote_xml_condition();
	xml += quote_xml_charge();
	xml += '</Quote>';
	return xml;
}

//Build xml document with sufficient information to Find Matching Quotes
function quote_forMatching_xml() {
	var xml;
    var save_quotetype = quotetype;
    quotetype = '';
	xml = '<Quote>' + quote_xml_header();
	xml += quote_xml_detailMatching();
	xml += quote_xml_geography();
	xml += quote_xml_condition();
	xml += quote_xml_charge();
    xml += quote_xml_srch_info_detail();
	xml += '</Quote>';
	quotetype = save_quotetype;
	return xml;
}

function quote_xml_srch_info_detail(){
    var searchInfoDetail;
    var useinheritdetail = 1 ;
	searchInfoDetail = '<srch_info' +   
	' useinherit="'   + useinheritdetail + '"' + '/>'; 
    
    return searchInfoDetail;
}

// Build Header Segment
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
	' idpqcontme="'  + idpqcontme  + '"' +
	' />';
	return header;
}

// Build Detail Segment
function quote_xml_detail() {
	var detail;
	if (idpqlandtl == null) {idpqlandtl = 0};
	if (lanenumber == null) {lanenumber = 0};
	detail = '<detail' +
	' idpqlandtl="' + idpqlandtl + '"' +
	' lanenumber="' + lanenumber + '"' +
	' quotetype ="' + quotetype + '"' +
	' effdate="' + effdate + '"' +
	' expdate="' + expdate + '"' +
	' rateddate="' + rateddate + '"' +
	' approvdsts="' + approvdsts + '"' +
	' approvddat="' + approvddat + '"' +
	' approvdusr="' + approvdusr + '"' +
	' statorig="' + statorig + '"' +
	' statdest="' + statdest + '"' +
	' statbegdt="' + statbegdt + '"' +
	' statenddt="' + statenddt + '"' +
	' custrefno="' + custrefno + '"' +
	' />';
	return detail;
}

function quote_xml_users(){
	
	var users;
	
	users = '<laneusers' +
	  ' usertype="' + $("#salesUser option:selected").attr("usertype") + '"' +
	  ' userprofile="' + $("#salesUser option:selected").attr("value") + '"' +
	  ' />' +
	  '<laneusers' +
	  ' usertype="' + $("#publishUser option:selected").attr("usertype") + '"' +
	  ' userprofile="' + $("#publishUser option:selected").attr("value") + '"' +
	  ' />' +
	  '<laneusers' +
	  ' usertype="' + $("#priceUser option:selected").attr("usertype") + '"' +
	  ' userprofile="' + $("#priceUser option:selected").attr("value") + '"' +
	  ' />';
	return users;
}
//Build Detail Segment for Matching ONLY
function quote_xml_detailMatching() {
	var detail;
	if (idpqlandtl == null) {idpqlandtl = 0};
	if (lanenumber == null) {lanenumber = 0};
	detail = '<detail' +
	' idpqlandtl="' + idpqlandtl + '"' +
	' lanenumber="' + lanenumber + '"' +
	' quotetype ="' + quotetype + '"' +
	' effdate="' + effdate + '"' +
	' expdate="' + expdate + '"' +
	' rateddate="' + rateddate + '"' +
	' approvdsts="*"' +
	' approvddat="' + approvddat + '"' +
	' approvdusr="' + approvdusr + '"' +
	' statorig="' + statorig + '"' +
	' statdest="' + statdest + '"' +
	' statbegdt="' + statbegdt + '"' +
	' statenddt="' + statenddt + '"' +
	' custrefno="' + custrefno + '"' +	
	' />';
	return detail;
}


// Build All Geography Segments
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
	;
	return geography;
}

// Build all Accessorial and Shipment Condition Segments
function quote_xml_condition() {
	var condition = '';
	for (var i = 0; i < cond.length; i++) {
		condition += '<condition' +
		' idpqcond="' + cond[i].idpqcond + '"' + 	
		' codetype="' + cond[i].codetype + '"' + 	
		' code="' + cond[i].code + '"' + 	
		' qualifier1="' + cond[i].qualifier1 + '"' + 	
		' qualifier2="' + cond[i].qualifier2 + '"' + 	
		' exclcond="' + cond[i].exclcond + '"' + 	
		' />';
	}
	;
	return condition;
}

// Build All Statistic Segments
//function quote_xml_statistic() {
//	var statistic = '';
//	for (var i = 0; i < stat.length; i++) {
		
		// make sure statValue is not blank
//		if (stat[i].statValue == "") {
//			stat[i].statValue = 0;
//		}
	
//		var str = stat[i].statValue;
//		str = str.replace("%", "");
		
//		statistic += '<statistic' + 	
//		' idpqstsmst="' + stat[i].idPqStsMst + '"' + 	
//		' statvalue="' + str + '"' + 		
//		' />';
//	}
//	return statistic;
//}

// Build All Charge Segments
function quote_xml_charge() {
	var charge = '';
	for (var i = 0; i < chrg.length; i++) {
		if (chrg[i].linecode> 0) {
			if (chrg[i].propqty == '') {chrg[i].propqty = '0'}
			if (chrg[i].proprate == '') {chrg[i].proprate = '0'}
			if (chrg[i].propamt == '') {chrg[i].propamt = '0'}
			if (chrg[i].rmsrate == '') {chrg[i].rmsrate = '0'}	
			if (chrg[i].pricedminchr == '') {chrg[i].pricedminchr = '0'}			
		charge += '<charge' +
		' recordid="' + chrg[i].idpqlanchr + '"' + 	
		' sequence="' + chrg[i].sequence + '"' + 	
		' segment="' + chrg[i].segment + '"' + 	
		' linecodetype="' + chrg[i].linecodetype + '"' + 
		' linecode="' + chrg[i].linecode + '"' + 
		' description="' + chrg[i].description + '"' + 	
		' rmssection="' + chrg[i].rmssection + '"' + 	
		' rmsitem="' + chrg[i].rmsitem + '"' + 	
		' rmsqty="' + chrg[i].rmsqty + '"' + 	
		' rmsuom="' + chrg[i].rmsuom + '"' + 	
		' rmsrate="' + chrg[i].rmsrate + '"' + 	
		' rmsamount="' + chrg[i].rmsamount + '"' + 	
		' rmsminchg="' + chrg[i].rmsminchg + '"' + 	
		' rmspubrpm="' + chrg[i].rmspubrpm + '"' + 
//        ' rmspubrpm="0"' +     
		' propqty="' + chrg[i].propqty + '"' + 	
		' proprate="' + chrg[i].proprate + '"' + 	
		' propuom="' + chrg[i].propuom + '"' + 	
		' propamt="' + chrg[i].propamt + '"' +
		' exclchrg="' + chrg[i].exclchrg + '"' +
		' adjustpct="' + chrg[i].adjustpct + '"' +
		' pricedminchr="' + chrg[i].pricedminchr + '"' +  
		' pricingid="' + chrg[i].pricingid + '"' + 	
		' pricingorig="' + encodeURIComponent(chrg[i].puborigin) + '"' + 	 
		' pricingdest="' + encodeURIComponent(chrg[i].pubdest) + '"' + 	
		' scaleqty="' + chrg[i].scaleqty + '"' + 	
		' scaleuom="' + chrg[i].scaleuom + '"' + 
		' scalerate="' + chrg[i].scalerate + '"' + 	
		' scaleamt="' + chrg[i].scaleamt + '"' +
		' scaleprcid="' + chrg[i].scaleprcid + '"' + 
		' scaleorig="' + encodeURIComponent(chrg[i].scaleorigin) + '"' + 	 
		' scaledest="' + encodeURIComponent(chrg[i].scaledest) + '"' + 	
		' scaleminchr="' + chrg[i].scaleminchr + '"' +
		' />';
		}
	}
	;

	return charge;
}
//Build all Notes/comment Segments
function quote_xml_comments() {
	var comments = '';
	for (var i = 0; i < notes.length; i++) {
		comments += '<notes' +
		' cmtkey="' + notes[i].cmtkey + '"' + 	
		' cmtseq="' + notes[i].cmtseq + '"' + 	
		' cmtkeytyp="' + notes[i].cmtkeytyp + '"' + 	
		' cmtaplcod="' + notes[i].cmtaplcod + '"' + 	
		' cmttype="' + notes[i].cmttype + '"' + 
		' comment="' + encodeURIComponent(notes[i].comment) + '"' + 	
		//' comment="' + escapeXML(notes[i].comment) + '"' + 	
		' commentlength="' + notes[i].commentlength + '"' + 	
		' entusr="' + notes[i].entusr + '"' + 	
		' enttim="' + notes[i].enttim + '"' +
		' chgusr="' + notes[i].chgusr + '"' + 	
		' chgtim="' + notes[i].chgtim + '"' + 
		' entdat="' + notes[i].entdat + '"' + 	
		' chgdat="' + notes[i].chgdat + '"' + 	
		' />';
	}
	;
	return comments;
}

function quote_xml_loads() {
	
	if (checkLoads) {
		var loads = '<loads checkloads="true" />';
	} else {
		var loads = '<loads checkloads="false" />';
	}

	return loads
}

//Build xml document for saving imported lanes
function quote_forImport_xml() {
	var xml;
	
	xml = '<Quote>' + quote_xml_header() + quote_lane() + '</Quote>';
	return xml;
}

//Build lane seqments for import
function quote_lane(){
	var lane = '';
	
	for (imp=0; imp < lanes.length; imp++){
		if (lanes[imp].type == "New"){
            lane = lane + '<lane>' + quote_xml_detailImport() + quote_geoImport() + importquote_volumetrics() + importquote_xml_users() + '</lane>';
		}
		// Import - Changes to Rate, UOM, and Minimum Charge & Volumetrics Only
		if (lanes[imp].type == "Chg"){
			lane = lane + '<lane>' + quote_xml_detailImport() + quote_ratesImport() +
            importquote_volumetrics()  +
            '</lane>';
			}
	}
	
	return lane;
}
function importquote_xml_users(){
	
	var users = '';
	
	for (var i = 0; i < custDefaultUsers.length; i++){
		users += '<laneusers' +
			  ' usertype="' + custDefaultUsers[i].userType + '"' +
			  ' userprofile="' + custDefaultUsers[i].userProfile + '"' +
			  ' />';
	}
	
	return users;
}
function importquote_volumetrics(){
    var volumetrics = '';
    var imp_laneid = 0;
    
    if (lanes[imp].type != "New"){
        imp_laneid = lanes[imp].idpqlandtl;
    }
    
    // Add Volumetrics  
    for (var v = 0; v < ds_Volumetrics_SS.columns.length; v++) {
        volumetrics += '<volume' + 
            ' id="' + imp_laneid + '"' +
            ' valuename="' + ds_Volumetrics_SS.columns[v].vol_field_name + '"' +
            ' value="' + lanes[imp][ds_Volumetrics_SS.columns[v].vol_field_name] + '"' +
            ' uom="' + lanes[imp][ds_Volumetrics_SS.columns[v].uom_field_name] + '"' +
            ' />';
    }
    
   return volumetrics; 
    
}

//Build Detail Segment
function quote_xml_detailImport() {
	var detail;
	var statusCode;
	detail = '<detail';
	if (lanes[imp].type == "New"){
		detail += ' idpqlandtl="0" lanenumber="0" ';
		statusCode = "";
	} else {
		detail += ' idpqlandtl="' + lanes[imp].idpqlandtl + '"'
		+ ' lanenumber="' + lanes[imp].lanenumber + '"';
		//Get Workflow Status Code from Values
		for (var w = 0; w < workFlowStatus_values.length; w++) { 
        	if (workFlowStatus_values[w].sdesc == lanes[imp].workflowstatus){
        		statusCode = workFlowStatus_values[w].code;
           		break;
           	};
        }
		
	}
	
	detail +=
	
	' quotetype ="I" ' +
	' effdate="' + effdate + '"' +
	' expdate="' + expdate + '"' +
	' rateddate="0001-01-01-00.00.00.000000"' +
	' approvdsts="' + statusCode + '"' +
	' approvddat="0001-01-01-00.00.00.000000" ' +
	' approvdusr="" ' +
	' statorig="' + lanes[imp].originzone + '"' +
	' statdest="' + lanes[imp].destinationzone + '"' +
	' statbegdt="" ' +
	' statenddt="" ' +
	' custrefno="' + lanes[imp].custrefno + '"' +	
	' />';
	return detail;
}

function quote_geoImport(){
	var geography = '';
	
	geography = '<geography' +
	' idpqlangeo="0" ' + 	
	' segment="0" ' + 	
	' sequence="1" ' + 	
	' geotype="ORG" ' + 	
	' pointsrc="' + lanes[imp].originsource + '"' + 	
	' idcity="' + lanes[imp].originidcity + '"' + 	
	' cityname="' + lanes[imp].origincityname + '"' + 	
	' idcounty="' + lanes[imp].originidcounty + '"' + 	
	' countyname="' + lanes[imp].origincountyname + '"' + 	
	' state="' + lanes[imp].originstate + '"' + 	
	' country="' + lanes[imp].origincountry + '"' + 	
	' idzip="' + lanes[imp].originidzip + '"' + 	
	' zipcode="' + lanes[imp].originzipcode + '"' + 	
	' zone="' + lanes[imp].originzone + '"' + 	
	' idregion="' + lanes[imp].originidregion + '"' + 	
	' applycarr="0" ' +
	' />' +
	' <geography' +
	' idpqlangeo="0" ' + 	
	' segment="0" ' + 	
	' sequence="2" ' + 	
	' geotype="DST" ' + 	
	' pointsrc="' + lanes[imp].destinationsource + '"' + 	
	' idcity="' + lanes[imp].destinationidcity + '"' + 	
	' cityname="' + lanes[imp].destinationcityname + '"' + 	
	' idcounty="' + lanes[imp].destinationidcounty + '"' + 	
	' countyname="' + lanes[imp].destinationcountyname + '"' + 	
	' state="' + lanes[imp].destinationstate + '"' + 	
	' country="' + lanes[imp].destinationcountry + '"' + 	
	' idzip="' + lanes[imp].destinationidzip + '"' + 	
	' zipcode="' + lanes[imp].destinationzipcode + '"' + 	
	' zone="' + lanes[imp].destinationzone + '"' + 	
	' idregion="' + lanes[imp].destinationidregion + '"' + 	
	' applycarr="0" ' +
	' />';

return geography;	
}
function quote_ratesImport(){
	var rates = '';
	if (lanes[imp].priminchr == ""){
		lanes[imp].priminchr = "0";
	}
	rates = '<rates' +
	' idpqlandtl="' + lanes[imp].idpqlandtl + '"' +
	' uom="' + lanes[imp].proposeduom + '"' +
	' rmsrate="' + lanes[imp].proposedrate + '"' +
	' rmsminchg="' + lanes[imp].priminchr + '"' +
    ' pricedfscuom="' + lanes[imp].pricedfscuom + '"' +
    ' pricedfscrate="' + lanes[imp].pricedfscrate + '"' +
    ' pricedmxcarrierrate="' + lanes[imp].pricedmxcarrierrate + '"' +    
    ' pricedmxfsc="' + lanes[imp].pricedmxfsc + '"' +
    ' pricedmxbordercrossingfee="' + lanes[imp].pricedmxbordercrossingfee + '"' +
	' />';
	return rates;
} 
//Build xml document for Mass Update
function massUpdate_xml() {
	var xml;
	if (massRerate){
		// Mass ReRate Only - No Updates Performed
		xml = '<MassUpdate>' + 
			'<landtl' +
			' idpqheader="' + idpqheader + '"' +
			' quotetype=""' +
			' effdate="0001-01-01"' + 
			' expdate="0001-01-01"' + 
			' workflowstatus="*"' + 
			' usertype=""' + 
		    ' updUser=""' +
		    ' reRate="Y"' +
			' />'		
			+ massUpdate_xml_Lanes() + '</MassUpdate>';
	}else{
		xml = '<MassUpdate>' + massUpdate_xml_LaneDtl() 
	  	    + massUpdate_xml_Geo() + massUpdate_xml_Cond()  
	    	+ massUpdate_xml_Charges() 
	      	+ massUpdate_xml_Lanes() + '</MassUpdate>';
	}
	return xml;
	
}

function massUpdate_xml_LaneDtl(){
	var detail;
	detail = '<landtl' +
	' idpqheader="' + idpqheader + '"' +
	' quotetype="' + updlanetype + '"' +
	' effdate="' + updeffectiveDate + '"' +
	' expdate="' + updexpireDate + '"' +
	//' linehaulrate="' + updlinehaulrate + '"' +
	//' linehauluom="' + updlinehauluom + '"' +
	' workflowstatus="' + updWorkFlowStatusCode + '"' +
    ' usertype="' + updUserType + '"' +
    ' updUser="' + updUser + '"' + 
    ' reRate=""' +
	' />';
	return detail;
}

function massUpdate_xml_Geo() {
	var geography = '';
	for (var i = 0; i < updgeo.length; i++) {
		
		geography += '<geo' +
		' type="' + updgeo[i].geotype + '"' + 	
		' source="' + updgeo[i].pointsrc + '"' + 	
		' idcity="' + updgeo[i].idcity + '"' + 	
		' cityname="' + updgeo[i].cityname + '"' + 	
		' idcounty="' + updgeo[i].idcounty + '"' + 	
		' countyname="' + updgeo[i].countyname + '"' + 	
		' state="' + updgeo[i].state + '"' + 	
		' country="' + updgeo[i].country + '"' + 	
		' idzip="' + updgeo[i].idzip + '"' + 	
		' zipcode="' + updgeo[i].zipcode + '"' + 	
		' zone="' + updgeo[i].zone + '"' + 	
		' idregion="' + updgeo[i].idregion + '"' + 	
		' />';
	}
	;
	return geography;
}
function massUpdate_xml_Cond() {
	var condition = "";
	/*$("#accessorialsList input:checked").each(function(){
			condition += '<cond' +
			' code="' + $(this).attr('rpcode') + '"' + 
			' codetype="' + $(this).attr('rpctyp') + '"' + 	
			' />';
	});*/
	$.each(massUpdateAccessorial_values, function(index, value){
		condition += '<cond' +
			' code="' + value + '"' + 
			' codetype="A"' + 	
			' />';
	});
	
	return condition;
}
function massUpdate_xml_Charges() {
	var charges = "";
	
	// Update Line Haul 
	if (updlinehauluom != ""){
		charges += '<charges linehaulrate="' + updlinehaulrate + '"' +
		           ' linehauluom="' + updlinehauluom + '" />';
	}
	// Update Mexico Charges
	if (updMexRate != "" && Number(updMexRate) >= 0){
		charges += '<charges linehaulrate="' + updMexRate + '"' +
		           ' linehauluom="MX" />';
	}	
	// Update Minimum Charge	
	if (updMinRate != "" && Number(updMinRate) > 0){
		charges += '<charges linehaulrate="' + updMinRate + '"' +
		           ' linehauluom="MIN" />';
	}	
	
	return charges;
	
}
function massUpdate_xml_Lanes() {
	var lanesXML = '';
	for (var i = 0; i < lanesToUpdate.length; i++) {
		lanesXML += '<laneid' +
		' idpqlanid="' + lanesToUpdate[i] + '"' + 
		' />';
	};
	
	return lanesXML;
}
//Build xml document for Publishing
function quote_forPublish_xml() {
	var xml;
	var section = $("#pubRateAuthority").val();
	var item = $("#pubPublicationNum").val();
	
	xml = '<PubInfo section="' + section + '"' +
		' item="' + item + '"' +
		' effdate="' + pubEffectiveDate + '"' +
		' expdate="' + pubExpireDate + '" >'
	       + publish_xml_Lanes() + '</PubInfo>';
	return xml;
	
}
function publish_xml_Lanes() {
	var lanesXML = '';
	var expirePricingId = '';
	
	for (var i = 0; i < lanesToUpdate.length; i++) {
		lanesXML += '<lane>' +
		 lanesToUpdate[i] + 
		'</lane>';
	};
	
	for (var i = 0; i < lanesToUpdate.length; i++) {
		// Get Pricing Id from Auto Publish Lanes
		expirePricingId = '0';
		for (var x = 0; x < ds_TBPLanes.length; x++) {
			if (ds_TBPLanes[x].laneId == lanesToUpdate[i] && ds_TBPLanes[x].autoExpire == 'Y'){
				expirePricingId = ds_TBPLanes[x].pricingId; 
			};
		}
		
		lanesXML += '<pricingId>' +
			expirePricingId + 
			'</pricingId>';
	};
	
	return lanesXML;
}
