//AJAX


function retrieveAnalytics(action,callback){
    var post_Analytics,
        url;
    
    
    
    if ($("#aMask").css('display') != "block"){
        $("#aMask").css('display', 'block');
        analyticsCL.show();
        $("#analyticsSpinner").css('display','block');
    }
    
    // Update ds_Analytics with Lane Geography and Customer 
    analyticsLaneGeo();
    ds_Analytics.action = action;

    post_Analytics = JSON.stringify(ds_Analytics);
    url = "PQxml.pgm?Func=GetAnalytics&quotenum=" + quotenum + "&lane=" + lanenumber;

    // Abort active get analytics request if one is in progress
    if(getAnalyticsXHR && getAnalyticsXHR.readyState != 4){
        getAnalyticsXHR.abort();
    }

    getAnalyticsXHR = 
    $.ajax({
        url: url,
        method: "POST",
        data: post_Analytics,
        processData: false,
        dataType: "json",
        async: true,
        cache: false,
        timeout: 60000,
        success: function(analytics){
            ds_Analytics = analytics;
            // Update Sandbox DS values 
            ds_Sandbox.propRate = ds_Analytics.proprate;
            ds_Sandbox.mileageadjustment = ds_Analytics.mileageadjustment;
            ds_Sandbox.operatingRatio = ds_Analytics.operatingratio;
            ds_Sandbox.or2leg = ds_Analytics.or2leg;
            ds_Sandbox.or3leg = ds_Analytics.or3leg;

            ds_Analytics.action = action;
        
            if (callback) {
            callback();
            }
        },

        complete: function() {
        	
           if ($("#aMask").css('display') == "block"){
                $("#aMask").css('display', 'none');
                analyticsCL.hide();
                $("#analyticsSpinner").css('display','none');
            };
        },

        error: function(jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort"){
            }
        }
    });


}
function saveAnalytics(quotenum,callback){
    var post_Analytics,
        url;

    ds_Analytics.laneId = idpqlandtl;
    
    // Update ds_Analytics with Lane Geography and Customer 
    analyticsLaneGeo();
    ds_Analytics.action = 'SAVE';
    
    // Update ds_SandBox with Analytic Values 
    analyticsSandboxValues();
    // Update ds_Analytics with Sandbox Values
    ds_Analytics.sandboxRate = ds_Sandbox.propRate;
    ds_Analytics.sandboxOR = ds_Sandbox.operatingRatio; 
    ds_Analytics.sandboxMiles = ds_Sandbox.mileageadjustment;
    ds_Analytics.sandboxGroup = ds_Sandbox.groupid;
    
 
    url = "PQxml.pgm?Func=ANALYTICSSAVE&quotenum=" + quotenum;
    post_Analytics = JSON.stringify(ds_Analytics);


    $.ajax({
        url: url,
        method: "POST",
        data: post_Analytics,
        processData: false,
        dataType: "json",
        async: true,
        cache: false,
        timeout: 60000,
        success: function(response){
            // Update ds_Analytics with Selection Id and Group Sums Id(Core Stats ID)
            if (response.success){
                ds_Analytics.selectionId = response.selectionId;
                if (response.GROUP.length > 0){
                    for (var i=0; i < response.GROUP.length; i++){
                        if (response.GROUP[i].groupId != "0"){
                            if (response.GROUP[i].groupId = ds_Analytics.GROUP[i].groupId){
                                ds_Analytics.GROUP[i].groupSumsId = response.GROUP[i].groupSumsId;
                            }
                        }
                    }
                };
            } else {
                Alert(response.errmsg);
           };
            if (callback) {
                callback();
            }
        },

        complete: function() {

        },

        error: function(jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort"){
                alert('Errors updating analytics.')
            }
        }
    });

}
function retrieveAnalyticsTabLayout(callback){

    var url = "/applications/Pricing/XML/analytics_tab.json";  

    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",

        success: function(analyticTab){
            ds_AnalyticTabLayout = analyticTab;
            
            if (callback) {
                callback();
            }
        },

        complete: function() {

        },

        error: function(jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort"){
                alert(errorMessage);
            }
        }
    });



}
function calcAnalyticSandbox(whatChanged,callback){
    var post_Sandbox,
        url;

    // Update ds_SandBox with Analytic Values 
    analyticsSandboxValues();
    ds_Sandbox.whatChanged = whatChanged;

    post_Sandbox = JSON.stringify(ds_Sandbox);
    url = "PQxml.pgm?Func=SANDBOX&quotenum=" + quotenum + "&lane=" + lanenumber;


    $.ajax({
        url: url,
        method: "POST",
        data: post_Sandbox,
        processData: false,
        dataType: "json",
        async: true,
        cache: false,
        timeout: 60000,
            success: function(sandbox){
                ds_Sandbox.propRate = sandbox.proprate;
                ds_Sandbox.operatingRatio = sandbox.operatingratio;
                ds_Sandbox.or2leg = sandbox.or2leg;
                ds_Sandbox.or3leg = sandbox.or3leg;
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

// Update Analytics Data Structure with Lane Geography and Customer
function analyticsLaneGeo(){

    // Customer Number
    ds_Analytics.cusPrefix = cusprefix;
    ds_Analytics.cusBase = cusbase;
    ds_Analytics.cusSuffix = cussuffix;

    // Lane Geography
    for (var i = 0; i < geo.length; i++) {
        switch (geo[i]["geotype"]) {
            case 'ORG':
                ds_Analytics.origCity = geo[i]["idcity"];
                ds_Analytics.origCounty = geo[i]["idcounty"];
                ds_Analytics.origZipCode= geo[i]["zipcode"];				
                ds_Analytics.origPointSrc = geo[i]["pointsrc"];	
                ds_Analytics.origState = geo[i]["state"];	
                ds_Analytics.origZone = geo[i]["zone"];	
                break;
            case 'DST':
                ds_Analytics.destCity = geo[i]["idcity"];
                ds_Analytics.destCounty = geo[i]["idcounty"];
                ds_Analytics.destZipCode= geo[i]["zipcode"];				
                ds_Analytics.destPointSrc = geo[i]["pointsrc"];	
                ds_Analytics.destState = geo[i]["state"];	
                ds_Analytics.destZone = geo[i]["zone"];	
                break;
            case 'PEN':
                ds_Analytics.entPortCity = geo[i]["idcity"];
                ds_Analytics.entPortCounty = geo[i]["idcounty"];
                ds_Analytics.entPortZipCode= geo[i]["zipcode"];				
                ds_Analytics.entPortState = geo[i]["state"];	
                ds_Analytics.entPortZone = geo[i]["zone"];	
                break;
            case 'PEX':
                ds_Analytics.extPortCity = geo[i]["idcity"];
                ds_Analytics.extPortCounty = geo[i]["idcounty"];
                ds_Analytics.extPortZipCode= geo[i]["zipcode"];				
                ds_Analytics.extPortState = geo[i]["state"];	
                ds_Analytics.extPortZone = geo[i]["zone"];	
                break;					
        }
    }

    // Rate Record Info
    if (chrg.length != 0){
        ds_Analytics.rateRecordId = chrg[0]["pricingid"];
        ds_Analytics.transitMiles = chrg[0]["rmsqty"];
        // Values used for Sandbox - Use Priced
        if (chrg[0].proprate != "0"){
            if (chrg[0].propuom == "MLS"){    
                ds_Analytics.publishedRate = chrg[0].proprate;  
                ds_Analytics.publishedFlatRate = "0";
                ds_Analytics.publishedMiles = chrg[0].propqty;
            } else {
                ds_Analytics.publishedRate = "0";
                ds_Analytics.publishedFlatRate = chrg[0].proprate;
                ds_Analytics.publishedMiles = chrg[0].rmsqty;
            }
            
        } else {
            // Priced Not Entered, Use Published
            if (chrg[0].rmsuom == "MLS"){
                ds_Analytics.publishedRate = chrg[0].rmsrate;  
                ds_Analytics.publishedFlatRate = "0";
            } else {
                ds_Analytics.publishedRate = "0";
                ds_Analytics.publishedFlatRate = chrg[0].rmsamount;
            }
            ds_Analytics.publishedMiles = chrg[0].rmsqty;
        }
        
    } else {
        ds_Analytics.rateRecordId = "0";
        ds_Analytics.transitMiles = "0";
        ds_Analytics.publishedRate = "0";
        ds_Analytics.publishedFlatRate = "0";
        ds_Analytics.publishedMiles = "0";
    }
}

function analyticsSandboxValues(){
    var groupIdx = 0;
    
    
    // Sandbox Input Fields
    ds_Sandbox.propRate = $("#propLHRPLMInput").val();
    ds_Sandbox.mileageadjustment = $("#propEmptyMilesAdjInput").val();
    ds_Sandbox.operatingRatio = $("#propOrInput").val();
    
    if (ds_Sandbox.propRate == ""){
        ds_Sandbox.propRate = "0";    
    }
    
    if (ds_Sandbox.mileageadjustment == ""){
        ds_Sandbox.mileageadjustment = "0";    
    }
    
    
    if (ds_Sandbox.operatingRatio == ""){
        ds_Sandbox.operatingRatio  = "0";    
    }
    
    ds_Sandbox.propAmount = "0";  
    
    // Calculated Fields
    ds_Sandbox.or2leg = "0";
    ds_Sandbox.or3leg = "0";
    
    // Set Group Index
    if ($("#analyticGroupCompany").hasClass("analyticButtonSelected")) {
        groupIdx = 0
    } else {
        // Customer
        groupIdx = 1
    };
        
    // Static fields from ds_Analytics
    ds_Sandbox.selectionid = ds_Analytics.selectionId;
    ds_Sandbox.groupid = ds_Analytics.GROUP[groupIdx].groupId;
    ds_Sandbox.ldcont = ds_Analytics.GROUP[groupIdx].loadCount;
    ds_Sandbox.totalexpense = ds_Analytics.GROUP[groupIdx].totalExpense;
    ds_Sandbox.dstobldcount = ds_Analytics.GROUP[groupIdx].destOBLoadCount;
    ds_Sandbox.orgibldcount = ds_Analytics.GROUP[groupIdx].originIBLoadCount;  
    ds_Sandbox.dstobexpense = ds_Analytics.GROUP[groupIdx].destOBExpense;
    ds_Sandbox.orgibexpense = ds_Analytics.GROUP[groupIdx].originIBExpense;
    ds_Sandbox.orgobexpense= ds_Analytics.GROUP[groupIdx].originOBExpense;
    ds_Sandbox.orgibrevenue = ds_Analytics.GROUP[groupIdx].originIBRev;
    ds_Sandbox.dstobrevenue = ds_Analytics.GROUP[groupIdx].destOBRev;
    ds_Sandbox.dstibrevenue = ds_Analytics.GROUP[groupIdx].destIBRev;
    ds_Sandbox.billedmiles = ds_Analytics.GROUP[groupIdx].loadedMilesBilled;
	ds_Sandbox.linehaulrev = ds_Analytics.GROUP[groupIdx].linehaulRev;
	ds_Sandbox.loadedmiles = ds_Analytics.GROUP[groupIdx].loadedMiles;
    ds_Sandbox.totalrev = ds_Analytics.GROUP[groupIdx].totalRev;
        
}

function buildAnalytics(){
    
    if (ds_Analytics.GROUP.length > 0){
        
        // Group Selection - leave as selected when action is CALC
        if (ds_Analytics.action == "CALC"){
            if ($("#analyticGroupCompany").hasClass("analyticButtonSelected")){
                groupIdx = 0;   // Company
            } else {
                groupIdx = 1;   // Customer
            }
            
        }else{
            // Set Group Selection based on UI Group ID
            var groupIdx = 1;  // Default to Customer  
            for (var y=0; y < ds_Analytics.GROUP.length; y++){
                if (ds_Analytics.uiGroupId == ds_Analytics.GROUP[y].groupId){
                    groupIdx = y;
                    if (ds_Analytics.GROUP[y].groupDesc == "COMPANY"){
                        $("#analyticGroupCompany").addClass("analyticButtonSelected");
                        $("#analyticGroupCustomer").removeClass("analyticButtonSelected");
                    } else {
                        $("#analyticGroupCompany").removeClass("analyticButtonSelected");
                        $("#analyticGroupCustomer").addClass("analyticButtonSelected");
                    }
                } 	
            }
        }
        
        // Build Analytics Tab for Selected Group - Company or Customer
        buildAnalyticsTab(groupIdx);
        
        
        
        for (i=0; i < ds_Analytics.GROUP.length; i++){
            
            // Customer Stats
            if (ds_Analytics.GROUP[i].groupDesc == 'CUSTOMER'){
                // Cost
                $("#custLoadCnt").html(
                    formatNumberWithCommas(ds_Analytics.GROUP[i].loadCount)
                );
                $("#custLoadedMi").html(
                    formatNumberWithCommas(ds_Analytics.GROUP[i].avgLoadedMiles)
                );
                $("#custAvgEmpty").html(
                    formatNumberWithCommas(ds_Analytics.GROUP[i].avgEmptyMiles)
                );
                $("#custOR").html(parseFloat(ds_Analytics.GROUP[i].operatingRatio).toFixed(2) + "%"); 
                $("#cust2LegOR").html(parseFloat(ds_Analytics.GROUP[i].operatingRatio2Leg).toFixed(2) + "%"); 
                $("#cust3LegOR").html(parseFloat(ds_Analytics.GROUP[i].operatingRatio3Leg).toFixed(2) + "%"); 
                
                $("#custRPLM").html(ds_Analytics.GROUP[i].revPerLoadedMile); 
                $("#custLHRPLM").html(ds_Analytics.GROUP[i].linehaulPerLoadedMile);
                $("#custLHRPBM").html(ds_Analytics.GROUP[i].linehaulPerBilledMile);
                $("#custCPLM").html(ds_Analytics.GROUP[i].costPerLoadedMile);
                
                $("#custYield").html(ds_Analytics.GROUP[i].yield);
                $("#custMargin").html(ds_Analytics.GROUP[i].margin);
                
                // Waste
                $("#custTransTime").html(ds_Analytics.GROUP[i].singleTransitTime);
                $("#custDwell").html(ds_Analytics.GROUP[i].avgDwell); 
                $("#custLdTime").html(ds_Analytics.GROUP[i].avgLoadTime); 
                $("#custInTransDelay").html(ds_Analytics.GROUP[i].avgIntransitDel); 
                $("#custUnldTime").html(ds_Analytics.GROUP[i].avgUnloadTime);
                
                $("#custLoaded").html(ds_Analytics.GROUP[i].avgLoadedMiles);
                $("#custChase").html(ds_Analytics.GROUP[i].avgChase);
                $("#custEmpty").html(ds_Analytics.GROUP[i].avgEmptyMiles);
                
            }
            
            // Company Stats
            if (ds_Analytics.GROUP[i].groupDesc == 'COMPANY'){
                // Origin
                $("#originOR").html(parseFloat(ds_Analytics.GROUP[i].originOBOperatingRatio).toFixed(2) + "%"); 
                $("#originIBRPLM").html(ds_Analytics.GROUP[i].originIBRevPerLoadedMile); 
                $("#originOBRPLM").html(ds_Analytics.GROUP[i].originOBRevPerLoadedMile); 

                $("#originLBFValue")
                    .html(parseFloat(ds_Analytics.GROUP[i].originLoadBalanceFactor).toFixed(2))
                    .append("<span>LBF</span>");
                $("#originIBLBF").html(ds_Analytics.GROUP[i].originIBLoadCount); 
                $("#originOBLBF").html(ds_Analytics.GROUP[i].originOBLoadCount); 

                var oPlusMinus = parseInt(ds_Analytics.GROUP[i].originIBLoadCount) -
                    parseInt(ds_Analytics.GROUP[i].originOBLoadCount);

                $("#originLBFPlusMinus").html(oPlusMinus>0 ? "+"+oPlusMinus:oPlusMinus);

                // Destination
                $("#destIBOR").html(parseFloat(ds_Analytics.GROUP[i].destIBOperatingRatio).toFixed(2) + "%");
                $("#destOBOR").html(parseFloat(ds_Analytics.GROUP[i].destOBOperatingRatio).toFixed(2) + "%"); 
                $("#destIBRPLM").html(ds_Analytics.GROUP[i].destIBRevPerLoadedMile); 
                $("#destOBRPLM").html(ds_Analytics.GROUP[i].destOBRevPerLoadedMile); 

                $("#destLBFValue")
                    .html(parseFloat(ds_Analytics.GROUP[i].destLoadBalanceFactor).toFixed(2))
                    .append("<span>LBF</span>"); 
                $("#destIBLBF").html(ds_Analytics.GROUP[i].destIBLoadCount); 
                $("#destOBLBF").html(ds_Analytics.GROUP[i].destOBLoadCount); 

                var dPlusMinus = parseInt(ds_Analytics.GROUP[i].destIBLoadCount) -
                    parseInt(ds_Analytics.GROUP[i].destOBLoadCount);

                $("#destLBFPlusMinus").html(dPlusMinus>0 ? "+"+dPlusMinus:dPlusMinus);

                // Cost
                $("#companyLoadCnt").html(
                    formatNumberWithCommas(ds_Analytics.GROUP[i].loadCount)
                );
                $("#companyLoadedMi").html(
                    formatNumberWithCommas(ds_Analytics.GROUP[i].avgLoadedMiles)
                );
                $("#companyAvgEmpty").html(
                    formatNumberWithCommas(ds_Analytics.GROUP[i].avgEmptyMiles)
                );
                
                $("#companyOR").html(ds_Analytics.GROUP[i].operatingRatio); 
                $("#company2LegOR").html(ds_Analytics.GROUP[i].operatingRatio2Leg); 
                $("#company3LegOR").html(ds_Analytics.GROUP[i].operatingRatio3Leg); 

                $("#companyRPLM").html(ds_Analytics.GROUP[i].revPerLoadedMile);
                $("#companyLHRPLM").html(ds_Analytics.GROUP[i].linehaulPerLoadedMile);
                $("#companyLHRPBM").html(ds_Analytics.GROUP[i].linehaulPerBilledMile); 
                $("#companyCPLM").html(ds_Analytics.GROUP[i].costPerLoadedMile);
                
                $("#companyYield").html(ds_Analytics.GROUP[i].yield);
                $("#companyMargin").html(ds_Analytics.GROUP[i].margin);
                
                // Waste
                $("#companyTransTime").html(ds_Analytics.GROUP[i].singleTransitTime);
                $("#companyDwell").html(ds_Analytics.GROUP[i].avgDwell); 
                $("#companyLdTime").html(ds_Analytics.GROUP[i].avgLoadTime); 
                $("#companyInTransDelay").html(ds_Analytics.GROUP[i].avgIntransitDel); 
                $("#companyUnldTime").html(ds_Analytics.GROUP[i].avgUnloadTime); 

                $("#companyLoaded").html(ds_Analytics.GROUP[i].avgLoadedMiles);
                $("#companyChase").html(ds_Analytics.GROUP[i].avgChase);
                $("#companyEmpty").html(ds_Analytics.GROUP[i].avgEmptyMiles);
                
                // MRI
                $("#mriLoadCount").html(ds_Analytics.GROUP[i].mriLoadCount);
                $("#mriCarrierCount").html(ds_Analytics.GROUP[i].mriCarrierCount);
                $("#mriAvgFSC").html(ds_Analytics.GROUP[i].mriAvgFuelSurchargeRPLM);
                $("#mriRPLM").html(ds_Analytics.GROUP[i].mriAvgTotalRPLM);
                $("#mriAvgLOH").html(ds_Analytics.GROUP[i].mriAvgLoadedMiles);
            }
        }
        
        buildGraphs();
        
        buildSandbox();
        
    }
 
}

function buildGraphs() {

//------------- LBF ------------------//

    // Set index for Customer analytics
    var analyticsGroup = ds_Analytics.GROUP[0].groupDesc == "COMPANY"?0:1;
    
    // Chart values for Load Balance Factor
    var originLBFSeries = [],
        destLBFSeries = [],
        originIBLB = parseInt(ds_Analytics.GROUP[analyticsGroup].originIBLoadCount),
        originOBLB = parseInt(ds_Analytics.GROUP[analyticsGroup].originOBLoadCount),
        destIBLB = parseInt(ds_Analytics.GROUP[analyticsGroup].destIBLoadCount),
        destOBLB = parseInt(ds_Analytics.GROUP[analyticsGroup].destOBLoadCount);
    
    // Chartist prefs for LBF
    var LBFOptions = {
        donut: true,
        donutWidth: 10,
        startAngle: -145,
        total: 100*3.75/3,
        showLabel: false
    };

    // Origin LBF Chart
    originLBFSeries[0] = parseFloat((originIBLB/(originIBLB + originOBLB)*100).toFixed(2));
    originLBFSeries[1] = parseFloat((100 - originLBFSeries[0]).toFixed(2));
    var originLBFChart = new Chartist.Pie('#originLBFGauge', {series: originLBFSeries}, LBFOptions);
    
    // Animation!!
    originLBFChart.on('draw', function(data) {
        animateDonut(data, 'originLBF');
    });

    // Dest LBF Chart
    destLBFSeries[0] = parseFloat((destIBLB/(destIBLB + destOBLB)*100).toFixed(2));
    destLBFSeries[1] = parseFloat((100 - destLBFSeries[0]).toFixed(2));
    var destLBFChart = new Chartist.Pie('#destLBFGauge', {series: destLBFSeries}, LBFOptions);
    
    // Animation!!
    destLBFChart.on('draw', function(data) {
        animateDonut(data, 'destLBFs');
    });
    
//------------ OR ---------------//    
    
    // Chart values for OR
    var custORSeries = [],
        companyORSeries = [];

    // Customer OR Data
    analyticsGroup = ds_Analytics.GROUP[0].groupDesc == "CUSTOMER"?0:1;
    custORSeries[0] = parseFloat(ds_Analytics.GROUP[analyticsGroup].operatingRatio).toFixed(2);
    custORSeries[1] = parseFloat(ds_Analytics.GROUP[analyticsGroup].operatingRatio2Leg).toFixed(2);  
    custORSeries[2] = parseFloat(ds_Analytics.GROUP[analyticsGroup].operatingRatio3Leg).toFixed(2);

    // Company OR Data
    analyticsGroup = ds_Analytics.GROUP[0].groupDesc == "COMPANY"?0:1;
    companyORSeries[0] = parseFloat(ds_Analytics.GROUP[analyticsGroup].operatingRatio).toFixed(2);
    companyORSeries[1] = parseFloat(ds_Analytics.GROUP[analyticsGroup].operatingRatio2Leg).toFixed(2);  
    companyORSeries[2] = parseFloat(ds_Analytics.GROUP[analyticsGroup].operatingRatio3Leg).toFixed(2);

    // Chartist prefs for Bar
    var ORBarOptions = {
        high: 
        Math.ceil((Math.max.apply(Math, custORSeries.concat(companyORSeries))+1) / 10) * 10 + 10,
        low: Math.max.apply(Math, custORSeries.concat(companyORSeries)) == 0?0:50
    };
    
    // Customer OR Chart
    var custORChart = new Chartist.Bar('#custORChart', {
        series: [custORSeries],
        labels: ["1-leg", "2-leg", "3-leg"]
    }, ORBarOptions);

    
    // Animation!!
    var seq = 0;

    custORChart.on('created', function() {
        seq = 0;
    });

    custORChart.on('draw', function (data) {
        addBarVals(data);

        if (data.type === 'bar') {
            data.element.attr({
                style: 'stroke-width: 10px'
            });
            var strokeWidth = 10; 

            data.element.animate({
                y2: {
                    begin: 300 + seq*100,
                    dur: 300,
                    from: data.y1,
                    to: data.y2,
                    easing: Chartist.Svg.Easing.easeOutQuint,
                },
                'stroke-width': {
                    begin: 0,
                    dur: 1,
                    from: 1,
                    to: strokeWidth,
                    fill: 'freeze',
                }
            }, true);

            seq++;
        }
    });

    // Company OR Chart
    var companyORChart = new Chartist.Bar('#companyORChart', {
        series: [companyORSeries],
        labels: ["1-leg", "2-leg", "3-leg"]
    }, ORBarOptions);

    /*companyORChart.on('draw', function(data){
        addBarVals(data);
    });*/
    
    // Animation!!
    var seq = 0;

    companyORChart.on('created', function() {
        seq = 0;
    });
    
    companyORChart.on('draw', function (data) {
        addBarVals(data);
        
        if (data.type === 'bar') {
            data.element.attr({
                style: 'stroke-width: 10px'
            });
            var strokeWidth = 10; 

            data.element.animate({
                y2: {
                    begin: 300 + seq*100,
                    dur: 300,
                    from: data.y1,
                    to: data.y2,
                    easing: Chartist.Svg.Easing.easeOutQuint,
                },
                'stroke-width': {
                    begin: 0,
                    dur: 1,
                    from: 1,
                    to: strokeWidth,
                    fill: 'freeze',
                }
            }, true);

            seq++;
        }
    });
    
//------------- WASTE ----------------//    
    
    // Chart values for Waste
    var custMileWaste = [],
        custTimeWaste = [],
        companyMileWaste =[],
        companyTimeWaste = [];
    
    // Chartist prefs for Waste
    var wasteOptions = {
        donut: true,
        donutWidth: 15,
        showLabel: false
        /*labelOffset: 35,
        labelDirection: 'explode'*/
    };

    // Customer Mile Waste
    analyticsGroup = ds_Analytics.GROUP[0].groupDesc == "CUSTOMER"?0:1;
    custMileWaste = {
        series: [
            parseInt(ds_Analytics.GROUP[analyticsGroup].avgLoadedMiles), 
            parseInt(ds_Analytics.GROUP[analyticsGroup].avgChase), 
            parseInt(ds_Analytics.GROUP[analyticsGroup].avgEmptyMiles)
        ]
    };
    // Customer Time Waste
    custTimeWaste = {
        series: [
            parseFloat(ds_Analytics.GROUP[analyticsGroup].singleTransitTime), 
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgDwell), 
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgLoadTime),
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgIntransitDel),
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgUnloadTime)
        ]
    };
    
    // Build Graph
    $("#custMileWaste").removeClass("empty");
    
    // Check for empty data set
    if (custMileWaste.series[0] + custMileWaste.series[1] + custMileWaste.series[2] == 0){
        $("#custMileWaste").addClass("empty");
        custMileWaste.series[0] = 1;
    }
    
    var custMileWasteChart = new Chartist.Pie('#custMileWaste', custMileWaste, wasteOptions);
    
    // Animation!!
    custMileWasteChart.on('draw', function(data) {
        animateDonut(data, 'custMile');
    });
    
    // Build Graph
    $("#custTimeWaste").removeClass("empty");
    
    // Check for empty data set
    if (custTimeWaste.series[0] + custTimeWaste.series[1] + custTimeWaste.series[2] + custTimeWaste.series[3]
                 + custTimeWaste.series[4] == 0){
        $("#custTimeWaste").addClass("empty");
        custTimeWaste.series[0] = 1;
    }
    
    // Check for negative unload time
    if (custTimeWaste.series[4] < 0){
        custTimeWaste.series[4] = 0;
    }
    
    var custTimeWasteChart = new Chartist.Pie('#custTimeWaste', custTimeWaste, wasteOptions);

    // Animation!!
    custTimeWasteChart.on('draw', function(data) {
        animateDonut(data, 'custTime');
    });
    
    // Company Mile Waste
    analyticsGroup = ds_Analytics.GROUP[0].groupDesc == "COMPANY"?0:1;
    companyMileWaste = {
        series: [
            parseInt(ds_Analytics.GROUP[analyticsGroup].avgLoadedMiles), 
            parseInt(ds_Analytics.GROUP[analyticsGroup].avgChase), 
            parseInt(ds_Analytics.GROUP[analyticsGroup].avgEmptyMiles)
        ]
    };
    // Customer Time Waste
    companyTimeWaste = {
        series: [
            parseFloat(ds_Analytics.GROUP[analyticsGroup].singleTransitTime), 
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgDwell), 
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgLoadTime),
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgIntransitDel),
            parseFloat(ds_Analytics.GROUP[analyticsGroup].avgUnloadTime)
        ]
    };

    $("#companyMileWaste").removeClass("empty");
    
    // Check for empty data set
    if (companyMileWaste.series[0] + companyMileWaste.series[1] + companyMileWaste.series[2] == 0){
        companyMileWaste.series[0] = 1;
        $("#companyMileWaste").addClass("empty");
    }

    var companyMileWasteChart = new Chartist.Pie('#companyMileWaste', companyMileWaste, wasteOptions);
    
    // Animation!!
    companyMileWasteChart.on('draw', function(data) {
        animateDonut(data, 'companyMiles');
    });
    
    $("#companyTimeWaste").removeClass("empty");
    
    // Check for empty data set
    if (companyTimeWaste.series[0] + companyTimeWaste.series[1] + companyTimeWaste.series[2] 
                 + companyTimeWaste.series[3] + companyTimeWaste.series[4] == 0){
        companyTimeWaste.series[0] = 1;
        $("#companyTimeWaste").addClass("empty");
    }
    
    // Check for negative unload time
    if (companyTimeWaste.series[4] < 0){
        companyTimeWaste.series[4] = 0;
    }
    
    var companyTimeWasteChart = new Chartist.Pie('#companyTimeWaste', companyTimeWaste, wasteOptions);

    // Animation!!
    companyTimeWasteChart.on('draw', function(data) {
        animateDonut(data, 'companyTime');
    });


