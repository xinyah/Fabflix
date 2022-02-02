package edu.uci.ics.xinyah.service.gateway.resources;

import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.configs.MoviesConfigs;
import edu.uci.ics.xinyah.service.gateway.core.CheckSession;
import edu.uci.ics.xinyah.service.gateway.core.MoviePath;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;
import edu.uci.ics.xinyah.service.gateway.threadpool.ClientRequest;
import edu.uci.ics.xinyah.service.gateway.threadpool.HTTPMethod;
import edu.uci.ics.xinyah.service.gateway.threadpool.ThreadPool;
import edu.uci.ics.xinyah.service.gateway.transaction.TransactionGenerator;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.*;

@Path("movies")
public class MovieGet {
    @Path("get/{phrase:.*}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMovie(@Context HttpHeaders headers, @Context UriInfo uriInfo, String jsonText, @PathParam("phrase") String phrase)
    {
        CheckSession checkSession = new CheckSession(headers.getHeaderString("email"),
                headers.getHeaderString("session_id"),
                headers.getHeaderString("transaction_id"));
        ServiceLogger.LOGGER.info(Integer.toString(checkSession.passing()));
        if(checkSession.passing()!=130)
        {
            return Response.status(checkSession.getHttpStatus()).entity(checkSession.getSession()).build();
        }
        ClientRequest clientRequest = null;
        ThreadPool threadPool = GatewayService.getThreadPool();
        ServiceLogger.LOGGER.info("inside movie search");
        String transaction_id = TransactionGenerator.generate();
        MoviesConfigs moviesConfigs = GatewayService.getMoviesConfigs();
        MoviePath pathBuilder = new MoviePath();
        MultivaluedMap<String,String> queries = uriInfo.getQueryParameters();

        clientRequest=new ClientRequest(headers.getHeaderString("email"),
                headers.getHeaderString("session_id"),
                transaction_id,
                pathBuilder.getServicePath(),
                moviesConfigs.getGetPath()+phrase,
                HTTPMethod.GET,
                jsonText.getBytes(),
                11,
                queries
        );
        threadPool.putRequest(clientRequest);
        ServiceLogger.LOGGER.info("so far so good");

        return  Response.noContent()
                .header("transaction_id",transaction_id)
                .header("session_id",headers.getHeaderString("session_id"))
                .build();
    }
}
