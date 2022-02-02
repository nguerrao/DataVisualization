# Milestone 1

What do you know about Co2 emissions?

A project to learn about Co2 emissions to understand the challenges we are facing with climate change. 

## Dataset

We will use multiple datasets for each part of our visualization:

- First we show global emissions per sectors and countries. We will be using Greenhouse Gas Emissions by Country and Economic Sector [data]((https://resourcewatch.org/data/explore/cli008-Greenhouse-Gas-Emissions-by-Country-and-Sector-Full-Longform?hash=layers&section=Discover&zoom=1&lat=0&lng=0&pitch=0&bearing=0&basemap=dark&labels=light&layers=%255B%257B%2522dataset%2522%253A%2522a290675c-9528-4a51-8201-f6c2d7848744%2522%252C%2522opacity%2522%253A1%252C%2522layer%2522%253A%2522c0c8ee6e-5cd4-4c9d-bd10-ce6545b26fef%2522%257D%255D&page=1&sort=most-viewed&sortDirection=-1)), that was obtained from this ClimateWatch [dataset](https://www.climatewatchdata.org/data-explorer/historical-emissions?historical-emissions-data-sources=71&historical-emissions-gases=246&historical-emissions-regions=All%20Selected&historical-emissions-sectors=843&page=3#data).
The raw data can be seen [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-wizards/blob/master/milestones/datasets/historical_global_emissions.csv).
It corresponds to historical data ranging from 1990 until 2017 of emissions per countries and sector. We will focus on the most recent data (2017).
For the preprocessing, to keep the analysis simple, we decided to split the data into 5 sectors: 
  - Energy (electricity production and heat)
  - Industry (industrial processes and manufacture)
  - Transport
  - Agriculture (with deforestation and food waste)
  - Other

We are using the MtCo2e metric (Million tons of carbon dioxide equivalent), which means that we consider the green house gases altogether.

- After the global overview, we will focus on the energy sector. The data is already clean and comes from the following [Github repository](https://github.com/owid/energy-data). The raw data can be accessed [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-wizards/blob/master/milestones/datasets/electricity_emissions.csv). It shows the energy obtained from different sources (nuclear, fossil, wind...).

- Similarly, we will have a dataset for the industrial sector. It was obtained from references of the following [paper](https://www.nature.com/articles/s41561-021-00690-8#MOESM3). The raw data is accessible [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-wizards/blob/master/milestones/datasets/industry_emissions.csv). It corresponds to the emission in Giga tons of Co2 equivalent per year, for each type of material (cement, iron, steel, plastic...).

- The next part will be about the agriculture sector. For this part, we have decided to show the kg of Co2 emissions per kg of food. Thus, we would like to compare various kinds of food and their relative emissions. The data is from [OurWorldInData](https://ourworldindata.org/food-choice-vs-eating-local). It is already clean. The raw data can be seen [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-wizards/blob/master/milestones/datasets/food_emissions.csv).

- Finally, we will have a look at the transportation sector. We found the data on the International Energy Agency [website](https://www.iea.org/data-and-statistics/charts/transport-sector-co2-emissions-by-mode-in-the-sustainable-development-scenario-2000-2030). We preprocessed it to only keep the most recent data (2020). The raw file can be seen [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-wizards/blob/master/milestones/datasets/transport_emissions.csv). We converted the metrics to have, for each kind of transportation its Million tons of Co2 equivalent for each year.


## Problematic

#### What am I trying to show with my visualization?

The goal of our project is to give a better understanding of Co2 emissions and how it impacts the climate. Indeed, tackling this problem has become a priority, and the young generation is taking actions through activism, entrepreneurship or in politics. 
However, some facts about global Co2 emissions are still not known, and might sometimes be unclear. Experts often use different metrics, and their reports can be hard to follow.

As as result, we would like to give an easily understandable overview of the various emissions, and hope to educate the users of our website with different interactions.

We will follow a top-down approach:

- First, we will show the global situations of Co2 emissions. The goal, will be to understand the contribution of each sector (Energy and Heat, Industry, Agriculture and deforestation, and finally Transportation). Moreover, we would like to show the contribution of each country.

- Then, we will dive deeper into each sector and provide an interactive experience for the users.
For each sector, the user will learn about uncommon facts. For example, regarding the agriculture section, we want the user to realize what are the footprint of the food he/her consummes. Also, if we look at the transportation sector, it is not known that aviation represents less than 10% of the total sector emissions, and road transportation is responsible for more than 75% of it.

- Finally, we would like to have an interaction with the user so that he can learn more about its own lifestyle footprint.

Our motivation is to educate people about the climate change topic, and especially about Co2 emissions. We target all people that would like to know more about this topic and especially the ones that struggle to make sense of all the available ressources.

## Exploratory Data Analysis

You can see all our preprocessing and a first analysis of the data in the following [notebook](https://github.com/com-480-data-visualization/data-visualization-project-2021-wizards/blob/master/milestones/eda.ipynb). We have't yet saved the preprocessed data, as it might evolve before we build our visualizations and website.

## Related work

#### What others have already done with the data?

There are various websites that offer visualization of data related to Co2 emissions. However, usually they do not provide context about emissions and metrics they use, their analysis is either only global (countries and sector) or only focus on one sector. When searching for data, we also found various visualizations (see sources from the Dataset section).
Bill Gates and its foundation for climate change, have already tried to make the topic of Co2 emissions simple.

#### Why is your approach original?

First of all, we are combining multiple sources that haven't been gathered before. As a result, we would like to give a complete overview of Co2 emissions, starting from global data, and then exploring each sector in more details.

Then, we would like to link both visualizations and simple explanations so that a large audience can understand.

Finally, we would like to make the experience interactive to engage the user and show him/her how his/her lifestyle affects the climate.

#### What source of inspiration do you take?

We took inspiration from the work of Bill Gates, with his new book about climate change. We wanted to make a more visual and interactive experience. His foundation for the climate, [Breakthrough Energy](https://www.breakthroughenergy.org/), has already done various visualizations about emissions that are inspiring.

Regarding the lifestyle footprint, we took inspiration from the [footprint calculator](https://www.footprintcalculator.org/food1) website.

We would like to build a map of the world, and took inspirations from various choropleth maps, like this [one](http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f) done in D3.js.
