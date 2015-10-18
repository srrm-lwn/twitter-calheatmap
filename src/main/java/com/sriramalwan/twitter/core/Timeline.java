package com.sriramalwan.twitter.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sriram on 9/6/15.
 */
public class Timeline {

    public static final long _30DAYS = 30 * 24 * 60 * 60 * 1000L;
    private final String domain;
    private final Date minDate;
    private final List<Tweet> tweets;
    private final int[] legend;

    private final String errorMessage;

    private Timeline(String errorMessage) {
        this.errorMessage = errorMessage;
        this.tweets = null;
        this.minDate = null;
        this.domain = null;
        this.legend = null;
    }

    private Timeline(List<Tweet> tweets) {
        this.tweets = tweets;
        this.minDate = tweets.get(tweets.size() - 1).getDate();
        Date maxDate = tweets.get(0).getDate();
        final boolean hyperActive = maxDate.getTime() - this.minDate.getTime() < _30DAYS;
        this.domain = hyperActive ? "day" : "month";
        this.errorMessage = null;
        this.legend = computeLegend(tweets, hyperActive);
    }

    private int[] computeLegend(List<Tweet> tweets, boolean hyperActive) {
        DateFormat format = new SimpleDateFormat(hyperActive? "yyy-MM-dd HH" : "yyyy-MM-dd");
        Map<String, Integer> counts = new HashMap<String, Integer>();
        int max = Integer.MIN_VALUE;

        for (Tweet tweet : tweets) {
            String key = format.format(tweet.getDate());
            if (!counts.containsKey(key)) {
                counts.put(key, 0);
            }
            int newCount = counts.get(key) + 1;
            counts.put(key, newCount);
            if (newCount > max) {
                max = newCount;
            }
        }

        if (max <= 5) return new int[]{1, 2, 3, 4, 5};

        int[] legend = new int[5];
        for (int j = 1; j <= 5; j++) {
            legend[j - 1] = (max / 5) * j;
        }
        return legend;
    }

    public static Timeline withError(String errorMessage) {
        return new Timeline(errorMessage);
    }

    public static Timeline withTweets(List<Tweet> tweets, String user) {
        return tweets.isEmpty() ? new Timeline("@" + user + " hasn't tweeted yet!") : new Timeline(tweets);
    }

    @JsonProperty
    public String getDomain() {
        return domain;
    }

    @JsonProperty
    public Date getMinDate() {
        return minDate;
    }

    @JsonProperty
    public List<Tweet> getTweets() {
        return tweets;
    }

    @JsonProperty
    public String getErrorMessage() {
        return errorMessage;
    }

    @JsonProperty
    public int[] getLegend() {
        return this.legend;
    }
}
