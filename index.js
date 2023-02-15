import puppeteer from "puppeteer";

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n * 1000);
}

async function type() {
  // visit monkeytype.com with puppeteer
  const url = "https://monkeytype.com/";
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  // // press the class "acceptAll" in the popup with id "cookiePopup"
  // await page.click("#cookiePopup .acceptAll");
  // only if the #cookiePopup is visible
  const cookiePopup = await page.$("#cookiePopup");
  if (cookiePopup) {
    await page.click("#cookiePopup .acceptAll");
  }
  sleep(2);
  await page.click("#testConfig > div > div.mode > div:nth-child(2)");

  sleep(2); // Change this duration to delay the typing speed

  // loop through the class "word" and loop through letter tag and fetch the text
  // now keypress the fetched text
  // after each loop in the word class, press the spacebar
  const words = await page.$$(".word");
  for (let i = 0; i < words.length; i++) {
    const letters = await words[i].$$("letter");
    for (let j = 0; j < letters.length; j++) {
      await page.keyboard.press(
        await letters[j].evaluate((node) => node.innerText)
      );
    }
    await page.keyboard.press("Space");
  }
}

type();
