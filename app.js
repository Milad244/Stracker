window.onload = function() {
    currentFileName = document.getElementById('js-current-file').innerHTML;
    Load(currentFileName);
};

const currentShows = JSON.parse(localStorage.getItem('currentShows')) || {};

const showWatchHistory = JSON.parse(localStorage.getItem('showWatchHistory')) || {};

const finishedShows = JSON.parse(localStorage.getItem('finishedShows')) || {};

const deletedShows = JSON.parse(localStorage.getItem('deletedShows')) || {};

if (JSON.parse(localStorage.getItem('backup-1.1')) === null) {
    const allCookies = {
        currentShows,
        showWatchHistory,
        finishedShows,
        deletedShows
    }
    localStorage.setItem('backup-1.1', JSON.stringify(allCookies));
} else {
    //console.log(JSON.parse(localStorage.getItem('backup-1.1')));
}

function enterStart(func, event, parameter){ 
    if (event.key === 'Enter') {
        func(parameter);
    }
}

function addNewShow() {
    const newShow = document.getElementById('js-new-show-input');
    const availableArr = checkNameAvailability(newShow.value);
    if (availableArr[0] === true){
        currentShows[newShow.value] = {
            showName: newShow.value,
            season: 1,
            episode: 0,
            liveSeason: 1,
            liveEpisode: 1
        };
        showWatchHistory[newShow.value] = {
            Logs: []
        };
        saveCookies();
        Load('index');
    } else{
        alert(`Error 1\nThe name you typed is invalid because it is ${availableArr[1]}`);
    }
    newShow.value = '';
}

let pageDate = new Date().toJSON().slice(0, 10);
function Load(page){
    if (page === 'index') {
        const showsList = document.getElementById('js-shows-container');
        showsList.innerHTML = '';
        Object.keys(currentShows).forEach(function(value, index){
            const showObject = currentShows[value];
            const seasonMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-2xl minus-box" onclick="changeShowNum('ShowName-${index}', 'season', -1)"></i></div>`
            const episodeMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-2xl minus-box" onclick="changeShowNum('ShowName-${index}', 'episode', -1)"></i></div>`
            const seasonPlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-2xl plus-box" onclick="changeShowNum('ShowName-${index}', 'season', 1)"></i></div>`
            const episodePlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-2xl plus-box" onclick="changeShowNum('ShowName-${index}', 'episode', 1)"></i></div>`
            showsList.innerHTML += `<div class="show-container"> <h3 id="ShowName-${index}">${value}</h3>
            <P>Last episode watched: Season: ${showObject.season} Episode: ${showObject.episode}</P>
            <div class="adjustable-div"> ${seasonMinusBoxHTML} <p class="adjustable-p"> Season: ${showObject.liveSeason}</p> ${seasonPlusBoxHTML}</div>
            <div class="adjustable-div"> ${episodeMinusBoxHTML} <p class="adjustable-p">Episode: ${showObject.liveEpisode}</p> ${episodePlusBoxHTML}</div>
            <div class="adjustable-div"> <p>Date: </p> <input class="date-box" id="Date-${index}" value="${pageDate}" type="date"></div>
            <button onclick="updateShow('ShowName-${index}', ${showObject.liveSeason}, ${showObject.liveEpisode}, 'Date-${index}')">Watched Season ${showObject.liveSeason} Episode ${showObject.liveEpisode}</button> <br>
            <button id="finished-show-button" onclick="finishedShow('ShowName-${index}')">Finished This Show</button><div>`
        });
    } else if(page === 'watch-history') {
        const showListContainer = document.getElementById('js-show-list-container');
        showListContainer.innerHTML = '';
        Object.keys(showWatchHistory).forEach(function(value, index){
            showListContainer.innerHTML += `<div style="padding-top: 20px;"><li onclick="makeListActive('${index}')">${value}</li></div>`;
        });
        makeListActive(0);
        changeTimePeriod('30 days', 'days', 30);
    }
}

