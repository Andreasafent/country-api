const domElements = {
    dropdownContainerBtn : document.querySelector('.filter-btn'),
    dropdownContent : document.querySelector('.dropdown-container .dropdown-content'),
    dropdownBtn : document.querySelector('.fa-angle-down'),
    toggleModeBtn : document.querySelector('.dark-mode-container button'),
    countryContainer : document.querySelector('.countries-container'),
    filterContainer : document.querySelector('.search-filter-container .filter-title'),
    filterBtns : document.querySelectorAll('.dropdown-content nav ul li button '),
    input : document.querySelector('input')
}

const API_URL = 'https://restcountries.com/v3.1/';

let windowHref = window.location.href;




window.addEventListener('DOMContentLoaded', ()=>{
    init();
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



function debounce(func, timeout = 500){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}



function dropdownToggle(){
    domElements.dropdownContainerBtn.addEventListener('click', ()=>{
        domElements.dropdownContent.classList.toggle('show');
        domElements.dropdownBtn.classList.toggle('rotate');
    })
}



/* const fetchData = async(endpoint) => {
    if (!endpoint) {
        endpoint = 'all';
    }
    const response = await fetch(API_URL + endpoint);
    const data = await response.json(); 
    
    return data;
} */



async function showCountries(){
    const res = await fetch(API_URL + 'all');

    let countries = await res.json();
    countries.forEach(country => {
        makeCountry(country);
    });
}



async function makeCountry(item){

    let country = `<section class="${item.name.common} country-item" data-iso-code="${item.cca3}">
                    <div class="flag">
                        <img src=${item.flags.png} alt="country-flag">
                    </div>
                    <div class="country-info-container">
                        <div class="country-name">
                            <h2>${item.name.common}</h2>
                        </div>
                        <div class="country-info">
                            <ul>
                                <li><span class="bold">Population:</span>  ${item.population.toLocaleString('en-UK').replaceAll('.',',')}</li>
                                <li><span class="bold">Region:</span>  ${item.region}</li>
                                <li><span class="bold">Capital:</span>  ${item.capital}</li>
                            </ul>
                        </div>
                    </div>
                </section>`;

    domElements.countryContainer.insertAdjacentHTML('beforeend', country);

    document.querySelectorAll('.country-item').forEach((country) => {
        country.addEventListener('click', () => {
            let isoCode = country.dataset.isoCode;
            window.location.href = windowHref + `details.html?iso=${isoCode}`;
        });
    })
}




function filterByRegion(region){

    domElements.countryContainer.innerHTML='';

    if(region !== 'All'){
        if(!domElements.input.value){
            fetch('https://restcountries.com/v3.1/region/' + region.toLowerCase())
                .then(res =>{return res.json()})
                .then(data=>{
                    data.forEach(country => {
                        makeCountry(country);
                    })
                })
        }
        else{
            searchCountries();
        }
    }
    else{
        if(!domElements.input.value){
            showCountries()
        }
        else{
            searchCountries();
        }
    } 
    
}




function searchCountries(){

    if(this.timeout){
        window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(()=>{
        domElements.countryContainer.innerHTML='';
    
        let regionFilter = document.querySelector('.clicked');
    
        if (regionFilter !== null){
            regionFilter = regionFilter.textContent;
        }
    
        let input = domElements.input.value.toLowerCase();
    
        if(input != ''){
            fetch('https://restcountries.com/v3.1/name/' + input)
                .then(res =>{return res.json()})
                .then(data=>{
                    data.forEach(country => {
                        if (regionFilter != 'All' && regionFilter != null){
                            if (regionFilter == country.region){
                                makeCountry(country);
                            }
                        }
                        else{
                            makeCountry(country);
                        }
                        
                    })
                })
        }
    
        else{
            showCountries()
        }
    }, 500)
}



function removeClickedItem(){
    let clickedItem = document.querySelector('.clicked');
    if(clickedItem !== null){
        clickedItem.classList.remove('clicked')
    }
}



function removeDropdown(){
    domElements.filterBtns.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            filterByRegion(btn.textContent);
            domElements.filterContainer.textContent = btn.textContent;
            domElements.dropdownContent.classList.remove('show');
            domElements.dropdownBtn.classList.toggle('rotate');
            removeClickedItem();
            btn.classList.add('clicked');
        })
    })
}



