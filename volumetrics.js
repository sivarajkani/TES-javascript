
function buildVolumetricsChart(mode){
    var customer = [],
        proposal = [0],
        awarded = [0],
        committed = [0],
        chartArray = [],
        volumetricsExists = false;
    
    // Populate graph arrays
    if (ds_Volumetrics.length > 0){
        for (i=0; i < ds_Volumetrics.length; i++){
            switch (ds_Volumetrics[i].group){
                case "rate":
                    $("#volumetricCustRate").html(ds_Volumetrics[i].value);
                    break;

                case "prop":
                    if (ds_Volumetrics[i].scac == "CUST"){
                        customer.push(ds_Volumetrics[i].yearvalue);
                        if (ds_Volumetrics[i].yearvalue != 0 && ds_Volumetrics[i].yearvalue != null){
                            volumetricsExists = true;
                        }
                        $("#volumetricCustAvail").html(
                            ds_Volumetrics[i].yearvalue == null ? 0 : ds_Volumetrics[i].yearvalue
                        );
                    } else {
                        proposal.push(ds_Volumetrics[i].yearvalue);
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".proposed > .volumetricVal").html(
                            ds_Volumetrics[i].yearvalue == null ? 0 : ds_Volumetrics[i].yearvalue
                        );
                    }
                    break;

                case "awrd":
                    awarded.push(ds_Volumetrics[i].yearvalue);
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".awarded > .volumetricVal").html(
                        ds_Volumetrics[i].yearvalue == null ? 0 : ds_Volumetrics[i].yearvalue
                    );
                    break;

                case "comm":
                    committed.push(ds_Volumetrics[i].yearvalue);
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".committed > .volumetricVal").html(
                        ds_Volumetrics[i].yearvalue == null ? 0 : ds_Volumetrics[i].yearvalue
                    );
                    break;
            }

            if ( $.inArray( ds_Volumetrics[i].scac, volumetricScacs ) == -1 ) {
                volumetricScacs.push(ds_Volumetrics[i].scac);
            }
        }
    
        // Equalize customer array size
        for (i=1; i < proposal.length; i++){
            customer.push(0);
        }

        // Flush nulls
        for (i=0; i < customer.length; i++){
            if (customer[i] == null){
                customer[i] = 0;
            }
        }
        for (i=0; i < proposal.length; i++){
            if (proposal[i] == null){
                proposal[i] = 0;
            }
        }
        for (i=0; i < awarded.length; i++){
            if (awarded[i] == null){
                awarded[i] = 0;
            }
        }
        for (i=0; i < committed.length; i++){
            if (committed[i] == null){
                committed[i] = 0;
            }
        }

        // Swap axis for chartist cause it makes no sense
        for (i=0; i < proposal.length; i++){
            chartArray[i] = [customer[i], proposal[i], awarded[i], committed[i]];
        }
        
    // Show empty chart
    } else {
        chartArray = [[0, 0, 0, 0]];
    }
    
    if(mode != 'edit'){
        volumetricsBarChart = new Chartist.Bar('#volumetricsChart', 
            {
                labels: ['Cust', 'Prop', 'Awd', 'Comm'],
                series: chartArray
            }, 
            {
                stackBars: true,
                height: 250,
                width: 244
            });
        
        // Hide Input 
        $("#volumetricsData .volumetricVal").show();
        $(".volumetricInput").css('display','none'); 
        $(".volumetricInputRate").css('display','none'); 
        $(".volumetricSelectProp").css('display','none'); 
        $(".volumetricSelectRate").css('display','none'); 
        $("#volumetricsSave").hide();
        $("#volumetricsData").removeClass('volumetricsEditMode');
      
    }else{
        // Edit Mode - shrink chart height
        volumetricsBarChart = new Chartist.Bar('#volumetricsChart', 
                                               {
            labels: ['Cust', 'Prop', 'Awd', 'Comm'],
            series: chartArray
        }, 
                                               {
            stackBars: true,
            height: 150,
            width: 244
        });    
        
    }
    // Disable Edit Mode for New Quote
    if (quotenum == '' || lanenumber == 0){
        $("#volumetricsEdit").addClass('disabled');
    }else{
        $("#volumetricsEdit").removeClass('disabled');
    }
    
    // Show Asterisk when Volumetrics Exist
    if (volumetricsExists) {
        $("#volumetricsTabAsterisk").show();
    } else {
        $("#volumetricsTabAsterisk").hide();
    }
    
}

