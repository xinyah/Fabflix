package edu.uci.ics.xinyah.service.gateway.threadpool;

import com.fasterxml.jackson.core.io.JsonEOFException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsonFormatVisitors.JsonObjectFormatVisitor;
import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.core.PathBuilder;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;
import edu.uci.ics.xinyah.service.gateway.models.ResponseModel;
import edu.uci.ics.xinyah.service.gateway.util.Param;
import edu.uci.ics.xinyah.service.gateway.util.Util;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.client.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

public class Worker extends Thread {
    int id;
    ThreadPool threadPool;

    private Worker(int id, ThreadPool threadPool) {
        this.id = id;
        this.threadPool = threadPool;
    }

    public static Worker CreateWorker(int id, ThreadPool threadPool) {
        return new Worker(id, threadPool);
    }

    public void process() {
        Response response = null;
        ClientRequest clientRequest = this.threadPool.takeRequest();
        Connection con = GatewayService.getConnectionPoolManager().requestCon();
        PathBuilder pathBuilder = new PathBuilder();
        Param[] insertionParam = null;
        int flag = clientRequest.getFlag();
        String session = "";
        ResponseModel responseModel = null;

        if (clientRequest != null) {
            try {
                ServiceLogger.LOGGER.info("Building client...");
                Client client = ClientBuilder.newClient();
                client.register(JacksonFeature.class);
                ServiceLogger.LOGGER.info("Building WebTarget...");
                WebTarget webTarget = client.target(pathBuilder.getServicePath()).path(pathBuilder.getEndpointPath());
                webTarget = client.target(clientRequest.getURI()).path(clientRequest.getEndpoint());
                if (clientRequest.getMethod().equals(HTTPMethod.GET)) {
                    MultivaluedMap<String, String> cur = clientRequest.getQueries();
                    for (String key : cur.keySet()) {
                        System.err.println(key);
                        System.err.println(cur.getFirst(key));
                        System.err.println("good");
                        webTarget = webTarget.queryParam(key.toString(), cur.getFirst(key).toString());
                        System.err.println("yes");
                    }
                }
                ServiceLogger.LOGGER.info(webTarget.toString());
                ServiceLogger.LOGGER.info("Starting invocation builder...");
                Invocation.Builder invocationBuilder = webTarget.request(MediaType.APPLICATION_JSON)
                        .header("email",clientRequest.getEmail())
                        .header("session_id",clientRequest.getSession_id())
                        .header("transaction_id",clientRequest.getTransaction_id());
                if (clientRequest.getMethod().equals(HTTPMethod.GET)) {
                    response = invocationBuilder.get();
                } else {
                    response = invocationBuilder.post(Entity.entity(clientRequest.getRequestBytes(), MediaType.APPLICATION_JSON));
                }

                ServiceLogger.LOGGER.info("Request sent.");
                String responseText = response.readEntity(String.class);
                ServiceLogger.LOGGER.info(responseText);
                insertionParam = new Param[]{
                        Param.create(Types.VARCHAR, clientRequest.getTransaction_id()),
                        Param.create(Types.VARCHAR, clientRequest.getEmail()),
                        Param.create(Types.VARCHAR, clientRequest.getSession_id()),
                        Param.create(Types.LONGVARCHAR, responseText),
                        Param.create(Types.INTEGER, response.getStatus())
                };
                String insertionQuery = "INSERT INTO responses(transaction_id,email,session_id,response,http_status)\n" +
                        "VALUES (?,?,?,?,?);\n";

                int check = Util.prepareStatement(insertionQuery, insertionParam, con).executeUpdate();
                GatewayService.getConnectionPoolManager().releaseCon(con);
                ServiceLogger.LOGGER.info("completed");
            } catch (SQLException e) {
                ServiceLogger.LOGGER.info(e.getMessage());
                GatewayService.getConnectionPoolManager().releaseCon(con);
            }
        } else {
            ServiceLogger.LOGGER.info("empty");
        }
    }

    @Override
    public void run() {
        while (true) {
            this.process();
        }
    }
}
