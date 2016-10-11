// Set the theme and general chart options
function setOptions(hc)
{

    // Load the fonts
    hc.createElement('link', {
        href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
        rel: 'stylesheet',
        type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

// Add the background image to the container
    hc.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
        proceed.call(this);
        this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
    });

    hc.theme = {
        global: {useUTC: false},
        colors: ["#039", "#f45b5b", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: null,
            style: {
                fontFamily: "Signika, serif"
            }
        },
        title: {
            style: {
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            style: {
                color: 'black'
            }
        },
        tooltip: {
            borderWidth: 0,
            valueDecimals: 3
        },
        legend: {
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '13px'
            }
        },
        xAxis: {
            paddingBottom: 0,
            labels: {
                style: {
                    color: '#6e6e70',
                    fontSize: '0.8vmax'
                }
            }
        },
        yAxis: {
            title:{
                style: {
                    fontSize: '1vmax'
                    // marginBottom: '20vmax'
                    // marginTop: '10vmax'
                    // paddingTop: '100px'
                    // paddingLeft: '1vw'
                    // paddingTop: '10px'
                }
            },
            labels: {
                style: {
                    color: '#6e6e70',
                    fontSize: '0.9vmax'
                }
            }
        },
        plotOptions: {
            series: {
                shadow: true
            },
            candlestick: {
                lineColor: '#404048'
            },
            map: {
                shadow: false
            }
        },

        // Highstock specific
        navigator: {
            paddingTop: 0,
            height: 20,
            margin: 0,
            xAxis: {
                labels: {
                    style: {
                        color: '#6D869F',
                        fontSize: '0.1vmax'
                    }
                }
            }
        },
        rangeSeector: {
            buttonTheme: {
                fill: 'white',
                stroke: '#C0C0C8',
                'stroke-width': 1,
                states: {
                    select: {
                        fill: '#D0D0D8'
                    }
                }
            }
        },
        scrollbar: {
            trackBorderColor: '#C0C0C8'
        },

        // General
        background2: '#E0E0E8'

    };

    // Apply the theme
    hc.setOptions(hc.theme);
}