# Population Graphs

## Front-end application for retrieving and visualizing World Bank population data  
- The user inputs a three letter country code (ISO3 format) and chooses the desired indicator.
- The application fetches data from World Bank API.  
- The data is displayed in a graph created with Chart.js.

### This project was created during a MOOC in April 2020. Afterwards I modified my version:  
- The app now shows data since 1960 until 2018 (data for 2019 is not yet available).
- The user can choose the type of graph to show. There are five different indicators available:
    - Total population
    - Population in largest city
    - Population ages 0-14
    - Population ages 15-64
    - Population ages > 65
- New indicators were added to API calls.  
- A function for checking the country code validity was added as well as a function for clearing the chart.  
- In case of invalid country code, the old chart is removed from the screen. 
- The graph now displays a label for the Y-scale. The label changes depending on the chosen indicator ('Millions' or 'Percentage').
- The graph also shows tickmarks in millions for the indicators 'Total population' and 'Population in largest city'. 
- Background color and other style changes were made.