package com.sriramalwan.twitter.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Optional;
import com.sriramalwan.twitter.core.Timeline;
import com.sriramalwan.twitter.core.Tweet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import twitter4j.*;
import twitter4j.auth.AccessToken;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sriram on 9/6/15.
 */

@Path("/timeline")
@Produces(MediaType.APPLICATION_JSON)
public class UserTimelineResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserTimelineResource.class);
    private static final int API_LIMIT = 200;
    private static final int NUM_OF_TOTAL_TWEETS = 1000;
    private static final int NUM_OF_API_CALLS = NUM_OF_TOTAL_TWEETS / API_LIMIT;

    private final Twitter twitter;

    private static final Map<String, List<Tweet>> TWEET_CACHE = new HashMap<String, List<Tweet>>();

    public UserTimelineResource(String consumerKey, String consumerSecret, String token, String tokenSecret) {
        this.twitter = TwitterFactory.getSingleton();
        this.twitter.setOAuthConsumer(consumerKey, consumerSecret);
        this.twitter.setOAuthAccessToken(new AccessToken(token, tokenSecret));
    }

    public void pingTwitter() throws TwitterException {
        this.twitter.help().getPrivacyPolicy();
    }

    @GET
    @Timed
    public Timeline getTweetsForUser(@QueryParam("userId") Optional<String> userId) {

        String user = userId.get();

        List<Tweet> tweets = tweetsFromCache(user);

        if (tweets.isEmpty()) {
            return tweetsFromAPI(user);
        }
        return Timeline.withTweets(tweets, user);
    }

    private Timeline tweetsFromAPI(String user) {
        List<Tweet> tweets = new ArrayList<Tweet>();

        List<Status> statuses;
        try {
            statuses = this.getStatuses(user);

        } catch (TwitterException e) {
            LOGGER.error("Unable to retrieve user timeline", e);
            final String message = e.getErrorMessage();
            return Timeline.withError("Sorry, that page does not exist.".equals(message)? "@" + user + " doesn't exist!" : message);
        }

        for (Status status : statuses) {
            tweets.add(new Tweet(status.getId(), status.getCreatedAt(), status.getText()));
        }

//        addToCache(user, tweets);
        return Timeline.withTweets(tweets, user);
    }

    private List<Status> getStatuses(String user) throws TwitterException {
        List<Status> statuses = new ArrayList<Status>();

        List<Status> statusesPerCall = this.twitter.getUserTimeline(user, new Paging(1, API_LIMIT));
        statuses.addAll(statusesPerCall);

        int i = NUM_OF_API_CALLS - 1;
        while (!statusesPerCall.isEmpty() && i > 0) {
            i--;
            long maxId = statusesPerCall.get(statusesPerCall.size() - 1).getId();
            long nextMaxId = maxId - 1;
            statusesPerCall = this.twitter.getUserTimeline(user, new Paging(1, API_LIMIT, 1, nextMaxId));
            statuses.addAll(statusesPerCall);
        }


        LOGGER.info("Retrieved {} tweets for user {}", statuses.size(), user);
        return statuses;
    }

    private static void addToCache(String user, List<Tweet> tweets) {
        TWEET_CACHE.put(user, tweets);
        LOGGER.info("[TWEET_CACHE] Cache grows to size {}", TWEET_CACHE.size());
    }

    private static List<Tweet> tweetsFromCache(String user) {
        if (TWEET_CACHE.containsKey(user)) {
            final List<Tweet> tweets = TWEET_CACHE.get(user);
            LOGGER.info("[TWEET_CACHE] Retrieved {} tweets from cache for user {}", tweets.size(), user);
            return tweets;
        }
        return new ArrayList<Tweet>();
    }

}
