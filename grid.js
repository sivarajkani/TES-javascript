// JavaScript Document
//-----------------------------------------------------------
// RMS Rate Grid Functions
//-----------------------------------------------------------	
	function buildRateGrid() {
			
		// Build a new SlickGrid object
		rateDataView = new Slick.Data.DataView({ inlineFilters: true });
		rateGrid = new Slick.Grid("#rateGrid", rateDataView, rateColumns, rateOptions);
		
		rateGrid.setSelectionModel(new Slick.RowSelectionModel());
		
		// wire up model events to drive the grid
		rateDataView.onRowCountChanged.subscribe(function (e, args) {
			rateGrid.updateRowCount();
			rateGrid.render();
		});
		
		rateDataView.onRowsChanged.subscribe(function (e, args) {
			rateGrid.invalidateRows(args.rows);
			rateGrid.render();
		});
			
		rateDataView.getItemMetadata = function(row){
			var item = rateDataView.getItem(row);
			if(item.linecodetype == "D") {
				return { cssClasses: 'deficitDetail' };
			}
		};
		
		// Determine if Quantity can be Edited according to the Rules for Line Code & UOM
		rateGrid.onBeforeEditCell.subscribe(function(e,args) {
            // Inquiry ONLY Authority - Block ALL entry of UOM, Price & Quantity
            if (inquiryOnly || ds_Auth.authorityLevel == "9"){
                return false;                
               
            } else {
            	switch (args.item.linecodetype){
            	// Deficit Codes
            	case "D":
            		switch (args.column.name){
            		case "Priced UOM":
                   		// Determine if UOM Deficit can be Edited
                		for (var i = 0; i < deficitRules.length; i++) { 
                			if (deficitRules[i].code == args.item.linecode){
                				if (deficitRules[i].change_Value_Allowed == "Y"){
                					return true;
                				} else {
                					return false;
                				}
                			}
                		}
                      		  
            		case "Priced Qty":
            			// Determine if Quantity can be Edited according to the Rules for Line Code & UOM
            			for (var i = 0; i < rules.length; i++) { 
            				if ((rules[i].linecode == args.item.linecode) && (rules[i].uom == args.item.propuom)
            					&& (rules[i].linecodetype == args.item.linecodetype)){
            					if ((rules[i].updqty == "N")){ 
            						return false;
            					} else {
            						return true;
            					}
            				}
            			}

            		case "Priced Rate":
            			// Determine if Deficit Charges can be Edited
            			for (var i = 0; i < deficitRules.length; i++) { 
            				if (deficitRules[i].code == args.item.linecode){
            					if (deficitRules[i].change_Value_Allowed == "Y"){
            						return true;
            					} else {
            						return false;
            					}
            				}
            			}

            		default:
            			return false;

            		}

            		break;
            		// Freight Codes	
            	case "F":
            		// Determine if Quantity can be Edited according to the Rules for Line Code & UOM
            		for (var i = 0; i < rules.length; i++) { 
            			if ((rules[i].linecode == args.item.linecode) && (rules[i].uom == args.item.propuom)
            				&& (rules[i].linecodetype == args.item.linecodetype)){
            				if ((rules[i].updqty == "N") && (args.column.name == "Priced Qty")){ 
            					return false;
            				} else {
            					return true;
            				}
            			}
            		};
            		
            		break;
            	};
            }
     
            
		});
		
		
		rateGrid.onSort.subscribe(function (e, args) {
			var cols = args.sortCols;
			
			rateDataView.sort(function (dataRow1, dataRow2) {
				for (var i = 0, l = cols.length; i < l; i++) {
					var field = cols[i].sortCol.field;
					var sign = cols[i].sortAsc ? 1 : -1;
					var value1 = dataRow1[field], value2 = dataRow2[field];
					var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
					
					if (result != 0) {
						return result;
					}
				}
				
				return 0;
			});
			rateGrid.invalidate();
			rateGrid.render();
		});

		
		
		// show the rate info grid when they click on the Item# column
		rateGrid.onClick.subscribe(function (e, args) {
			var cell = rateGrid.getCellFromEvent(e);
			var row = cell.row;
			
			var column = rateGrid.getColumns(e);
			var clickedcolumn = column[cell.cell].name;
			
			var thisItem = rateDataView.getItem(row); 
			var thisIdx = thisItem.id.slice(7);
			
			
			switch (clickedcolumn){
			case "Item#":
				// Display Charge Item Rate Details
				// adjustment is necessary because body element
				// is only 95% of screen size
				var left = ($(document).width() - $('body').width()) / 2;
				$("#deficitInfo").hide();
				$("#rateInfo")
				.css("top", e.pageY)
				.css("left", e.pageX - left)
				.show();

				$("#pricingid").html(chrg[thisIdx].pricingid);
				$("#linecode").html(chrg[thisIdx].linecode);
				if (chrg[thisIdx].linecodetype == 'D'){
					$("#description").html("Deficit-" + chrg[thisIdx].description);
				} else {
					$("#description").html(chrg[thisIdx].description);
				}
				$("#rmssection").html(chrg[thisIdx].rmssection);
				$("#rmsitem").html(chrg[thisIdx].rmsitem);
				$("#rmsqty").html(chrg[thisIdx].rmsqty);
				$("#rmsuom").html(chrg[thisIdx].rmsuom);
				$("#rmsrate").html(chrg[thisIdx].rmsrate);
				$("#rmsamount").html(chrg[thisIdx].rmsamount);
				$("#rmsminchg").html(chrg[thisIdx].rmsminchg);
				$("#puborigin").html(chrg[thisIdx].puborigin);
				$("#pubdest").html(chrg[thisIdx].pubdest);			
				$("#scaleprcid").html(chrg[thisIdx].scaleprcid);
				$("#scaleqty").html(chrg[thisIdx].scaleqty);
				$("#scaleuom").html(chrg[thisIdx].scaleuom);
				$("#scalerate").html(chrg[thisIdx].scalerate);
				$("#scaleamt").html(chrg[thisIdx].scaleamt);			
				$("#scaleorigin").html(chrg[thisIdx].scaleorigin);
				$("#scaledest").html(chrg[thisIdx].scaledest);
				break;
			case "Charge Type":
				$("#rateInfo").hide();
				// Display Expanded Deficit Description 
				if (chrg[thisIdx].linecodetype == "D"){
					var deficitToolTip = "";
					// Find Deficit Rule to Display Description
					for (var i = 0; i < deficitRules.length; i++) { 
						if (deficitRules[i].code == chrg[thisIdx].linecode){
							deficitToolTip = deficitRules[i].tooltip;
							break;
						};
					}
					$("#deficitInfo").html(deficitToolTip);
					$("#deficitInfo").css("top", e.pageY).css("left", e.pageX).show();
				} else {
					$("#deficitInfo").hide();
				}
				break;
			default:
				$("#rateInfo").hide();
				$("#deficitInfo").hide();
				break;
			}
  
		});
	}
	
	// Total Rate
	function updateRateTotal() {
		var displayTotal = Number($("#rateTotal").text().split("+")[1])*100; // convert to whole numbers to prevent javascript rounding errors
		var rateTotal = 0;
		var rawAmount = 0;
		var pubTotal = 0;
		var scaleTotal = 0;
		var gridLineCodeType;
		
		
		for (var i=0; i < rateDataView.getLength(); i++){
			// Exclude Deficit Code Charges in Totals
			gridLineCodeType = rateDataView.getItem(i).linecodetype;
			if (gridLineCodeType != "D"){
				rawAmount = rateDataView.getItem(i).propamt;
				if (rawAmount != ""){
					rateTotal += Number(rawAmount) * 100;
				}
			}
		}
			
		$("#rateTotal > span").html(
			(rateTotal/100).toFixed(2),
			{
				duration:500,
				animateOpacity:false,
				intStepDecimals:2,
				intEndDecimals:2,
				floatStepDecimals:2,
				floatEndDecimals:2,
				showPositive:true
			}
		);
		
		for (var x=0; x < chrg.length; x++){
			// Exclude Deficit Code Charges in Totals
			if (chrg[x].linecodetype != "D"){
				// Accumulate Scale Total
				rawAmount = chrg[x].scaleamt;
				if (rawAmount != ""){
					scaleTotal += Number(rawAmount) * 100;
				}
				// Accumulate Published Total
				rawAmount = chrg[x].rmsamount;
				if (rawAmount != ""){
					pubTotal += Number(rawAmount) * 100;
				}
			}
		}
		$("#scaleTotalHdr").html("Scale Total:");
		$("#scaleTotalAmt").html(
			(scaleTotal/100).toFixed(2),
				{
				 	duration:500,
					animateOpacity:false,
					intStepDecimals:2,
					intEndDecimals:2,
					floatStepDecimals:2,
					floatEndDecimals:2,
					showPositive:true
				}
			);
		$("#publishTotalHdr").html("Published Total:");
		$("#publishTotalAmt").html(
				(pubTotal/100).toFixed(2),
				{
				 	duration:500,
					animateOpacity:false,
					intStepDecimals:2,
					intEndDecimals:2,
					floatStepDecimals:2,
					floatEndDecimals:2,
					showPositive:true
				}
			);
		
	}
	function updateFilter() {
	    dataView.setFilterArgs({
	      percentCompleteThreshold: percentCompleteThreshold,
	      searchString: searchString
	    });
	    dataView.refresh();
	  }
		

