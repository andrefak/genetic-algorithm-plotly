# Genetic Max Value Calculator

Given a two variable function, the program calculates the maximum possible value using a genetic algorithm based on three different evolution methods.

## How to Use
Select the desired function on the top of the page (you may also input a custom function using JS syntax). Then, select whether you want to plot the function you chose (it may slow down the execution). You can also select the specific methods that will be used in the analysis (elitism, roulette or tourney) - you will be able to see their comparison. At last, it's also possible to change the generation size, number of individuals and mutation ratio. Click in *"Generate!"* to see the evolution!

## Methods

### Elitism
In this method, the *best individual* (the one that has the highest fitness value) will be selected to crossover with every other individual.

### Roulette
Two individuals will be randomly selected to be the parents of each new individual. The *best individual* is preserved.

### Tourney
Two individuals will be randomly selected for a "fight". Whoever wins the fight is selected for crossover.

#### Specifications
This project was made in *javascript*, using the *[Plotly](https://plot.ly/)* library.

### Authors
André Fakhoury, Thiago Preischadt and Vitor Santana.
USP-ICMC Students.
