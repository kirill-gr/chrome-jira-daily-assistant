function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function init() {
    let swimlaneIds = [];
    let allSwimlanes = document.getElementsByClassName("ghx-swimlane")
    for (let swimlane of allSwimlanes) {
        let swimlaneId = swimlane.attributes['swimlane-id'].value;
        if (parseInt(swimlaneId) !== allSwimlanes.length) {
            swimlaneIds.push(swimlaneId);
        }
        collapse(swimlane);
    }
    shuffleArray(swimlaneIds);

    chrome.storage.local.set({currentSwimlaneId: 0})
    chrome.storage.local.set({swimlaneIds: swimlaneIds})
    chrome.storage.local.set({dailyStatus: "ongoing"})
}

function next() {
    let allSwimlanes = document.getElementsByClassName("ghx-swimlane")

    chrome.storage.local.get(["currentSwimlaneId", "swimlaneIds"], (value) => {
        let swimlaneIds;
        let currentSwimlaneId;

        if (!!value.swimlaneIds) {
            swimlaneIds = value.swimlaneIds;
        } else {
            alert("Init first");
            return
        }

        if (!!value.currentSwimlaneId || value.currentSwimlaneId === 0) {
            currentSwimlaneId = Number.parseFloat(value.currentSwimlaneId)
        } else {
            alert("Init first");
            return
        }

        if (currentSwimlaneId < swimlaneIds.length) {
            for (let swimlane of allSwimlanes) {
                collapse(swimlane);
            }
            let swimlaneId = swimlaneIds[currentSwimlaneId++];
            let currentSwimlane = document.querySelector(`[class~="ghx-swimlane"][swimlane-id="${swimlaneId}"]`);

            scrollTo(currentSwimlane);
            chrome.storage.local.set({currentSwimlaneId: currentSwimlaneId})
        } else {
            expandSwimlanes(allSwimlanes);
            chrome.storage.local.remove("swimlaneIds")
            chrome.storage.local.remove("currentSwimlaneId")
            chrome.storage.local.remove("dailyStatus")
        }
    })
}

/**
 * @param {HTMLCollectionOf<Element>} swimlanes
 */
function expandSwimlanes(swimlanes) {
    for (let swimlane of swimlanes) {
        if (swimlane.classList.contains("ghx-closed")) {
            swimlane.getElementsByClassName("ghx-expander")[0].click()
        }
    }
}

/**
 * @param {Element} swimlane
 */
function collapse(swimlane) {
    if (!swimlane.classList.contains("ghx-closed")) {
        swimlane.getElementsByClassName("ghx-expander")[0].click()
    }
}

/**
 * @param {Element} swimlane
 */
function scrollTo(swimlane) {
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