function buildVolumetricsUOM_Select(selectUOMList,selectUOMType){

    var x=0,
        i=0;
    
    for (x = 0; x < ds_VolumetricsUOM.type.length; x++) {
        if (ds_VolumetricsUOM.type[x].value == selectUOMType){
            for (i = 0; i < ds_VolumetricsUOM.type[x].uom.length; i++) {
            // Build Select Option List 
              selectUOMList.append(
                "<option value='"+ ds_VolumetricsUOM.type[x].uom[i].code + 
                  "' uomCode='"+ ds_VolumetricsUOM.type[x].uom[i].code+ 
                  "' uomConversion='"+ ds_VolumetricsUOM.type[x].uom[i].conversion+ 
                  "' uomDesc='"+ ds_VolumetricsUOM.type[x].uom[i].desc+ 
                  "'>"+ ds_VolumetricsUOM.type[x].uom[i].desc +"</option>");
            }
        }
    }

}

function hideVolumetricsEdit(){
    $("#volumetricsData .volumetricVal").show();
    $(".volumetricInput").css('display','none'); 
    $(".volumetricInputRate").css('display','none'); 
    $(".volumetricSelectProp").css('display','none'); 
    $(".volumetricSelectRate").css('display','none'); 
    $("#volumetricsSave").hide();
    $("#volumetricsData").removeClass('volumetricsEditMode');
    buildVolumetricsChart('');
}
function showVolumetricsEdit(){

    // Populate Volumetrics Input Boxes for Editing
    if (ds_Volumetrics.length > 0){
        for (var i=0; i < ds_Volumetrics.length; i++){
            switch (ds_Volumetrics[i].group){
                case "rate":
                    $(".volumetricInputRate").val(ds_Volumetrics[i].value == null ? 0 : ds_Volumetrics[i].value);
                    if (ds_Volumetrics[i].uom == null){
                        $(".volumetricSelectRate").val("M");    
                    } else {
                        $(".volumetricSelectRate").val(ds_Volumetrics[i].uom);
                    }
                    break;

                case "prop":
                    if (ds_Volumetrics[i].scac == "CUST"){
                        $("#custVolume .volumetricInput").val(
                            ds_Volumetrics[i].value == null ? 0 : ds_Volumetrics[i].value);
                        if (ds_Volumetrics[i].uom == null){
                            $("#custVolume .volumetricSelectProp").val("Y"); 
                        } else {
                            $("#custVolume .volumetricSelectProp").val(ds_Volumetrics[i].uom);
                        }
                    } else {
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".proposed > .volumetricInput").val(
                            ds_Volumetrics[i].value == null ? 0 : ds_Volumetrics[i].value
                        );
                        if (ds_Volumetrics[i].uom == null){
                            $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                              ".proposed > .volumetricSelectProp").val("Y"); 
                        } else {
                            $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                              ".proposed > .volumetricSelectProp").val(ds_Volumetrics[i].uom);
                        }

                    }
                    break;

                case "awrd":
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".awarded > .volumetricInput").val(
                        ds_Volumetrics[i].value == null ? 0 : ds_Volumetrics[i].value
                    );
                    if (ds_Volumetrics[i].uom == null){
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".awarded > .volumetricSelectProp").val("Y"); 
                    } else {
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".awarded > .volumetricSelectProp").val(ds_Volumetrics[i].uom);
                    }

                    break;

                case "comm":
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".committed > .volumetricInput").val(
                        ds_Volumetrics[i].value == null ? 0 : ds_Volumetrics[i].value
                    );
                    if (ds_Volumetrics[i].uom == null){
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".committed > .volumetricSelectProp").val("Y"); 
                    } else {
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".committed > .volumetricSelectProp").val(ds_Volumetrics[i].uom);
                    } 

                    break;
            }
        }
    }
    $("#volumetricsData .volumetricVal").hide();
    $(".volumetricInput").css('display','inline-block');
    $(".volumetricInputRate").css('display','inline-block');
    $(".volumetricSelectProp").css('display','inline-block');
    $(".volumetricSelectRate").css('display','inline-block');
    $("#volumetricsSave").addClass('disabled');
    $("#volumetricsSave").show();
    $("#volumetricsData").addClass('volumetricsEditMode');
    buildVolumetricsChart('edit');

}

