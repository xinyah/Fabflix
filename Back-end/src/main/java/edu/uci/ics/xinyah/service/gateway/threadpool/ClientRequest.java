package edu.uci.ics.xinyah.service.gateway.threadpool;

import edu.uci.ics.xinyah.service.gateway.models.RequestModel;

import javax.ws.rs.core.MultivaluedMap;

public class ClientRequest
{
    /* User Information */
    private String email;
    private String session_id;
    private String transaction_id;

    /* Target Service and Endpoint */
    private String URI;
    private String endpoint;
    private HTTPMethod method;

    /*
     * So before when we wanted to get the request body
     * we would grab it as a String (String jsonText).
     *
     * The Gateway however does not need to see the body
     * but simply needs to pass it. So we save ourselves some
     * time and overhead by grabbing the request as a byte array
     * (byte[] jsonBytes).
     *
     * This way we can just act as a
     * messenger and just pass along the bytes to the target
     * service and it will do the rest.
     *
     * for example:
     *
     * where we used to do this:
     *
     *     @Path("hello")
     *     ...ect
     *     public Response hello(String jsonString) {
     *         ...ect
     *     }
     *
     * do:
     *
     *     @Path("hello")
     *     ...ect
     *     public Response hello(byte[] jsonBytes) {
     *         ...ect
     *     }
     *
     */
    private byte[] requestBytes;
    int flag;
    MultivaluedMap<String,String> queries;
    public ClientRequest(String email, String session_id, String transaction_id, String URI,String endpoint, HTTPMethod method, byte[] requestBytes,int flag,MultivaluedMap<String,String> queries)
    {
        this.email = email;
        this.session_id = session_id;
        this.transaction_id = transaction_id;
        this.endpoint = endpoint;
        this.method = method;
        this.requestBytes = requestBytes;
        this.URI = URI;
        this.flag = flag;
        this.queries = queries;
    }


    public int getFlag() {
        return flag;
    }

    public MultivaluedMap<String, String> getQueries() {
        return queries;
    }

    public void setQueries(MultivaluedMap<String, String> queries) {
        this.queries = queries;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    public byte[] getRequestBytes() {
        return requestBytes;
    }

    public void setRequestBytes(byte[] requestBytes) {
        this.requestBytes = requestBytes;
    }

    public HTTPMethod getMethod() {
        return method;
    }

    public void setMethod(HTTPMethod method) {
        this.method = method;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getURI() {
        return URI;
    }

    public void setURI(String URI) {
        this.URI = URI;
    }

    public String getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(String transaction_id) {
        this.transaction_id = transaction_id;
    }

    public String getSession_id() {
        return session_id;
    }

    public void setSession_id(String session_id) {
        this.session_id = session_id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
