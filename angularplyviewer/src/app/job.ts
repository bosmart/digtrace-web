/**
 * Job Class
 */
export class Job {
    
    id: number;
    name: string;

    /**
     * 0 Canceled
     * 1 In progress
     * 2 Completed
     */
    status: number;

    // data to send to the server
    postData;

    // Server request
    request;

    // Component that added job
    caller;

}
