const travelApp = {};

travelApp.layerGroup = null;

travelApp.getInterest = function (query) {
    $('#loader').show();
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: `https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-text`,
            params: {
                city_name: query,
                apikey: "fma82wXQhGiqg3UGbSHNeiypaPyr6ZUl",
            },
            proxyHeaders: {
                'Some-Header': 'goes here'
            },
            xmlToJSON: false,
            useCache: false
        },
    }).then(function (result) {
        // console.log(result);

        //get the points of interest
        travelApp.displayInterest(result.points_of_interest)
    });

};

travelApp.displayInterest = function(interestArray){
    // console.log(interestArray);

    //wait till all promise has been returned 
    // console.log(interestArray);
    $.when(...interestArray)
        .then((...finish) =>{
            //if travelApp.layerGroup is not equal null then clear all previous layers

            if(travelApp.layerGroup != null){
                //clear the layers of markers
                travelApp.layerGroup.clearLayers();
            }
            // console.log(finish);
            //empty the arrays
            $('#interestBox').empty();
            $('#largeInterestBox').empty();
        
            let mark = [];
            finish.forEach(function(destination) {
                // $('#interestBox').empty();
                // console.log('destination in for each', destination);
        

                // create a variable of title, give a class of title and pull the title from object
                const title = $('<h2>').addClass('title').text(destination.title);
                
                //create a variable of image, pull the image from object
                const image = $('<img>').attr('src', destination.main_image);
                


                //This is for short description section
                //create a const of shortDescription, add a class and pull info from object
                const shortDescription = $('<p>').addClass('shortdescriptionText').text(destination.details.short_description);

                //create a a tage of readMore, link it to longdescription
                const readMore = $('<a>').addClass('readMore').attr('href', `#${destination.title}`).text('Read More');

                //create a div to wrap around the shorDescription and readMore button 
                const textTravelPlace = $('<div>').addClass('indTextPlace').append(shortDescription, readMore);


                // const readLess = $('<button>').addClass('readLess').text('Read Less');
                // const travelPlace = $('<div>').addClass('indPlace').append(image, textTravelPlace);
                // const travelEachPlace = $('<div>').addClass('eachPlace').append(title, travelPlace);



                //This is for Read More Section
                // create a const to take image for readmore section
                const largeimage = $('<img>').attr('src', destination.main_image);

                //create a div for quotes to show up
                // const funFact =$('<div>').attr('id', 'type')

                const instaImgGrid = $('<div>').addClass('instaImgGrid').append(largeimage);

                //create a div to include largeimage and title to create the imageGrid 
                const largeimageGrid = $('<div>').addClass('imgGrid').append(instaImgGrid);

                //create a h2 with an id for the read more btn and also pull title from object
                const largetitle = $('<h2>').text(destination.title).attr('id', destination.title);


                //create variable for icons
                const star = $('<i>').addClass('fa fa-star').attr('aria-hidden', 'true');
                // <i class="fa fa-star" aria-hidden="true"></i>
                const mapIcon = $('<i>').addClass('fa fa-map-marker').attr('aria-hidden', 'true');
                // <i class="fa fa-map-marker" aria-hidden="true"></i>
                const laptop = $('<i>').addClass('fa fa-laptop').attr('aria-hidden', 'true');
                // <i class="fa fa-laptop" aria-hidden="true"></i>


                //create a p tag for rating
                const ratingTitle = $('<h3>').addClass('ratingTitle').text('Rating');
                const rating = $('<p>').addClass('rating').text(destination.grades.city_grade);
                const ratingGrid = $('<div>').addClass('ratingGrid').append(ratingTitle, star, rating);


                //creating div to hold all location information
                const locationTitle = $('<h3>').addClass('locationTitle').text('Location');

                const longitudeAmount = $('<p>').addClass('longitudeAmount').text(`Longitude:  ${destination.location.longitude}`);
                const latitudeAmount = $('<p>').addClass('latitudeAmount').text(`Longitude:  ${destination.location.latitude}`);

                const googleMapLink = $('<a>').addClass('goodleMapLink').attr('href', destination.location.google_maps_link).text('Google Maps');
                const googleMapGrid = $('<div>').addClass('goodleMapGrid').append(mapIcon, googleMapLink);
                
                const locationGrid = $('<div>').addClass('locationGrid').append(locationTitle, googleMapGrid, longitudeAmount, latitudeAmount)


                //create a div to hold contact section
                const contactTitle = $('<h3>').addClass('contactTitle').text('Contact');
                const wikiPage = $('<a>').addClass('wikiPage').attr('href', destination.details.wiki_page_link).text('Wikipedia');
                const contactGrid = $('<div>').addClass('contactGrid').append(contactTitle, laptop, wikiPage)

                const googleAndLocation = $('<div>').addClass('googleAndLocation').append(locationGrid, contactGrid);

                //put all mini information into a div 
                const detailGrid = $('<div>').addClass('detailGrid').append(ratingGrid, googleAndLocation);


                //create a const of description, give it a class, and pull info from object
                const description = $('<p>').addClass('descriptionText').text(destination.details.description);

                //create a div for info only 
                const fullDescription = $('<div>').addClass('fullDescription').append(largetitle, detailGrid, description)

                //create the large description div
                const largeDescription = $('<div>').addClass('largeDescription').append(largeimageGrid, fullDescription);

                // const backListText = $('<p>').addClass('backListText').text('Back to List')
                const backList = $('<a>').addClass('backList').attr('href', '#mainBody').text('More Things To Do');
                const backListGrid = $('<div>').addClass('backListGrid').append(backList)

                // const searchText = $('<p>').addClass('searchText').text('Look for more cities?');
                const searchBtn = $('<a>').addClass('searchBtn').attr('href', '#top').text('Looking for more cities?');
                const searchGrid = $('<div>').addClass('searchGrid').append(searchBtn);

                const navBtnGrid = $('<div>').addClass('navBtnGrid').append(backListGrid, searchGrid);

                

                // $('#interestBox').append(title,travelPlace);
                $('#largeInterestBox').append(largeDescription, navBtnGrid);
                // console.log(travelEachPlace);
                // console.log(largeDescription);
                
                //creating an accordion for the information to show up
                $('#interestBox').accordion().append(title).append(textTravelPlace).accordion("destroy").accordion({
                    collapsible: true,
                    active: false,
                    heightStyle: 'content'
                });
                
                let latitude = destination.location.latitude
                let longitude = destination.location.longitude
                let titleBuble = destination.title

        
        
                // console.log(latitude);
                //create a marker with latitude and longitude and also create the bubble with text
                mark.push(L.marker([latitude, longitude]).bindPopup(`${titleBuble}`).openPopup())
                travelApp.mymap.setView([latitude, longitude])
        
            });
            //create a layer of markers for map
            travelApp.layerGroup = L.layerGroup(mark);
            travelApp.layerGroup.addTo(travelApp.mymap);
            // console.log(mark);
    });  
}; 


travelApp.events = function() {
    //when the user click on a city take that value and put it into api request
    $('input').on('change', function(){
        // console.log('change');
        const city = $(this).val();
        // console.log(city);
        travelApp.getInterest(city);
    });


    $('form').on('submit', function(e) {
        e.preventDefault();
        const searchCity = $(this).val();
        // console.log(searchCity);
        travelApp.getInterest(searchCity);
        // $('form').smoothScroll();
    });

    $('readMore').on('click', function(e) {
        e.preventDefault(); 
    });

};


//create a layer of map
travelApp.init = function() {
    travelApp.mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibGltZW9yYW5nZSIsImEiOiJjamExemsxMTUwam1qMnFsZnh1OGs0NHd4In0.jIHVzy4DBGEC2BZK3ROgjw'
    }).addTo(travelApp.mymap);

    travelApp.getInterest('berlin');
    // console.log('ready');
    travelApp.events();
}

//document ready
$(function(){
    // console.log('hi');
    travelApp.init();
    
});