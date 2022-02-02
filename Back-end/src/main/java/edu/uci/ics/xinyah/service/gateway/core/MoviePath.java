package edu.uci.ics.xinyah.service.gateway.core;

import edu.uci.ics.xinyah.service.gateway.GatewayService;
import edu.uci.ics.xinyah.service.gateway.configs.IdmConfigs;
import edu.uci.ics.xinyah.service.gateway.configs.MoviesConfigs;
import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;

import javax.ws.rs.core.UriBuilder;

public class MoviePath {
    private MoviesConfigs idmConfigs = GatewayService.getMoviesConfigs();
    private String  scheme;
    private String  hostName;
    private Integer port;
    private String  path;
    private String servicePath;
    private String endpointPath;
    public MoviePath()
    {
        scheme= idmConfigs.getScheme();
        hostName= idmConfigs.getHostName();
        port = idmConfigs.getPort();
        path = idmConfigs.getPath();
        endpointPath = idmConfigs.getBrowsePath();
        servicePath = UriBuilder.fromUri(scheme + hostName + path).port(port).build().toString();
        ServiceLogger.LOGGER.info(servicePath);
    }

    public String getEndpointPath() {
        return endpointPath;
    }

    public String getServicePath() {
        return servicePath;
    }
}