function editMode() {
    const showListContainer = document.getElementById('js-show-list-container');
    showListContainer.innerHTML = '';
    Object.keys(showWatchHistory).forEach(function(value, index){
        showListContainer.innerHTML += `<div class="title-flex-container"><div class="text-container"><li id="ShowName1-${index}" onclick="makeListActive('${index}', 'editMode')">${value}</li></div>
        <div class="trash-can-container"><i class="fa-solid fa-circle-minus removeButton" onclick="deleteShow('ShowName1-${index}')"></i></div></div>`;
    });
    makeListActive(0, 'editMode');
}

function changeShowNum(showNameID, seasonOrEpisode, amount) {
    const showName = document.getElementById(showNameID).innerHTML;
    const showObject = currentShows[showName];
    if (seasonOrEpisode === 'season') {
        showObject.liveSeason += amount;
        showObject.liveEpisode = 1;
    }
    else {
        showObject.liveEpisode += amount;
    }
    saveCookies();
    Load('index');
}

function updateShow(showNameID, season, episode, dateID) {
    const showName = document.getElementById(showNameID).innerHTML;
    const showObject = currentShows[showName];
    showObject.season = season;
    showObject.episode = episode;
    showObject.liveEpisode ++;
    
    showWatchHistory[showObject.showName]['Logs'].push ({
        showName: showObject.showName,
        date: document.getElementById(dateID).value,
        season: season,
        episode: episode
    })
    pageDate = document.getElementById(dateID).value;
    saveCookies();
    Load('index');
}

function finishedShow(showNameID){
    const showName = document.getElementById(showNameID).innerHTML;
    finishedShows[showName] = currentShows[showName];
    delete currentShows[showName];
    saveCookies();
    Load('index');
}

function renewShow(showNameID){
    const showName = document.getElementById(showNameID).innerHTML;
    currentShows[showName] = finishedShows[showName];
    delete finishedShows[showName];
    saveCookies();
    window.location = 'index.html';
}

function LoginOrSignup(loginOrsignUp) {
    const loginElement = document.getElementById('js-login-container');
    const signUpElement = document.getElementById('js-signUp-container');
    const divElement = document.getElementsByTagName('div');
    for (i = 0; i < divElement.length; i++){
        divElement[i].setAttribute('style', 'opacity: 20%; pointer-events: none')
    }
    if (loginOrsignUp === 'Login'){
        signUpElement.classList.remove('loginOrSignup-container');
        signUpElement.classList.add('no-display');
        loginElement.classList.add('loginOrSignup-container');
        loginElement.classList.remove('no-display');
        loginElement.setAttribute('style', 'opacity: 100%; pointer-events: all');
    } else{
        loginElement.classList.remove('loginOrSignup-container');
        loginElement.classList.add('no-display');
        signUpElement.classList.add('loginOrSignup-container');
        signUpElement.classList.remove('no-display');
        signUpElement.setAttribute('style', 'opacity: 100%; pointer-events: all');
    }
}

function LoginAttempt(){
    username = document.getElementById('js-username-input').value;
    password = document.getElementById('js-password-input').value;
}

function SignUpAttempt(){
    newUsername = document.getElementById('js-new-username-input').value;
    newPassword = document.getElementById('js-new-password-input').value;
}

