let dailyState = {
    current: 0
};
let swimlanes = [];

let pool = document.getElementById("ghx-pool");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function init() {
    swimlanes.length = 0;
    document.querySelectorAll('[class~="ghx-swimlane"]').forEach(
        (value) => swimlanes.push(value)
    );
    shuffleArray(swimlanes);
    dailyState.current = 0;
    chrome.runtime.sendMessage({
        message: "initDoneEvt",
        swimlaneCurrent: dailyState.current,
        swimlanesTotal: swimlanes.length
    })
}

function next() {
    let swimlane = swimlanes[dailyState.current++];
    swimlane.scrollIntoView();
    let columnHeaders = document.getElementById("ghx-column-headers");
    let headerStalker = document.getElementById("ghx-swimlane-header-stalker");
    // workaround for column headers covering the swimlane
    if (swimlane.classList.contains("ghx-first")) {
        pool.scrollBy(0, -(columnHeaders.offsetHeight + headerStalker.offsetHeight))
    } else {
        pool.scrollBy(0, -(headerStalker.offsetHeight - 1));
    }
    chrome.runtime.sendMessage({
        message: "updateStateEvt",
        swimlaneCurrent: dailyState.current
    })
}

chrome.runtime.onMessage.addListener(
    (request) => {
        switch (request.message) {
            case "startDaily":
                init();
                break;
            case "nextPerson":
                next();
                break;
            default:
                console.log("Daily Stand up script: Unknown command");
        }
    });