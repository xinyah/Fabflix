package edu.uci.ics.xinyah.service.gateway.resources;

import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("hello")
public class testPage {
    @GET
    public Response test()
    {
        ServiceLogger.LOGGER.info("I'm here");
        ServiceLogger.LOGGER.info("updated things");
        return Response.ok().build();
    }
}