function makeListActive(listIndex, Mode){
    if (Mode === 'editMode') {
        normalButtonsContainer = document.getElementById('js-normal-buttons-container');
        editButtonsContainer = document.getElementById('js-edit-buttons-container');
        normalButtonsContainer.classList.add('no-display');
        editButtonsContainer.classList.remove('no-display');
    }
    const showInfoContainer = document.getElementById('js-current-show-info');
    const activeListName = Object.keys(showWatchHistory)[parseInt(listIndex)]
    const showInfoObject = showWatchHistory[activeListName];
    let isFinishedShow = true;
    for(i = 0; i < Object.keys(currentShows).length; i++){
        const currentShowName = Object.keys(currentShows)[parseInt(i)];
        if (currentShowName === activeListName) {
            isFinishedShow = false;
            break;
        }
    }
    showInfoContainer.innerHTML = '';
    if (isFinishedShow === true){
        for (i = 0; i < Object.keys(finishedShows).length; i++) {
            const finishedShowName = Object.keys(finishedShows)[parseInt(i)]
            if (finishedShowName === activeListName) {
                showInfoContainer.innerHTML += `<button onclick="renewShow('Renew-${listIndex}')">Renew This Show</button> <p class="hidden" id="Renew-${listIndex}">${finishedShowName}</p>`;
                break;
            }
        }
    }
    showInfoObject['Logs'].forEach(function(value, index){
        const currentLog = showInfoObject['Logs'][index];
        if (Mode === undefined) {
            showInfoContainer.innerHTML += `<div><p>| Log: ${index + 1} | Show Name: ${currentLog.showName} | Date Watched: ${currentLog.date} Season: ${currentLog.season} | Episode: ${currentLog.episode} |</p></div>`;
        }else {
            showInfoContainer.innerHTML += `<div class="logs-flex-container"><div class="text-container"><p>| Log: ${index + 1} | Show Name: ${currentLog.showName} | Date Watched: ${currentLog.date} Season: ${currentLog.season} | Episode: ${currentLog.episode} |</p></div>
            <div class="trash-can-container"><i onclick="deleteLog('ShowName-${index}', 'ShowLogIndex-${index}', 'ActiveShowIndex-${index}');" class="fa-solid fa-circle-minus removeButton"></i></div></div>
            <p id="ShowName-${index}" class='hidden'>${currentLog.showName}</p>
            <p id="ShowLogIndex-${index}" class='hidden'>${index}</p>
            <p id="ActiveShowIndex-${index}" class='hidden'>${listIndex}</p>`;
        }
    });
}

function changeTimePeriod(newElementValue, timeVariable, timePeriod){
    calcLastTimePeriodResults(timeVariable, timePeriod);
    const timePeriodElement = document.getElementById('js-time-period-dropdown-text');
    timePeriodElement.innerHTML = newElementValue;
    const dropdownElement = document.querySelector('.dropdown-select');
    dropdownElement.setAttribute('style', 'pointer-events: none');
    setTimeout(() => {
        dropdownElement.setAttribute('style', 'pointer-events: all');
    }, 1);
}

function calcLastTimePeriodResults(timeVariable, timePeriod){
    let amountOfShows = 0;
    let amountOfEpisodes = 0;
    let showsArray = [];
    if (timeVariable === 'years') {
        timePeriod *= 365;
    }
    let furthestDate = new Date();
    const Calcdate = furthestDate.getTime() - (timePeriod * 24 * 60 * 60 * 1000);
    furthestDate.setTime(Calcdate);
    let furthestYearDate = furthestDate.toJSON().slice(0, 10);
    for (i = 0; i<timePeriod; i++) {
        const Calcdate = furthestDate.getTime() + (1 * 24 * 60 * 60 * 1000);
        furthestDate.setTime(Calcdate);
        furthestYearDate = furthestDate.toJSON().slice(0, 10);
        const currentDateCalcedArr = calcAmountOfShowsAndEpisodes(furthestYearDate, showsArray);
        amountOfShows += currentDateCalcedArr[0];
        amountOfEpisodes += currentDateCalcedArr[1];
        showsArray = currentDateCalcedArr[2];
    }
    const amountOfShowsObject = document.getElementById('js-show-amount');
    const amountOfEpisodesObject = document.getElementById('js-episode-amount');
    amountOfShowsObject.innerHTML = amountOfShows;
    amountOfEpisodesObject.innerHTML = amountOfEpisodes;
}

function calcAmountOfShowsAndEpisodes (furthestYearDate, showsArray){
    let amountOfEpisodes = 0;
    let amountOfShows = 0;
    Object.keys(showWatchHistory).forEach(function(value, index){
        const currentShowName = value;
        showWatchHistory[currentShowName]['Logs'].forEach(function(value, index){
            const showLogObject = value;
            if (showLogObject.date === furthestYearDate){
                amountOfEpisodes += 1;
                if (!showsArray.includes(currentShowName)) {
                    showsArray.push(currentShowName);
                    amountOfShows += 1;
                }
            }
        })
    })
    return [amountOfShows, amountOfEpisodes, showsArray];
}

