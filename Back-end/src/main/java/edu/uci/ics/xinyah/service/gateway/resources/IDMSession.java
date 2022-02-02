package edu.uci.ics.xinyah.service.gateway.resources;

import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.configs.IdmConfigs;
import edu.uci.ics.xinyah.service.gateway.core.PathBuilder;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;
import edu.uci.ics.xinyah.service.gateway.models.ResponseModel;
import edu.uci.ics.xinyah.service.gateway.threadpool.ClientRequest;
import edu.uci.ics.xinyah.service.gateway.threadpool.HTTPMethod;
import edu.uci.ics.xinyah.service.gateway.threadpool.ThreadPool;
import edu.uci.ics.xinyah.service.gateway.transaction.TransactionGenerator;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Path("idm")
public class IDMSession {
    @Path("session")
    @POST
    public Response session(@Context HttpHeaders headers, @Context UriInfo uriInfo, String jsonText)
    {
        ClientRequest clientRequest = null;
        ThreadPool threadPool = GatewayService.getThreadPool();
        ServiceLogger.LOGGER.info("inside idm login");
        String transaction_id = TransactionGenerator.generate();
        IdmConfigs idmConfigs = GatewayService.getIdmConfigs();
        PathBuilder pathBuilder = new PathBuilder();
        clientRequest=new ClientRequest(headers.getHeaderString("email"),
                headers.getHeaderString("session_id"),
                transaction_id,
                pathBuilder.getServicePath(),
                idmConfigs.getSessionPath(),
                HTTPMethod.POST,
                jsonText.getBytes(),
                0,
                null
        );
        threadPool.putRequest(clientRequest);
        ServiceLogger.LOGGER.info("so far so good");

        return  Response.noContent()
                .header("transaction_id",transaction_id)
                .header("session_id",headers.getHeaderString("session_id"))
                .build();
    }
}