function init(){

    toggleModes();
    showCountries();
    dropdownToggle();
    removeDropdown();

    domElements.filterBtns.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            filterByRegion(btn.textContent);
            removeClickedItem();
            btn.classList.add('clicked');
        })
    })

    domElements.input.addEventListener('keyup', searchCountries);
}
























/* window.addEventListener('DOMContentLoaded', ()=>{
    dropdownToggle();
    toggleModes();
    
    init();
})



function debounce(func, timeout = 500){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}



function dropdownToggle(){
    domElements.dropdownContainerBtn.addEventListener('click', ()=>{
        domElements.dropdownContent.classList.toggle('show');
        domElements.dropdownBtn.classList.toggle('rotate');
    })
}



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
    if (!endpoint) {
        endpoint = 'all';
    }
    const response = await fetch(API_URL + endpoint);
    const data = await response.json(); 
    
    return data;
}



function makeCountries(countries){
    let displayCountry = countries.map((country)=>{
        return `
            <section class="${country.name.common} country-item" data-iso-code="${country.cca3}">
                <div class="flag">
                    <img src=${country.flags.png} alt="country-flag">
                </div>
                <div class="country-info-container">
                    <div class="country-name">
                        <h2>${country.name.common}</h2>
                    </div>
                    <div class="country-info">
                        <ul>
                            <li><span class="bold">Population:</span>  ${country.population.toLocaleString('en-UK').replaceAll('.',',')}</li>
                            <li><span class="bold">Region:</span>  ${country.region}</li>
                            <li><span class="bold">Capital:</span>  ${country.capital}</li>
                        </ul>
                    </div>
                </div>
            </section>
            `;  
    })

    displayCountry = displayCountry.join('');
    domElements.countryContainer.innerHTML = displayCountry;

    document.querySelectorAll('.country-item').forEach((country) => {
        country.addEventListener('click', () => {
            let isoCode = country.dataset.isoCode;
            window.location.href = windowHref + `details.html?iso=${isoCode}`;
        });
    })
};



function showCountries(){
    let countriesArr=[];
    fetchData().then((data)=>{
        data.forEach((item)=>{
            countriesArr.push(item);
        });
        makeCountries(countriesArr);
    });
};



function filterByRegion(region){
    let inputValue = domElements.input.value.toLowerCase();
    
    
    let countriesArr = [];
    if(region !== 'All'){
        if(!inputValue){
            fetchData('region/' + region).then((data)=>{
                data.forEach((item)=>{
                    countriesArr.push(item);
                });
                makeCountries(countriesArr);
                countriesArr = [];
            });
        }
        else{
            debounce(searchCountries);
        }
        

    }
    else{
        if(!inputValue){
            showCountries();
        }
        else{
            debounce(searchCountries);
        }        
    }
}




function searchCountries(){
    let countriesArr = [];    
    let inputValue = domElements.input.value.toLowerCase();
    let region = document.querySelector('.active');

    if (region !== null) {
        region = region.textContent;
    }
    

    if(inputValue !== ''){
        fetchData('name/' + inputValue).then((data)=>{
            data.forEach((item)=>{
                if (region != 'All' && region != null){
                    if(region == item.region){
                        countriesArr.push(item);
                    }
                }
                else{
                    countriesArr.push(item);
                }
            })
            makeCountries(countriesArr);
            countriesArr = [];
        })
    }
    else{
        showCountries();
    }    
}


function removeClickedItem(){
    let getClickedItem = document.querySelector('.clicked');
    if (getClickedItem !== null) {
        getClickedItem.classList.remove('clicked');
    }
}


function init(){
    showCountries();

    domElements.filterBtns.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            filterByRegion(btn.textContent);
            domElements.dropdownContainerBtn.textContent = btn.textContent;
            domElements.dropdownContent.classList.remove('show');
            removeClickedItem();
            btn.classList.add('clicked');
        })
    }) 


    domElements.input.addEventListener('keyup', debounce(searchCountries))
}
 */



