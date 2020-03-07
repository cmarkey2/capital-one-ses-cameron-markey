// URL of yelp business search, with cors anywhere before it
var yelp_url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
// Specific api key
var api = "Bearer oFy945EvCRcRmrtKpIeiv9T0VJXjTuA71OcqMfobmxg8foPXH_pg4gPd57UL2SYR0kiZY0U8So8__AV_Z8NmATCCypi_GzTk59TcEeFcJbLtJQ-AVJIGEZO7nCRPXnYx";
// Array of coordinates for markers to use in Google Maps API
var coordinatesArr = new Array();

/*
  This function uses an ajax call to get all information for restaurants based on the user's current latitude and longitude and choices.
  Each business has its own section displayed on the screen, including a picture and information about the restaurant.
*/
function getRestaurantInfo(latitude, longitude, price, sort, miles, limit, cuisine, open) {
  $.ajax({
    type: "GET",
    url: yelp_url,
    data: {
      term: cuisine, 
      latitude: latitude, 
      longitude: longitude,
      price: price,
      sort_by: sort,
      radius: miles,
      limit: limit,
      open_now: open
      },
    headers: {Authorization: api},
    dataType: 'json',
    async: false,
     success: function(data){
                // Grab the results from the API JSON return
                var totalresults = data.total;
                // Change sort results to look like plain text to display to user
                if(sort === 'best_match') 
                  sort = "best match";
                if(sort === 'review_count')
                  sort = "review count";
                // Change price results to look like plain text to display to user
                if(price === '1')
                  price = "$";
                else if(price === '1,2')
                  price = "$$";
                else if(price === '1,2,3')
                  price = "$$$";
                else
                  price = "$$$$";
                // If our results are greater than 0, continue
                if (totalresults > 0){
                    // Display a header on the page with the number of results and all of the user's choices 
                    if(open == false) {
                      if(totalresults > limit && cuisine !== 'restaurant') {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! ' + limit + ' restaurants with ' + cuisine + ' options are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. All restaurants - open or closed - are displayed. </b></h5>');
                      }
                      else if(totalresults > limit) {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! ' + limit + ' restaurants are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. All restaurants - open or closed - are displayed. </b></h5>');
                      }
                      else if(totalresults < limit && cuisine !== 'restaurant') {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! All restaurants with ' + cuisine + ' options are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. All restaurants - open or closed - are displayed. </b></h5>');
                      }
                      else {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! All restaurants are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. All restaurants - open or closed - are displayed. </b></h5>');
                      }
                    }
                    else {
                      if(totalresults > limit && cuisine !== 'restaurant') {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! ' + limit + ' restaurants with ' + cuisine + ' options are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. Only restaurants that are currently open are displayed. </b></h5>');
                      }
                      else if(totalresults > limit) {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! ' + limit + ' restaurants are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. Only restaurants that are currently open are displayed. </b></h5>');
                      }
                      else if(totalresults < limit && cuisine !== 'restaurant') {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! All restaurants with ' + cuisine + ' options are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. Only restaurants that are currently open are displayed. </b></h5>');
                      }
                      else {
                        $('#results').append('<h5><b>There are ' + totalresults + ' results! All restaurants are displayed for you! They are sorted by ' + sort + ', have a price-point of up to ' + price + ', and are located in a radius of about ' + Math.round(getMiles(miles)) + ' miles away. Only restaurants that are currently open are displayed. </b></h5>');
                      }
                    }
                    // Iterate through the array of 'businesses' which was returned by the API
                    $.each(data.businesses, function(i, business) {
                        // Store each object from each business in a variable
                        var id = business.id;
                        var phone = business.display_phone;
                        var image = business.image_url;
                        var name = business.name;
                        var rating = business.rating;
                        var reviewcount = business.review_count;
                        var address = business.location.address1;
                        var city = business.location.city;
                        var state = business.location.state;
                        var zipcode = business.location.zip_code;
                        var distance = getMiles(business.distance).toFixed(2);
                        var latitude = business.coordinates.latitude;
                        var longitude = business.coordinates.longitude;
                        coordinatesArr.push([name, latitude, longitude]);
                        var price = business.price;
                        if(price === undefined) {
                          var price_statement = "There is no pricing available for this restaurant";
                        }
                        else {
                          var price_statement = "The price-point is " + price;
                        }
                        // Append the results onto the page to be displayed
                        $('#results').append('<div id="' + id + '" style="margin-top:50px;margin-bottom:50px;"><img src="' + image + '" style="width:200px;height:150px;"><br>This restaurant is called <b>' + name + '</b><br>Address: ' + address + ' ' + city + ', ' + state + ' ' + zipcode + '<br>The phone number for this restaurant is: ' + phone + '<br>' + price_statement + '<br>This restaurant has a rating of ' + rating + ' with ' + reviewcount + ' reviews<br> This restaurant is ' + distance + ' miles away from your current location</div>');
                  });
                } else {
                    // If there are no results, a message is displayed that shows that there are no results
                    $('#results').append('<h5>There are no results for this area!</h5>');
                }
    },
    // Error function in case that the data does not work properly
    error: function(data) {
            
            console.log('Error:', data);
        }
  });
}

// Returns a function that contains an array where each value contains a business' name, latitude, and longitude
function getCoordinatesArr() {
    return coordinatesArr;
}

// Converts meters to miles to be more user-friendly for American viewers
function getMiles(i) {
     return i/1609.344;
}
