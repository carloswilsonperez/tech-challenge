// Please do not share or post this api key anywhere,
// Your JavaScript will go here, you can view api information at
// http://www.omdbapi.com/, but the short of it is you'll need to
// send an "s" param with your query, an "apiKey" which is provided above
// and a "type" param. The api also accepts "page" as a parameter, and
// accepts standard numbers as arguments (i.e. page=1)
let omdbUrl = 'http://www.omdbapi.com';
let omdbKey = '9085ebf';
let omdbType = 'movie';

async function fetchMetaData() {
    let allData = [];
    let morePagesAvailable = true;
    let currentPage = 0;
    let data;
    let totalResults;
    let resp;
  
    while(morePagesAvailable) {

      currentPage++;

      const response = await fetch(`http://www.omdbapi.com/?apikey=9085ebf&type=movie&s=true&page=${currentPage}`)
      data = await response.json();
      totalResults = data.totalResults;
      resp = data.Response;

      if (data && data.Search) {
          allData.push(...data.Search);
      }
      morePagesAvailable = resp === 'True' ? true : false;
    }
  
    return allData;
  }

  function sortByYear(a, b) {
    return parseInt(a.Year, 10) - parseInt(b.Year, 10);
  }

  function sortByTitle(item1, item2) {
    if (item1.Title < item2.Title) {
        return -1;
    }

    if ( item1.Title > item2.Title) {
        return 1;
    }
  
    return 0;
  }

  fetchMetaData().
  then(data => {
      data = data.sort(sortByYear)
      data.sort(sortByTitle);

      renderList(data); // Render items
    });

    function renderList(listData) {

        // Make a container element for the list
        let listContainer = document.getElementById('render_movies');

        // Set up a loop that goes through the items in listItems one at a time
        numberOfListItems = listData.length;
    
        for (i = 0; i < numberOfListItems; ++i) {
            // create an item for each one
            let divItemRow = document.createElement('div');
            let divItemOverview = document.createElement('div');
            let divItemDetail = document.createElement('div');
            let imgItem = document.createElement('img');
            let infoItem = document.createElement('div');

            infoItem.classList.add("description");
            imgItem.classList.add("thumbnail");
            divItemOverview.classList.add("overview");
            divItemDetail.classList.add("detail");
            divItemRow.classList.add("row");

            if (listData[i].Poster != 'N/A') {
                imgItem.src = listData[i].Poster;
            } else {
                imgItem.src = 'available.svg.png';
            }

            imgItem.dataset.type =  listData[i].Type;
            imgItem.dataset.imdb = listData[i].imdbID;

            // Add the item text
            infoItem.innerHTML = listData[i].Title + ' ' + '(' + listData[i].Year + ')';
    
            // Add listItem to the listElement
            divItemOverview.appendChild(imgItem);
            divItemOverview.appendChild(infoItem);
            divItemRow.appendChild(divItemOverview);
            divItemRow.appendChild(divItemDetail);


            listContainer.appendChild(divItemRow);
        }

        document.getElementById('spinner').remove();

        bindHover();
    }

    function bindHover() {
        let container = document.getElementById('render_movies');

        container.onmouseover = function(event) {

            if (event.target.className === 'thumbnail') {

                // Show movie details
                let infoItem = document.createElement('div');
                let typeItem = document.createElement('div');
                let imdbItem = document.createElement('div');

                infoItem.classList.add("details");
                typeItem.innerHTML = 'Type: ' + event.target.dataset.type;
                imdbItem.innerHTML = 'imdbId: ' + event.target.dataset.imdb;

                infoItem.appendChild(typeItem);
                infoItem.appendChild(imdbItem);

                event.target.parentNode.parentNode.childNodes[1].appendChild(infoItem);
            }
            
        }

        container.onmouseout = function(event) {
            if (event.target.className === 'thumbnail') {
                // Hide movie details
                event.target.parentNode.parentNode.childNodes[1].childNodes[0].remove();
            }
        }
    }
    
    
