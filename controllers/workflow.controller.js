import dayjs from 'dayjs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// we can't use 'import' syntax to import serve from @upstash/workflow/express because
//  it's not an ES module(written in common js), so we use require instead
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model';//local import, so we can use 'import' syntax

const Reminders = [15, 7, 3,1]; // days before renewal to send reminders
export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.payload;
    const subscription = await fetchSubscription(context, subscriptionId);
    if(!subscription || subscription.status !== 'active')return;

    const renewalDate = dayjs(subscription.renewalDate);

    // Check if renewal date is within the next 3 days
    if(renewalDate.diff(dayjs(), 'day') <= 3){
        // Send reminder email logic here
        console.log(`Sending reminder for subscription ${subscription._id} to user ${subscription.userId.email}`);
        return;
    }

    for(const daysBefore of Reminders){
        if(renewalDate.diff(dayjs(), 'day') === daysBefore){
            // Send reminder email logic here
            console.log(`Sending reminder for subscription ${subscription._id} to user ${subscription.userId.email} - ${daysBefore} days before renewal`);
            break;
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', ()=>{
        return Subscription.findById(subscriptionId).populate('userId', 'email name');
    })
}

const sleepUntillReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder for subscription ${context.payload.subscriptionId} at ${date.toISOString()}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerNextReminder = async (context, label) => {
    return await context.run(label, async ()=>{
        console.log(`Triggering ${label} reminder for subscription ${context.payload.subscriptionId}`);
        //send email, sms
    })
}