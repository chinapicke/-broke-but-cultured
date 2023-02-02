// function to wait for element to load
var waitForEl = function(selector, callback) {
    if (jQuery(selector).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForEl(selector, callback);
      }, 100);
    }
  };
  

$( document ).ready(function() {

let daysInput = 10;

// //geoDB alpha-2 codes from cityInput
let countryISO = "TH";

// country input from dropdown
//let countryInput = $('#countryInput').val();
let countryInput = "Thailand";


generateBudgetWidget();
addVoyageBtns();


// Generate Trip Budget Widget
function generateBudgetWidget() {

    var widgetScript = document.createElement('script');
    widgetScript.src = `https://widget.budgetyourtrip.com/location-widget-js/${countryISO}`;
    container = document.getElementById('budgetyourtrip');
    container.innerHTML = '';
    container.appendChild(widgetScript);

}

waitForEl('[id^="budgetyourtrip-curvalue-0"]', function() {
    // Gets average daily cost 
    let dailyCostStr = $('[id^="budgetyourtrip-curvalue-0"]').text();
    let dailyCost = parseFloat(dailyCostStr.replace(",", ""));
    
    // Gets currrency symbol
    let currency = $('[id^="budgetyourtrip-curvalue-0"]').siblings('.budgetyourtrip-symbol').text();
    
    let totalTripCost = daysInput * dailyCost;
    
    //console.log(totalTripCost)
    
    let tripBudget = `
    We calculate that a ${daysInput} day trip to ${countryInput} would cost you on average ${currency}${totalTripCost}.
    `;
    
    $('#tripBudget').text(tripBudget);
    
});

// create buttons for each wikivoyage category
function addVoyageBtns() {

    let voyageURL = `https://en.wikivoyage.org/w/api.php?action=query&list=search&srsearch=${countryInput}&utf8=&format=json&origin=*`;

    $.ajax({
        url: voyageURL,
        method: "GET"
    }).then(function(response) {
        
        $('#countryTitle').text(response.query.search[0].title);
        
        for (let x of response.query.search) {
        
        const voyageBtn = $(`<a target="_blank" href="https://en.wikivoyage.org/wiki/${x.title}"><button class="btn m-1 btn-info">${x.title}</button></a>`);
        $('#wiki').append(voyageBtn);
        
        
        }
        
    })
}

});

