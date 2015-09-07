var rawjs = require('raw.js');
rawjs._addListingRequest("mySubreddits", "subreddits/mine.json");
var reddit = new rawjs("top-9: top-5 from each reddit");

function auth(req, res, callback) {
    if (req.host.match(/herokuapp/)) {
        reddit.setupOAuth2("uNzrSv7R1kAyMQ", "zRLEjhZ3esbgO0jhdHUQV9jvPj4", "http://"+req.host);
    } else {
        reddit.setupOAuth2("-Nv1yz1Af4XuuA", "r58Dp2_GM46nvzY-bnhv6aAj16M", "http://"+req.host);
    }

    if (!req.query.token) {
        if (!req.query.code) {
            var authUrl = reddit.authUrl('top5'+new Date().getTime(), ['mysubreddits', 'read']);
            res.redirect(authUrl);
            return;
        }

        reddit.auth({"code": req.query.code}, function(err, response) {
            if (err) throw err;
            res.redirect(req.url + '&token='+response.access_token);
        });
        return;
    }

    reddit.refreshToken = req.query.token;
    reddit.auth(function(err, response) {
        callback();
    });
}

var LIMIT = 10;

function fetchTop5(callback) {
    fetchTop5Slice(callback)
}

function fetchTop5Slice(callback, afterId) {
    reddit.mySubreddits({ limit: LIMIT, after: afterId }, function(err, payload) {
        if (err) throw err;

        var subreddits = payload.children.map(function(sub) {
            return sub.data.display_name;
        });
        subreddits.forEach(top5.bind(this, function(data) {
            callback(data);
        }));

        if (payload.children.length === LIMIT) {
            var lastItem = payload.children[payload.children.length - 1]
            fetchTop5Slice(callback, lastItem.data.name);
        } else {
            // FIXME! chain in callback(null);
        }
    });
}

function top5(callback, subreddit) {
    console.log('r\\', subreddit);
    reddit.top({"r": subreddit, "t": 'day', "limit": 5}, function(err, payload) {
        console.log('r/', subreddit);
        if (err) throw err;

        var titles = payload.children.map(function(sub) {
            return { title: sub.data.title, permalink: sub.data.permalink };
        });
        callback({ name: subreddit, titles: titles })
    });
}

exports.auth = auth;
exports.fetchTop5 = fetchTop5;