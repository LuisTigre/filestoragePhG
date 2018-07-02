 document.addEventListener("deviceready", onDeviceReady, true);
            //Device is Ready
            function onDeviceReady() {
                // Create the friendly messages and define the variables
                var previousMessage = 'Here are your previous search results..';
                var welcomeMessage = 'What would you like to search for?';
                var localStorage = window.localStorage;
                /* Firstly, check to see if localStorage
has any cached content from a previous request. */
                if(localStorage.getItem('twitSearchResults')) {
                    /* We have saved content,
so display a nice message to the user */
                    $('body h2').html(previousMessage);
                    /* Set the value of the stored search
term into the input box */
                    $('#searchTerm').val(localStorage.getItem('searchTerm'));
                    // Display the clear button
                    showClearButton();
                    // Send the stored data to be rendered as HTML
                    outputResults(JSON.parse(localStorage.
                        getItem('twitSearchResults')));
                } else {
                    /* There is nothing cached,
so display a friendly message */
                    $('body h2').html(welcomeMessage);
                    hideClearButton();
                }
                // add click handlers here
            }
            
            /* Add a click handler to the clear button
which will be displayed is a user returns
to the page with saved content */
            $('#clear_btn').click(function() {
                // Clear the entire local storage object
                localStorage.clear();
                // Clear the content list
                $('#tweetResults').html('');
                $('#tweetResults').hide();
                /* There is nothing cached,
so display a friendly message */
                $('body h2').html(welcomeMessage);
                // Remove the clear button
                hideClearButton();
                // Reset the search term input field
                $('#searchTerm').val('');
            });
            $('#exit_btn').click(function() {
                navigator.app.exitApp();
            });
            
            /* Add a click handler to the search button
which will make our AJAX requests for us */
            $('#search_btn').click(function() {
                /* Obtain the value of the search term and send it
through to the request function */
                makeSearchRequest($('#searchTerm').val());
            });
            
            function makeSearchRequest(searchTerm) {
                // Display a user-friendly message
                $('body h2').html('Searching for: '+ searchTerm);
                /* Store the value we are searching
for into the localStorage object */
                localStorage.setItem('searchTerm', searchTerm);
                // Make the request to the Twitter search API
                $.ajax({
                    url:
                        "http://search.twitter.com/search.json?q="+
                        searchTerm+"&rpp=5",
                    dataType: "jsonp",
                    jsonpCallback: "storeResults"
                });
            }
            
            function storeResults(data) {
                /* Save the latest search results,
coercing the data from an object into a string */
                localStorage.setItem(
                'twitSearchResults',
                JSON.stringify(data));
                outputResults(data);
            }
            
            function outputResults(data) {
                // Clear the content and hide the results element
                $('#tweetResults').html('');
                // Loop through the results in the JSON object
                $.each(data.results,
                function(i, tweet) {
                    /* Replace and define any URLs
for inclusion in the output */
                    tweet.text = tweet.text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g,
                    function(url) {
                        return '<a href="'+url+'">'+url+'</a>';
                    }).replace(/\B@([_a-z0-9]+)/ig,
                    function(reply) {
                        return reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
                    });
                    $('#tweetResults').append('<li><img src="' + tweet.profile_image_url + '" /><h3>@' + tweet.from_user_name + '</h3><p>'+
                        tweet.text + '</p><p class="ui-li-aside"></p></li>');
                });
                // Refresh the list view
                $('#tweetResults').listview("refresh");
            }
        
            function showClearButton() {
                $("#clear_btn").css('display', 'block');
            }
            function hideClearButton() {
                $("#clear_btn").css('display', 'none');
            }
            
            function onError(error) {
                alert("Error: " + JSON.stringify(error));
            }