//---------- LOCAL FUNCTIONS -------------//


    function addBarVals(data){
        var barHorizontalCenter, barVerticalCenter, label, value;
        if (data.type === "bar") {
            barHorizontalCenter = data.x1 + (data.element.width() * .5);
            barVerticalCenter = data.y1 + (data.element.height() * -1) - 10;
            value = data.element.attr('ct:value');
            label = new Chartist.Svg('text');

            if (value !== '') {
                label.text(parseFloat(value).toFixed(2));
            } else {
                label.text("0.00");
            }

            label.addClass("ct-barlabel");
            label.attr({
                x: barHorizontalCenter,
                y: barVerticalCenter,
                'text-anchor': 'middle'
            });

            return data.group.append(label);
        }
    }
}

function buildAnalyticsTab(groupIdx){
    var statsListUL = $('#statsList');
    var statsDtl;
    var statsUL;
    var statsLI;
    var saveGroup;
    var statValue; 
    var statBegDtMoment;
    var statEndDtMoment;
        
    // Add Selected Class to Timeframe
    switch (ds_Analytics.monthSlider){
        case "3":
            $("#monthSlider3").click();
            break;
        case "6":
            $("#monthSlider6").click();
            break;
        case "9":
            $("#monthSlider9").click();
            break;
        case "12":
            $("#monthSlider12").click();
            break;
    }
    
    // Add Selected Class to Origin Geography
    switch (ds_Analytics.originGeographyType){
        case "ZN":
            $("#analyticOrigZone").click();
            break;
        case "3D":
            $("#analyticOrigZip3").click();
            break;
        case "RG":
            $("#analyticOrigReg").click();
            break;
        case "ST":
            $("#analyticOrigState").click();
            break;
        case "RR":
            $("#analyticRateRec").click();
            break;
    }
    
    // Add Selected Class to Destination Geography
    switch (ds_Analytics.destGeographyType){
        case "ZN":
            $("#analyticDestZone").click();
            break;
        case "3D":
            $("#analyticDestZip3").click();
            break;
        case "RG":
            $("#analyticDestReg").click();
            break;
        case "ST":
            $("#analyticDestState").click();
            break;
        case "RR":
            $("#analyticRateRec").click();
            break;
    }
    
    // Add Selected Class to Service
    switch (ds_Analytics.serviceType){
        case "T":
            $("#analyticSrvTeam").click();
            break;
        case "S":
            $("#analyticSrvSingle").click();
            break;
        case " ":
            $("#analyticSrvBoth").click();
            break;
    }
    
    // Add Selected Class to Source
    switch (ds_Analytics.rateSource){
        case "P":
            $("#analyticSrcPublish").click();
            break;
        case "O":
            $("#analyticSrcOther").click();
            break;
        case " ":
            $("#analyticSrcBoth").click();
            break;
    }
    
    statBegDtMoment = new moment(ds_Analytics.startDate, "YYYY-MM-DD");
    statEndDtMoment = new moment(ds_Analytics.endDate, "YYYY-MM-DD");

    $("#statBDate").html(statBegDtMoment.format("MM/YY"));
    $("#statEDate").html(statEndDtMoment.format("MM/YY"));
    

    if (ds_Analytics.startDate != "0001-01-01" ||
        ds_Analytics.endDate != "0001-01-01" ){
        $("#statInfo").css("display", "block");
    }
    
    
    
    statsListUL.empty();

    if (ds_AnalyticTabLayout.statsTab.length == 0){
        statsDtl = $("<li class='groupSection'></li>");
        statsDtl.append($("<div class='statsEmpty'>Analytics not Available</div>"));
        statsListUL.append(statsDtl);
    }


    for (var i = 0; i < ds_AnalyticTabLayout.statsTab.length; i++){
        
        if (ds_AnalyticTabLayout.statsTab[i].priGroup != saveGroup){
            statsDtl = $("<li class='groupSection'></li>");
            statsDtl.append($("<div class='statsGroup'>"+ ds_AnalyticTabLayout.statsTab[i].priGroup + "</div>"));
            statsListUL.append(statsDtl);
            statsUL = $("<ul class='stats'></ul>");
            statsListUL.append(statsDtl);
            saveGroup = ds_AnalyticTabLayout.statsTab[i].priGroup;
        }

        statsLI = $("<li class='stats'></li>");
        statsLI.append($("<span class='shortDesc' title='" + ds_AnalyticTabLayout.statsTab[i].fullDesc +"'>"+ds_AnalyticTabLayout.statsTab[i].shortDesc+"</span>"));
        
        // Get Stats Value from Analytics or Lane Charges
        switch (ds_AnalyticTabLayout.statsTab[i].dataStructure) {
            case "ds_Analytics":
                var statsField = ds_AnalyticTabLayout.statsTab[i].fieldName;
                statValue =  ds_Analytics.GROUP[groupIdx][ds_AnalyticTabLayout.statsTab[i].fieldName] + ds_AnalyticTabLayout.statsTab[i].format;
                break;
           
       
            // Set Data Structure for Line Haul Charges  
            case "chrg":
                if (chrg.length != 0){
                    if (ds_AnalyticTabLayout.statsTab[i].fieldName == "calcLOH"){
                        statValue =  chrg[0].rmsqty - chrg[0].scaleqty;   
                    }else{
                        statValue = chrg[0][ds_AnalyticTabLayout.statsTab[i].fieldName] + ds_AnalyticTabLayout.statsTab[i].format ;
                    }
                }else{
                    statValue = "N/A";
                }
                break;
        }
        
        
        
        statsLI.append($("<span class='statValue'>"+statValue+"</span>"));


        statsUL.append(statsLI);
        statsDtl.append(statsUL);
        statsListUL.append(statsDtl);
        
    };   
}
function buildSandbox(){
    
    $("#propOrInput").val(ds_Sandbox.operatingRatio);
    $("#propLHRPLMInput").val(ds_Sandbox.propRate);
    $("#propEmptyMilesAdjInput").val(ds_Sandbox.mileageadjustment);
    $("#estOR2Leg").html(ds_Sandbox.or2leg);
    $("#estOR3Leg").html(ds_Sandbox.or3leg);

}

function animateDonut(data, name){
    if(data.type === 'slice') {
        // Get the total path length in order to use for dash array animation
        var pathLength = data.element._node.getTotalLength();

        // Set a dasharray that matches the path length as prerequisite to animate dashoffset
        data.element.attr({
            'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
        });

        // Create animation definition while also assigning an ID to the animation for later sync usage
        var animationDefinition = {
            'stroke-dashoffset': {
                id: 'anim_' + name + data.index,
				begin: 300,
                dur: 500 * (data.value/data.totalDataSum) + 1,
                from: -pathLength + 'px',
                to:  '0px',
                easing: Chartist.Svg.Easing.easeOut,
                // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                fill: 'freeze'
            }
        };

        // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
        if(data.index !== 0) {
            animationDefinition['stroke-dashoffset'].begin = 'anim_' + name + (data.index - 1) + '.end';
        }

        // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
        data.element.attr({
            'stroke-dashoffset': -pathLength + 'px'
        });

        // We can't use guided mode as the animations need to rely on setting begin manually
        // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
        data.element.animate(animationDefinition, false);
    }
}
