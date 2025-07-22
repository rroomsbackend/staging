import { CronJob } from 'cron';

// prod -> '0 0 0 1 * *' represents a cron expression used to schedule a task to run at midnight (00:00:00) on the first day of every month.
// developmebt -> '*/30 * * * * *' represents a cron expression used to schedule a task to run every 30 seconds.

const invoiceJob = new CronJob(
	'*/30 * * * * *',
	function () {
		console.log('property invoice generation executed...');
	}, // onTick
	null, // onComplete
);
//invoiceJob.start();
export default invoiceJob