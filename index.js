const puppeteer = require('puppeteer')

const listOfPages = [
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=10',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=20',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=30',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=40',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=50',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=60',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=70',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=80',
  'https://www.indeed.com/jobs?q=javascript+remote&l=United+States&start=90'
]

const cssSelector = '#resultsCol .row[data-tn-component="organicJob"]'

const scrape = async (pageToScrape) => {
  const browser = await puppeteer.launch({ devtools: false, headless: false, args: ['--start-fullscreen'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 2080, height: 1200 })

  // CONFIGURE LOGIN IF NECESSARY
  // const { username, password } = require('./creds')
  // const loginURL = 'https://www.linkedin.com/uas/login'
  // await page.goto(loginURL, { 'waitUntil': 'networkidle0' })
  // await page.type('#session_key-login', username)
  // await page.type('#session_password-login', password)
  // await page.click('#btn-primary')

  // START SCRAPING

  await page.goto(pageToScrape, { 'waitUntil': 'networkidle0' })

  // FORMAT RESULTS
  let results = await page.$$eval(cssSelector, el => {
    return el.map((e) => {
      return {
        // url: e.children[0].innerHTML,
        position: e.children[0].innerText,
        company: e.children[1].innerText,
        location: e.children[2].innerText
      }
    })
  })

  // EXTRACT LINKS FROM ELEMENTS
  // const urls = await page.evaluate(() => {
  //   const links = Array.from(document.querySelectorAll('.pagination > a'))
  //   return links.map(link => link.href)
  // })

  // HANDLE BUTTON PAGINATION
  // await page.click('.pagination > a:nth-child(6) > span')
  // await page.waitFor(5000)

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
  
  // MATCH EVERY CHARACTER BETWEEN THIS IS AND SENTENCE
  // rgx = /(?<=This is)(.*)(?=sentence)/
  // str.match(rgx)[0]

  // WRITE TO CSV
  // const fs = require('fs-extra')
  // for (let result of results) {
  //   await fs.appendFile('results.csv', `${profileURL},${name},${headline}\n`)
  // }

  // TAKE A SCREENSHOT
  // await page.screenshot({ path: 'example.png' })
  
  // SYNCHRONOUS TIMEOUT
  // await new Promise(done => setTimeout(() => done(), 2000));

  await browser.close()
  return results
}

(async function runMultiPageScrape () {
  let fullResults = []
  let start = new Date()
  for (let page of listOfPages) {
    const result = await scrape(page)
    fullResults.push(...result)
  }
  let end = new Date()
  console.log(fullResults.length, 'results collected in', (end - start) / 1000, 'seconds')
})()
