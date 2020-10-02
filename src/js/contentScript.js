let dailyState = {
    current: 0,
    swimlaneIds: []
};

chrome.storage.local.get("currentSwimlaneId", (value) => {
    console.log(value.currentSwimlaneId)
    if (!!value.currentSwimlaneId) {
        dailyState.current = Number.parseFloat(value.currentSwimlaneId)
    }
})
chrome.storage.local.get("swimlineIds", (value) => {
    console.log(value.swimlineIds)
    if (!!value.swimlineIds) {
        dailyState.swimlaneIds = value.swimlineIds;
    }
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function init() {
    dailyState.swimlaneIds.length = 0;
    document.querySelectorAll('[class~="ghx-swimlane"]').forEach(
        value => dailyState.swimlaneIds.push(value.attributes['swimlane-id'].value)
    );
    shuffleArray(dailyState.swimlaneIds);
    dailyState.current = 0;
    chrome.runtime.sendMessage({
        message: "initDoneEvt",
        swimlaneIds: dailyState.swimlaneIds
    })
}

function next() {
    if (dailyState.current === dailyState.swimlaneIds.length) {
        return
    }
    let swimlaneId = dailyState.swimlaneIds[dailyState.current++];
    scrollTo(swimlaneId);
    chrome.runtime.sendMessage({
        message: "updateStateEvt",
        swimlaneCurrent: dailyState.current
    })
    if (dailyState.current === dailyState.swimlaneIds.length) {
        chrome.runtime.sendMessage({
            message: "noMoreParticipants"
        })
    }
}

let scrollTo = function (swimlaneId) {
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
};

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