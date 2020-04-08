document.getElementById('renderBtn').addEventListener('click', checkCountryCode);
//Empty the canvas when clicked?

function checkCountryCode() {
    let countryInput = document.getElementById('country');
    let canvas = document.getElementById("myChart");
    if (!countryInput.checkValidity()) {
        document.getElementById("error").innerHTML = "Please check the country code format. Valid example: USA";
    } else {
        document.getElementById("error").innerHTML = "";
        fetchData();
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
        //Throw an error when the response is not OK => proceeds directly to the catch
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
        }
    } catch (err) {
        console.log(err);
        renderError('Population data could not be retrieved. ' + err);
    }

}

function getValues(data) {
    var values = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return values;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function getIndicatorName(data) {
    var indicatorName = data[1][0].indicator.value;
    return indicatorName;
}

function renderError(message) {
    document.getElementById("error").innerHTML = message;
}

var currentChart;

function renderChart(data, labels, countryName, indicatorName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (currentChart) {
        // Clear the previous chart if it exists kts. Chart.js API
        currentChart.destroy();
    }
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
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}