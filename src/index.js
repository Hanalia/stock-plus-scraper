

const fs = require('fs')
const path = require('path')
const puppeteer = require("puppeteer");



async function convertToCSV(arr, filename) {
  const array = [Object.keys(arr[0])].concat(arr)

  const convertedArray = array.map(row => {
    return Object.values(row).map(value => {
      return typeof value === 'string' ? JSON.stringify(value.replaceAll('"', "'")) : value
    }).toString()
  }).join('\n')

  fs.writeFile(`${filename}.csv`, convertedArray, "utf8", () => {
  });
}



//returns a result object
async function getTopicDetails(page, url) {


  await page.goto(url);

  // waitfor  Loading
  await page.waitForSelector('.topicTop a')
  await sleep(1500)
  try {
    const percentageToNum = (percentageAsString) => percentageAsString.replace("+", "")

    // return get values
    const title = await page.evaluate(`document.querySelector(".topicTop a").textContent`).then(a => a.slice(3));
    const dayChange = await page.evaluate(`document.querySelector(".topicTop em span").textContent`).then(a => percentageToNum(a));

    const items = await page.evaluate(() => {
      const percentageToNum = (percentageAsString) => percentageAsString.replace("+", "")

      let elements = [...document.querySelectorAll(".topicChart ul.f_clear li")];
      const results = elements.map(el => percentageToNum(el.querySelector("em")?.textContent.trim()))
      return results;
    });
    const [weekChange, monthChange, semesterChange] = items

    const topicText = await page.evaluate(`document.querySelector(".topicExp").textContent`);

    const tickerList = await page.evaluate(() => {
      let elements = [...document.querySelectorAll(".topicTable tbody")];
      const results = elements.map(el => {
        let name = el.querySelector(".lAlign")?.textContent.trim()
        let change = el.querySelector("span")?.textContent.trim()
        return (`${name} (${change})`)
      })
      return results;
    });

    console.log({ tickerList })
    const tickerLength = tickerList.length

    const result = {
      dateTime: new Date().toISOString().replace('T', ' ').substr(0, 19),
      url: url,
      title,
      dayChange,
      weekChange,
      monthChange,
      semesterChange,
      tickerLength,
      tickerList: tickerList.join(",")
    }
    console.log(url)
    return result
  } catch (e) {
    console.log("error", e)
    return []
  }
}


function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


async function getData() {

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  // start page
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(60000); // set default timeout to 1 min for more waiting just incase

  // const pageNoArray = [...Array(1000).keys()]
  const pageNoArray = [9, 52, 145, 149, 150, 154, 169, 174, 194, 196, 201, 204, 206, 214, 215, 217, 218, 222, 223, 228, 229, 230, 232, 234, 236, 237, 238, 239, 243, 245, 251, 256, 260, 267, 268, 269, 271, 272, 273, 276, 279, 280, 281, 283, 286, 287, 291, 297, 298, 299, 300, 305, 308, 311, 312, 314, 316, 320, 321, 323, 326, 330, 334, 340, 341, 343, 344, 347, 349, 352, 366, 367, 375, 379, 385, 394, 397, 400, 402, 407, 410, 413, 426, 428, 433, 436, 441, 446, 447, 458, 460, 462, 476, 487, 507, 509, 510, 515, 516, 532, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 551, 552, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 570, 572, 573, 575, 576, 577, 579, 581, 582, 584, 585, 586, 588, 589, 592, 594, 595, 596, 600, 601, 602, 603, 604, 605, 606, 607, 608, 610, 611, 612, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 666, 675, 677, 705, 710, 720, 727, 728, 729, 734, 738,]

  let finalResult = []

  for (const pageNo of pageNoArray) {
    try {
      const url = `https://stockplus.com/m/investing_strategies/topics/${pageNo}`
      const result = await getTopicDetails(page, url)
      finalResult.push(result)


    } catch (err) {
      console.log('err', err)
    }
  }

  await browser.close()
  return finalResult.filter(arr => arr.length != 0)
}


getData().then((result) => convertToCSV(result, "resultTest"));
