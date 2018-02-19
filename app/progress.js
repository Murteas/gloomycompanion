'use strict';

export class Progress{

    constructor(callback, timeout){
        this.callback = callback || (() => {});
        this.timeout = timeout || 1000;

        this.startTime;
        this.requestID;
    }

    start(){
        this.stop();
        this.requestID = window.requestAnimationFrame((timestamp) => {
            this.starttime = timestamp || new Date().getTime()
            this.tick(timestamp)
        });
    }

    stop(){
        if (this.requestID)
            window.cancelAnimationFrame(this.requestID);
        this.requestID = undefined;
    }

    restart(){
        if (this.requestID)
            this.start();
    }

    tick(timestamp){

        var timestamp = timestamp || new Date().getTime();
        var runtime = timestamp - this.starttime;
        var progress = runtime / this.timeout;

        progress = Math.min(progress, 1)

        this.callback(progress);

        if (runtime < this.timeout){ 
            this.requestID = window.requestAnimationFrame((timestamp) => {
                this.tick(timestamp, this.timeout)
            });
        }
        else{
            this.requestID = undefined;
            this.callback(progress, true);
        }
    }
}

export default Progress;