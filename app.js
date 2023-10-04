window.onload = function() {
    Load();
};

const currentShows = {
    Avengers: {
        showName: 'Avengers',
        season: 1,
        episode: 2,
        liveSeason: 1,
        liveEpisode: 3
    }
};

const showWatchHistory = {
    Avengers: {
        1: {
            showName: 'Avengers',
            date: '2023-09-30',
            season: 1,
            episode: 1
        },
        2: {
            showName: 'Avengers',
            date: '2023-10-01',
            season: 1,
            episode: 2
        }
    }
}

function enterStart(func, event, parameter){ 
    if (event.key === 'Enter') {
        func(parameter);
    }
}

function addNewShow() {
    const newShow = document.querySelector('#js-new-show-input');
    currentShows[newShow.value] = {
        showName: newShow.value,
        season: 1,
        episode: 0,
        liveSeason: 1,
        liveEpisode: 1
    };
    showWatchHistory[newShow.value] = {};
    Load();
    newShow.value = '';
}

function Load(){
    const showsList = document.querySelector('#js-shows-container')
    showsList.innerHTML = '';
    for(i = 0; i < Object.keys(currentShows).length; i++){
        const showObjectName = Object.keys(currentShows)[i]
        const showObject = currentShows[showObjectName];
        const seasonMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-xl minus-box" onclick="changeShowNum('${showObject.showName}', 'season', -1)"></i></div>`
        const episodeMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-xl minus-box" onclick="changeShowNum('${showObject.showName}', 'episode', -1)"></i></div>`
        const seasonPlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-xl plus-box" onclick="changeShowNum('${showObject.showName}', 'season', 1)"></i></div>`
        const episodePlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-xl plus-box" onclick="changeShowNum('${showObject.showName}', 'episode', 1)"></i></div>`
        showsList.innerHTML += `<h3>${showObject.showName}</h3>
        <P>Last episode watched: Season: ${showObject.season} Episode: ${showObject.episode}</P>
        <p>Season: ${showObject.liveSeason}</p> ${seasonMinusBoxHTML} ${seasonPlusBoxHTML}
        <p>Episode: ${showObject.liveEpisode}</p> ${episodeMinusBoxHTML} ${episodePlusBoxHTML}
        <p>Date: </p> <input id="${showObject.showName + 'Date'}" value="${new Date().toJSON().slice(0, 10)}" type="date">
        <button onclick="updateShow('${showObject.showName}', ${showObject.liveSeason}, ${showObject.liveEpisode})">Watched Season ${showObject.liveSeason} Episode ${showObject.liveEpisode}</button>`
    };
}

function changeShowNum(name, seasonOrEpisode, amount) {
    const showObject = currentShows[name];
    if (seasonOrEpisode === 'season') {
        showObject.liveSeason += amount;
    }
    else {
        showObject.liveEpisode += amount;
    }
    Load();
}

function updateShow(name, season, episode) {
    const showObject = currentShows[name];
    showObject.season = season;
    showObject.episode = episode;
    showObject.liveEpisode ++;
    
    showWatchHistory[name][Object.keys(showWatchHistory[name]).length + 1] = {
        showName: name,
        date: document.querySelector('#' + name + 'Date').value,
        season: season,
        episode: episode
    }
    
    saveCookies();
    Load();
    console.log(showWatchHistory);
}

function saveCookies() {
    
}