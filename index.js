const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const { username, password } = require('./creds')

// COLLECT URLS
const loginURL = 'https://www.linkedin.com/uas/login'
const pageToScrape = 'https://www.linkedin.com/groups/47530/members'

// CONFIGURE REGEX PATTERNS
const urlRegex = /https:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/
const customRegex = /id="hovercard-\d+">(.+)<\/span><\/p><p class="entity-headline">(.+)<\/p><p/;

(async () => {
  // START PUPPETEER
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // LOGIN
  await page.goto(loginURL)
  await page.waitForSelector('#mini-profile--js')
  await page.type('#session_key-login', username)
  await page.type('#session_password-login', password)
  await page.click('#btn-primary')

  // REDIRECT TO NEW PAGE
  await page.goto(pageToScrape)
  await page.waitForSelector('.member-view')

  let members = await page.$$eval('.member-entity', el => {
    return el.map((e) => e.innerHTML)
  })

  for (let member of members) {
    member = member.replace(/\n/g, ' ')
    let profileURL = member.match(urlRegex)
    let group = member.match(customRegex)
    let name = group[1].replace(/,/g, ' - ')
    let headline = group[2].replace(/,/g, ' - ')
    await fs.appendFile('out.csv', `${profileURL},${name},${headline}\n`)
  }

  await page.click('.next')

  await page.waitFor(5000)

  await browser.close()
})()

// ADDITIONAL FUNCTIONALITY
// TAKE A SCREENSHOT
// await page.screenshot({ path: 'example.png' })
