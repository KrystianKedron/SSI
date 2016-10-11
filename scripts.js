/**
 * Created by tango on 08/10/16.
 */
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

var dataToAdd = [];
var money = 100;
var lenght;

function readFile(file, series) {

    if (file != null) {

        reader.open('get', file, true);
        reader.onreadystatechange = function () {
            drawHistoricData(series);
        };
        reader.send(null);
    }
}

function addDataToArray(data) {

    var points, x, y;
    points = data.split(",");
    var date = new Date(points[0]);
    addUser(points[1], date);
    x = date.getTime();
    money += points[2]*1;
    y = money;
    if (!y) y = 0;
    dataToAdd.push([x, y]);
}

function addUser(user, date) {
    var minute = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    var mount = (date.getMonth() < 10) ? "0" + date.getMonth() : date.getMonth();
    var hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    $('#GeneralInfo').html(day+"-"+mount+"-"+date.getFullYear()+" "+hours+":"+minute+"    New value add by "+ user);
}

var progress = 0;
function drawHistoricData(series) {
    if(reader.readyState==4) {

        var data = reader.responseText.split('\r\n');
        var line, old = 0;
        lenght = data.length-1;
        for (line = 0; line < lenght; line ++) {

            progress = Math.round(1 * (line/data.length).toFixed(2));
            if (progress != old){
                $('#wyk').html(progress);
            }
            old = progress;

            addDataToArray(data[line]);
        }
        series[0].setData(dataToAdd);

        removeElements();
        showPlot()
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

function update(file, series)
{
    if (file != null) {

        reader.open('get', file, true);
        reader.onreadystatechange = function () {
            addNewData(series);
        };
        reader.send(null);
    }
}

function addNewData(series) {

    if(reader.readyState==4) {
        var data = reader.responseText.split('\r\n');
        var line;
        var dataLenght = data.length -1;
        if (dataLenght > lenght) {
            line = dataLenght - (dataLenght - lenght);
            lenght = data.length-1;
            for (var i = data.length-2; i >= line; i--) {
                addDataToChar(data[i], series);
            }
        }
    }
}

function addDataToChar(data, series) {
    var points, x, y;
    points = data.split(",");
    var date = new Date(points[0]);
    addUser(points[1], date);
    x = date.getTime();
    money += points[2]*1;
    y = money;
    if (!y) y = 0;
    series[0].addPoint([x, y], true, true);
}

function removeFocus() {
    $("input").css("visibility", "hidden");
    $("input").css("background-color", "white");
}