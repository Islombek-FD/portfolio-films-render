const elNavList = document.querySelector('.nav-list');
const elHeroSection = document.querySelector('.hero');
const elForm = document.querySelector('.films-form');
const elFilmsList = document.querySelector('.films-list');
const elSelect = document.querySelector('.genres-select');
const elSortSelect = document.querySelector('.sort-select');
const elRegExpInput = document.querySelector('.regexp-input');
const elHeroContent = document.querySelector('.hero-content'); 
const elBookmarkList = document.querySelector('.bookmark-list');
const elModal = document.querySelector('.modal');
const elModalContent = document.querySelector('.modal-list');
const elHamburgerMenu = document.querySelector('.hamburger__menu');

const bookmarkFilms = [];

let elOpenMenu = false;
elHamburgerMenu.addEventListener('click', () => {
    if (!elOpenMenu) {
        elNavList.classList.add('nav-list--open');
        elHamburgerMenu.classList.add('open__menu');
        elOpenMenu = true;
    }
    else {
        elNavList.classList.remove('nav-list--open');
        elHamburgerMenu.classList.remove('open__menu');
        elOpenMenu = false;
    }
})

function normalizeDate(format) {
    const date = new Date(format);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);

    return `${day}.${month}.${year}`;
}

const sortFilms = {
    0: (a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return  1;
        }
        return 0;
    },

    1:  (a, b) => {
        if (a.title < b.title) {
            return 1;
        }
        if (a.title > b.title) {
            return -1;
        }
        return 0;
    },

    2: (a, b) => b.release_date - a.release_date,

    3: (a, b) => a.release_date - b.release_date,
}

function renderFilms(arr, node, more) {
    node.innerHTML = null;

    arr.forEach(film => {

        film.genres.forEach(genre => {
            if(!elSelect.textContent.includes(genre)) {
                const genreOption = document.createElement('option');
                genreOption.value = genre;
                genreOption.textContent = genre;

                elSelect.appendChild(genreOption);
            }
        })

        const filmItem = document.createElement('li');
        const filmTitle = document.createElement('h3');
        const filmImg = document.createElement('img');
        const filmInfo = document.createElement('div');
        if (more) {
            const filmDescription = document.createElement('p');
            const filmGenresName = document.createElement('p');
            const filmGenresList = document.createElement('ul');
            const filmTime = document.createElement('time');

            filmDescription.textContent = film.overview.split(' ').slice(0, 20).join(' ');
            filmGenresName.textContent = 'Genres types';
            filmTime.textContent = normalizeDate(film.release_date);

            film.genres.forEach(genre => {
                const filmGenreItem = document.createElement('li');
                filmGenreItem.textContent = genre;
                filmGenreItem.classList.add('film-genre__item');
                
                filmGenresList.appendChild(filmGenreItem);
            }) 

            filmDescription.classList.add('film-description');
            filmGenresName.classList.add('film-genres__name');
            filmGenresList.classList.add('film-genres__list');
            filmTime.classList.add('film-date');

            filmInfo.appendChild(filmDescription);
            filmInfo.appendChild(filmGenresName);
            filmInfo.appendChild(filmGenresList);
            filmInfo.appendChild(filmTime); 
        }
        const filmBookmarkBtn = document.createElement('button');
        const filmMoreBtn = document.createElement('button');
        const filmBookmarkDeleteBtn = document.createElement('button');
        
        filmTitle.textContent = film.title.split(' ').slice(0, 2).join(' ');
        filmImg.setAttribute('src', film.poster);
        filmBookmarkBtn.textContent = 'Bookmark';
        filmMoreBtn.textContent = 'More';
        filmBookmarkDeleteBtn.textContent = 'Delete';
        
        
        filmItem.classList.add('film-item');
        filmTitle.classList.add('film-title');
        filmImg.classList.add('film-img');
        filmBookmarkBtn.classList.add('bookmark-btn');
        filmMoreBtn.classList.add('more-btn');
        filmBookmarkDeleteBtn.classList.add('bookmark-delete-btn');
        filmBookmarkBtn.dataset.bookmarkId = film.id;
        filmMoreBtn.dataset.moreId = film.id;
        filmBookmarkDeleteBtn.dataset.bookmarkDeleteId = film.id;
    
        filmItem.appendChild(filmTitle);
        filmItem.appendChild(filmImg);
        filmItem.appendChild(filmMoreBtn);
        filmItem.appendChild(filmBookmarkBtn);
        filmItem.appendChild(filmBookmarkDeleteBtn);
        filmItem.appendChild(filmInfo);
    
        node.appendChild(filmItem);
    })
}

