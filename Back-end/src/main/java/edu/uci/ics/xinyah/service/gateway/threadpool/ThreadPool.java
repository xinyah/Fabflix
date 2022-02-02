package edu.uci.ics.xinyah.service.gateway.threadpool;

import edu.uci.ics.xinyah.service.gateway.logger.ServiceLogger;

import java.util.ArrayList;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class ThreadPool
{
    private int numWorkers;

    private ArrayList<Worker> workers;
    private BlockingQueue<ClientRequest> queue;

    public ArrayList<Worker> getWorkers() {
        return workers;
    }

    public void setWorkers(ArrayList<Worker> workers) {
        this.workers = workers;
    }

    /*
     * BlockingQueue is a interface that allows us
     * to choose the type of implementation of the queue.
     * In this case we are using a LinkedBlockingQueue.
     *
     * BlockingQueue as the name implies will block
     * any thread requesting from it if the queue is empty
     * but only if you use the correct function
     */
    private ThreadPool(int numWorkers)
    {
        this.numWorkers = numWorkers;

        workers = new ArrayList<>();
        queue = new LinkedBlockingQueue<>();

        // TODO more work is needed to create the threads
        for(int i = 0; i<numWorkers;i++)
        {
            workers.add(Worker.CreateWorker(i,this));
        }
    }

    public static ThreadPool createThreadPool(int numWorkers)
    {
        return new ThreadPool(numWorkers);
    }

    public BlockingQueue<ClientRequest> getQueue() {
        return queue;
    }

    public void setQueue(BlockingQueue<ClientRequest> queue) {
        this.queue = queue;
    }

    /*
     * Note that this function only has package scoped
     * as it should only be called with the package by
     * a worker
     * 
     * Make sure to use the correct functions that will
     * block a thread if the queue is unavailable or empty
     */
    ClientRequest takeRequest()
    {
        // TODO *take* the request from the queue
        try{
            return queue.take();
        }
        catch (InterruptedException e)
        {
            ServiceLogger.LOGGER.info("oops, something wrong in takeRequest"+e);
            return null;
        }
    }

    public void putRequest(ClientRequest clientRequest)
    {
        // TODO *put* the request into the queue
        try{
            queue.put(clientRequest);
        }
        catch (InterruptedException e)
        {
            ServiceLogger.LOGGER.info("noooo");
        }
    }

}
