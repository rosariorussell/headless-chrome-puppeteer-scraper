const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // CONFIGURE LOGIN IF NECESSARY
  // const { username, password } = require('./creds')
  // const loginURL = 'https://www.linkedin.com/uas/login'
  // await page.goto(loginURL, { 'waitUntil': 'networkidle0' })
  // await page.type('#session_key-login', username)
  // await page.type('#session_password-login', password)
  // await page.click('#btn-primary')

  // START SCRAPING
  const pageToScrape = 'https://www.indeed.com/jobs?q=javascript+remote&l=United+States'
  const cssSelector = '#resultsCol .row[data-tn-component="organicJob"]'
  await page.goto(pageToScrape, { 'waitUntil': 'networkidle0' })

  // FORMAT RESULTS
  let results = await page.$$eval(cssSelector, el => {
    return el.map((e) => {
      return {
        position: e.children[0].innerText,
        company: e.children[1].innerText,
        location: e.children[2].innerText
      }
    })
  })

  // PERFORM REGEX IF NECESSARY
  // const urlRegex = /https:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/
  // const customRegex = /id="hovercard-\d+">(.+)<\/span><\/p><p class="entity-headline">(.+)<\/p><p/;
  // for (let result of results) {
  //   result = result.replace(/\n/g, ' ')
  //   let profileURL = result.match(urlRegex)
  //   let group = result.match(customRegex)
  //   let name = group[1].replace(/,/g, ' - ')
  //   let headline = group[2].replace(/,/g, ' - ')
  // }

  // WRITE TO CSV
  // const fs = require('fs-extra')
  // for (let result of results) {
  //   await fs.appendFile('results.csv', `${profileURL},${name},${headline}\n`)
  // }

  // TAKE A SCREENSHOT
  // await page.screenshot({ path: 'example.png' })

  // OTHER COMMON PUPPETEER FUNCTIONS
  // await page.click('.next')
  // await page.waitFor(5000)

  console.log(results)

  await browser.close()
})()
