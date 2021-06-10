ds_AuthTest = {};


//AJAX Routines
function retrieveAuth(){
    ///////NOT USED - replaced by retrieveAuthority
	var errMessage;
	var error = false;
	var i = -1;
	var url;


	//Clear auth array
	auth.length = 0;	  

	//Build URL to get auth list
	url = "PQxml.pgm?" + 
		"Func=GetAuthorization&Action=Get&username=" + currentUser + "&programname=pricingcgi";

	$.ajax({
		type:"GET",
		url:url,
		dataType: "xml",
		async: false,
		success: function(xml) {
			response = $(xml).find('success').text();
			if (response == 'true'){
				i = -1;
				$(xml).find('auth').each(function(){
					i++;
					auth[i] = {};
					auth[i].name = $(this).attr("name");
					auth[i].value = $(this).attr("value");
					switch (auth[i].name) {
						case 'email':
							if (auth[i].value == 'true'){
								emailAuthorized = true;
							} else {
								emailAuthorized = false;
							}
							break;
						case 'save':
							if (auth[i].value == 'true'){
								saveAuthorized = true;
							} else {
								saveAuthorized = false;
							}
							break; 
						case 'publish':
							if (auth[i].value == 'true'){
								publishAuthorized = true;
							} else {
								publishAuthorized = false;
							}
							break;
					}
				});			   	
			}			


		},
		complete: function() {
			if (saveAuthorized){
				$("#commentControls").show();
			}
		},

		error: function() {
			alert('There was a problem with the retrieveAuth AJAX request');
		}		

	});
}



function retrieveAuthority(callback) {

    url = "PQxml.pgm?" +
        "Func=GETAUTHORITY&username=" + currentUser; 

    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",
        async: false,

        success: function (userAuth) {
            ds_Auth = userAuth;

            // Authority Level display in Help
            $("#authGroup" + ds_Auth.authorityLevel).css("display", "block");
            
            // Authorized to Save
            if (ds_Auth.save) {
                saveAuthorized = true;
            } else {
                saveAuthorized = false;
            }

            // Authorized to Send Email
            if (ds_Auth.email) {
                emailAuthorized = true;
            } else {
                emailAuthorized = false;
            }

            // Authorized to Publish
            if (ds_Auth.publish) {
                publishAuthorized = true;
            } else {
                publishAuthorized = false;
            }
    
            // Inquiry Only
            if (ds_Auth.quoteType.length > 1){
                inquiryOnly = false;
            } else {
                inquiryOnly = true;
            }
    
            //Disable & Set Authorized Action Buttons
            disableActions(false,function () {
                setAuthorizedActions();
            });

            if (callback) {
                callback();
            }
        },

        complete: function () {
            if (saveAuthorized) {
                $("#commentControls").show();
            }
        },

        error: function (jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort") {
                alert(errorMessage);
            }
        }
    });



}
function retrieveSalesRepInfo(callback) {

    url = "PQxml.pgm?" +
        "Func=SALESTERRITORY&username=" + currentUser + "&originzone=" + geo[0].zone;

    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",
        async: false,

        success: function (response) {
            if (response.salesuser) {
                salesPerson = true;
            } else {
                salesPerson = false;
            }

            if (response.interritory) {
                inTerritory = true;
            } else {
                inTerritory = false;
            }


            if (callback) {
                callback();
            }
        },

        complete: function () {

        },

        error: function (jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort") {
                alert(errorMessage);
            }
        }
    });



}

// Authorization Functions

// Action Buttons Authority Section
//////////////////////////////////////
function disableActions(fadeOutButtons,callback){

	// Disable All Action Buttons
	$("#saveRates").addClass("disabled");
	$("#emailButton").addClass("disabled");
	$("#massUpdateButton").addClass("disabled");
	$("#downloadButton").addClass("disabled");
	$("#publishButton").addClass("disabled");
	$("#auditButton").addClass("disabled");

	if (fadeOutButtons){
		$("#massUpdateButton").fadeOut();
		$("#downloadButton").fadeOut();
		$("#publishButton").fadeOut();
		$("#auditButton").fadeOut();
	}

	if (callback) {
		callback();
	}
}


