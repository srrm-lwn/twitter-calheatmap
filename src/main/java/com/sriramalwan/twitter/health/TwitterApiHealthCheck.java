package com.sriramalwan.twitter.health;

import com.codahale.metrics.health.HealthCheck;
import com.sriramalwan.twitter.resources.UserTimelineResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import twitter4j.TwitterException;

/**
 * Created by sriram on 9/7/15.
 */
public class TwitterApiHealthCheck extends HealthCheck {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserTimelineResource.class);
    private final String consumerKey;
    private final String consumerSecret;
    private final String token;
    private final String tokenSecret;

    public TwitterApiHealthCheck(String consumerKey, String consumerSecret, String token, String tokenSecret) {

        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.token = token;
        this.tokenSecret = tokenSecret;
    }

    @Override
    protected Result check() throws Exception {
        LOGGER.info("Twitter API Health Check - ping");
        try {
            new UserTimelineResource(consumerKey, consumerSecret, token, tokenSecret).pingTwitter();
        } catch (TwitterException e) {
            Result.unhealthy(e);
        }
        return Result.healthy();
    }
}
