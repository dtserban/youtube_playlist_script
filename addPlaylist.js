// Used to fill and add to playlists automatically from a user's videos page

// Adds top n newest videos to the specified playlist
async function addPlaylist(num, plName, mode="add", args=[])
{
    // Sleep function
    function sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get all loaded videos
    let allVids = document.querySelectorAll("ytd-rich-grid-media");
    let tempButton;
    let allPopUps;
    let tempOptions;
    let menuPopUp;
    let addButton;
    let tempSelector;
    let plSelector;
    let tempPlaylists;
    let tempPL;
    let playlist;
    let pNum;
    let titleNotFound = true;
    let sleepTime = 100;
    let idleTime = 0;
    let timeoutTime = 5000;
    let selectMode = false;
    let selectNum;

    if (allVids.length <= 0) {
        // Something broke
        throw "addPlaylist: no ytd-rich-grid-media tags found";
    }

    // If called from fillPlaylist()
    if (mode == "fill") {
        num = allVids.length;
    } // If called from addSelected()
    else if (mode == "select") {
        selectMode = true;
        selectNum = 0;
        num = args[selectNum];
        selectNum = selectNum + 1;
    }

    // PRIMING PHASE
    // First iteration that primes the pop-up menus out of non-existence
    console.log(num);

    // Get video kebab button
    tempButton = allVids[num - 1].querySelectorAll("button");

    if (tempButton.length != 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more or less than 1 button per video";
    }

    if (document.querySelectorAll("ytd-popup-container").length != 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more or less than 1 ytd-popup-container";
    }

    // Get all pop-ups
    allPopUps = document.querySelectorAll("ytd-popup-container")[0];

    // Button has not been clicked yet, so there should be 0 if unprimed and 1 if primed already
    tempOptions = allPopUps.querySelectorAll("tp-yt-iron-dropdown");

    // Click kebab button
    tempButton[0].click();

    if (tempOptions.length == 0) {
        // Waiting for the pop-up menu to be created
        while (tempOptions.length < 1) {
            await sleep(sleepTime);

            // Refresh allPopUps
            allPopUps = document.querySelectorAll("ytd-popup-container")[0];
            tempOptions = allPopUps.querySelectorAll("tp-yt-iron-dropdown");
        }
    }
    else if (tempOptions.length == 1) {
        // Something changed or it is already primed -- investigate
        throw "addPlaylist: Either the menu is already primed or there is more than 1 tp-yt-iron-dropdown tag when primed. Refresh the page once to be sure.";
    }
    else {
        // Something changed -- investigate
        throw "addPlaylist: there is more than 1 tp-yt-iron-dropdown tag when primed";
    }

    // SAME menuPopUp ELEMENT IS USED BY ALL VIDEOS
    // Get pop-up menu
    menuPopUp = tempOptions[0];

    // Wait for it to become visible (if not already)
    while (menuPopUp.style.display == "none") {
        await sleep(sleepTime);
    }

    // SAME addButton ELEMENT IS USED BY ALL VIDEOS
    // Get "Save to playlist" button
    addButton = menuPopUp.querySelectorAll("ytd-menu-service-item-renderer")[2];

    // Check that it is correct
    if (addButton.querySelectorAll("yt-formatted-string")[0].innerText != "Save to playlist") {
        // Something changed -- investigate
        throw 'addPlaylist: button does not match "Save to playlist"';
    }

    // Button has not been clicked yet, so there should be 0 if unprimed and 1 if primed already
    tempSelector = allPopUps.querySelectorAll("tp-yt-paper-dialog");

    // Click "Save to playlist"
    addButton.click();

    if (tempSelector.length == 0) {
        // Waiting for the playlist menu to be created
        while (tempSelector.length < 1) {
            await sleep(sleepTime);

            // Refresh allPopUps
            allPopUps = document.querySelectorAll("ytd-popup-container")[0];
            tempSelector = allPopUps.querySelectorAll("tp-yt-paper-dialog");
        }
    }
    else {
        // Something changed -- investigate
        throw "addPlaylist: there is more than 1 tp-yt-paper-dialog tag when primed";
    }

    plSelector = tempSelector[0];

    // Wait for it to become visible (if not already)
    while (plSelector.style.display == "none") {
        await sleep(sleepTime);
    }

    // All playlists
    tempPlaylists = plSelector.querySelectorAll("ytd-playlist-add-to-option-renderer");

    // Playlist slot to use after first iteration
    tempPL = tempPlaylists[1].querySelectorAll("tp-yt-paper-checkbox");

    if (tempPL.length != 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more or less than 1 tp-yt-paper-checkbox per playlist";
    }

    // Playlist to use after first iteration
    playlist = tempPL[0];

    // Find playlist title in tempPlaylists
    for (pNum = 0; pNum < tempPlaylists.length; pNum++) {
        if (tempPlaylists[pNum].querySelectorAll("yt-formatted-string")[0].innerText == plName) {
            // Playlist title found
            titleNotFound = false;
            // Click checkbox
            tempPlaylists[pNum].querySelectorAll("tp-yt-paper-checkbox")[0].click();
            // Sleep in case it needs time to process click
            await sleep(sleepTime);
            break;
        }
    }

    if (titleNotFound) {
        throw "addPlaylist: Playlist title not found. Either playlist does not exist or something broke.";
    }

    // Sets up next num if addSelected() was called
    if (selectMode) {
        if (selectNum < args.length) {
            num = args[selectNum] + 1;
            selectNum = selectNum + 1;
        }
        else {
            num = 0;
        }
    }

    // First iteration done
    num = num - 1;

    // REGULAR OPERATION
    // Add remaining top n videos to playlist from oldest to newest
    for (let i = num; i > 0; i--) {

        console.log(i);
        titleNotFound = true;
        idleTime = 0;

        // Get video kebab button
        tempButton = allVids[i - 1].querySelectorAll("button");

        if (tempButton.length != 1) {
            // Something changed -- investigate
            throw "addPlaylist: there is more or less than 1 button per video";
        }

        // Click kebab button
        tempButton[0].click();

        // Wait for it to become visible (if not already)
        while (menuPopUp.style.display == "none") {
            await sleep(sleepTime);
        }

        // Click "Save to playlist"
        addButton.click();

        // Wait for it to become visible (if not already)
        while (plSelector.style.display == "none") {
            await sleep(sleepTime);
        }

        // Check playlist title
        while (titleNotFound) {
            if (playlist.querySelectorAll("yt-formatted-string")[0].innerText == plName) {
                // Click correct playlist title
                playlist.click();
                titleNotFound = false;
            }
            else if (tempPlaylists[pNum].querySelectorAll("yt-formatted-string")[0].innerText == plName) {
                // Playlist has not changed slots yet -- not quick enough
                // Click correct playlist title
                tempPlaylists[pNum].querySelectorAll("tp-yt-paper-checkbox")[0].click();
                titleNotFound = false;
            }
            else if (idleTime < timeoutTime) {
                // Handles a playlist miss, ultimately timing out if it can't be found
                // Search for playlist title in tempPlaylists
                // console.log("playlist miss");
                for (pNum = 0; pNum < tempPlaylists.length; pNum++) {
                    if (tempPlaylists[pNum].querySelectorAll("yt-formatted-string")[0].innerText == plName) {
                        // Playlist title found
                        // console.log("playlist hit");
                        titleNotFound = false;
                        // Reassign expected playlist slot
                        playlist = tempPlaylists[pNum].querySelectorAll("tp-yt-paper-checkbox")[0];
                        // Click checkbox
                        playlist.click();
                        break;
                    }
                }

                await sleep(sleepTime);
                idleTime = idleTime + sleepTime;
            }
            else {
                // Something changed -- investigate
                throw "addPlaylist: timeout -- playlist title in expected and original list slots does not match past 1st iteration";
            }
        }

        // Sleep in case it needs time to process click
        await sleep(sleepTime);

        // Sets up next i if addSelected() was called
        if (selectMode) {
            if (selectNum < args.length) {
                i = args[selectNum] + 1;
                selectNum = selectNum + 1;
            }
            else {
                i = 0;
            }
        }
    }
}

