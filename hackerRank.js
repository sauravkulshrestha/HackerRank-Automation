const puppeteer = require("puppeteer");
const {email} = require('./secrets.js');
const {password} = require('./secrets.js');
const {answer} = require('./codes');

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
    let allquerypromise = curTab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
    return allquerypromise;
})
.then(function () {
    function getAllQUesLink() {
        let allElemArr = document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
        let linkArr = [];
        for (let i = 0; i < allElemArr.length; i++) {
           linkArr.push(allElemArr[i].getAttribute("href"));
            
        }
        return linkArr;
    }
    let linkArrayPromise = curTab.evaluate(getAllQUesLink);
    return linkArrayPromise;
})
.then(function (linkArr) {
    // console.log(linkArr);
    console.log("Link to all questions recived");
    let questionWillBeSolvedPromise = questionSolver(linkArr[0] , 0);
    for (let i = 1; i < linkArr.length;i++) {
        questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
            return questionSolver(linkArr[i] , i);
        })
    }
    return questionWillBeSolvedPromise;
})
.then(function () {
    console.log("Question is solved");
})

.catch(function (err) {
    console.log(err);
});
function WaitnClick(algoBtn) {
    let waitandclickPromise  = new Promise(function(resolve , reject){
        let waitforselectorpromise = curTab.waitForSelector(algoBtn);
        waitforselectorpromise
        .then(function () {
            console.log("Algo btn found");
            let AlgobtnClickPromise = curTab.click(algoBtn);
            return AlgobtnClickPromise;
        })
        .then(function () {
            console.log("Algo btn clicked");
            resolve();
        })
        .catch(function (err) {
            console.log(err);
        })
    });
    return waitandclickPromise;
}

function questionSolver(url , idx) {
    return new Promise(function (resolve , reject) {
        let fullLink = `https://www.hackerrank.com${url}`;
        let gotoQuestionpromise = curTab.goto(fullLink);
         gotoQuestionpromise

         .then(function () {
          console.log("question page opened");

          let inputBoxClickedPromise = WaitnClick(".checkbox-input");
          return inputBoxClickedPromise;
        })
        .then(function () {
            console.log("Check box clicked");
            let waitForTextBoxPromise = curTab.waitForSelector(".custominput");
            return waitForTextBoxPromise;
        })
        // .then(function () {
            // console.log("Text box found");
            //     let textBoxClicked = curTab.click(".custominput");
            //     return textBoxClicked;
            // })
            .then(function () {
                  console.log("Text box found");
            let codeWillBeTypedPromise = curTab.type(".custominput", answer[idx], {
            //   delay: 100,
            });
            return codeWillBeTypedPromise;
          })
          .then(function () {
            console.log("answer is typed in cunstom box");
            let controlKeyIsPressed = curTab.keyboard.down("Control");
            return  controlKeyIsPressed;
        })
        .then(function () {
            console.log("Control Key pressed");
            let aKeyIsPressed = curTab.keyboard.down("a");
            return  aKeyIsPressed;
          })
        .then(function () {
            console.log("a Key pressed");
            let xKeyIsPressed = curTab.keyboard.down("x");
            return  xKeyIsPressed;
        })
        .then(function () {
              console.log("x Key pressed");
            let controlKeyIsPressed = curTab.keyboard.up("Control");
            return  controlKeyIsPressed;
        })
        .then(function () {
            console.log("Control button released");
            let cursorOnTheEditorPromise = curTab.click(".monaco-editor.no-user-select.vs");
            return cursorOnTheEditorPromise;
        })
        .then(function () {
            console.log("cursor on editor");
            let controlKeyIsPressed = curTab.keyboard.down("Control");
            return  controlKeyIsPressed;
        })
        .then(function () {
            console.log("Control Key pressed");
            let aKeyIsPressed = curTab.keyboard.down("a");
            return  aKeyIsPressed;
          })
          .then(function () {
            console.log("a Key pressed");
            let vKeyIsPressed = curTab.keyboard.down("v");
            return  vKeyIsPressed;
          })
          .then(function () {
              console.log("v key pressed");
              let sumbitBtnClickedPromise = curTab.click(".hr-monaco-submit");
              return sumbitBtnClickedPromise;
          })
          .then(function(){
              console.log("code sumbit successsfully");
              resolve();
          })

        .catch(function (err) {
            console.log(err);
        });
    });
    
}

