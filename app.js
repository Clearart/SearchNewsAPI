// Custom Http Module
function customHttp() {
    return {
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}

// Init http module
const http = customHttp();

const newService = (function () {
    const apiUrl = 'http://newsapi.org/v2';
    const apiKey = '5d038207775448bd88edc79ce22a7a2c';

    return {
        topHeadlines(contry = 'ua', cb) {
            http.get(`${apiUrl}/top-headlines?country=${contry}&apiKey=${apiKey}`, cb);
        },
        everyThings(query, cb) {
            http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
        }
    }
})();

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    loadNews();
})

//  init selects
document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
    loadNews();
});

//Load news function

function loadNews() {
    const country = countrySelect.value;
    const searchText = searchInput.value;

    if(!searchText) {
        newService.topHeadlines(country, onGetResponse);
    } else {
        newService.everyThings(searchText, onGetResponse);
    }

}

function onGetResponse(err, res) {
    if (err) {
        
    }
    renderNews(res.articles);
}

function renderNews(news) {
    const newsContainer = document.querySelector('.news-container .row');
    if (newsContainer.children.length) {
        clearContainer(newsContainer)
    }
    let fragment = '';
    news.forEach(newItem => {
        const el = newsTemplate(newItem);
        fragment += el;
    })
    newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

function clearContainer(container) {
    let child = container.lastElementChild;
    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
}

function newsTemplate({ urlToImage, title, url, description }) {
    return `
      <div class="col s12">
        <div class="card">
            <div class="card-image">
                <img src="${urlToImage}" alt="">
                <span class="card-title">${title || ''}</span>
            </div>
            <div class="card-content">
                <p>${description || ''}</p>
            </div>
            <div class="card-action">
                <a href="${url}">Read more</a>
            </div>
        </div>
      </div>  
    `;
}