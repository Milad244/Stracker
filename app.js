//loading html when visiting the website
window.onload = function() {
    currentFileName = document.getElementById('js-current-file').innerHTML;
    Load(currentFileName);
};
//general vars
const currentShows = JSON.parse(localStorage.getItem('currentShows')) || {};
const showWatchHistory = JSON.parse(localStorage.getItem('showWatchHistory')) || {};
const finishedShows = JSON.parse(localStorage.getItem('finishedShows')) || {};
const deletedShows = JSON.parse(localStorage.getItem('deletedShows')) || {};
//backups
const Backups = JSON.parse(localStorage.getItem('Stracker-Backups')) || {};
if (Backups['backup-1.0'] === undefined) {
    const backupDate = new Date().toJSON().slice(0, 10);
    Backups['backup-1.0'] = {
        currentShows,
        showWatchHistory,
        finishedShows,
        deletedShows,
        backupDate
    }
    console.log(Backups);
    localStorage.setItem('Stracker-Backups', JSON.stringify(Backups));
} else {
    let latestBackup = [];
    Object.keys(Backups).forEach(function(value, index){
        const backupNum = parseFloat(value.replace('backup-', ''));
        if (backupNum >= latestBackup[0] || latestBackup[0] === undefined){
            latestBackup[0] = backupNum;
            latestBackup[1] = value;
        }
    });
    let originalBackupDate = new Date(Backups[latestBackup[1]].backupDate);
    const Calcdate = originalBackupDate.getTime() + (14 * 24 * 60 * 60 * 1000);
    originalBackupDate.setTime(Calcdate);
    const updatedBackupDate = originalBackupDate.toJSON().slice(0, 10);
    const currentDate = new Date().toJSON().slice(0, 10);
    if (currentDate >= updatedBackupDate){
        newBackupNum = (latestBackup[0] + 0.1).toFixed(1);
        newBackupName = 'backup-' + newBackupNum.toString();
        const backupDate = new Date().toJSON().slice(0, 10);
        Backups[newBackupName] = {
            currentShows,
            showWatchHistory,
            finishedShows,
            deletedShows,
            backupDate
        }
        localStorage.setItem('Stracker-Backups', JSON.stringify(Backups));
    }
}
//general functions
function enterStart(func, event, parameter){ 
    if (event.key === 'Enter') {
        func(parameter);
    }
}

