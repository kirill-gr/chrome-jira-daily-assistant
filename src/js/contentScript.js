let dailyState = {
    current: 0
};
let swimlaneIds = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function init() {
    swimlaneIds.length = 0;
    document.querySelectorAll('[class~="ghx-swimlane"]').forEach(
        value => swimlaneIds.push(value.attributes['swimlane-id'].value)
    );
    shuffleArray(swimlaneIds);
    dailyState.current = 0;
    chrome.runtime.sendMessage({
        message: "initDoneEvt",
        swimlaneIds: swimlaneIds
    })
}

function next() {
    if (dailyState.current === swimlaneIds.length) {
        return
    }
    let swimlaneId = swimlaneIds[dailyState.current++];
    let swimlane = document.querySelector(`[class~="ghx-swimlane"][swimlane-id="${swimlaneId}"]`);
    swimlane.scrollIntoView();
    let columnHeaders = document.getElementById("ghx-column-headers");
    let headerStalker = document.getElementById("ghx-swimlane-header-stalker");
    // workaround for column headers covering the swimlane
    let pool = document.getElementById("ghx-pool");
    if (swimlane.classList.contains("ghx-first")) {
        pool.scrollBy(0, -(columnHeaders.offsetHeight + headerStalker.offsetHeight))
    } else {
        pool.scrollBy(0, -(headerStalker.offsetHeight - 1));
    }
    chrome.runtime.sendMessage({
        message: "updateStateEvt",
        swimlaneCurrent: dailyState.current
    })
    if (dailyState.current === swimlaneIds.length) {
        chrome.runtime.sendMessage({
            message: "noMoreParticipants"
        })
    }
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