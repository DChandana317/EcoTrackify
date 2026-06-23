import Agenda from 'agenda';
import dayjs from 'dayjs';
import { env } from '../config/env.js';
import { Goal } from '../models/Goal.js';
import { NotificationService } from '../services/notificationService.js';

const agenda = new Agenda({
  db: {
    address: env.mongoUri,
    collection: 'ecotrackify_jobs'
  }
});

agenda.define('send-goal-reminders', async () => {
  const upcomingGoals = await Goal.find({
    remindersEnabled: true,
    status: { $ne: 'completed' },
    targetDate: { $lte: dayjs().add(7, 'day').toDate() }
  });

  await Promise.all(
    upcomingGoals.map((goal) => {
      const progress = Math.max(
        0,
        Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
      );
      return NotificationService.create(goal.userId, {
        type: 'reminder',
        title: 'Keep pushing your goal!',
        message: `You're ${progress}% of the way toward "${goal.title}" with ${dayjs(goal.targetDate).diff(dayjs(), 'day')} days remaining.`
      });
    })
  );
});

export const startAgenda = async () => {
  await agenda.start();
  await agenda.every('1 day', 'send-goal-reminders');
  return agenda;
};

export default agenda;
