//criação da fila!!!!!

const Queue = require('bull');
const redisConfig = require('../../config/redis');
const jobs = require('../jobs');
const { host, port, password } = redisConfig;

// Object.values will return {key:'...', handle: () => {}} of each job create and exported on jobs/index.js
const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, {
        redis: {
            host,
            port,
            password
        }
    }),
    name: job.key,
    handle: job.handle,
    options: job.options
}))

module.exports = {
    queues,
    add(name, data) {
        const queue = this.queues.find(queue => queue.name === name);

        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', (job, err) => {
                // Sentry.captureException(err);
                console.log('Job failed: ', queue.key, job.data);
                console.log(err);
            });
        })
    }
}