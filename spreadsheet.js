// JavaScript Document
var spreadsheetLoadingCount = 0,
    ds_VolumetricsUOM = {},
    ds_Volumetrics_SS = {};
    

$(document).ready( function () {
	
// Setup Spreadsheet Download
	$("#downloadButton").click(function(){
		if (!$(this).hasClass("disabled")){
			if (quoteLockedByBatch(quotenum)){
				alert('Quote is Locked by Batch. Unable to download at this time.');
			} else {
                // Disable All Actions - Do Not Fade Out
                disableActions(false);
				//$("#downloadButton").addClass("disabled");
                
				// display "Downloading..." message
				$("#propMessageSpinner").css("display", "inline-block");
				$("#propMessage > span").html("Downloading...");
				$("#propMessage").css("display", "inline-block");

				downloadSpreadsheet(quotenum,function(){
                    setAuthorizedActions(false);
                    //$("#downloadButton").removeClass("disabled");    
                });
			}
		}
	});
	
// Setup Spreadsheet upload
	
	// Build Drag and Drop routines for lane list
	var $drop = $("#laneListDropDown");
	var $dropMask = $("#laneListDropDown > .hoverMask");
    
    
    
	// Dragged file enters the lane list area
	$drop.on('dragenter', function (e)
	{
		e.stopPropagation();
		e.preventDefault();
		$dropMask.fadeTo("fast", 0.7);
	});
	$dropMask.on('dragenter', function (e)
	{
		e.stopPropagation();
		e.preventDefault();
	});
	// Dragged leaves the lane list area
	$dropMask.on('dragleave', function (e)
	{
		e.stopPropagation();
		e.preventDefault();

		if ($(e.relatedTarget).parents('#laneListDropDown').length > 0) {
			return;
		}

		$dropMask.fadeOut();
	});
	// File is hovering over lane list
	$dropMask.on('dragover', function (e)
	{
		 e.stopPropagation();
		 e.preventDefault();
	});
	// File is dropped
	$dropMask.on('drop', function (e)
	{
		e.stopPropagation();
		e.preventDefault();

		var files = e.originalEvent.dataTransfer.files;

		// Hide mass update pane if open
		if ($("#massUpdateBlock").css("display") != "none"){
			hideMassUpdateForm(true);
		}
		
		$dropMask.fadeTo("fast", 1);
		$dropMask.css("background-image", "url(/applications/pricing/images/xlsxDrop.png)");
		
		if (laneListTable){
			laneListTable.order([0, "asc"]);
		}
		
		$("#geoBlock").fadeOut(300, function(){
			var $tableScrollBody = $("#laneListTable_wrapper > .dataTables_scroll > .dataTables_scrollBody");
			
			if ($tableScrollBody.length > 0) {
				$tableScrollBody.animate({height: "575px"}, "fast");
			}
			$("#laneListDropDown").animate({height: "99%"}, "fast");
		});
		
     	handleFileUpload(files,$dropMask);
	});
});

// Handle file drop
function handleFileUpload(files,obj)
{
   for (var i = 0; i < files.length; i++)
   {
        var fd = new FormData();
        fd.append('file', files[i]);
 
        var statusBar = new createStatusbar(obj); //Using this we can set progress.
        //statusBar.setFileNameSize(files[i].name,files[i].size);
        //sendFileToServer(fd,status);
              
       xlsTojson(files[i], parseSpreadsheet);    
       		
   }
}

function createStatusbar(obj)
{
     this.statusbar = $("<div class='statusBar'></div>");
     this.filename = $("<div class='fileName'></div>").appendTo(this.statusbar);
     this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
     this.size = $("<div class='fileSize'><span class='progressCount'>0</span> of <span class='progressGoal'>0</div>").appendTo(this.statusbar);
     //this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
     obj.append(this.statusbar);
 
    
}

