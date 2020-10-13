let dailyState = {
    current: 0,
    swimlaneIds: []
};

chrome.storage.local.get("currentSwimlaneId", (value) => {
    if (!!value.currentSwimlaneId) {
        dailyState.current = Number.parseFloat(value.currentSwimlaneId)
    }
})
chrome.storage.local.get("swimlineIds", (value) => {
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
    let swimlanes = document.querySelectorAll('[class~="ghx-swimlane"]');
    swimlanes.forEach(
        value => {
            let swimlaneId = value.attributes['swimlane-id'].value;
            if (parseInt(swimlaneId) !== swimlanes.length) {
                dailyState.swimlaneIds.push(swimlaneId);
            }
        }
    );
    shuffleArray(dailyState.swimlaneIds);
    dailyState.current = 0;
    let allSwimlanes = document.getElementsByClassName("ghx-swimlane")
    collapseSwimlanes(allSwimlanes)

    chrome.runtime.sendMessage({
        message: "initDoneEvt",
        swimlaneIds: dailyState.swimlaneIds
    })
}

function next() {
    let allSwimlanes = document.getElementsByClassName("ghx-swimlane")
    if (dailyState.current === dailyState.swimlaneIds.length) {
        expandSwimlanes(allSwimlanes);
        return
    }
    collapseSwimlanes(allSwimlanes);
    let swimlaneId = dailyState.swimlaneIds[dailyState.current++];
    let currentSwimlane = document.querySelector(`[class~="ghx-swimlane"][swimlane-id="${swimlaneId}"]`);

    scrollTo(currentSwimlane);
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

/**
 * @param {HTMLCollectionOf<Element>} swimlanes
 */
let expandSwimlanes = (swimlanes) => {
    for (let swimlane of swimlanes) {
        if (swimlane.classList.contains("ghx-closed")) {
            swimlane.getElementsByClassName("ghx-expander")[0].click()
        }
    }
};

/**
 * @param {HTMLCollectionOf<Element>} swimlanes
 */
let collapseSwimlanes = (swimlanes) => {
    for (let swimlane of swimlanes) {
        if (!swimlane.classList.contains("ghx-closed")) {
            swimlane.getElementsByClassName("ghx-expander")[0].click()
        }
    }
};

/**
 * @param {Element} swimlane
 */
let scrollTo = swimlane => {
    swimlane.getElementsByClassName("ghx-expander")[0].click()
    swimlane.scrollIntoView();
    // workaround for column headers covering the swimlane
    let columnHeaders = document.getElementById("ghx-column-headers");
    let headerStalker = document.getElementById("ghx-swimlane-header-stalker");
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