## Table of Contents

* [About](#about)
* [Assumptions](#assumptions)
* [Methodology](#methodology)
* [Built With](#built-with)
* [Getting Started](#getting-started)
* [Issues](#issues)
* [Contact](#contact)


## About

Read the percentage chance of rain for three days in the future. If the percentage value is > 50%, fail the test with the message `Looks like it will be a rainy day on 24th of April`, where the substring `24th of April` is dynamic. Otherwise, the test passes.

## Assumptions
The data on `http://www.bom.gov.au/nsw/forecasts/sydney.shtml` appears to be a 7 day forecast, with the first day in the forecast being today. Given that I don't know the exact business logic behind the forecast, I will assume there will always be 7 days of forecast data, and that the first day will always be today. I then assume that the 3rd set of data on the page (using 0 indexing) will always be three days ahead of the current date, i.e. our target date to assert against. Obviously this may be incorrect (I haven't seen how the app functions when it's at the end of the month, or the end of the year), but without any other knowledge I will consider these assumptions to be sufficient.

## Methodology
We use a `beforeEach` hook to visit the url that is read from the `playwright.config.ts` file. I grab the `textContent` from all `.day` elements, and given our assumption above, we will consider the third element in this array to be our target percentage value. It isn't ideal to use classnames, but this seems to be the easiest method of getting the desired text given the lack of other unique selectors. I get the percentage value through a regex match. I use Day.js to format the date for our error message. Generally I try to avoid using external libraries, but in this case Day.js helps reduce complexity; the boundary cases of calculating three days from today's date when at the end of a month, or at the end of the year, could be complex to implement - it's simpler and (probably) safer to use an external library built for this purpose.

I have not used the page object model architecture, as the above test is too small/short to justify scaffolding out a POM framework.

## Built With:

* Playwright
* TypeScript
* Day.js

## Getting Started

To get a local copy up and running follow these steps:

1. clone the repo
2. run `npm install`
3. run `npx playwright test chanceOfRain.spec.ts`

## Issues
The tests seem to fail in GitHub Actions for a reason that isn't clear (maybe anti-scraping/anti-bot measures?). Locally the tests run fine.

## Contact

Ezra Mizrahi - ezra.mizrahi@hey.com