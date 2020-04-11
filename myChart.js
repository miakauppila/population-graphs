let currentChart;

document.getElementById('renderBtn').addEventListener('click', checkCountryCode);

function checkCountryCode() {
    clearChart();
    let countryInput = document.getElementById('country');
    if (!countryInput.checkValidity()) {
        document.getElementById("error").innerHTML = "Please check the country code format. Valid example: USA";
        document.getElementById("chartContainer").style.backgroundColor = '#d9d9d9';
    }
    else {
        document.getElementById("error").innerHTML = "";
        document.getElementById("chartContainer").style.backgroundColor = '#d9d9d9';
        fetchData();
    }
}

function clearChart() {
    if (currentChart) {
        // Clear the previous chart if it exists kts. Chart.js API
        currentChart.destroy();
    }
}

async function fetchData() {
    let countryCode = document.getElementById('country').value;
    let indicatorCode = document.getElementById('indicators').value;
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    //API default format is XML
    //Fetch since 1960 in JSON format
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?per_page=60' + '&format=json';
    console.log('Fetching data from URL: ' + url);

    try {
        const response = await fetch(url);
        //Throw an error when the response is not OK => proceeds directly to catch
        if (!response.ok) {
            console.log(response.statusText);
            throw new Error('Network error.');
        }
        else if (response.status == 200) {
            let fetchedData = await response.json();
            console.log(fetchedData);

            if (fetchedData[0].message) {
                throw (fetchedData[0].message[0].value);
            }

            let data = getValues(fetchedData);
            let labels = getLabels(fetchedData);
            let countryName = getCountryName(fetchedData);
            let indicatorName = getIndicatorName(fetchedData);
            renderChart(data, labels, countryName, indicatorName);
            document.getElementById("chartContainer").style.backgroundColor = 'white';
        }
    } catch (err) {
        console.log(err);
        renderError('Population data could not be retrieved. ' + err);
    }
}

function getValues(data) {
    let valuesRaw = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    //round pergentages to 2 decimals
    let values = valuesRaw.map(item => Math.round(item * 100) / 100);
    //remove 2019 null value
    values.pop();
    return values;
}

function getLabels(data) {
    let labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    //remove 2019 from labels
    labels.pop();
    return labels;
}

function getCountryName(data) {
    let countryName = data[1][0].country.value;
    return countryName;
}

function getIndicatorName(data) {
    let indicatorName = data[1][0].indicator.value;
    return indicatorName;
}

function renderError(message) {
    document.getElementById("error").innerHTML = message;
}

function renderChart(data, labels, countryName, indicatorName) {
    let ctx = document.getElementById('myChart').getContext('2d');

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: indicatorName + ', ' + countryName,
                data: data,
                borderColor: '#5cd65c',
                backgroundColor: '#b3ffb3',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Millions"
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000000) {
                                return value / 1000000;
                            } else {
                                return value;
                            }
                        }
                    }
                }]
            }
        }
    });

    if (indicatorName.includes("ages")) {
        currentChart.options.scales.yAxes[0].scaleLabel.labelString = "Percentage";
        currentChart.update();
    }
}