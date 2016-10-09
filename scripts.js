/**
 * Created by tango on 08/10/16.
 */
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

var file1, file2, file3;
var dataToAdd = [];
var counter = 0;

function parseComputerData(file, series) {

    if(reader.readyState==4) {

        //open file and read first date
        var data = reader.responseText.split('<');
        var date, dateToParse, dateFromFile;

        dateToParse = data[0].split(" ");
        date = dateToParse[0] + "T" + dateToParse[1];
        dateFromFile = new Date(date);
        //convert to Central European Time
        dateFromFile.setHours(dateFromFile.getHours() - 2);
        console.log(dateFromFile);

        if (file == 'data1') {

            dateFromFile1 = dateFromFile;
            reader.abort();
            readComputerDate('data2', series);
        } else if (file == 'data2') {

            dateFromFile2 = dateFromFile;
            reader.abort();
            readComputerDate('data3', series);
        } else {

            dateFromFile3 = dateFromFile;
            isValid('data1', 'data2', 'data3');
            reader.abort();
            readFile(file1, series);
        }
    }
}

var dateFromFile1, dateFromFile2, dateFromFile3;
function isValid(filename1, filename2, filename3) {

    var data1 = [], data2 = [], data3 = [];
    if(dateFromFile1 == "Invalid Date"){
        if (dateFromFile2 == "Invalid Date") {
            if(dateFromFile3 == "Invalid Date"){

                file1 = null;
                file2 = null;
                file3 = null;
                console.log('No data!')
            } else {

                file1 = filename3;
                file2 = null;
                file3 = null;
            }
        } else if(dateFromFile3 == "Invalid Date"){

            file1 = filename2;
            file2 = null;
            file3 = null;
        } else  {

            data1.push(dateFromFile2,filename2);data2.push(dateFromFile3,filename3);
            sortDate(data1,data2)
        }
    } else {
        if (dateFromFile2 == "Invalid Date") {
            if(dateFromFile3 == "Invalid Date"){

                file1 = filename1;
                file2 = null;
                file3 = null;
            } else {

                data1.push(dateFromFile1,filename1);data2.push(dateFromFile3,filename3);
                sortDate(data1, data2)
            }
        } else if(dateFromFile3 == "Invalid Date"){

            data1.push(dateFromFile1,filename1);data2.push(dateFromFile2,filename2);
            sortDate(data1, data2)
        } else  {

            data1.push(dateFromFile1,filename1);data2.push(dateFromFile2,filename2);data3.push(dateFromFile3,filename3)
            sortDate(data1, data2, data3);
        }
    }
}

function sortDate(data1, data2, data3) {

    //sort data
    var dataArray = [data1, data2, data3];
    var x;
    for(var j = 0; j < dataArray.length - 1; j++){
        for (var i = 0; i < dataArray.length - 1; i ++) {
            if (dataArray[i] != undefined && dataArray[i + 1] != undefined) {
                if (dataArray[i][0] > dataArray[i + 1][0]) {

                    x = dataArray[i];
                    dataArray[i] = dataArray[i + 1];
                    dataArray[i + 1] = x;
                }
            }
        }
    }

    if (dataArray[0] != undefined) {
        file1 = dataArray[0][1];
    } else {
        file1 = null;
    }

    if (dataArray[1] != undefined) {
        file2 = dataArray[1][1];
    } else {
        file2 = null;
    }

    if (dataArray[2] != undefined) {
        file3 = dataArray[2][1];
    } else {
        file3 = null;
    }
}

function readComputerDate(file, series) {

    reader.open('get', file, true);
    reader.onreadystatechange = function () {parseComputerData(file, series);};
    reader.send(null);
}

function readFile(file, series) {

    if (file != null) {

        reader.open('get', file, true);
        reader.onreadystatechange = function () {
            drawHistoricData(series);
        };
        reader.send(null);
    } else{
        if (counter != 0) {

            series[0].setData(dataToAdd);
            removeElements();
            showPlot()
        }
    }
}

