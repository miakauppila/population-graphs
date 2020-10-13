# Population Graphs

## Front-end application for retrieving and visualizing World Bank population data

- The user chooses a country and selects the desired indicator.
- The application fetches population data from [World Bank Open Data](https://data.worldbank.org/).
- The data is displayed in a graph created with Chart.js.
- Country metadata incl. flag is retrieved from [REST Countries](https://restcountries.eu/).

## Try the app:

### This project was created during the #mimmitkoodaa MOOC by Sympa in 2020. Afterwards I modified my application.

- The app shows data since 1960 until 2019.
- The user can choose the country from a dropdown list.
- The user can choose the graph to show. There are five different indicators available:
  - Total population
  - Population in largest city
  - Population ages 0-14
  - Population ages 15-64
  - Population ages > 65
- New indicators were added to API calls.
- A function for checking the user input validity and for clearing the chart was added.
- The graph displays a label for the Y-scale. The label changes depending on the chosen indicator ('Millions' or 'Percentage'). Applicable tickmarks are also shown.
- Country flag, native name and region are shown above the graph.

## How to install & run

Download the files and open the file index.html using a browser.

## World Bank data

Population data is retrieved from the World Bank (CC BY 4.0). For more information see [About the Indicators API Documentation](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation).
