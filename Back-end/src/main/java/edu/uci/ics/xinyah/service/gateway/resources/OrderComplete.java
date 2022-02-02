package edu.uci.ics.xinyah.service.gateway.resources;

import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.configs.BillingConfigs;
import edu.uci.ics.xinyah.service.gateway.configs.IdmConfigs;
import edu.uci.ics.xinyah.service.gateway.core.BillingPath;
import edu.uci.ics.xinyah.service.gateway.core.CheckSession;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;
import edu.uci.ics.xinyah.service.gateway.threadpool.ClientRequest;
import edu.uci.ics.xinyah.service.gateway.threadpool.HTTPMethod;
import edu.uci.ics.xinyah.service.gateway.threadpool.ThreadPool;
import edu.uci.ics.xinyah.service.gateway.transaction.TransactionGenerator;
import jdk.nashorn.internal.objects.annotations.Getter;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.*;

@Path("billing")
public class OrderComplete {
    @Path("order/complete")
    @GET
    public Response complete(@Context HttpHeaders headers, @Context UriInfo uriInfo, String jsonText)
    {
        ClientRequest clientRequest = null;
        ThreadPool threadPool = GatewayService.getThreadPool();
        ServiceLogger.LOGGER.info("inside idm login");
        String transaction_id = TransactionGenerator.generate();
        BillingConfigs idmConfigs = GatewayService.getBillingConfigs();
        BillingPath pathBuilder = new BillingPath();
        MultivaluedMap<String,String> queries = uriInfo.getQueryParameters();
        clientRequest=new ClientRequest(headers.getHeaderString("email"),
                headers.getHeaderString("session_id"),
                transaction_id,
                pathBuilder.getServicePath(),
                idmConfigs.getOrderCompletePath(),
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