function addData(data,i,current) {

    var points, x, y;
    points = data[i + 1].split(",");
    x = points[0] * 1000;
    y = points[1] * 1000;
    if (!y || y < 0) y = 0;
    dataToAdd.push([x, y]);
}

var progress = 0;
function drawHistoricData(series) {
    if(reader.readyState==4) {

        var data = reader.responseText.split('<');
        var line, old = 0;

        if (counter == 0) {
            for (line = 0; line < data.length - 1; line += 4) {

                progress = Math.round(33 * (line/data.length).toFixed(2));
                if (progress != old){
                    $('#wyk').html(progress);
                }
                old = progress;

                addData(data,line,series[0].name);
            }

            counter += 1;
            readFile(file2, series);
        } else if (counter == 1) {
            for (line = 0; line < data.length - 1; line += 4) {

                progress = Math.round(33 * (line/data.length).toFixed(2))+33;

                if (progress != old){
                    $('#wyk').html(progress);
                }
                old = progress;
                addData(data,line,series[0].name);
            }

            counter += 1;
            readFile(file3, series);

        } else if (counter == 2) {

            data = reader.responseText.split('<');
            for (line = 0; line < data.length - 1; line += 4) {
                progress = Math.round(33 * (line/data.length).toFixed(2))+66;

                if (progress != old){
                    $('#wyk').html(progress);
                }
                old = progress;

                addData(data,line,series[0].name);
            }

            series[0].setData(dataToAddCurrent);
            series[1].setData(dataToAddLife);
            series[2].setData(dataToAddEnergy);

            removeElements();
            showPlot()
        }
    }
}

function removeElements() {

    var root = document.getElementById("container");
    root.removeChild(document.getElementById("textLoading"))
}

function showPlot() {

    var plot = document.getElementById("plot");
    plot.style.visibility = "visible";
}

function get_zero() {
    // generate an array of random data
    var data = [], time = (new Date()).getTime(), i;

    for (i = -43199; i <= 0; i += 1) {
        data.push([
            time + i * 1000,
            0
        ]);
    }

    return data;
}

function showName() {
    
    var div = document.getElementById("rectangle05");
    div.firstChild.style.visibility = "visible";
}

function showValue() {
    
    var div = document.getElementById("device05");
    div.firstChild.style.visibility = "visible";
}

function Round(n)
{
    var factor = Math.pow(10, 1);
    n = Math.round(Math.round(n*factor)/10);
    return n/(factor/10);
}