//------------------------------------------------------------------------------------------------
//xlsTojson
//------------------------------------------------------------------------------------------------
function xlsTojson(file, callback) {
	var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
	
	var name = file.name;
	var reader = new FileReader();
	
	//event handler that fires after readAsBinaryString below
	reader.onload = function(e) {
		var data = e.target.result;
		var wb;
		if(rABS) {
			wb = XLSX.read(data, {type: 'binary'});
		} else {
		var arr = fixdata(data);
			wb = XLSX.read(btoa(arr), {type: 'base64'});
		}
		json = to_json(wb);
		callback(json);
	}
	
	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { headingToLowercase:true });
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}	
	
	function fixdata(data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l)
			o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(o.length)));
		return o;
	}

	//define slice method since microsoft left it out of IE10
	if (!ArrayBuffer.prototype.slice) {
	    //Returns a new ArrayBuffer whose contents are a copy of this ArrayBuffer's
	    //bytes from `begin`, inclusive, up to `end`, exclusive
	    ArrayBuffer.prototype.slice = function (begin, end) {
	        //If `begin` is unspecified, Chrome assumes 0, so we do the same
	        if (begin === void 0) {
	            begin = 0;
	        }

	        //If `end` is unspecified, the new ArrayBuffer contains all
	        //bytes from `begin` to the end of this ArrayBuffer.
	        if (end === void 0) {
	            end = this.byteLength;
	        }

	        //Chrome converts the values to integers via flooring
	        begin = Math.floor(begin);
	        end = Math.floor(end);

	        //If either `begin` or `end` is negative, it refers to an
	        //index from the end of the array, as opposed to from the beginning.
	        if (begin < 0) {
	            begin += this.byteLength;
	        }
	        if (end < 0) {
	            end += this.byteLength;
	        }

	        //The range specified by the `begin` and `end` values is clamped to the 
	        //valid index range for the current array.
	        begin = Math.min(Math.max(0, begin), this.byteLength);
	        end = Math.min(Math.max(0, end), this.byteLength);

	        //If the computed length of the new ArrayBuffer would be negative, it 
	        //is clamped to zero.
	        if (end - begin <= 0) {
	            return new ArrayBuffer(0);
	        }

	        var result = new ArrayBuffer(end - begin);
	        var resultBytes = new Uint8Array(result);
	        var sourceBytes = new Uint8Array(this, begin, end - begin);

	        resultBytes.set(sourceBytes);

	        return result;
	    };
	}
	
	if (rABS) {
		reader.readAsBinaryString(file);
		//var wb;
		//wb = XLSX.read(reader.result, {type: 'binary'});
		//json = to_json(wb);
		//callback(json);
	} else {
		reader.readAsArrayBuffer(file);
	}
}

