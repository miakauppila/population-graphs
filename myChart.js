let currentChart;

// Fetch list of countries for the dropdown
window.onload = async function fetchDropdownData() {
  const url = "https://api.worldbank.org/v2/country?format=json&per_page=400";
  const response = await fetch(url);
  console.log("Fetching country dropdown data from URL: " + url);

  try {
    if (!response.ok) {
      throw new Error("response status " + response.status);
    } else {
      if (response.status == 200) {
        let countryData = await response.json();
        let countryList = countryData[1];
        countryList = countryList.sort((a, b) => (a.name > b.name ? 1 : -1));
        addDropdownOptions(countryList);
      } else {
        renderDropdownError("Retrieving country list from server failed.");
      }
    }
  } catch (error) {
    console.log(error);
    renderDropdownError("Retrieving country list from server failed.");
  }
};

function addDropdownOptions(countryList) {
  let dropdown = document.getElementById("selectCountryDropdown");

  let option;
  for (var i = 0; i < countryList.length; i++) {
    // capitalCity is empty for regions/continents
    if (countryList[i].capitalCity === "") {
      continue;
    }
    option = document.createElement("option");
    option.text = countryList[i].name;
    option.value = countryList[i].id;
    dropdown.append(option);
  }
}

function renderDropdownError(message) {
  document.getElementById("dropdownError").textContent = message;
}

document.getElementById("renderBtn").addEventListener("click", checkInput);

//tämä on jäänyt kesken. ennen oli country code kenttä. 
function checkInput() {
  clearChart();
  clearCountryData();

  let countryInput = document.getElementById("selectCountryDropdown");
  let indicatorCode = document.getElementById("selectIndicators").value;

  if (!countryInput.checkValidity()) {
    document.getElementById("dropdownError").innerHTML =
      "Please choose a country!";
    document.getElementById("chartContainer").style.backgroundColor =
      "var(--bg-color)";
  }
  else if (indicatorCode === "empty") {
    document.getElementById("dropdownError").innerHTML =
      "Please select an indicator from the list.";
    document.getElementById("chartContainer").style.backgroundColor =
      "var(--bg-color)";
  }
  else {
    document.getElementById("dropdownError").innerHTML = "";
    document.getElementById("chartContainer").style.backgroundColor =
      "var(--bg-color)";
    fetchGraphData();
    fetchCountryData();
  }
}

function clearChart() {
  if (currentChart) {
    // Clear the previous chart if it exists
    currentChart.destroy();
  }
}

function clearCountryData() {
  document.getElementById("countryName").textContent = "";
  document.getElementById("region").textContent = "";
  //remove country flag if it already displayed
  if (document.getElementById("flagContainer").firstChild !== null) {
    document.getElementById("flagContainer").firstChild.remove();
  }
}

async function fetchGraphData() {
  let countryCode = document.getElementById("selectCountryDropdown").value;
  let indicatorCode = document.getElementById("selectIndicators").value;
  const baseUrl = "https://api.worldbank.org/v2/country/";
  //API default format is XML
  //Fetch since 1960 in JSON format
  const url =
    baseUrl +
    countryCode +
    "/indicator/" +
    indicatorCode +
    "?per_page=60" +
    "&format=json";
  console.log("Fetching population data from URL: " + url);

  try {
    const response = await fetch(url);
    //Throw an error when the response is not OK => proceeds directly to catch
    if (!response.ok) {
      console.log(response.status);
      throw new Error("Network error.");
    } else if (response.status == 200) {
      let fetchedData = await response.json();
      console.log(fetchedData);
      //only error message received
      if (fetchedData[0].message) {
        throw fetchedData[0].message[0].value;
      }
      let data = getValues(fetchedData);
      let labels = getLabels(fetchedData);
      let countryName = getCountryName(fetchedData);
      let indicatorName = getIndicatorName(fetchedData);
      renderChart(data, labels, countryName, indicatorName);
      document.getElementById("chartContainer").style.backgroundColor = "white";
    }
  } catch (err) {
    renderError("Population data could not be retrieved. " + err);
  }
}

function getValues(data) {
  let valuesRaw = data[1]
    .sort((a, b) => a.date - b.date)
    .map((item) => item.value);
  //round pergentages to 2 decimals
  let values = valuesRaw.map((item) => Math.round(item * 100) / 100);
  return values;
}

function getLabels(data) {
  let labels = data[1].sort((a, b) => a.date - b.date).map((item) => item.date);
  //remove last label if the value of the year is null
  if (labels[length - 1] == null) {
    labels.pop();
  }
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
  document.getElementById("chartError").textContent = message;
}

function renderChart(data, labels, countryName, indicatorName) {
  let ctx = document.getElementById("populationChart").getContext("2d");

  var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  gradientStroke.addColorStop(0, "#99ff33");
  gradientStroke.addColorStop(1, "#66ffcc");

  var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
  gradientFill.addColorStop(0, "rgba(153, 255, 51, 0.5)");
  gradientFill.addColorStop(1, "rgba(102, 255, 204, 0.5)");

  // Draw new chart
  currentChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: indicatorName + ", " + countryName,
          data: data,
          borderColor: gradientStroke,
          backgroundColor: gradientFill,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Millions",
            },
            ticks: {
              beginAtZero: true,
              callback: function (value, index, values) {
                if (parseInt(value) >= 100) {
                  return value / 1000000;
                } else {
                  return value;
                }
              },
            },
          },
        ],
      },
    },
  });

  if (indicatorName.includes("ages")) {
    currentChart.options.scales.yAxes[0].scaleLabel.labelString = "Percentage";
    currentChart.update();
  }
}

function renderCountryInfo(countryData) {
  document.getElementById(
    "countryName"
  ).textContent = `Native name: ${countryData.nativeName}`;
  document.getElementById(
    "region"
  ).textContent = `Region: ${countryData.region}`;
  //create a new image and set src, alt and id (for styling via CSS)
  var img = document.createElement("img");
  img.src = `${countryData.flag}`;
  img.alt = "Flag";
  img.id = "flag";
  //if country flag is already displayed
  if (document.getElementById("flagContainer").firstChild !== null) {
    document.getElementById("flagContainer").firstChild.remove();
  }
  document.getElementById("flagContainer").appendChild(img);
}

async function fetchCountryData() {
  let countryCode = document.getElementById("selectCountryDropdown").value;
  //filter by nativeName, region, flag
  const restUrl = `https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=name;nativeName;region;flag`;
  console.log("Fetching country's data from URL: " + restUrl);

  try {
    const response = await fetch(restUrl);
    //Throw an error when the response is not OK => proceeds directly to catch
    if (!response.ok) {
      throw new Error("response status " + response.status);
    } else if (response.status == 200) {
      let fetchedData = await response.json();
      console.log(fetchedData);
      renderCountryInfo(fetchedData);
    }
  } catch (err) {
    //country data error will not be shown on screen since app can still display the graph
    console.log("Country data fetch failed.", err);
  }
}
