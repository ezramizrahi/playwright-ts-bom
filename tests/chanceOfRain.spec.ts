import { test, expect, type Locator } from '@playwright/test';
import dayjs from 'dayjs';
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat)

const precipPercentageThreshold: number = 50;
// any turns off type checking for selectors, but that's ok because that won't really impact anything
const selectors: any = {
  day: '.day'
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('three days from now it will not be rainy', async ({ page }) => {
  await page.getByTestId('Sydney forecast').click();
  await page.waitForLoadState('load');
  const day:Locator = page.locator(selectors.day);
  const dayTextArray: (string|null)[] = await day.evaluateAll(d => d.map(element => element.textContent));
  const targetDayText: string|null = dayTextArray[3];
  const precipPercentageNumValue: number = await getPrecipPercentageNumValue(targetDayText);
  const targetDate: string = await getFormattedTargetDate();
  expect(precipPercentageNumValue, `Looks like it will be a rainy day on ${targetDate}`).toBeLessThan(precipPercentageThreshold);
});

async function getPrecipPercentageNumValue(percentageText: string|null) {
  if (percentageText === null) {
    throw new Error("Could not find percentage text. Consider placing sufficient guards before you try to get the textContent of an element.");
  };
  const regex = /(?<=: )\w+(?=%)/g; // => matches everything between ": " and "%"
  const matched = percentageText.match(regex);
  return Number(matched![0]); // => returns e.g. 80
};

async function getFormattedTargetDate() {
  const todayPlusThree = dayjs().add(3, 'day');
  const targetDay: string = todayPlusThree.format('Do'); // => get ordinal date e.g. 24th
  const targetMonth: string = todayPlusThree.format('MMMM'); // => get full name of month e.g. April
  return targetDay + ' ' + targetMonth; // => returns a string e.g. 'April 24th'
};