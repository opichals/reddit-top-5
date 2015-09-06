var rawjs = require('raw.js');
rawjs._addListingRequest("mySubreddits", "subreddits/mine.json");

var reddit = new rawjs("top-9: top-5 from each reddit");
reddit.setupOAuth2("44-dk2NeOUMULw", "J74W-ic_5EJO2y1rGmxy5u9bYfo");
reddit.auth({"username": "top-5", "password": 'top999'}, function(err, response) {
    reddit.mySubreddits({}, function(err, payload) {
        var subreddits = payload.children.map(function(sub) {
            return sub.data.display_name;
        });
        
        subreddits.forEach(top5);
    });
});

function top5(subreddit) {
    reddit.top({"r": subreddit, "t": 'day', "limit": 5}, function(err, payload) {
        console.log('S', subreddit)
        var titles = payload.children.map(function(sub) {
            return sub.data.title;
        });
        console.log('C', titles)
    });
}