// Adds every single video to the specified playlist (as long as they are loaded on the page)
function fillPlaylist(plName)
{
    addPlaylist(0, plName, "fill");
}

// Adds selected videos to the specified playlist passed in as an array of video numbers (with 1 being the most recent video)
// Array is designed to be passed in with numbers in descending order. But they can be in any order. e.g. [98, 65, 43, 27, 11]
// NOTE -- Each video in the array is added to the playlist in order starting from the beginning of the array.
function addSelected(plName, vidArray)
{
    addPlaylist(0, plName, "select", vidArray);
}

// TEST CODE
// let allVids = document.querySelectorAll("ytd-rich-grid-media");
// let num = allVids.length;
// let tempButton = allVids[num - 1].querySelectorAll("button");
// tempButton[0].click();
//
// let allPopUps = document.querySelectorAll("ytd-popup-container")[0];
// let tempOptions = allPopUps.querySelectorAll("tp-yt-iron-dropdown");
// let menuPopUp = tempOptions[0];
// let addButton = menuPopUp.querySelectorAll("ytd-menu-service-item-renderer")[2];
// addButton.click();
//
// allPopUps = document.querySelectorAll("ytd-popup-container")[0];
// let tempSelector = allPopUps.querySelectorAll("tp-yt-paper-dialog");
// let plSelector = tempSelector[0];
// let tempPlaylists = plSelector.querySelectorAll("ytd-playlist-add-to-option-renderer");
// tempPlaylists[0].querySelectorAll("tp-yt-paper-checkbox")[0].click();


// FOR CONVENIENCE
// addPlaylist(, "Every Tom Scott Video Ever");
// addSelected("Every Corridor Crew Reacts Video Ever", []);
