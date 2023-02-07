// function to wait for element to load and if not loaded, try again in 0.1 seconds
var waitForEl = function(selector, callback) {
    if (jQuery(selector).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForEl(selector, callback);
      }, 100);
    }
  };
  
// Gets url parameters values
const currentUrl = new URL(window.location.toLocaleString());
const countryInput = currentUrl.searchParams.get('country');
const countryCode  = currentUrl.searchParams.get('countryCode');
const daysInput = currentUrl.searchParams.get('days');


$( document ).ready(function() {

  // //geoDB alpha-2 codes from cityInput
  let countryISO = countryCode;

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
      
     let notripBudget =`
      We don't have enough data about ${countryInput} to give you a trip budget, but please use our currency converter!
      `;
      

      if (totalTripCost === 0){
        $('#tripBudget').text(notripBudget);
      }
      else{
        $('#tripBudget').text(tripBudget);
      }
      
      const currencyCode = $('#budgetyourtrip .budgetyourtrip-costform:nth-child(3)').find('select').val();
  
  $('#currencyWidget .target select').val(currencyCode)
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
          
          const voyageBtn = $(`<a target="_blank" href="https://en.wikivoyage.org/wiki/${x.title}"><button class="btn m-1">${x.title}</button></a>`);
          $('#wiki').append(voyageBtn);
          
          
          }
          
      })
  }

});

