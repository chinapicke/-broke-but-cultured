// ---------DOM MANIPULATION-------------
var daysInput =$('#daysInput').val()
var budgetInput =$('#budgetInput').val()

// ------------------AUTOCOMPLETE INPUT BAR-----------------------------

var countries = []
var historyCountries = []
// set empty variable outside of function for country currency to be put into so that it can be sued for currency converter API
var countryCurrency=""
var countryName =''


// Autocomplete drop down menu for the user input 
function autocomplete(){
$( "#search" ).autocomplete({
    source: countries
})
};

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

    const countryName = $('#search').val()
    if (countryName == '') {
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
        // saves all inputs to localStorage
    
        $('#cca2').val(countryCodes[countryName]);
        let cca2 = countryCodes[countryName]
    
        historyCountries.push({
            countryName: countryName,
            countryCode: cca2,
            budget: budgetInput,
            days: daysInput
        });

        localStorage.setItem("historyCountries", JSON.stringify(historyCountries)); //saves city input to local storage 

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

        console.log(search)
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
    
    localStorage.setItem("historyCountries", JSON.stringify(historyCountries)); //saves city input to local storage 

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