function DisplayChanges(mode, elements, opacityLevel){
    if (Array.isArray(elements) === false){
        elements = [elements];
    }
    const divElement = document.getElementsByTagName('div');
    Object.keys(divElement).forEach(function(value, index){
        if (mode === 'display'){
            divElement[index].setAttribute('style', `opacity: ${opacityLevel}%; pointer-events: none`);
        } else if (mode === 'noDisplay'){
            divElement[index].setAttribute('style', 'opacity: 100%; pointer-events: all');
        }
    });
    elements.forEach(function(value, index){
        if (mode === 'display'){
            elements[index].classList.remove('no-display');
            elements[index].setAttribute('style', 'opacity: 100%; pointer-events: all');
        } else if (mode === 'noDisplay'){
            elements[index].classList.add('no-display');
        } else if (mode === 'disable'){
            elements[index].setAttribute('style', `opacity: ${opacityLevel}%; pointer-events: none`);
        } else if (mode === 'enable'){
            elements[index].setAttribute('style', 'opacity: 100%; pointer-events: all');
        }
    });
}
//key functions
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
        if (Object.keys(showWatchHistory).length != 0){
            Object.keys(showWatchHistory).forEach(function(value, index){
                showListContainer.innerHTML += `<div style="padding-top: 20px;"><li onclick="makeListActive('${index}')">${value}</li></div>`;
            });
            makeListActive(0);
        } else{
            showListContainer.innerHTML = 'You have no shows on this account. <br>To start seeing your watch history go to the home page and add a new show!';
            const editButton = document.getElementById('js-watch-history-edit-button');
            DisplayChanges('disable', editButton, 20);
        }
        changeTimePeriod('30 days', 'days', 30);
    } else if(page === 'stats'){
        statsCalc('6 months', 'days', 283);
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
    const activeObject = showWatchHistory[activeListName];
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
    activeObject['Logs'].forEach(function(value, index){
        const currentLog = activeObject['Logs'][index];
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

function statsCalc(newElementValue, timeVariable, timePeriod){
    //Changing dropdown text
    const timePeriodElement = document.getElementById('js-time-period-dropdown-text');
    timePeriodElement.innerHTML = newElementValue;
    const dropdownElement = document.querySelector('.dropdown-select');
    dropdownElement.setAttribute('style', 'pointer-events: none');
    setTimeout(() => {
        dropdownElement.setAttribute('style', 'pointer-events: all');
    }, 1);
    //calculating the graph numbers
    const calcStatGraph = (furthestYearDate, episodeArr, dateArr) => {
        let episodes = 0;
        Object.keys(showWatchHistory).forEach(function(value, index){
            const currentShowName = value;
            showWatchHistory[currentShowName]['Logs'].forEach(function(value, index){
                const showLogObject = value;
                if (showLogObject.date === furthestYearDate){
                    episodes += 1;
                }
            })
        })
        episodeArr.push(episodes);
        dateArr.push(furthestYearDate);
        return [episodeArr, dateArr];
    }
    let episodeArr = [];
    let dateArr = [];
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
        const currentDateCalcedArr = calcStatGraph(furthestYearDate, episodeArr, dateArr);
        episodeArr = currentDateCalcedArr[0];
        dateArr = currentDateCalcedArr[1];
    }
    //Making graph
    const statsContainerElem = document.getElementById('js-stats-container');
    statsContainerElem.innerHTML = `<canvas id="js-stats-chart"></canvas>`;
    new Chart("js-stats-chart", {
        type: "line",
        data: {
            labels: dateArr,
            datasets: [{
            backgroundColor:"rgba(255,255,255,1.0)",
            data: episodeArr
            }]
        },
        options:{
            legend: {display: false}
        }
        });
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
    const checkSameValueEl = document.getElementById('check-same-value');
    checkSameValueEl.innerHTML = name;
    const nameDup = checkSameValueEl.innerHTML;
    if (name != nameDup){
        reason = 'containing an invalid character';
        isNameAvailable = false;
    }
    returnArray = [isNameAvailable, reason];
    return returnArray;
}

function deleteShow(ShowName1ID){
    const showName = document.getElementById(ShowName1ID).innerHTML;
    deletedShows[showName] = [showWatchHistory[showName], currentShows[showName] || finishedShows[showName]];
    delete showWatchHistory[showName];
    delete currentShows[showName];
    delete finishedShows[showName];
    editMode();
}

function RestoreContainer(state){
    const restoreContainer = document.getElementById('js-restore-deleted-shows-container');
    const deletedShowsContainer = document.getElementById('js-deleted-shows-container');
    const restoreShowButton = document.getElementById('js-restore-button');
    if (state === 'open'){
        DisplayChanges('display', [restoreContainer, deletedShowsContainer], 15);
        if (Object.keys(deletedShows).length != 0){
            deletedShowsContainer.innerHTML = '';
            Object.keys(deletedShows).forEach(function(value, index){
            deletedShowsContainer.innerHTML += `<li onclick="activeDeletedShow('${index}')">${value}</li>`;
            });
            activeDeletedShow(0);
        } else{
            deletedShowsContainer.innerHTML = 'You have no deleted shows';
            DisplayChanges('disable', restoreShowButton, 15);
        }
        
    } else if (state === 'close'){
        DisplayChanges('noDisplay', restoreContainer);
    }
}

function activeDeletedShow(listIndex){
    const restoreButton = document.getElementById('js-restore-button');
    const activeListName = Object.keys(deletedShows)[parseInt(listIndex)]
    const activeObject = deletedShows[activeListName];
    restoreButton.innerHTML = `Restore ${activeListName}`;
    restoreButton.onclick = function(){restoreDeletedShow(activeListName, activeObject);};
}

function restoreDeletedShow(showName, showObject){
    showWatchHistory[showName] = showObject[0];
    currentShows[showName] = showObject[1];
    delete deletedShows[showName];
    saveCookies();
    RestoreContainer('open');
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
    if (type === 'start'){
        DisplayChanges('display', deleteWarningDiv, 10);
        DisplayChanges('disable', confirmDeleteButton, 10);
        confirmDeleteButton.innerHTML = `Confirm (${5})`
        let baseNum = 4;
        countdownLoop = setInterval(() => {
            let currentNum = baseNum;
            confirmDeleteButton.innerHTML = `Confirm (${baseNum})`
            currentNum --;
            baseNum = currentNum;
            if (baseNum < 0){
                confirmDeleteButton.innerHTML = 'Confirm'
                DisplayChanges('enable', confirmDeleteButton);
                clearInterval(countdownLoop);
            }
        }, 1000)
    } else if (type === 'cancel'){
        clearInterval(countdownLoop);
        DisplayChanges('noDisplay', deleteWarningDiv);
    } else if (type === 'confirm'){
        clearInterval(countdownLoop);
        DisplayChanges('noDisplay', deleteWarningDiv);
        deleteAccount();
    }
}

function deleteAccount() {
    localStorage.removeItem('currentShows');
    localStorage.removeItem('showWatchHistory');
    localStorage.removeItem('finishedShows');
    localStorage.removeItem('deletedShows');
    localStorage.removeItem('Stracker-Backups');
    window.location = 'index.html';
    console.log('DELETED');
}

function downloadData (){
    const allData = {
        currentShows,
        showWatchHistory,
        finishedShows,
        deletedShows
    }
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

let uploadedUserData;

function uploadFile(type){
    const uploadFileContainer = document.getElementById('js-upload-file-container');
    const fileElement = document.getElementById("js-user-file-elem");
    const fileSelectButton = document.getElementById("js-file-select-button");
    if (type === 'start'){
        DisplayChanges('display', uploadFileContainer, 10);
        fileSelectButton.onclick = function(){fileElement.click();};
    } else if (type === 'cancel'){
        fileElement.value = '';
        DisplayChanges('noDisplay', uploadFileContainer);
    } else if (type === 'confirm'){
        if (fileElement.files.length > 0) {
            const userDataFile = fileElement.files[0];
            const reader = new FileReader();
            reader.readAsText(userDataFile);
            reader.onload = function (e) {
            try{
                uploadedUserData = JSON.parse(e.target.result);
                if (uploadedUserData.currentShows && uploadedUserData.showWatchHistory && uploadedUserData.finishedShows && uploadedUserData.deletedShows){
                    fileElement.value = '';
                    DisplayChanges('noDisplay', uploadFileContainer);
                    uploadDataPrereq('start');
                } else{
                    fileElement.value = '';
                    alert('Error Invalid File');
                }
            } catch{
                fileElement.value = '';
                alert('Error Invalid File');
            }
            };
          } else {
            fileElement.value = '';
            alert('Error No file selected');
          }
    }
}

function uploadDataPrereq(type){
    const uploadWarningDiv = document.getElementById('js-upload-account-prereq');
    const confirmUploadButton = document.getElementById('js-confirm-upload-account');
    if (type === 'start'){
        DisplayChanges('display', uploadWarningDiv, 10);
        DisplayChanges('disable', confirmUploadButton, 10);
        confirmUploadButton.innerHTML = `Confirm (${5})`
        let baseNum = 4;
        countdownLoop = setInterval(() => {
            let currentNum = baseNum;
            confirmUploadButton.innerHTML = `Confirm (${baseNum})`
            currentNum --;
            baseNum = currentNum;
            if (baseNum < 0){
                confirmUploadButton.innerHTML = 'Confirm'
                DisplayChanges('enable', confirmUploadButton);
                clearInterval(countdownLoop);
            }
        }, 1000)
    } else if (type === 'cancel'){
        clearInterval(countdownLoop);
        DisplayChanges('noDisplay', uploadWarningDiv);
    } else if (type === 'confirm'){
        clearInterval(countdownLoop);
        DisplayChanges('noDisplay', uploadWarningDiv);
        uploadData();
    }
}

function uploadData(){
    downloadData();
    localStorage.setItem('currentShows', JSON.stringify(uploadedUserData.currentShows));
    localStorage.setItem('showWatchHistory', JSON.stringify(uploadedUserData.showWatchHistory));
    localStorage.setItem('finishedShows', JSON.stringify(uploadedUserData.finishedShows));
    localStorage.setItem('deletedShows', JSON.stringify(uploadedUserData.deletedShows));
    window.location = 'index.html';
}