function setAuthorizedActions(fadeInButtons,callback){

	// Fade In All Action Buttons
	if (fadeInButtons){
		$("#massUpdateButton").fadeIn();
		$("#downloadButton").fadeIn();
		$("#publishButton").fadeIn();
		$("#auditButton").fadeIn();
	}

	// Authorized to Email
	if (ds_Auth.email){
		$("#emailButton").removeClass("disabled");
	} else {
		$("#emailButton").addClass("disabled");
	}

	// Authorized to Mass Update
	if (ds_Auth.massUpdate){
		$("#massUpdateButton").removeClass("disabled");
	} else {
		$("#massUpdateButton").addClass("disabled");
	}

	// Authorized to Export
	if (ds_Auth.export){
		$("#downloadButton").removeClass("disabled");
	} else {
		$("#downloadButton").addClass("disabled");
	}

	// Authorized to Publish
	if (ds_Auth.publish){
		$("#publishButton").removeClass("disabled");
	} else {
		$("#publishButton").addClass("disabled");
	}

	// Authorized to Audit
	if (ds_Auth.audit){
		$("#auditButton").removeClass("disabled");
	} else {
		$("#auditButton").addClass("disabled");
	}

	if (callback) {
		callback();
	}

}

// Dates Authority Section
//////////////////////////////////////
function disableQuoteDates(callback){

	$('#effectiveDate').datepicker('disable');
	$('#expirationDate').datepicker('disable');

	if (callback) {
		callback();
	}
}
function setAuthorizedQuoteDates(thisQuoteType,setExpirationDate,callback){
    var daysEffective = 0,
        daysBack = 0,
        daysFwd = 0,
        daysBackDate,
        daysFwdDate;
    
    // Get Authorized +/- Days for this Quote Type    
    for (var i=0; i < ds_Auth.quoteType.length; i++){
        if (ds_Auth.quoteType[i].type == thisQuoteType){
            daysEffective = ds_Auth.quoteType[i].daysEffective;
            daysBack = ds_Auth.quoteType[i].daysBackdateSelect;
            daysFwd = ds_Auth.quoteType[i].daysExtend;
            break;
        }
    }
        
    var effMoment = new moment($("#effectiveDate").val(), "MM-DD-YYYY");
    var expMoment = new moment($("#expirationDate").val(), "MM-DD-YYYY");
    var newExpMoment;

    // Set Expiration Date - Effective Date Plus #Days Effective for Quote Type
    if (setExpirationDate){
        newExpMoment = effMoment.clone();
        newExpMoment.add('days', daysEffective);
        $("#expirationDate").val(newExpMoment.format('MM/DD/YYYY')); 
        $("#expirationDate").datepicker("setDate", 
                                        newExpMoment.format('MM/DD/YYYY')                   );
    } else {
        newExpMoment = expMoment.clone();  
    }
    
    
    // Set Extended Date
    if (daysFwd != 0){
        newExpMoment.add('days', daysFwd);    
    }
    daysFwdDate = newExpMoment.format('MM/DD/YYYY');
    
    // Set Back Date
    newExpMoment = effMoment.clone();   
    if (daysBack != 0){
        newExpMoment.subtract('days', daysBack);       
    }
    daysBackDate = newExpMoment.format('MM/DD/YYYY');
    
            
    
    $("#effectiveDate").datepicker("option", "minDate", daysBackDate);


	$("#expirationDate").datepicker("option", "maxDate", daysFwdDate);

	if (callback) {
		callback();
	}
}


// Priced Rate Authority Section
//////////////////////////////////////
function checkQuotePriceDeviations(quoteType){
    var quotePriceValid = true,
        compareAmount = 0,
        compLineCode,
        compPropRate,
        compScaleQty,
        compPropUOM,
        compLineCodeType;
    
    
    // Check Linehaul and Fuel Surcharge for Authorized Price Deviations
    for (var q = 0; q < chrg.length; q++) { 
        if ((chrg[q].linecode == "100" || chrg[q].linecode == "150") & chrg[q].propuom != "" && chrg[q].linecodetype == "F"){
            // Recalculate Extended Proposed Amount for Miles UOM based on Scale Miles.
            if (chrg[q].propuom == "MLS"){
                compLineCode = chrg[q].linecode;
                compPropRate = chrg[q].proprate;
                compScaleQty = chrg[q].scaleqty;
                compPropUOM = chrg[q].propuom;
                compLineCodeType = chrg[q].linecodetype;
                compareAmount = Number(calculateExtendedAmount(compLineCode,compPropRate,compScaleQty,compPropUOM,compLineCodeType));  
            } else {
                compareAmount = Number(chrg[q].propamt);
            }
            // Check Authorized Deviation below Scale Amount
            if (Number(compareAmount) < Number(chrg[q].scaleamt)){
                switch (chrg[q].linecode){
                    case "100":
                        if (!authorizedRateAmount(quoteType,"LINEHAUL",compareAmount)){
                            quotePriceValid = false;
                        }
                        break;
                    case "150":
                        if (!authorizedRateAmount(quoteType,"FUEL",compareAmount)){
                            quotePriceValid = false;
                        }  
                        break;
                }
                    
            } 
            
        }
        
            
    };
    
    return quotePriceValid;
    
    
}

