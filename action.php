<!DOCTYPE html>
  <html>
  <head lang="en">
      <!-- Nice font -->
      <link rel="stylesheet" media="screen" href="https://fontlibrary.org/face/gidole-regular" type="text/css"/>
      <!-- src for gathering Yelp Fusion information -->
      <script src="get.js"></script>
      <!-- src needed to use Google Maps API -->
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBz8yq6a-Dokm-DLXTegwH_Q4jzRL0Opow"></script>
      <!-- src for information to use jquery -->
      <script src="https://code.jquery.com/jquery-3.3.1.min.js" 
      integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" 
      crossorigin="anonymous"></script>
      
      <!-- Style to implement certain font -->
      <style type = "text/css">
        body {
         font-family: 'GidoleRegular';
         font-weight: normal;
         font-style: normal;
        }
      </style>
  
    <meta charset="utf-8">
    
    <title> Capital One SES Coding Challenge </title>
  </head>
  
  <!-- Add a background picture to the webpage, along with headers -->
  <body style="background-image:url(webb.png)">
    <div id="results"> 
    <h1> Lettuce Eat </h1>
    <h2><b> A user-friendly application that promotes vegetarian, vegan, and plant-based options!</b></h2>
    <h3 id="location"> Please let this application use your location.</h3>
    <h4> Find locations near you (Please wait for the browser to load the page):</h4>

<!-- Uses php and post to grab all elements from the form on the previous page-->
<?php
$limit = $_POST['limit'];
$price = $_POST['price'];
$sort = $_POST['sort'];
$miles = $_POST['miles'];
$cuisine = $_POST['cuisine'];
$open = $_POST['open'];
?>

  <!-- Creates hidden fields so that javascript can use the variables found using php -->
  <input type="hidden" id="limit" name="limit" value="<?php echo $limit?>">
  <input type="hidden" id="price" name="price" value="<?php echo $price?>">
  <input type="hidden" id="sort" name="sort" value="<?php echo $sort?>">
  <input type="hidden" id="miles" name="miles" value="<?php echo $miles?>">
  <input type="hidden" id="cuisine" name="cuisine" value="<?php echo $cuisine?>">
  <input type="hidden" id="open" name="open" value="<?php echo $open?>">
  
  
   <script>
       //Grabs variables from the hidden variables and gets their values
       var limit = document.getElementById('limit').value;
       var price = document.getElementById('price').value;
       var sort = document.getElementById('sort').value;
       var miles = Math.round((document.getElementById('miles').value)*1609.344);
       var cuisine = document.getElementById('cuisine').value;
       var open = document.getElementById('open').value;
       
       if(open === "true")
         open = true;
       else
         open = false;
       
       /* This function gets the location of the current user and runs both the 
       getRestaurantInfo() and createYelpMap() methods using the latitude and longitude found and the user input
       */
       function getLocation(){
        if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(position){
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            getRestaurantInfo(latitude, longitude, price, sort, miles, limit, cuisine, open);
            createYelpMap(latitude, longitude);
        });
        }
        else{
          document.getElementById("location").innerHTML="Geolocation is not supported by this browser.";
        }
       }
        /* 
          Call to getLocation()
        */
        getLocation();
        
        /* 
          Function that creates a map based off of Google Maps API.
          It displays markers from the current location of the user and also
          displays markers from all of the restaurant locations.
        */
        function createYelpMap(latitude, longitude) {
          // The latitude and longitude of the current user
          var latlng = new google.maps.LatLng(latitude, longitude);
          var mapProp = {
              center: latlng,
              zoom:12,
              };
              // Creating a map
              var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
              // Creating a marker for the Current Location
              var locationMarker = new google.maps.Marker({
               position: latlng,       
               title: "Current Location",
               map:map,
               icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
               },
               animation: google.maps.Animation.DROP
               });
               attachRestaurantName(locationMarker, "Current Location");
         
          /*
            Uses the array from get.js to pass each business' name, latitude, and longitude to
            create a marker for each business.   
          */   
          var marker, i;
          var coordArray = getCoordinatesArr();
          for(i = 0; i < coordArray.length; i++) {
               marker = new google.maps.Marker({
               position: new google.maps.LatLng(coordArray[i][1], coordArray[i][2]),       
               title: coordArray[i][0],
               map: map,
               animation: google.maps.Animation.DROP
             }); 
             attachRestaurantName(marker, coordArray[i][0]);
          }
       }
       
       // A function to attach the restaurant name to each business for user-friendliness
       function attachRestaurantName(marker, name) {
         var infowindow = new google.maps.InfoWindow({
           content: name
         });

        marker.addListener('click', function() {
          infowindow.open(marker.get('map'), marker);
        });
      }
     </script>
     <div id="googleMap" style="width:800px;height:600px"></div>
  </body>
</html>



