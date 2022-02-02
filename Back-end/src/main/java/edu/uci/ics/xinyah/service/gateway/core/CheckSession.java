package edu.uci.ics.xinyah.service.gateway.core;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;
import edu.uci.ics.xinyah.service.gateway.models.ResponseModel;
import edu.uci.ics.xinyah.service.gateway.util.Param;
import edu.uci.ics.xinyah.service.gateway.util.Util;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.client.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

public class CheckSession {
    Response response;
    Connection con;
    PathBuilder pathBuilder;
    Param[] insertionParam;
    String session;
    ResponseModel responseModel;

    public CheckSession(String email, String session_id,String transaction_id) {
        try{
            this.pathBuilder = new PathBuilder();
            ServiceLogger.LOGGER.info("Building client...");
            Client client = ClientBuilder.newClient();
            client.register(JacksonFeature.class);
            ServiceLogger.LOGGER.info("Building WebTarget...");
            WebTarget webTarget = client.target(pathBuilder.getServicePath()).path(pathBuilder.getEndpointPath());
            Invocation.Builder invocationBuilder = webTarget.request(MediaType.APPLICATION_JSON);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("email",email);
            jsonObject.put("session_id",session_id);
            response = invocationBuilder.post(Entity.entity(jsonObject.toString(), MediaType.APPLICATION_JSON));
            this.session = response.readEntity(String.class);
            ObjectMapper mapper = new ObjectMapper();
            this.responseModel = mapper.readValue(session, ResponseModel.class);
        }
        catch (JSONException | IOException  e)
        {
            ServiceLogger.LOGGER.info("ooops");
            GatewayService.getConnectionPoolManager().releaseCon(con);
        }
    }
    public Response getResponse() {
        return response;
    }

    public String getSession() {
        return session;
    }

    public int getHttpStatus()
    {
        return response.getStatus();
    }

    public int passing()
    {
        return responseModel.getResultCode();
    }

    public String session_id()
    {
        return responseModel.getSession_id();
    }
}