//------------------------------------------------------------------------------------------------
//parseSpreadsheet
//------------------------------------------------------------------------------------------------
function parseSpreadsheet(json) {
	var sheets = [];
	var i = -1;
	var x = -1;
	
	// Clear Spread Sheet Import Lanes
	spreadsheetLanes.length = 0;
	spreadsheetLoadingCount = 0;
	importErrors = false;
	
	for (var prop in json)  {
		i++;
		sheets[i] = json[prop];
	}
	
	//now go through each sheet in sheets array and load each record into SSSet
	for (var j=0;j<sheets.length;j++){
		for (var i=0;i<sheets[j].length;i++){
			//Must have miles and either city or zip for origin and dest
			if (
				!(
					typeof sheets[j][i]["origin"] !== "undefined" && 
					typeof sheets[j][i]["destination"]  !== "undefined" 
				)) {
				// Insert error handling here
				
			} else {
				 
				//if a cell is empty, it's property is not created by js-xlsx. Do it manually.
				if (!sheets[j][i]["cust seq id"])	{sheets[j][i]["cust seq id"] = ''}
				else {sheets[j][i]["cust seq id"]	= $.trim(sheets[j][i]["cust seq id"])}
				
				if (!sheets[j][i]["quote #"])		{sheets[j][i]["quote #"] = ''}
				else {sheets[j][i]["quote #"]		= $.trim(sheets[j][i]["quote #"])}
				
				if (!sheets[j][i]["lane #"])		{sheets[j][i]["lane #"] = ''}
				else {sheets[j][i]["lane #"]		= $.trim(sheets[j][i]["lane #"])}
				
				if (!sheets[j][i]["origin"])		{sheets[j][i]["origin"] = ''}
				else {sheets[j][i]["origin"]		= $.trim(sheets[j][i]["origin"])}
				
				if (!sheets[j][i]["destination"])	{sheets[j][i]["destination"] = ''}
				else {sheets[j][i]["destination"]	= $.trim(sheets[j][i]["destination"])}
				
				if (!sheets[j][i]["priced uom"])	{sheets[j][i]["priced uom"] = ''}
				else {sheets[j][i]["priced uom"]	= $.trim(sheets[j][i]["priced uom"])}
				
				if (!sheets[j][i]["priced rate"])	{sheets[j][i]["priced rate"] = ''}
				else {sheets[j][i]["priced rate"]	= $.trim(sheets[j][i]["priced rate"])}
				
				if (!sheets[j][i]["priced mininum"])	{sheets[j][i]["priced mininum"] = ''}
				else {sheets[j][i]["priced mininum"]	= $.trim(sheets[j][i]["priced mininum"])}
                
                if (!sheets[j][i]["priced fsc uom"])	{sheets[j][i]["priced fsc uom"] = ''}
                else {sheets[j][i]["priced fsc uom"]	= $.trim(sheets[j][i]["priced fsc uom"])}
				
                if (!sheets[j][i]["priced fsc rate"])	{sheets[j][i]["priced fsc rate"] = ''}
                else {sheets[j][i]["priced fsc rate"]	= $.trim(sheets[j][i]["priced fsc rate"])}
                
                if (!sheets[j][i]["priced mx carrier rate"])	{sheets[j][i]["priced mx carrier rate"] = ''}
                else {sheets[j][i]["priced mx carrier rate"]	= $.trim(sheets[j][i]["priced mx carrier rate"])}
                
                if (!sheets[j][i]["priced mx fsc"])	{sheets[j][i]["priced mx fsc"] = ''}
                else {sheets[j][i]["priced mx fsc"]	= $.trim(sheets[j][i]["priced mx fsc"])}
                
                if (!sheets[j][i]["priced mx border crossing fee"])	{sheets[j][i]["priced mx border crossing fee"] = ''}
                else {sheets[j][i]["priced mx border crossing fee"]	= $.trim(sheets[j][i]["priced mx border crossing fee"])}
                
				if (!sheets[j][i]["lane id"])	{sheets[j][i]["lane id"] = ''}
				else {sheets[j][i]["lane id"]	= $.trim(sheets[j][i]["lane id"])}
				
				if (!sheets[j][i]["lane status"])	{sheets[j][i]["lane status"] = ''}
				else {sheets[j][i]["lane status"]	= $.trim(sheets[j][i]["lane status"])}
                
                // Volumetrics Column Names are stored in ds_Volumetrics_SS
                for (var v = 0; v < ds_Volumetrics_SS.columns.length; v++) {
                    
                    if (!sheets[j][i][ds_Volumetrics_SS.columns[v].vol_field_name]){
                        sheets[j][i][ds_Volumetrics_SS.columns[v].vol_field_name] = ''
                    } else {
                        sheets[j][i][ds_Volumetrics_SS.columns[v].vol_field_name]	= $.trim(sheets[j][i][ds_Volumetrics_SS.columns[v].vol_field_name])
                    }
                    
                    if (!sheets[j][i][ds_Volumetrics_SS.columns[v].uom_field_name]){
                        sheets[j][i][ds_Volumetrics_SS.columns[v].uom_field_name] = ''
                    } else {
                        sheets[j][i][ds_Volumetrics_SS.columns[v].uom_field_name]	= $.trim(sheets[j][i][ds_Volumetrics_SS.columns[v].uom_field_name])
                    }
                    
                }
                
                				
				// Load Imported Spreadsheet into spreadsheetLanes Array
				x = spreadsheetLanes.length;
				spreadsheetLanes[x] = {};
				spreadsheetLanes[x].custrefno = sheets[j][i]["cust seq id"];
				spreadsheetLanes[x].custlaneNum = sheets[j][i]["lane #"];
				spreadsheetLanes[x].origin = sheets[j][i]["origin"];
				spreadsheetLanes[x].originValid = "";
				spreadsheetLanes[x].destination = sheets[j][i]["destination"];
				spreadsheetLanes[x].destinationValid = "";
				spreadsheetLanes[x].idpqlandtl = sheets[j][i]["lane id"];
				// Load Changed UOM, Rate,Minimum Charge and Workflow Status for Existing Lane
				if (spreadsheetLanes[x].idpqlandtl != ""){
					spreadsheetLanes[x].type = "Chg";
					spreadsheetLanes[x].proposeduom = sheets[j][i]["priced uom"];
					var workUOM = spreadsheetLanes[x].proposeduom.toUpperCase();
					spreadsheetLanes[x].proposeduom = workUOM;
					spreadsheetLanes[x].uomValid = "";
					spreadsheetLanes[x].proposedrate = sheets[j][i]["priced rate"];
					spreadsheetLanes[x].rateValid = "";
					spreadsheetLanes[x].priminchr = sheets[j][i]["priced mininum"];
					spreadsheetLanes[x].minChrValid = "";
					spreadsheetLanes[x].workflowstatus = sheets[j][i]["lane status"];
					spreadsheetLanes[x].workflowstatusdesc = "";
					spreadsheetLanes[x].workflowstatuscode = "";
					spreadsheetLanes[x].workflowstatusValid = "";
                    spreadsheetLanes[x].pricedfscuom = sheets[j][i]["priced fsc uom"];
                    workUOM = spreadsheetLanes[x].pricedfscuom.toUpperCase();
                    spreadsheetLanes[x].pricedfscuom = workUOM;
                    spreadsheetLanes[x].pricedfscrate = sheets[j][i]["priced fsc rate"];
                    spreadsheetLanes[x].pricedmxcarrierrate = sheets[j][i]["priced mx carrier rate"];
                    spreadsheetLanes[x].pricedmxfsc = sheets[j][i]["priced mx fsc"];
                    spreadsheetLanes[x].pricedmxbordercrossingfee = sheets[j][i]["priced mx border crossing fee"];
					
				} else {
					// New Lane - UOM, Rate & Minimum Charge Not Imported
					spreadsheetLanes[x].type = "New";
					spreadsheetLanes[x].proposeduom = "";
					spreadsheetLanes[x].uomValid = "";
					spreadsheetLanes[x].proposedrate = "";
					spreadsheetLanes[x].rateValid = "";
					spreadsheetLanes[x].priminchr = "";
					spreadsheetLanes[x].minChrValid = "";
					spreadsheetLanes[x].idpqlandtl = "";
					spreadsheetLanes[x].workflowstatus = "New";
					spreadsheetLanes[x].workflowstatusdesc = "New";
					spreadsheetLanes[x].workflowstatuscode = "";
				}
                // Add Volumetrics Columns and Values to spreadsheetLanes 
                for (var v = 0; v < ds_Volumetrics_SS.columns.length; v++) {

                    spreadsheetLanes[x][ds_Volumetrics_SS.columns[v].vol_field_name] = 
                        sheets[j][i][ds_Volumetrics_SS.columns[v].vol_field_name];
                    
                    spreadsheetLanes[x][ds_Volumetrics_SS.columns[v].uom_field_name] =
                        sheets[j][i][ds_Volumetrics_SS.columns[v].uom_field_name];

                }
                
				// Add Columns needed, not provided in Import
				spreadsheetLanes[x].originsource = ""; 
				spreadsheetLanes[x].originidcity= 0;
				spreadsheetLanes[x].origincityname="";
				spreadsheetLanes[x].originidcounty= 0;
				spreadsheetLanes[x].origincountyname="";
				spreadsheetLanes[x].originstate="";
				spreadsheetLanes[x].origincountry="";
				spreadsheetLanes[x].originidzip=0;
				spreadsheetLanes[x].originzipcode="";
				spreadsheetLanes[x].originzone="";
				spreadsheetLanes[x].originidregion=0;
				spreadsheetLanes[x].destinationsource= ""; 
				spreadsheetLanes[x].destinationidcity= 0;
				spreadsheetLanes[x].destinationcityname="";
				spreadsheetLanes[x].destinationidcounty= 0;
				spreadsheetLanes[x].destinationcountyname="";
				spreadsheetLanes[x].destinationstate="";
				spreadsheetLanes[x].destinationcountry="";
				spreadsheetLanes[x].destinationidzip=0;
				spreadsheetLanes[x].destinationzipcode="";
				spreadsheetLanes[x].destinationzone="";
				spreadsheetLanes[x].destinationidregion=0;
				spreadsheetLanes[x].selectedForMassUpdate = false;
				spreadsheetLanes[x].selectedToPublish = false;
				spreadsheetLanes[x].auditreslt = "";
				spreadsheetLanes[x].auditdate = "";
				spreadsheetLanes[x].saveType = "";
                
				spreadsheetLanes[x].saveProposedUOM = "";
				spreadsheetLanes[x].saveProposedRate = "";
				spreadsheetLanes[x].savePriMinChr = "";
                spreadsheetLanes[x].savePricedFscUOM = "";
                spreadsheetLanes[x].savePricedFscRate = "";
                spreadsheetLanes[x].savePricedMxCarrierRate = "";
                spreadsheetLanes[x].savePricedMxFsc;
                spreadsheetLanes[x].savePricedMxBorderCrossingFee;
                spreadsheetLanes[x].saveWorkFlowStatus = "";
				
			}
		}
	}
	// Validates Imported Spread sheet & Rebuilds Lane List
   	importMode = true;
	validateSpreadSheetLanes();
		
	$("#listDropIcon").addClass("close");
	
	$("#laneListEditorMask").fadeTo("fast", 1, function(){
		$("#laneListEditor, #laneListEditorMask").css("display", "none");
	});
    
    // Disable Action Buttons During Import & Do Not Fade Out Buttons
    disableActions(false);
    
}

