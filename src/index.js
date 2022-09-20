import '../css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const fetchCountries = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");

fetchCountries.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
        countryList.innerHTML = '';
        if (fetchCountries.value.trim() == '') {
                return;
        }
        fetchCountriesAPI(fetchCountries.value.trim())
                .then((countries) => renderCountryList(countries)).catch(noMatches);
}

function fetchCountriesAPI(name) {
        if (name == "")
                return;
        return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`).then(
                (response) => {
                        if (!response.ok) {
                                countryList.innerHTML = '';
                                throw Error(response.statusText);
                        }
                        return response.json();
                }
        );
}

function renderCountryList(countries) {
        if (countries.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                countryList.innerHTML = '';
        }
        else if (countries.length >= 2 && countries.length <= 10) {
                const markup = countries
                        .map((country) => {
                                return `<li>
          <p><img src="${country.flags.svg}" width="50"/> ${country.name.official}</p>
        </li>`;
                        })
                        .join("");
                countryList.innerHTML = markup;
        }
        else if (countries.length == 1) {
                const markup = countries
                        .map((country) => {
                                return `<li>
          <h1><img src="${country.flags.svg}" width="50"/> ${country.name.official}</h1>
          <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${Object.values(country.languages)}</p>
        </li>`;
                        })
                        .join("");
                countryList.innerHTML = markup;
        }
        else {
                countryList.innerHTML = '';
        }
}
function noMatches(error) {
        console.log(error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryList.innerHTML = '';
}