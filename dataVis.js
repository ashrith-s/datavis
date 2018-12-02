var allText;
var overlapData = new Array();
var singleData = new Array();
var data = new Array();
var chartSize = 500;
var intervalId;
var buttonFlag = 0;
var animateCount;

var slider1 = document.getElementById("slider1");
var slider2 = document.getElementById("slider2");
var button = document.getElementById("button1");
var label = document.getElementById("song-title");
var label2 = document.getElementById("song-count");

//function clearBox()
//{
//    document.getElementById("RadarChart").innerHTML = "";
//}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function(){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}//readTextFile

function initialiseData(){
    readTextFile('data/data.json');
    return JSON.parse(allText);
}

function prepareOverlapData(songCount, data){
    overlapData.length = 0;

    var newObj = new Array();
    newObj = JSON.parse(JSON.stringify(data));
    newObj = newObj.slice(0, songCount);
    
    for (var i=0; i<songCount; i++){
        delete newObj[i].id;
        delete newObj[i].Rank;
        delete newObj[i].duration_ms;
        delete newObj[i].key;
        delete newObj[i].loudness;
        delete newObj[i].mode;
        delete newObj[i].time_signature;
        delete newObj[i].name;
        delete newObj[i].instrumentalness;
        delete newObj[i].artists;
        delete newObj[i].tempo;
    }
//    console.log(newObj);
    var keyNames = Object.keys(newObj[0]);
    for (var i=0; i<songCount; i++) {
        if (!overlapData[i]) overlapData[i] = [];
        for (var j=0; j<6; j++) {
            overlapData[i][j] = new Object();
            overlapData[i][j].axis = keyNames[j];
            overlapData[i][j].value = newObj[i][keyNames[j]];
        }//for
    }//for
    
//    console.log(songCount);
}//prepareOverlapData

function prepareSingleData(rankCount, data){
    singleData.length=0;
    
    singleData[0] = [];    
    
    var newObj = new Array();
//    newObj = data[rankCount];
    newObj = JSON.parse(JSON.stringify(data[rankCount]));
    
    delete newObj.id;
    delete newObj.Rank;
    delete newObj.duration_ms;
    delete newObj.key;
    delete newObj.loudness;
    delete newObj.mode;
    delete newObj.time_signature;
    delete newObj.name;
    delete newObj.instrumentalness;
    delete newObj.artists;
    delete newObj.tempo;
    
    var keyNames = Object.keys(newObj);
    
    for (var j=0; j<6; j++) {
            singleData[0][j] = new Object();
            singleData[0][j].axis = keyNames[j];
            singleData[0][j].value = newObj[keyNames[j]];
    }//for

//    console.log(rankCount);
}//prepareSingleData

function animateChart(){
    var i = slider2.value - 1;
    intervalId = setInterval(function(){
        i = (++i) % 100;
        prepareSingleData(i, data);
        label.innerHTML="Rank " + data[i].Rank + " : " + data[i].name;
        RadarChart("#songChart", singleData, radarChartOptions);
        slider2.value = i;
    }, 250);
}//animateChart

function stopAnimate() {
    clearInterval(intervalId);
}

/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
      
////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = {top: 100, right: 100, bottom: 100, left: 100},
width = Math.min(chartSize, window.innerWidth - 10) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

//            var color=d3.scaleBand().rangeRound(["#EDC951","#CC333F","#00A0B0"]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 5,
    roundStrokes: true,
    color: color
};

/*//////////////////////////End///////////////////////////////*/

//Initialise data
data = initialiseData();
//console.log(data);

//Call function to draw the overlapped Radar chart
prepareOverlapData(1, data);
RadarChart("#overlapChart", overlapData, radarChartOptions);

//Call function to draw the individual Radar charts
prepareSingleData(0, data);
label.innerHTML="Rank " + data[0].Rank + " : " + data[0].name;
RadarChart("#songChart", singleData, radarChartOptions);
//console.log(data);

//Slider 1 Callback
slider1.oninput = function() {
    prepareOverlapData(this.value, data);
    label2.innerHTML = "No. of songs = " + this.value;
    //Call function to draw the Radar chart
    RadarChart("#overlapChart", overlapData, radarChartOptions);
}//oninput function

//Slider 2 Callback
slider2.oninput = function() {
    if(buttonFlag == 1){
        buttonFlag = 0;
        stopAnimate();
        button.innerHTML = "Start Animation";
    }
    var count = this.value - 1;
    prepareSingleData(count, data);
    
    label.innerHTML="Rank " + data[count].Rank + " : " + data[count].name;
    //Call function to draw the Radar chart
    RadarChart("#songChart", singleData, radarChartOptions);
}//oninput function

button1.onclick = function() {
    if(buttonFlag == 0) {
        buttonFlag = 1;
        animateChart();
        button.innerHTML = "Stop Animation";
//        slider2.disabled = true;
    } else {
        buttonFlag = 0;
        stopAnimate();
        button.innerHTML = "Start Animation";
//        slider2.disabled = false;
//        slider2.value = animateCount;
//        console.log(slider2.value);
//        prepareSingleData(0, data);
//        RadarChart("#songChart", singleData, radarChartOptions);
    }
}

///////////////TESTING/////////////////
var label3 = document.getElementById("song-count2");
var slider2 = document.getElementById("slider2");
var overlapData2 = new Array();

function prepareOverlapData2(start, data){
    overlapData2.length = 0;

    var newObj = new Array();
    newObj = JSON.parse(JSON.stringify(data));
    newObj = newObj.slice(start, start + 10);
    console.log(start);
    
    for (var i=0; i<10; i++){
        delete newObj[i].id;
        delete newObj[i].Rank;
        delete newObj[i].duration_ms;
        delete newObj[i].key;
        delete newObj[i].loudness;
        delete newObj[i].mode;
        delete newObj[i].time_signature;
        delete newObj[i].name;
        delete newObj[i].instrumentalness;
        delete newObj[i].artists;
        delete newObj[i].tempo;
    }
    console.log(newObj);
    var keyNames = Object.keys(newObj[0]);
    for (var i=0; i<10; i++) {
        if (!overlapData2[i]) overlapData2[i] = [];
        for (var j=0; j<6; j++) {
            overlapData2[i][j] = new Object();
            overlapData2[i][j].axis = keyNames[j];
            overlapData2[i][j].value = newObj[i][keyNames[j]];
        }//for
    }//for
    
//    console.log(songCount);
}//prepareOverlapData2

//Call function to draw the overlapped Radar chart
prepareOverlapData2(0, data);
RadarChart("#overlapChart2", overlapData2, radarChartOptions);

slider3.oninput = function() {
    var start = (this.value - 1) * 10;
    prepareOverlapData2(start, data);
    label3.innerHTML = "Rank Range : " + (start+1) + " to " + (start + 10);
    //Call function to draw the Radar chart
    RadarChart("#overlapChart2", overlapData2, radarChartOptions);
}//oninput function