function validateSpreadSheetLanes(statusBar){
	$("#saveRates").addClass("disabled");
	
	for (var x = 0; x < spreadsheetLanes.length; x++) { 
		
		// Geo Validation for New Lanes
		if (spreadsheetLanes[x].type == "New" && spreadsheetLanes[x].originValid == ""){
			spreadsheetGeoValidate(spreadsheetLanes[x], function(){
				var $progressGoal = $(".hoverMask .fileSize > .progressGoal");
				var $progressCount = $(".hoverMask .fileSize > .progressCount");
				var $progressBar = $(".hoverMask .progressBar > div");
				
				spreadsheetLoadingCount++;
				var newWidth = (spreadsheetLoadingCount/spreadsheetLanes.length)*95;
				
				$progressGoal.html(spreadsheetLanes.length);
				$(".hoverMask .fileSize").show();
				$progressBar.animate({ width: newWidth + "%" }, 50, function(){
					var loadingCount = parseInt($progressCount.text());
					
					$progressCount.html(++loadingCount);
					if (loadingCount == spreadsheetLanes.length){
						addImportToLanes();
					}
				});
			});
		};
		
		// Update Existing UOM, Rate, and/or Minimum Charge 
		if (spreadsheetLanes[x].type == "Chg" && spreadsheetLanes[x].rateValid == "" ){
			spreadsheetRatesValidate(spreadsheetLanes[x], x, function(){
				var $progressGoal = $(".hoverMask .fileSize > .progressGoal");
				var $progressCount = $(".hoverMask .fileSize > .progressCount");
				var $progressBar = $(".hoverMask .progressBar > div");
				
				spreadsheetLoadingCount++;
				var newWidth = (spreadsheetLoadingCount/spreadsheetLanes.length)*95;
				
				$progressGoal.html(spreadsheetLanes.length);
				$(".hoverMask .fileSize").show();
				$progressBar.animate({ width: newWidth + "%" }, 50, function(){
					var loadingCount = parseInt($progressCount.text());
					
					$progressCount.html(++loadingCount);
					if (loadingCount == spreadsheetLanes.length){
						addImportToLanes();
					}
				});
			});
		}
			
		
	};
	function addImportToLanes(){
		
		spreadsheetLoadingCount = 0;
		
		// Add Imported Spread Sheet to Lanes 
		for (var i = 0; i < spreadsheetLanes.length; i++) {
			
			// Add New Lanes 
			if (spreadsheetLanes[i].type == "New"){
				var y = lanes.length;
				lanes[y] = spreadsheetLanes[i];
				lanes[y].lanenumber = y + 1;
				lanes[y].idpqlandtl = 0;
			} else {
				// Update Rates in Existing Lane
				for (var x = 0; x < lanes.length; x++) {
					if (spreadsheetLanes[i].idpqlandtl == lanes[x].idpqlandtl){
						lanes[x].saveQuoteType = lanes[x].type;
						lanes[x].quoteType = lanes[x].type;
						lanes[x].saveType = lanes[x].type;
						lanes[x].type = "Chg";
						// Save Fields are used to restore the fields if user cancels the import.
						lanes[x].saveProposedRate = lanes[x].proposedrate;
						lanes[x].proposedrate = spreadsheetLanes[i].proposedrate;
						lanes[x].rateValid = spreadsheetLanes[i].rateValid;
						
						lanes[x].saveProposedUOM = lanes[x].proposeduom;
						lanes[x].proposeduom = spreadsheetLanes[i].proposeduom;
						lanes[x].uomValid = spreadsheetLanes[i].uomValid;
						
						lanes[x].saveWorkFlowStatus = lanes[x].workflowstatus;
						lanes[x].workflowstatus = spreadsheetLanes[i].workflowstatus;
						lanes[x].workflowstatuscode = spreadsheetLanes[i].workflowstatuscode;
						lanes[x].workflowstatusValid = spreadsheetLanes[i].workflowstatusValid;
						
						lanes[x].savePriMinChr = lanes[x].priminchr;
						lanes[x].priminchr = spreadsheetLanes[i].priminchr;
						lanes[x].minChrValid = spreadsheetLanes[i].minChrValid;
                        
                        lanes[x].savePricedFscRate = lanes[x].pricedfscrate;
                        lanes[x].pricedfscrate = spreadsheetLanes[i].pricedfscrate;
                        
                        lanes[x].savePricedFscUOM = lanes[x].pricedfscuom;
                        lanes[x].pricedfscuom = spreadsheetLanes[i].pricedfscuom;
                        
                        lanes[x].savePricedMxCarrierRate = lanes[x].pricedmxcarrierrate;
                        lanes[x].pricedmxcarrierrate = spreadsheetLanes[i].pricedmxcarrierrate;
                        
                        lanes[x].savePricedMxFsc = lanes[x].pricedmxfsc;
                        lanes[x].pricedmxfsc = spreadsheetLanes[i].pricedmxfsc;
                        
                        lanes[x].savePricedMxBorderCrossingFee = lanes[x].pricedmxbordercrossingfee;
                        lanes[x].pricedmxbordercrossingfee = spreadsheetLanes[i].pricedmxbordercrossingfee;
                        
                        // Update Volumetrics in Lanes
                        for (var v = 0; v < ds_Volumetrics_SS.columns.length; v++) {

                            lanes[x][ds_Volumetrics_SS.columns[v].vol_field_name] = 
                                spreadsheetLanes[i][ds_Volumetrics_SS.columns[v].vol_field_name];
                            
                            lanes[x][ds_Volumetrics_SS.columns[v].uom_field_name] = 
                                spreadsheetLanes[i][ds_Volumetrics_SS.columns[v].uom_field_name];
                        }
						break;
					}
				}
			}
			
			if (((spreadsheetLanes[i].type == "New") && (spreadsheetLanes[i].originValid != "true" || spreadsheetLanes[i].destinationValid != "true"))
					|| ((spreadsheetLanes[i].type == "Chg") && (spreadsheetLanes[i].rateValid != "true" || spreadsheetLanes[i].uomValid != "true" || spreadsheetLanes[i].minChrValid != "true"
						|| spreadsheetLanes[i].workflowstatusValid != "true" )	)){
				importErrors = true;
			}
		};
		
		// Rebuild Lane List
		rebuildLaneListDatatable();
								
		clearLoadedRow();
		
		if (!importErrors && saveAuthorized == true){
			$("#saveRates").removeClass("disabled");
		}
		
		window.setTimeout(function(){
			$(".hoverMask").fadeOut(function(){
				$(".hoverMask .fileSize").hide();
				$(".hoverMask").css("background-image", "url(/applications/pricing/images/dropHere.png)");
				var $progressBar = $(".hoverMask .progressBar > div");
				$progressBar.parents(".statusBar").remove();
			});
		}, 500);
	};
	
}
function spreadsheetRatesValidate(spreadSheet, laneIndex, callback){
	var rule_ratedecimals = 0;
	var decimal_mult;
	// Validate Rate is Numeric
	spreadSheet.rateValid = "true";
	
	// Validate Minimum Charge is Numeric
	spreadSheet.minChrValid = "true";
	
	// Validate UOM
	spreadSheet.uomValid = "true";
	
	// Validate Work Flow Status - cannot be blanks
	if (spreadSheet.workflowstatus == ""){
		spreadSheet.workflowstatusValid = "false";
	} else {
		
		// Validate Status 
		spreadSheet.workflowstatusValid = "false";
		for (var w = 0; w < workFlowStatus_values.length; w++) { 
        	if (workFlowStatus_values[w].desc.toUpperCase() == spreadSheet.workflowstatus.toUpperCase()){
        		spreadSheet.workflowstatusValid = "true";
        		spreadSheet.workflowstatuscode = workFlowStatus_values[w].code;
        		spreadSheet.workflowstatusdesc = workFlowStatus_values[w].desc;
        		// Change workflowstatus to short desc
        		spreadSheet.workflowstatus = workFlowStatus_values[w].sdesc;
        		break;
           	};
        }
		
		if (spreadSheet.workflowstatusValid == "true"){
			if (lanes.length > 0){
				// Error - when quote is a Spot, or current status is TBP, Pub, Cmp
				if ((lanes[laneIndex].type == "Spot" ||
						(lanes[laneIndex].workflowstatus == "TBP" || 
								lanes[laneIndex].workflowstatus == "Pub" || 
								lanes[laneIndex].workflowstatus == "Cmp")) && lanes[laneIndex].workflowstatus != spreadSheet.workflowstatus){
					spreadSheet.workflowstatusValid = "false";
				} else {
					// Error - Cannot change work flow status to Published
					if (spreadSheet.workflowstatus == "Pub" && lanes[laneIndex].workflowstatus != spreadSheet.workflowstatus){
						spreadSheet.workflowstatusValid = "false";
					}
					// Quote is not priced, status are not valid: Load Moved, To Be Published and Sent for Signature
					if (spreadSheet.proposedrate == ""  && 
							(spreadSheet.workflowstatus == "Mov" || spreadSheet.workflowstatus == "TBP" || spreadSheet.workflowstatus == "Sig")){
						spreadSheet.workflowstatusValid = "false";
					}		
				}
			}
				
		}
	}
		

	// Validate Linehaul Rate and Unit of Measure
	if ( spreadSheet.proposedrate  != "" ){
		if (! $.isNumeric(spreadSheet.proposedrate)){
			// Rate must be numeric
			spreadSheet.rateValid = "false";
		}	
		if (spreadSheet.proposeduom == ""){
			// UOM Required when Rate Exists
			spreadSheet.uomValid  = "false";
		}
	} else {
		if (spreadSheet.proposeduom != ""){
			// Rate Required when UOM Exists
			spreadSheet.rateValid  = "false";
		}
	}
	
	// Validate UOM using Rules for LineCode 100
	if (spreadSheet.proposeduom != ""){
		spreadSheet.uomValid  = "false";
		// Validate UOM and Find Rate Grid Decimal Precision Rule for Line Code
		for (r = 0; r < rules.length; r++) { 
        	if ((rules[r].linecode == "100") && (rules[r].uom == spreadSheet.proposeduom) 
        		&& (rules[r].linecodetype == "F")){
        		spreadSheet.uomValid  = "true";
        		rule_ratedecimals = rules[r].ratedecprc;
        		break;
        	};
        }
	}
	
	
	if (spreadSheet.proposedrate != "" && spreadSheet.rateValid == "true" && spreadSheet.uomValid == "true"){
		// Format Rate in Correct Decimal Precision
		// Calculate Decimal Precision Multiplier
        if (rule_ratedecimals == 0){
	      	decimal_mult = 1;
	    } else {
	    	decimal_mult = Math.pow(10,rule_ratedecimals)
	    };
	  // Replace Line Haul Rate with Correct Decimal Rate
	    var formattedRate = ((spreadSheet.proposedrate * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
	    spreadSheet.proposedrate = formattedRate;
	}
	
	// Validate Minimum Charge
	if ( spreadSheet.priminchr != "" ){
		if (! $.isNumeric(spreadSheet.priminchr)){
			// Minimum Rate must be numeric
			spreadSheet.minChrValid = "false";
		} else {
			// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM - Min Charge uses Line 100 & F/R
        	rule_ratedecimals = 0;
            for (r = 0; r < rules.length; r++) { 
            	if ((rules[r].linecode == "100") && (rules[r].uom == "F/R")
            		&& (rules[r].linecodetype == "F")){
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
    	    var formattedRate = ((spreadSheet.priminchr * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
    	    spreadSheet.priminchr = formattedRate;
		
		}
	}
    // Validate Extra Charges to Upload: Fuel Surcharge, Fuel Surcharge UOM, MX Carrier Rate, MX Fuel Surcharge Rate,
    // MX Border Crossing Fee.  Change invalid fields to blanks because extra charges are not available to
    // edit by the user on the grid.
    
    // FSC Rate
    if ( spreadSheet.pricedfscrate != "" ){
        
        if (! $.isNumeric(spreadSheet.pricedfscrate) || spreadSheet.pricedfscuom == ""){
            // FSC Rate must be numeric and FSC UOM Required - blank the field.
            spreadSheet.pricedfscrate = "";
            spreadSheet.pricedfscuom = "";
        } else {
            // Validate UOM and Find Rate Grid Decimal Precision Rule for Line Code
            var validFcsUOM = false;
            for (r = 0; r < rules.length; r++) { 
                if ((rules[r].linecode == "150") && (rules[r].uom == spreadSheet.pricedfscuom)
                	&& (rules[r].linecodetype == "F")){
                    validFcsUOM = true;
                    rule_ratedecimals = rules[r].ratedecprc;
                    break;
                };
            }
            if (validFcsUOM){
                // Calculate Decimal Precision Multiplier
                if (rule_ratedecimals == 0){
                    decimal_mult = 1;
                } else {
                    decimal_mult = Math.pow(10,rule_ratedecimals)
                }
                // Replace FSC Rate with Correct Decimal Rate
                var formattedRate = ((spreadSheet.pricedfscrate * decimal_mult) / decimal_mult).toFixed(rule_ratedecimals);
                spreadSheet.pricedfscrate = formattedRate;    
            }else{
                // Invalid UOM - Blank out Rate and UOM
                spreadSheet.pricedfscrate = "";
                spreadSheet.pricedfscuom = "";
            }
            
        }
    } else {
        // FSC Rate = Blanks, blank out FSC UOM
        spreadSheet.pricedfscuom = "";    
    }
    
    // MX Carrier Rate
    if (spreadSheet.pricedmxcarrierrate != ""){
        if (! $.isNumeric(spreadSheet.pricedmxcarrierrate)){
            spreadSheet.pricedmxcarrierrate = "";       
        }
    }
    
    // MX Fuel Surcharge
    if (spreadSheet.pricedmxfsc != ""){
        if (! $.isNumeric(spreadSheet.pricedmxfsc)){
            spreadSheet.pricedmxfsc = "";       
        }
    }
    
    // MX Border Crossing Fee
    if (spreadSheet.pricedmxbordercrossingfee != ""){
        if (! $.isNumeric(spreadSheet.pricedmxbordercrossingfee)){
            spreadSheet.pricedmxbordercrossingfee = "";       
        }
    }

    //Note: Volumetrics are validated in the server update procedure.  
    // User is not allowed to in-line edit volumetrics. 
    
        
            
	if (callback) {
		callback();
	}
}

/*function markLaneListErrors(){
	$("#laneListTable > tbody > tr > td").removeClass("invalidField");
	for (var i = 0; i < lanes.length; i++) {
		if (lanes[i].type == "New"){
			if (lanes[i].originValid == "true") {
				
			} else {
				setLaneGeoInvalid(lanes[i].lanenumber, 2);
			};
			if (lanes[i].destinationValid == "true") {
				
			} else {
				setLaneGeoInvalid(lanes[i].lanenumber, 3);
			};
		};
	};
	if (!importErrors && saveAuthorized == true){
		$("#saveRates").removeClass("disabled");
	}
}

function setLaneGeoInvalid(lane, columnNumber) {
	$("#laneListTable > tbody > tr").each(function() {
		if ($(this).find("td:first-child").html() == lane) {
			$(this).find("td:nth-child(" + columnNumber + ")").addClass("invalidField");
			importErrors = true;
		}
	});
}
function removeLaneGeoInvalid(lane, columnNumber) {
	$("#laneListTable > tbody > tr").each(function() {
		if ($(this).find("td:first-child").html() == lane) {
			$(this).find("td:nth-child(" + columnNumber + ")").removeClass("invalidField");
		}
	});
}*/


// Request XLSX copy of lane list
function downloadSpreadsheet(proposal, callback){
	var errMessage;
	var error = false;
	var i = -1;
	var url;


	// Build URL 
	url = "PQxml.pgm?" +
	"Func=Spreadsheet&quotenum=" + proposal;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		async: true,
		success: function(xml) {

			// Check for Success
			errMessage = $(xml).find('Error').attr('message');
			
			$("#propMessageSpinner").css("display", "none");
			$("#propMessage").hide();
			
			if (errMessage){
				error = true;
				alert(errMessage);
			} else {
				var xlsFileName = $(xml).find('export').text();
				var $link = $("<a href='/applications/_globalTemp/" + xlsFileName + "'></a>");
				var ifr = $('<iframe />').attr('src', $link.attr('href')).hide().appendTo($("body"));
            	setTimeout(function () {ifr.remove();}, 5000);
		
			}
            if (callback) {
                callback();
            }
		},

		complete: function() {
			//if (callback) {
//				callback();
//			}
			
			// Reactivate DownLoad Button
			//$("#downloadButton").removeClass("disabled");
			// Reactivate Mass Update Button if Authorized
			//if (saveAuthorized == true){
            //    $("#massUpdateButton").removeClass("disabled");
//			//	$("#publishButton").removeClass("disabled");
				//$("#auditButton").removeClass("disabled");
			//}
            //if (publishAuthorized == true){
            //    $("#publishButton").removeClass("disabled");
            //}
		},

		error: function(jqXHR, errorStatus, errorMessage) {
			
		}
	});
}


function retrieveVolumetricsColumns(callback){
    // Retrieve Columns for New/Updated Volumetrics for Spreadsheet 
    //var url = "/applications/Pricing/XML/volumetrics_columns.json";  
    // VOLUMECOLUMNNAMES 
    
    // Build URL to Retrieve Volumetrics Columns
    var url = "PQxml.pgm?" +
        "Func=VOLUMECOLUMNNAMES";
    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",

        success: function(volumetricsColumns){
            ds_Volumetrics_SS = volumetricsColumns;

            if (callback) {
                callback();
            }
        },

        complete: function() {

        },

        error: function(jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort"){
            }
        }
    });



}