package com.sriramalwan.twitter;

import com.sriramalwan.twitter.health.TwitterApiHealthCheck;
import com.sriramalwan.twitter.resources.UserTimelineResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

/**
 * Created by sriram on 9/6/15.
 */
public class UserTimelineApplication extends Application<UserTimelineConfiguration> {

    public static void main(String[] args) throws Exception {
        new UserTimelineApplication().run(args);
    }


    @Override
    public String getName() {
        return "twitter-calheatmap";
    }

    @Override
    public void initialize(Bootstrap<UserTimelineConfiguration> bootstrap) {
        // nothing to do yet
    }

    @Override
    public void run(UserTimelineConfiguration userTimelineConfiguration,
                    Environment environment) throws Exception {

        final UserTimelineResource resource = new UserTimelineResource(userTimelineConfiguration.getConsumerKey(),
                userTimelineConfiguration.getConsumerSecret(),
                userTimelineConfiguration.getToken(),
                userTimelineConfiguration.getTokenSecret());
        environment.jersey().register(resource);

        environment.healthChecks().register("Twitter ping", new TwitterApiHealthCheck(userTimelineConfiguration.getConsumerKey(),
                userTimelineConfiguration.getConsumerSecret(),
                userTimelineConfiguration.getToken(),
                userTimelineConfiguration.getTokenSecret()));
    }
}
