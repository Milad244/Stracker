window.onload = function() {
    if (window.location.pathname.includes("index.html")){
        Load('index');
    } else if(window.location.pathname.includes("watch-history.html")) {
        Load('watch-history');
    }
};

const currentShows = JSON.parse(localStorage.getItem('currentShows')) || {};

const showWatchHistory = JSON.parse(localStorage.getItem('showWatchHistory')) || {};

const finishedShows = JSON.parse(localStorage.getItem('finishedShows')) || {};

function enterStart(func, event, parameter){ 
    if (event.key === 'Enter') {
        func(parameter);
    }
}

function addNewShow() {
    const newShow = document.querySelector('#js-new-show-input');
    const availableArr = checkNameAvailability(newShow.value);
    if (availableArr[0] === true){
        currentShows[Object.keys(currentShows).length + 1] = {
            showName: newShow.value,
            season: 1,
            episode: 0,
            liveSeason: 1,
            liveEpisode: 1
        };
        showWatchHistory[newShow.value] = {};
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
        const showsList = document.querySelector('#js-shows-container');
        showsList.innerHTML = '';
        for(i = 1; i < Object.keys(currentShows).length + 1; i++){
            const showObject = currentShows[i];
            const seasonMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-2xl minus-box" onclick="changeShowNum('${i}', 'season', -1)"></i></div>`
            const episodeMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-2xl minus-box" onclick="changeShowNum('${i}', 'episode', -1)"></i></div>`
            const seasonPlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-2xl plus-box" onclick="changeShowNum('${i}', 'season', 1)"></i></div>`
            const episodePlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-2xl plus-box" onclick="changeShowNum('${i}', 'episode', 1)"></i></div>`
            showsList.innerHTML += `<div class="show-container"> <h3>${showObject.showName}</h3>
            <P>Last episode watched: Season: ${showObject.season} Episode: ${showObject.episode}</P>
            <div class="adjustable-div"> ${seasonMinusBoxHTML} <p class="adjustable-p"> Season: ${showObject.liveSeason}</p> ${seasonPlusBoxHTML}</div>
            <div class="adjustable-div"> ${episodeMinusBoxHTML} <p class="adjustable-p">Episode: ${showObject.liveEpisode}</p> ${episodePlusBoxHTML}</div>
            <div class="adjustable-div"> <p>Date: </p> <input class="date-box" id="${'Date' + i}" value="${pageDate}" type="date"></div>
            <button onclick="updateShow(${i}, ${showObject.liveSeason}, ${showObject.liveEpisode})">Watched Season ${showObject.liveSeason} Episode ${showObject.liveEpisode}</button> <br>
            <button id="finished-show-button" onclick="finishedShow(${i})">Finished This Show</button><div>`
        };
    } else if(page === 'watch-history') {
        const showListContainer = document.querySelector('#js-show-list-container');
        showListContainer.innerHTML = '';
        Object.keys(showWatchHistory).forEach(function(value, index){
            showListContainer.innerHTML += `<div><li onclick="makeListActive('${index}')">${value}</li></div>`;
        });
        makeListActive(0);
    }
}

function changeShowNum(index, seasonOrEpisode, amount) {
    const showObject = currentShows[index];
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

function updateShow(index, season, episode) {
    const showObject = currentShows[index];
    showObject.season = season;
    showObject.episode = episode;
    showObject.liveEpisode ++;
    
    showWatchHistory[showObject.showName][Object.keys(showWatchHistory[showObject.showName]).length + 1] = {
        showName: showObject.showName,
        date: document.querySelector('#Date'+ index).value,
        season: season,
        episode: episode
    }
    pageDate = document.querySelector('#Date'+ index).value;
    saveCookies();
    Load('index');
}

function finishedShow(index){
    finishedShows[Object.keys(finishedShows).length + 1] = currentShows[index];
    delete currentShows[index];
    saveCookies();
    Load('index');
}

function renewShow(index){
    const finishedShowObject = finishedShows[index];
    currentShows[Object.keys(currentShows).length + 1] = finishedShowObject;
    delete finishedShows[index];
    saveCookies();
    window.location = 'index.html';
}

function LoginOrSignup(loginOrsignUp) {
    const loginElement = document.querySelector('#js-login-container');
    const signUpElement = document.querySelector('#js-signUp-container');
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

function makeListActive(listIndex){
    const showInfoContainer = document.querySelector('#js-current-show-info');
    const activeListName = Object.keys(showWatchHistory)[parseInt(listIndex)]
    const showInfoObject = showWatchHistory[activeListName];
    let isFinishedShow = true;
    for(i = 1; i < Object.keys(currentShows).length + 1; i++){
        const currentShow = currentShows[i];
        if (currentShow.showName === activeListName) {
            isFinishedShow = false;
            break;
        }
    }
    showInfoContainer.innerHTML = '';
    if (isFinishedShow === true){
        for (i = 1; i < Object.keys(finishedShows).length + 1; i++) {
            if (finishedShows[i].showName === activeListName) {
                showInfoContainer.innerHTML += `<button onclick="renewShow(${i})">Renew This Show</button>`;
                break;
            }
        }
    }
    Object.keys(showInfoObject).forEach(function(value, index){
        const currentLog = showInfoObject[index + 1];
        showInfoContainer.innerHTML += `<div><p>| Log: ${value} | Show Name: ${currentLog.showName} | Date Watched: ${currentLog.date} Season: ${currentLog.season} | Episode: ${currentLog.episode} |</p></div>`;
    });
    //<i onclick="deleteLog('${currentLog.showName, value}');" class="fa-solid fa-trash fa-l trash-can"></i>
}

function changeTimePeriod(newElementValue, timeVariable, timePeriod){
    if (timeVariable === 'days'){
        calcLastTimePeriodResults();
    } else if (timeVariable === 'years') {
        calcLastTimePeriodResults();
    }
    const timePeriodElement = document.querySelector('#js-time-period-dropdown-text');
    timePeriodElement.innerHTML = newElementValue;
    const dropdownElement = document.querySelector('.dropdown-select');
    dropdownElement.setAttribute('style', 'pointer-events: none');
    setTimeout(() => {
        dropdownElement.setAttribute('style', 'pointer-events: all');
    }, 1);
    
}

function calcLastTimePeriodResults(){

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
    returnArray = [isNameAvailable, reason];
    return returnArray;
}

function deleteShow(index){

}

function deleteLog(showName, index){
    
}

function saveCookies() {
    localStorage.setItem('currentShows', JSON.stringify(currentShows));
    localStorage.setItem('showWatchHistory', JSON.stringify(showWatchHistory));
    localStorage.setItem('finishedShows', JSON.stringify(finishedShows));
}

function deleteAll() {
    localStorage.removeItem('currentShows');
    localStorage.removeItem('showWatchHistory');
    localStorage.removeItem('finishedShows');
    location.reload();
}