function update(series)
{
    $.get(
        //window.location.protocol + '//' + window.location.hostname + '/tangohost-server/data',
        "http://192.168.100.85/tangohost-server/data",
        function(data) {
            if (navigator.appVersion.indexOf("Win")!=-1){

                $('.horizontal-panel-style').css({'width':'26vmax','font-size':'2vmax'});
                $('#Energy').css('font-size','2.2vmax');
                $('#Lifetime').css('font-size','2.2vmax');
                $('#LifetimeMin').css('font-size','2.2vmax');
                $('.unitPanel-2').css('font-size','1.65vmax');
                $('.horizontal-2-panel-style').css('width','18vmax');
                $('.status').css({'margin-left':'1.8vw','min-width':'15.8vmax'});
                $('.current').css('min-width','30.2vmax');
                $('#Mode').css('margin-left','3.7vmax');
                $('.panel-heading2').css('width','45%');
            }

            var seriesDisplay = ['Energy', 'Dose', 'Pressure'];
            try {
                for (i = 0; i < series.length - 1; i++) {

                    var k = dev[series[i].name],
                        dp = data[k[0]][k[1]][k[2]][k[3]]["dataPoints"][0],
                        x = dp[0] * 1000,		// MAGIC!!!
                        y = dp[1] * k[4];		// convert values by the factor provided for each parameter

                    if (!y || y < 0) y = 0;
                    if (series[i].name == 'Lifetime') {
                        var _y = y.toString().split('.');
                        if (_y == 0){
                            $('#Lifetime').html(y);
                            $('#LifetimeMin').html(y);
                            series[i].addPoint([x, y], true, true);
                            continue;
                        }
                        var min = ('0.'+_y[1].toString()) * 60;
                        var arrayMin = ("" + min).split("");
                        var digs = arrayMin.slice(0, 5);

                        $('#Lifetime').html(_y[0]);
                        var dig = Round(digs.join(""),0);
                        $('#LifetimeMin').html(dig);

                    } else
                        $('#' + series[i].name).html(y.toFixed(2));
                    try {
                        series[i].addPoint([x, y], true, true);
                    } catch (TypeError) {
                        console.log("typeError");
                    }
                }
                for (j = 0; j < seriesDisplay.length; j++) {

                    var k = dev[seriesDisplay[j]],
                        dp = data[k[0]][k[1]][k[2]][k[3]]["dataPoints"][0],
                        x = dp[0] * 1000,		// MAGIC!!!
                        y = dp[1] * k[4];		// convert values by the factor provided for each parameter

                    if (!y) y = 0;

                    if (seriesDisplay[j] == 'Dose') {
                        $('#' + seriesDisplay[j]).html(y.toFixed(2));
                    } else if (seriesDisplay[j] == 'Energy') {
                        var value = y.toString().split('');
                        $('#' + seriesDisplay[j]).html(value[0] + value[1] + value[2] + value[3]);
                    }else {
                        $('#' + seriesDisplay[j]).html(y.toExponential(2));
                    }
                }

                var operationStatus;
                operationStatus = data["R1-ALL"]["DIA"]["R1-ALL-DIA-INFOBL1"]["OperationStatus"]["dataPoints"][0];
                if (operationStatus[1] != "") {
                    $('#Status').html(operationStatus[1]);
                } else {
                    $('#Status').html('None <br>');
                }

                var generalInfo;
                generalInfo = data["R1-ALL"]["DIA"]["R1-ALL-DIA-INFOBL1"]["GeneralInfo"]["dataPoints"][0];
                var dataTime = new Date();
                var minute = (dataTime.getMinutes() < 10) ? "0" + dataTime.getMinutes() : dataTime.getMinutes();
                var day = (dataTime.getDate() < 10) ? "0" + dataTime.getDate() : dataTime.getDate();
                var mount = (dataTime.getMonth() < 10) ? "0" + dataTime.getMonth() : dataTime.getMonth();
                var hours = (dataTime.getHours() < 10) ? "0" + dataTime.getHours() : dataTime.getHours();

                if (generalInfo[1] != "") {
                    $('#GeneralInfo').html(day+'-'+mount+"-"+dataTime.getFullYear()+' '+hours+':'+minute+" "+generalInfo[1] + '<br>');
                } else {
                    $('#GeneralInfo').html('None <br>');
                }

                try {
                    var gap;
                    gap = data["R1-04S"]["MAG"]["R1-04S-MAG-IDU1"]["Gap"]["dataPoints"][0];
                    $('#Gap').html(gap[1].toFixed(2));
                } catch (err){
                    console.log(err.message)
                }
                var bl4shutter, bl5shutter;
                try {
                    bl4shutter = data['solaris']['PSS']['0']['bl_04bmpeemxas_state']['dataPoints'][0][1];

                    if (bl4shutter[0] == 'false' || bl4shutter[1] == 'false'){
                        $('#rectangle04').css({"background-color": "green"});
                        $('#rectangle04').html("OPEN")
                    } else {
                        $('#rectangle04').css({"background-color": "orange"});
                        $('#rectangle04').html("CLOSE")
                    }

                    bl5shutter = data['solaris']['PSS']['0']['bl_05iduarpes_state']["dataPoints"][0][1];

                    if (bl5shutter[0] == 'false' || bl5shutter[1] == 'false'){
                        $('#rectangle05').css({"background-color": "green"});
                        $('#rectangle05').html("OPEN")
                    } else {
                        $('#rectangle05').css({"background-color": "orange"});
                        $('#rectangle05').html("CLOSE")
                    }
                } catch (err){
                    console.log(err.message)
                }
                setTime();
            } catch (TypeError) {

            }
        }
    );
}


