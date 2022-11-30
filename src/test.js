const path = require("path");

const chromeLocalPath = path.normalize("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
const path2 = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
console.log(chromeLocalPath)
const os = require('os');
const desktopDir = path.join(os.homedir(), "Desktop");
console.log(desktopDir);
const testAgain = path.win32.normalize(String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`)
console.log("last", testAgain)