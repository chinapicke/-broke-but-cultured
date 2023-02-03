let rate1 = document.querySelector(".rate1");
let rate2 = document.querySelector(".rate2");
let resultBtn = document.querySelector(".result");
let selects = document.querySelectorAll(".options select");
let sel1 = selects[0];
let sel2 = selects[1];
let inputs = document.querySelectorAll(".input input");
let inpt1 = inputs[0];
let inpt2 = inputs[1];

const defaultCurrencyCode = 'GBP';
// gets budget param from URL
const Url = new URL(window.location.toLocaleString());
const budget = Url.searchParams.get('budget');

$(budgetInput).val(budget);

// Empty Object to populate with rates
let rates = {};



let requestURL = "https://api.exchangerate.host/latest?base=USD";
// Calling an API function
fetchRates();

async function fetchRates() {
  let res = await fetch(requestURL);
  res = await res.json();
  rates = res.rates;
  populateOptions();
}

// Getting Data from API object in to our object 
function populateOptions() {
  let val = "";
  Object.keys(rates).forEach((code) => {
    let str;
    //Template for Inner HTML
    if (defaultCurrencyCode == code)
      str = `<option value="${code}" selected>${code}</option>`;
    else
      str = `<option value="${code}">${code}</option>`;
    val += str;
  });
  // Adding rates in to Selects 
  selects.forEach((s) => (s.innerHTML = val));

  
}


function convert(val, fromCurr, toCurr) {

    // Convertion formula
  let v = (val / rates[fromCurr]) * rates[toCurr];
  // Calling method to reduce amount of digits after the comma/dot
  let v1 = v.toFixed(3);
  return v1 == 0.0 ? v.toFixed(5) : v1;
}

function displayRate() {
  let v1 = sel1.value;
  let v2 = sel2.value;

  let val = convert(1, v1, v2);

  rate1.innerHTML = `1 ${v1} is`;
  rate2.innerHTML = `${val} ${v2}`;
}

resultBtn.addEventListener("click", () => {
  let fromCurr = sel1.value;
  //converting to Float because HTML retuns string
  let fromVal = parseFloat(inpt1.value);
  let toCurr = sel2.value;

  if (isNaN(fromVal)) {
    alert("Enter a Number");
  } else {
    let calcVal = convert(fromVal, fromCurr, toCurr);
    inpt2.value = calcVal;
  }
});
// Display rates on select of "options" element.
selects.forEach((s) => s.addEventListener("change", displayRate));
// Button to swap currency in converter
document.querySelector(".swap").addEventListener("click", () => {
  let in1 = inpt1.value;
  let in2 = inpt2.value;
  let op1 = sel1.value;
  let op2 = sel2.value;

  inpt2.value = in1;
  inpt1.value = in2;

  sel2.value = op1;
  sel1.value = op2;
  displayRate();
});
