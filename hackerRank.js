const puppeteer = require("puppeteer");
let email = "sauravkul0@gmail.com";
let password = "Saurav@2000";


let curTab;
let browserOPenPromise = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--start-maximized"],
//   executablePath: "/path/to/Chrome",
});
browserOPenPromise // fulfill 
    .then(function (browser) {
    console.log("browser is open");

    let allTabsPromises = browser.pages();
    return allTabsPromises;   
})

.then(function (allTabsArr){
    curTab = allTabsArr[0];
    console.log("new tab opnened");
    let visitingLoginPagePromise = curTab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function() {
    console.log("hackerRank opened");
    let emailwillbeTypedPromise = curTab.type("input[name='username']" , email);
    return emailwillbeTypedPromise;
})
.then(function() {
    console.log("email typed");
    let passwordwillbeTypedPromise = curTab.type("input[name='password']" , password);
    return passwordwillbeTypedPromise;
})
.then(function () {
    console.log("password has been typed");
    let willBeloggedin = curTab.click( ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    return willBeloggedin;
})
.then(function () {
    console.log("logged into hackerank Successfully");
})
.then(function () {
    let AlgoWillBeClickedPromise = WaitnClick("div[data-automation='algorithms']");
    return AlgoWillBeClickedPromise;
})
.then(function () {
    console.log("Algo page is opened");
})
.catch(function (err) {
    console.log(err);
});
function WaitnClick(algoBtn) {
    let waitandclickPromise  = new Promise(function(resolve , reject){
        let waitforselectorpromise = curTab.waitForSelector(algoBtn);
        waitforselectorpromise
        .then(function () {
            console.log("ALog btn found");
            let AlgobtnClickPromise = curTab.click(algoBtn);
            return AlgobtnClickPromise;
        })
        .then(function () {
            console.log("Algo btn clicked");
        })
        .catch(function (err) {
            console.log(err);
        })
    });
    return waitandclickPromise;
}