function validateVolumetrics(callback){
    
    volumetricErrors = false;
    
    // Customer Target Rate
    if (! $.isNumeric($(".volumetricInputRate").val())){
        // Rate must be numeric
        volumetricErrors = true;
        $(".volumetricInputRate").addClass('invalidField');
    } else {
        $(".volumetricInputRate").removeClass('invalidField');
    }	
    
    // Customer Volume
    if (! $.isNumeric($("#custVolume .volumetricInput").val())){
        // Volume must be numeric
        volumetricErrors = true;
        $("#custVolume .volumetricInput").addClass('invalidField');
    } else {
        $("#custVolume .volumetricInput").removeClass('invalidField');
    }	
    
    // Proposed, Awarded, Committed Volumes
    for (var i=0; i < ds_Volumetrics.length; i++){
        switch (ds_Volumetrics[i].group){
            
            case "prop":
                if (ds_Volumetrics[i].scac != "CUST"){
                    if (! $.isNumeric($("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                                        ".proposed > .volumetricInput").val())){
                        volumetricErrors = true;
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".proposed > .volumetricInput").addClass('invalidField');
                        
                    } else {
                        $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                          ".proposed > .volumetricInput").removeClass('invalidField');
                    }
                }
                break;

            case "awrd":
                if (! $.isNumeric($("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                                    ".awarded > .volumetricInput").val())){
                    volumetricErrors = true;
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".awarded > .volumetricInput").addClass('invalidField');
                } else {
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".awarded > .volumetricInput").removeClass('invalidField');
                    
                }
                break;

            case "comm":
                if (! $.isNumeric($("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                                    ".committed > .volumetricInput").val())){
                    volumetricErrors = true;
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".committed > .volumetricInput").addClass('invalidField');
                } else {
                    $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " + 
                      ".committed > .volumetricInput").removeClass('invalidField');

                }
                break;
        }
    }
   
    if (callback) {
        callback();
    }
    
    
}

function updateVolumetrics(quote, lane, callback){
    
    // Update Volumetrics Data Structure with Input Values
    for (var i = 0; i < ds_Volumetrics.length; i++) {
        switch (ds_Volumetrics[i].group) {
        case "rate":
            ds_Volumetrics[i].value = $(".volumetricInputRate").val();
            ds_Volumetrics[i].uom = $(".volumetricSelectRate option:selected").attr("uomcode");  
            ds_Volumetrics[i].uomdesc = $(".volumetricSelectRate option:selected").attr("uomdesc");  
            break;

        case "prop":
            if (ds_Volumetrics[i].scac == "CUST") {
                ds_Volumetrics[i].value = $("#custVolume .volumetricInput").val();
                ds_Volumetrics[i].uom = $("#custVolume .volumetricSelectProp option:selected").attr("uomcode");  
                ds_Volumetrics[i].uomdesc = $("#custVolume .volumetricSelectProp option:selected").attr("uomdesc");  
              
            } else {
                ds_Volumetrics[i].value = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                    ".proposed > .volumetricInput").val();
                ds_Volumetrics[i].uom = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                          ".proposed > .volumetricSelectProp option:selected").attr("uomcode");  
                ds_Volumetrics[i].uomdesc = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                              ".proposed > .volumetricSelectProp option:selected").attr("uomdesc"); 
            }
            break;

        case "awrd":
            ds_Volumetrics[i].value = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                        ".awarded > .volumetricInput").val();
            ds_Volumetrics[i].uom = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                      ".awarded > .volumetricSelectProp option:selected").attr("uomcode");  
            ds_Volumetrics[i].uomdesc = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                    ".awarded > .volumetricSelectProp option:selected").attr("uomdesc"); 
            
            break;

        case "comm":
            ds_Volumetrics[i].value = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                        ".committed > .volumetricInput").val();
            ds_Volumetrics[i].uom = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                      ".committed > .volumetricSelectProp option:selected").attr("uomcode");  
            ds_Volumetrics[i].uomdesc = $("#" + ds_Volumetrics[i].scac.toLowerCase() + "Volume " +
                                      ".committed > .volumetricSelectProp option:selected").attr("uomdesc"); 
            
            break;
        }
    }
    
    var url,
        post_Volumetrics;
    
    var returnObject = {list:ds_Volumetrics};
    
    url = "pqxml.pgm?func=VOLUMESAVE&quotenum=" + quote + "&lane=" + lane;
    post_Volumetrics = JSON.stringify(returnObject);
   
    $.ajax({
        url: url,
        method: "POST",
        data: post_Volumetrics,
        processData: false,
        dataType: "json",
        async: true,
        cache: false,
        timeout: 60000,
        
        success: function(response){
            ds_Volumetrics = response.list;
            
           
            buildVolumetricsChart();
            
            if (callback) {
                callback();
            }
        },

        complete: function() {

        },

        error: function(jqXHR, errorStatus, errorMessage) {
            if (errorStatus != "abort"){
                alert('Errors updating volumetrics.')
            }
        }
    });

    
    
}


//////////////////////////////////////
// AJAX                            ///
//////////////////////////////////////
function retrieveVolumetrics(quote, lane, callback){
    var url;

    url = "pqxml.pgm?func=VOLUMEGET&quotenum=" + quote + "&lane=" + lane;
    
    //url = "/applications/Pricing/XML/volumetrics_sample_withdata.json";  

    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",

        success: function(volumetrics){
            ds_Volumetrics = volumetrics.list;
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
function retrieveVolumetricsUOM(callback){

    var url = "/applications/Pricing/XML/volumetrics_uom.json";  

    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: "json",

        success: function(uomTypes){
            ds_VolumetricsUOM = uomTypes;

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