function checkNameAvailability(name) {
    let isNameAvailable = true
    let reason;
    if (!name.replace(/\s/g, '').length) {
        reason = 'empty';
        isNameAvailable = false
    }
    Object.keys(showWatchHistory).forEach(function(value, index){
        if (name.toLowerCase() === value.toLowerCase()){
            reason = 'a duplicate';
            isNameAvailable = false;
        }
    })
    Object.keys(deletedShows).forEach(function(value, index){
        if (name.toLowerCase() === value.toLowerCase()){
            reason = 'a duplicate';
            isNameAvailable = false;
        }
    })
    returnArray = [isNameAvailable, reason];
    return returnArray;
}

function deleteShow(ShowName1ID){
    const showName = document.getElementById(ShowName1ID).innerHTML;
    deletedShows[showName] = showWatchHistory[showName];
    delete showWatchHistory[showName];
    delete currentShows[showName];
    delete finishedShows[showName];
    editMode();
}

function deleteLog(ShowNameID, ShowLogIndexID, ActiveShowID){
    const showName = document.getElementById(ShowNameID).innerHTML;
    const showIndex = document.getElementById(ShowLogIndexID).innerHTML;
    showWatchHistory[showName]['Logs'].splice(showIndex, 1);
    const activeShowIndex = document.getElementById(ActiveShowID).innerHTML;
    makeListActive(activeShowIndex, 'editMode');
}

function saveCookies() {
    localStorage.setItem('currentShows', JSON.stringify(currentShows));
    localStorage.setItem('showWatchHistory', JSON.stringify(showWatchHistory));
    localStorage.setItem('finishedShows', JSON.stringify(finishedShows));
    localStorage.setItem('deletedShows', JSON.stringify(deletedShows));
}

function deleteAccountPrereq(type){
    const deleteWarningDiv = document.getElementById('js-delete-account-prereq');
    const confirmDeleteButton = document.getElementById('js-confirm-delete-account');
    const allDivElements = document.getElementsByTagName('div');
    if (type === 'start'){
        for (i = 0; i < allDivElements.length; i++){
            allDivElements[i].setAttribute('style', 'opacity: 10%; pointer-events: none')
        }
        deleteWarningDiv.classList.remove('no-display');
        deleteWarningDiv.setAttribute('style', 'opacity: 100%; pointer-events: all');
        confirmDeleteButton.setAttribute('style', 'opacity: 10%; pointer-events: none');
        confirmDeleteButton.innerHTML = `Confirm (${5})`
        let baseNum = 4;
        countdownLoop = setInterval(() => {
            let currentNum = baseNum;
            confirmDeleteButton.innerHTML = `Confirm (${baseNum})`
            currentNum --;
            baseNum = currentNum;
            if (baseNum < 0){
                confirmDeleteButton.innerHTML = 'Confirm'
                confirmDeleteButton.setAttribute('style', 'opacity: 100%; pointer-events: all');
                clearInterval(countdownLoop);
            }
        }, 1000)
    } else if (type === 'cancel'){
        clearInterval(countdownLoop);
        for (i = 0; i < allDivElements.length; i++){
            allDivElements[i].setAttribute('style', 'opacity: 100%; pointer-events: all')
        }
        confirmDeleteButton.setAttribute('style', 'opacity: 100%; pointer-events: all');
        deleteWarningDiv.classList.add('no-display');
    } else if (type === 'confirm'){
        clearInterval(countdownLoop);
        for (i = 0; i < allDivElements.length; i++){
            allDivElements[i].setAttribute('style', 'opacity: 100%; pointer-events: all')
        }
        confirmDeleteButton.setAttribute('style', 'opacity: 100%; pointer-events: all');
        deleteWarningDiv.classList.add('no-display');
        deleteAccount();
    }
}

function myStopFunction() {
  clearInterval(myInterval);
}

function deleteAccount() {
    localStorage.removeItem('currentShows');
    localStorage.removeItem('showWatchHistory');
    localStorage.removeItem('finishedShows');
    localStorage.removeItem('deletedShows');
    localStorage.removeItem('backup-1.0');
    localStorage.removeItem('backup-1.1');
    window.location = 'index.html';
    console.log('DELETED');
}

const allData = {
    currentShows,
    showWatchHistory,
    finishedShows,
    deletedShows
}

function downloadData (){
    const currentDate = new Date().toJSON().slice(0, 10);
    const allDataJSON = JSON.stringify(allData);
    const blob = new Blob([allDataJSON], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `Stracker-data-${currentDate}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

