// ---------DOM MANIPULATION-------------
var daysInput =$('#daysInput').val()
var budgetInput =$('#budgetInput').val()

// ------------------AUTOCOMPLETE INPUT BAR-----------------------------

let countries = []
// set empty variable outside of function for country currency to be put into so that it can be sued for currency converter API
var countryCurrency=""
var countryName =''


// Autocomplete drop down menu for the user input 
function autocomplete(){
$( "#search" ).autocomplete({
    source: countries
})
};

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
    // console.log(response)
        for(var i = 0; i < response.length;i++) {
            // List through each name object
            var countryNames = response[i].name.common;
            // Push it into empty array so that it can use to show countires in autocomplete dropdown
            countries.push(countryNames);
            // console.log(countryNames);
        // }
        }
    })
    
}
// Need to have getCountires function outside onclick, otherwise autocomplete does not display
getCountries()
$('#searchBtn').on('click', function(e){
    e.preventDefault()
    if (countries.includes($('#search').val())){
        console.log('Its found')
    }
    else{
        // Need to change this into a modal alert/pop up 
        alert('You have entered an incorrect value, please enter country name')
        return
    }
    // Assigned inside variable as it was not getting the input
    var daysInput =$('#daysInput').val()
    // console.log($('#daysInput').val())
    if (daysInput === '' ){
        alert('Please fill in number of days you would like to travel for')
        return
    }
    else{
        console.log(daysInput)
    }
    var budgetInput =$('#budgetInput').val()
    if (budgetInput==="" ){
        alert('Please fill in a budget you have for your trip')
        return
    }
    else{
        console.log(budgetInput)
    }
    currencyAPI()
    
}
) 


// ----------FUNCTION TO CREATE AN OBJECT OF COUNTRIES AND THEIR CURRENCY

// Function to get the countries currency
function currencyAPI(countryCurrency) {
    var countryName = $('#search').val()
    var countryURL = 'https://restcountries.com/v2/name/'+countryName+'?fullText=true'
    $.ajax({
        url: countryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response)
        // console.log(countryURL)
        // gets the countries currency 
        countryCurrency=response[0].currencies[0].code
        // let alphaCode =response[0].alpha2Code
        console.log("Currency: " + countryCurrency)
        // console.log("Alpha Code: "+ alphaCode)

    })
}