renderFilms(films, elFilmsList, false);

elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const elSelectValue = elSelect.value;
    const elSortSelectValue = elSortSelect.value;
    const elRegExpInputValue = elRegExpInput.value.trim();

    const regExp = new RegExp(elRegExpInputValue, 'gi');

    let filteredFilms = [];
    if (elSelectValue === 'All') {
        filteredFilms = films.filter(movie => movie.title.match(regExp));
    }
    else {
        filteredFilms = films.filter(film => film.genres.includes(elSelectValue)).filter(movie => movie.title.match(regExp));
    }

    filteredFilms.sort(sortFilms[elSortSelectValue]);
    elRegExpInput.value = null;

    renderFilms(filteredFilms, elFilmsList, false);
})

elHeroSection.addEventListener('click', (evt) => {
    const moreFilm = [];
    if (evt.target.matches('.bookmark-btn')) {
        elHeroContent.classList.add('hero-content--flex');
        const bookmarkId = Number(evt.target.dataset.bookmarkId);
        const foundFilm = films.find(film => Number(film.id) === bookmarkId);

        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.textContent = 'Delete';
        bookmarkBtn.classList.add('bookmark-delete-btn');

        if (!bookmarkFilms.includes(foundFilm)) {
            bookmarkFilms.unshift(foundFilm);
        }

        renderFilms(bookmarkFilms, elBookmarkList, false);
    }
    else if (evt.target.matches('.bookmark-close-menu')) {
        elHeroContent.classList.remove('hero-content--flex');
    }
    else if (evt.target.matches('.bookmark-close-icon')) {
        elHeroContent.classList.remove('hero-content--flex');
    }
    else if (evt.target.matches('.bookmark-delete-btn')) {
        const bookmarkDeleteId = Number(evt.target.dataset.bookmarkDeleteId);
        const foundFilmDelete = bookmarkFilms.findIndex(film => Number(film.id) === bookmarkDeleteId);
        bookmarkFilms.splice(foundFilmDelete, 1);
        
        renderFilms(bookmarkFilms, elBookmarkList, false);
    }
    else if (evt.target.matches('.more-btn')) {
        const moreId = Number(evt.target.dataset.moreId);
        const foundFilm = films.find(film => Number(film.id) === moreId);
        
        elModal.style.display = 'block';
        moreFilm.push(foundFilm);
        renderFilms(moreFilm, elModalContent, true);
    }
})


// const elBookmarkItem = document.querySelectorAll('.bookmark-list .film-item');
// console.log(elBookmarkItem);


elModal.addEventListener('click', (evt) => {
    if (evt.target.matches('.modal')) {
        elModal.style.display = 'none';
    }
    else if (evt.target.matches('.close-menu')) {
        elModal.style.display = 'none';
    }
    else if (evt.target.matches('.close-icon')) {
        elModal.style.display = 'none';
    }
})



// elBookmark.addEventListener('click', (evt) => {
//     if (evt.target.matches('.close-menu')) {
//         elBookmark.style.display = 'none';
//         elFilms.style.display = 'block';

//     }
//     else if (evt.target.matches('.close-icon')) {
//         elBookmark.style.display = 'none';
//         elFilms.style.display = 'block';
//     }
// })