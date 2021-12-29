// Step 1 - select the date to populate the search
// Step 2 - send the data to fetch on click
// Step 3 - retrieve and display the data;



document.getElementById("checkdate").addEventListener("change", function() {
    let wikiDate = new Date(this.value);
    let month = (wikiDate.getUTCMonth() + 1).toString();
    monthFixed = month.padStart(2, '0');  // ensure month is appropriatly formatted for single digits
    let date = wikiDate.getUTCDate().toString();
    dateFixed = date.padStart(2,'0'); // ensure date is appropriately formatted for single digits
    let year = wikiDate.getUTCFullYear().toString();
    wikiDataCheck(monthFixed, dateFixed, year);

});


const baseURL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top';

let headers = new Headers({
    "API-User-Agent":     "hacksawfg@yahoo.com"
});

// // let targetMonth = "07";
// // let targetDay = "18";
// // let targetYear = "2015"; 
let project = "en.wikipedia";

let listElement = document.getElementById('wiki-list');

function wikiDataCheck(month, day, year) {
    
    // removes data for different date selection
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
    
    let searchURL = `${ baseURL }/${ project }/all-access/${ year }/${ month }/${ day }`; // sets URL for data retrieval
    fetch(searchURL) // grab URL w/above values
        .then(response => response.json())
        .then(jsonData => {
            let filteredData = jsonData.items[0].articles.filter(article => {
                return (article.article.includes("Special:") === false && 
                article.article.includes("Main_Page") === false); // filter out Main page && (and) specials - not this OR this, this AND this
            } )
            console.log(jsonData.items[0].articles.slice(0,30)); // validate data displayed
            for (let article of filteredData.slice(0,15)) {  // sets to loop through sliced array
                displaywikiDataResults(article);
            }
        })

    }
function displaywikiDataResults(wikiData) {
    let wikiCard = document.createElement('li'); // creates list item
    let wikiTitle = document.createElement('a');  // creates link to page
    let wikiViews = document.createElement('p'); // create number of views field

    wikiTitle.setAttribute('href', `https://${ project }.org/wiki/${ wikiData.article }`); // wikiData.article is the reference to the object that contains the string
    wikiTitle.target = "_blank"; // can use attribute to set instead of setAttribute
    wikiTitle.textContent = `${ wikiTitle }`;
    wikiTitle.innerText = wikiData.article;
    wikiViews.innerText = wikiData.views + ' Views';

    wikiCard.appendChild(wikiTitle);
    wikiCard.appendChild(wikiViews);

    listElement.appendChild(wikiCard);
}
