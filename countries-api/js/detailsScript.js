const domElements = {
    toggleModeBtn : document.querySelector('.dark-mode-container button'),
    countryContainer : document.querySelector('.country-details-container')    
}



const API_URL = 'https://restcountries.com/v3.1/alpha/';
let params = new URLSearchParams(window.location.search);
let countryIso = params.get('iso');



window.addEventListener('DOMContentLoaded', ()=>{
    toggleModes();
    showCountry();
})



function toggleModes(){
    domElements.toggleModeBtn.addEventListener('click', ()=>{
        let element = document.body;
        element.classList.toggle('light-mode');
        if(element.classList.contains('light-mode')){
            domElements.toggleModeBtn.textContent = 'Light Mode';
        }
        else{
            domElements.toggleModeBtn.textContent = 'Dark Mode';
        }
    })
}

   
const fetchData = async(endpoint) => {
    
    const response = await fetch(API_URL + endpoint);
    const data = await response.json(); 
    
    return data;
}


function makeCountry(country){

    let detailCountry = ` <div class="flag-container">
                        <img src="${country.flags.png}" alt="${country.name} flag">
                    </div>
                    <div class="details-container">
                        <div class="country-name">
                            <h2>${country.name.common}</h2>
                        </div>
                        <div class="country-info-container">
                            <div class="country-info">
                                <ul>
                                    <li><span class="bold">Native Name: </span>${Object.values(country.name.nativeName)[0].common}</li>
                                    <li><span class="bold">Population: </span>${country.population.toLocaleString('en-UK').replaceAll('.',',')}</li>
                                    <li><span class="bold">Region: </span>${country.region}</li>
                                    <li><span class="bold">Sub Region: </span>${country.subregion}</li>
                                    <li><span class="bold">Capital: </span>${country.capital}</li>
                                </ul>
                            </div>
                            <div class="country-info">
                                <ul>
                                    <li><span class="bold">Top Level Domain: </span>${country.tld}</li>                            
                                    ${createCurrencies(country.currencies)}
                                    ${createLanguages(country.languages)}
                                </ul>
                            </div>
                        </div>
                        <div class="border-countries-container">
                            <div class="border-countries-title">
                                <h2>Border Countries:</h2>
                            </div>
                            <div class="border-countries">
                                <ul>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>`;


    domElements.countryContainer.insertAdjacentHTML('beforeend', detailCountry);

    let bordersContainer = document.querySelector('.border-countries ul');
   
    
    fetch(API_URL + countryIso)
    .then((response) => response.json())
    .then(data=>{
        data.forEach(info => {
            info.borders.forEach(item=>{
                fetch(API_URL + item)
                .then((response) => response.json())
                .then(data=>{
                    data.forEach(item => {
                        let borderItem = document.createElement('li');
                        bordersContainer.appendChild(borderItem);
                        borderItem.textContent = item.name.common;
                        borderItem.setAttribute('data-iso', item.cca3);
                        

                        borderItem.addEventListener('click', ()=>{
                            let url = new URL(window.location);
                            let params = url.search;
                            params = `?iso=`+item.cca3;
                            console.log(params);
                            /* window.location.href = `localhost/country-api/details.html`+ params */
                            window.location.href = `http://127.0.0.1:5500/details.html`+ params
                            
                        })
                    })
                })
            })
        })
    })
}


async function showCountry(){
    const res = await fetch(API_URL + countryIso);

    let country = await res.json();
    country.forEach(data => {
        makeCountry(data)
    });
}


/* function showCountry(){
    fetchData(countryIso).then((data)=>{
        data.forEach((info)=>{            
            domElements.countryContainer.innerHTML = makeCountry(info);
        })
    })
} */



function createCurrencies(curr){    
    let currenciesElement = '';
    let currenciesArr = [];

    for(let i in curr){
        currenciesArr.push(curr[i].name);
    }
    currenciesArr = currenciesArr.join(', ');
    currenciesElement += `<li><span class="bold">Currencies: </span>${currenciesArr}</li>`;

    return currenciesElement;
}



function createLanguages(lang){    
    let languagesElement = '';
    let languagesArr = [];

    for(let i in lang){
        languagesArr.push(lang[i]);
    }
    languagesArr = languagesArr.join(', ');
    languagesElement += `<li><span class="bold">Languages: </span>${languagesArr}</li>`;

    return languagesElement;
}



/* function createBorders(borders){
    let bordersElement = '';

    for (let i in borders){
        fetch("https://restcountries.com/v3.1/alpha/" + borders[i])
        .then((response) => response.json())
        .then(data=>{
            data.forEach(item => {
                bordersElement += `<li>${item.name.common}</li>`
            })
        })
    }
    return bordersElement;
} */




