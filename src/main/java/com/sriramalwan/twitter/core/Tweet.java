package com.sriramalwan.twitter.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * Created by sriram on 9/6/15.
 */
public class Tweet {

    private long id;
    private Date date;
    private String text;

    public Tweet(long id, Date date, String text) {
        this.id = id;
        this.date = date;
        this.text = text;
    }

    @JsonProperty
    public long getId() {
        return id;
    }

    @JsonProperty
    public Date getDate() {
        return date;
    }

    @JsonProperty
    public String getText() {
        return text;
    }
}
