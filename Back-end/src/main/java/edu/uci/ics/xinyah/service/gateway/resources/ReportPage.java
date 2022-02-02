package edu.uci.ics.xinyah.service.gateway.resources;

import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;
import edu.uci.ics.xinyah.service.gateway.models.ResponseModel;
import edu.uci.ics.xinyah.service.gateway.util.Param;
import edu.uci.ics.xinyah.service.gateway.util.Util;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

@Path("report")
public class ReportPage {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response reportPage(@Context HttpHeaders headers)
    {
        Connection con = GatewayService.getConnectionPoolManager().requestCon();
        String insertionQuery = "SELECT * FROM responses WHERE transaction_id = ?;\n";
        String deleteQuery = "DELETE FROM responses WHERE transaction_id = ?;\n";
        Param[] insertionParam = new Param[]{
                Param.create(Types.VARCHAR,headers.getHeaderString("transaction_id"))
        };
        ResponseModel responseModel = null;
        String reponse = null;
        Integer status = 200;
        try{
            ResultSet rs = Util.prepareStatement(insertionQuery, insertionParam,con).executeQuery();
            ServiceLogger.LOGGER.info("got response");
            if(rs.next())
            {
                ServiceLogger.LOGGER.info("setting responseModel");
                reponse = rs.getString("response");
                status = rs.getInt("http_status");
            }
            else
            {
                GatewayService.getConnectionPoolManager().releaseCon(con);
                return Response.noContent()
                        .header("transaction_id",headers.getHeaderString("transaction_id"))
                        .header("message","check back later")
                        .header("request_delay",GatewayService.getThreadConfigs().getRequestDelay())
                        .build();
            }
//            ServiceLogger.LOGGER.info("going to execute query");
            Util.prepareStatement(deleteQuery,insertionParam,con).executeUpdate();
//            ServiceLogger.LOGGER.info("query executed");
            GatewayService.getConnectionPoolManager().releaseCon(con);
//            ServiceLogger.LOGGER.info("connection released");
        }
        catch (SQLException e)
        {
            ServiceLogger.LOGGER.info(e.getMessage());
        }
        ServiceLogger.LOGGER.info("completed");
        return Response.status(status).entity(reponse).build();
    }
}
