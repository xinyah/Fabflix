package edu.uci.ics.xinyah.service.gateway.util;

import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Util {
    public static PreparedStatement prepareStatement(String query, Param[] paramList, Connection con)
            throws SQLException
    {
        ServiceLogger.LOGGER.info("Preparing Statement: "+ query);

        int count = 1;


        PreparedStatement ps = con.prepareStatement(query);

        for (Param param : paramList)
            ps.setObject(count++, param.getParam(), param.getType());

        ServiceLogger.LOGGER.info("QueryReady: " + ps.toString());

        return ps;
    }
}
