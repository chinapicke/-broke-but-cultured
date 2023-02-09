// ---------DOM MANIPULATION-------------
var daysInput =$('#daysInput').val()
var budgetInput =$('#budgetInput').val()

// ------------------AUTOCOMPLETE INPUT BAR-----------------------------
//Empty array to push into
var countries = []
var historyCountries = []
// set empty variable outside of function for country currency to be put into so that it can be sued for currency converter API
var countryCurrency=""
var countryName =''


// Autocomplete drop down menu for the user input, found from JS Query website 
function autocomplete(){
$( "#search" ).autocomplete({
    source: countries
})
};

// Empty object to push countrycodes into
const countryCodes = {};

// Function to provide country options for autocomplete input
function getCountries(){
    autocomplete()
// Use URL from REST API with all the countries
    var allCountries = 'https://restcountries.com/v3.1/all'
    $.ajax({
        url: allCountries,
        method: "GET"
    }).then(function (response) {
    //    Loop through each country within the list
        for(var i = 0; i < response.length;i++) {
      
            countryCodes[response[i].name.common] = response[i].cca2;

            // List through each name object
            var countryNames = response[i].name.common;
            // Push it into empty array so that it can use to show countires in autocomplete dropdown
            countries.push(countryNames);

        }
    })
    
}
// Need to have getCountries function outside onclick, otherwise autocomplete does not display
getCountries()
$('#searchBtn').on('click', function(e){
// If there is not input inside country name or not an actual country name show modal to prompt user to input country
    const countryName = $('#search').val()
    if (countryName == ''){ 
        e.preventDefault();
        $('#countryModal').modal('show')
        return
    }
    
    // Assigned inside variable as it was not getting the input
    var daysInput =$('#daysInput').val()
    // console.log($('#daysInput').val())
    if (daysInput === '' ){
        e.preventDefault();
        $('#daysModal').modal('show');
        return
    }
    else{
        console.log(daysInput)
    }
 // If there is not input inside country name show modal to prompt user to input country   
    var budgetInput =$('#budgetInput').val()
    if (budgetInput==="" ){
        e.preventDefault()
        $('#budgetModal').modal('show')
        return
    }
    else{
        console.log(budgetInput)
    }
//     If statement to limit country searches to 8
      if (historyCountries.length === 8){
        e.preventDefault()
        $('#limitModal').modal('show')
        return
    }


    e.preventDefault();

    currencyAPI(() => {

        // Saves all inputs to localStorage
        $('#cca2').val(countryCodes[countryName]);
        let cca2 = countryCodes[countryName]
        
        // Prevent same country saving twice
        if (!historyCountries.find(el => el.countryName == countryName)) {

            // Push search input object into array
            historyCountries.push({
                countryName: countryName,
                countryCode: cca2,
                budget: budgetInput,
                days: daysInput
            });

            localStorage.setItem("historyCountries", JSON.stringify(historyCountries)); //saves input to local storage 
        }

        $('form').submit();
    });

  
});

// ---FUNCTION CLEAR SEARCH HISTORY
$('#clearSearch').on('click', function () {
    // clears local storage
    localStorage.clear()
    // reloads the page to show user that the saved countries are gone
    location.reload()
});



// ----------FUNCTION TO CREATE AN OBJECT OF COUNTRIES AND THEIR CURRENCY

// Function to get the countries currency
function currencyAPI(callback) {
    var countryName = $('#search').val()
    // gets country code from the APO so it can use on trip.html
    let countryCode = countryCodes[countryName]
    var countryURL = 'https://restcountries.com/v2/alpha/'+countryCode
    $.ajax({
        url: countryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response)
        // console.log(countryURL)
        // gets the countries currency 
        countryCurrency=response.currencies[0].code
        // let alphaCode =response[0].alpha2Code
        console.log("Currency: " + countryCurrency)
        callback()
        // console.log("Alpha Code: "+ alphaCode)
       
    });
}


//-----FUNCTION TO MAKE BUTTONS OF PREVIOUS COUNTRY SEARCHES----
function renderButtons (){
    showSavedCountry()
    for (let i = 0; i < historyCountries.length; i++) {
        let search = historyCountries[i];
        //console.log(search)
        // Creates new buttons with each search
        var buttons = $('<button>')
        buttons.attr({ 'class': "col-sm-3 btn btn-secondary savedCountryBtn" })
        // Buttons text is from the looping through of searchCity by the users input 
        buttons.text(search.countryName)
        let url = `trip.html?countryCode=${search.countryCode}&country=${search.countryName}&days=${search.days}&budget=${search.budget}`;
        buttons.attr({'data-url': url})
        // Adds the buttons to the div on the pagex 
        $("#pastSearches").append(buttons);
        buttons.on('click', function (event) {
            // used event target to target the element that caused the button on click
            getCountries(countryName)
        });
    }
}

// ----FUNCTION TO CLEAR BUTTONS-----
// clear buttons stop them to showing on page twice
function clearButtons() {
    $('#pastSearches').empty()
}
// // ------FUNCTION SAVE COUNTRY-----
function saveSearch() {
    // Stringify so can be parsed
    localStorage.setItem("historyCountries", JSON.stringify(historyCountries)); //saves country input to local storage 
}

// // ----FUNCTION GET SAVED COUNTY-----
function showSavedCountry() {
    historyCountries = JSON.parse(localStorage.getItem('historyCountries')) || [];
}


// // Keeps buttons on page even when refreshed
renderButtons()

// opens saved country search results when clicking country button
$('.savedCountryBtn').on('click', function(e) {

    window.location = $(e.target).attr('data-url');

});
