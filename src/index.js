import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputHandle, DEBOUNCE_DELAY));

function onInputHandle(e) {
  const trimmedInput = input.value.trim();
  cleanPage();
  if (trimmedInput !== '') {
    fetchCountries(trimmedInput).then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      } else if (data.length === 1) {
        renderOneCountry(data);
      } else if (data.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" height="25"><b>${country.name.official}</b></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markupCountry = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" height="25">
      <b>${country.name.official}</b>
    </li>`;
    })
    .join('');

  const markupCountryInfo = countries
    .map(country => {
      return `<p><b>Capital:</b> ${country.capital}</p>
      <p><b>Population:</b> ${country.population}</p>
      <p><b>Languages:</b> ${Object.values(country.languages)}</p>`;
    })
    .join('');
  countryList.innerHTML = markupCountry;
  countryInfo.innerHTML = markupCountryInfo;
}

function cleanPage() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

countryList.style.listStyle = 'none';
countryInfo.style.paddingLeft = '40px';
