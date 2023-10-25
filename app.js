const filePath = '/Stracker/';
window.onload = function() {
    if (window.location.pathname === filePath + "index.html"){
        Load('index');
    } else if(window.location.pathname === filePath + "watch-history.html") {
        Load('watch-history');
    }
};

const currentShows = JSON.parse(localStorage.getItem('currentShows')) || {};

const showWatchHistory = JSON.parse(localStorage.getItem('showWatchHistory')) || {};

function enterStart(func, event, parameter){ 
    if (event.key === 'Enter') {
        func(parameter);
    }
}

function addNewShow() {
    const newShow = document.querySelector('#js-new-show-input');
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
    newShow.value = '';
}

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
            <div class="adjustable-div"> <p>Date: </p> <input class="date-box" id="${'Date' + i}" value="${new Date().toJSON().slice(0, 10)}" type="date"></div>
            <button onclick="updateShow(${i}, ${showObject.liveSeason}, ${showObject.liveEpisode})">Watched Season ${showObject.liveSeason} Episode ${showObject.liveEpisode}</button> <div>`
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
    
    saveCookies();
    Load('index');
    console.log(showWatchHistory);
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
    showInfoContainer.innerHTML = '';
    Object.keys(showInfoObject).forEach(function(value, index){
        currentLog = showInfoObject[index + 1];
        showInfoContainer.innerHTML += `<p>| Log: ${value} | Show Name: ${currentLog.showName} | Date Watched: ${currentLog.date} Season: ${currentLog.season} | Episode: ${currentLog.episode} |</p>`;
    });
}

function saveCookies() {
    localStorage.setItem('currentShows', JSON.stringify(currentShows));
    localStorage.setItem('showWatchHistory', JSON.stringify(showWatchHistory));
}

function deleteAll() {
    localStorage.removeItem('currentShows');
    localStorage.removeItem('showWatchHistory');
    location.reload();
}