/// Calculate Extended Amount
function calculateExtendedAmount (lineCode,propRate,propQty,propUOM,lineCodeType) {
    // Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM
    var rule_ratedecimals = 0;
    var rule_extratdiv = 1;
    var extendedAmount = 0;

    for (var i = 0; i < rules.length; i++) { 
        if ((rules[i].linecode == lineCode) && (rules[i].uom == propUOM)
        	&& (rules[i].linecodetype == lineCodeType)){
            rule_ratedecimals = rules[i].ratedecprc;
            rule_extratdiv = rules[i].extratdiv;
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
    // Calculate Extended Amount using the Decimal Precision Multiplier   	              
    extendedAmount = (((((propRate * decimal_mult) * propQty)/decimal_mult) / rule_extratdiv).toFixed(2)); 

    return extendedAmount;
}

// Authorized Rate Deviations 
function authorizedRateAmount(quoteType,rateType,rateAmount){
    var belowScale = 0,
        belowScaleFSC = 0,
        authorizedRate = false,
        scaleAmount = 0;
        
        
    // If Priced Rate Amount is greater or equal to Scale Amount then return Authorized Rate of True. 
    // Authorized Deviation only needs checked when the rate amount is below the Scale Amount.
    switch (rateType){
        case "LINEHAUL":
            // Search in the Charges for the Linehaul 
            for (var i = 0; i < chrg.length; i++) { 
                if (chrg[i].linecode == "100" && chrg[i].linecodetype == "F"){
                    if (Number(rateAmount) >= Number(chrg[i].scaleamt) ){
                        return true;
                    } else {
                        scaleAmount = Number(chrg[i].scaleamt)
                    }
                    break;
                };
            };
            break;
            
        case "FUEL":
            // Search in the Charges for the Fuel Surcharge 
            for (var i = 0; i < chrg.length; i++) { 
                if (chrg[i].linecode == "150" && chrg[i].linecodetype == "F"){
                    if (Number(rateAmount) >= Number(chrg[i].scaleamt) ){
                        return true;
                    } else {
                        scaleAmount = Number(chrg[i].scaleamt)
                    }
                    break;
                };
            };
            break;
    }
    
    
    
    // Determine if User is a Salesman In their Territory or Outside of their Territory
    retrieveSalesRepInfo(function () {

        // Get Authorized Scale Deviations for this Quote Type and User    
        for (var i = 0; i < ds_Auth.quoteType.length; i++) {
            if (ds_Auth.quoteType[i].type == quoteType) {
                if (salesPerson) {
                    if (inTerritory) {
                        belowScale = Number(ds_Auth.quoteType[i].belowScaleInTerr);
                        belowScaleFSC = Number(ds_Auth.quoteType[i].belowFuelSCInTerr);
                    } else {
                        belowScale = Number(ds_Auth.quoteType[i].belowScaleOutTerr);
                        belowScaleFSC = Number(ds_Auth.quoteType[i].belowFuelSCOutTerr);
                    }
                } else {
                    belowScale = Number(ds_Auth.quoteType[i].belowScale);
                    belowScaleFSC = Number(ds_Auth.quoteType[i].belowFuelsc);
                }

                break;
            }
        }
});
    
    // Determine if Priced Rate Amount is within Users Authority 
    deviationFromScale = ((scaleAmount - Number(rateAmount)) / scaleAmount) * 100;
    switch (rateType){
        case "LINEHAUL":
            if (deviationFromScale <= belowScale) {
                return true;
            } else {
                return false;
            }
            break;
        case "FUEL":
            if (deviationFromScale <= belowScaleFSC) {
                return true;
            } else {
                return false;
            }
            break;
    }
    
    
   
}

// Quote Types Authority Section
//////////////////////////////////////
function authorizedQuoteType(checkThisQuoteType){

    // Check if user is authorized to this quote type.
    
	var authorizedToThisType = false;

	for (var i=0; i < ds_Auth.quoteType.length; i++){
		// Authorized to this Quote Type
		if (checkThisQuoteType == ds_Auth.quoteType[i].type){
			authorizedToThisType = true;
		};
	}

	return authorizedToThisType;

}
function disableQuoteTypes(callback){
	// Disable Quotes Types Except Inquiry
	$(".laneType option:contains('Inquiry')").attr('disabled','false');
	$(".laneType option:contains('Bid')").attr('disabled','disabled');
	$(".laneType option:contains('Proposal')").attr('disabled','disabled');
	$(".laneType option:contains('Review')").attr('disabled','disabled');
	$(".laneType option:contains('Spot')").attr('disabled','disabled');
    if (callback) {
        callback();
    }
}

function setAuthorizedQuoteTypes(callback){
    
	for (var i=0; i < ds_Auth.quoteType.length; i++){
		// User is Authorized to Quote Type - available to select
		$(".laneType").children('option[value="' + ds_Auth.quoteType[i].type + '"]').attr('disabled', false);
	}

	if (callback) {
		callback();
	}
}


// Workflow Status Authority Section
//////////////////////////////////////
function authorizedWorkFlowStatus(quotetype,checkThisWorkFlowStatus,callback){

    // Check if user is authorized to this quote type.

    var authorizedToThisWorkFlowStatus = false;

    for (var i=0; i < ds_Auth.quoteType.length; i++){
        // Authorized to this Quote Type
        if (ds_Auth.quoteType[i].type == quotetype){
            for (var x=0; x < ds_Auth.quoteType[i].workFlow.length; x++){    
                if (ds_Auth.quoteType[i].workFlow[x].statusCode == checkThisWorkFlowStatus){    
                    // Authorized to Select Workflow
                    if (ds_Auth.quoteType[i].workFlow[x].select){
                        authorizedToThisWorkFlowStatus = true;
                        break;
                    }
                }
            }
        }
    }

    return authorizedToThisWorkFlowStatus;

}
function authorizedWorkFlowStatus_change(quotetype,checkThisWorkFlowStatus,callback){

    // Check if user is authorized to change this quote type with this work flow status.

    var authorizedToChangeThisWorkFlowStatus = false;

    for (var i=0; i < ds_Auth.quoteType.length; i++){
        // Authorized to this Quote Type
        if (ds_Auth.quoteType[i].type == quotetype){
            for (var x=0; x < ds_Auth.quoteType[i].workFlow.length; x++){    
                if (ds_Auth.quoteType[i].workFlow[x].statusCode == checkThisWorkFlowStatus){    
                    // Authorized to Change Workflow or Workflow Status has been selected for this Quote
                    if (ds_Auth.quoteType[i].workFlow[x].changeThis || originalWorkFlowStatus != checkThisWorkFlowStatus){
                        authorizedToChangeThisWorkFlowStatus = true;
                        break;
                    }
                }
            }
        }
    }

    return authorizedToChangeThisWorkFlowStatus;

}

function setAuthorizedWorkFlow(callback){

	for (var i=0; i < ds_Auth.quoteType.length; i++){
		if (ds_Auth.quoteType[i].type == quotetype){
			for (var x=0; x < ds_Auth.quoteType[i].workFlow.length; x++){    

				// Authorized to Select Workflow
				if (ds_Auth.quoteType[i].workFlow[x].select){
					$("#workFlowStatus").children('option[value="' + ds_Auth.quoteType[i].workFlow[x].statusCode + '"]').attr('disabled', false)
				} else {
					$("#workFlowStatus").children('option[value="' + ds_Auth.quoteType[i].workFlow[x].statusCode + '"]').attr('disabled', true)

				}
				// Check if user is authorized to change Current Workflow Status
				if (ds_Auth.quoteType[i].workFlow[x].statusCode == approvdsts){

					if (ds_Auth.quoteType[i].workFlow[x].changeThis){
						// Enable Workflow Selection   
						$("#workFlowStatus").children('option[value="' + ds_Auth.quoteType[i].workFlow[x].statusCode + '"]').attr('disabled', false) 
					} else {
						// Disable All Other Workflow Selections
						$("#workFlowStatus").children().attr('disabled', true)
					}
				}

			}


			break;   
		} 	
	}

	if (callback) {
		callback();
	}
}


function popAuth(){
	$.fancybox($("#regionForm"), {
		helpers: {
			overlay: false
		}
	});
}