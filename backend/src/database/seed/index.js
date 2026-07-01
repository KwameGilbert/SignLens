import db from '../../config/db.js';
import { hashPassword } from '../../utils/helpers.js';

export const runSeeds = async () => {
  console.log('Running database seeds with Knex...');
  try {
    // 1. Seed default accounts matching required roles
    const accounts = [
      { email: 'admin@signlens.com', firstName: 'Kwame', lastName: 'Gilbert', role: 'super_admin', pass: 'admin123' },
      { email: 'editor@signlens.com', firstName: 'Abigail', lastName: 'Mensah', role: 'content_editor', pass: 'editor123' },
      { email: 'moderator@signlens.com', firstName: 'Kofi', lastName: 'Owusu', role: 'moderator', pass: 'mod123' },
      { email: 'user@signlens.com', firstName: 'John', lastName: 'Doe', role: 'user', pass: 'user123' },
    ];

    for (const acc of accounts) {
      const exists = await db('users').where({ email: acc.email }).first();
      if (!exists) {
        console.log(`Seeding account for ${acc.email} (${acc.role})...`);
        const passwordHash = await hashPassword(acc.pass);
        await db('users').insert({
          email: acc.email,
          password_hash: passwordHash,
          first_name: acc.firstName,
          last_name: acc.lastName,
          role: acc.role,
          status: 'active',
        });
      }
    }

    // 2. Seed default Badges with triggering requirements
    const badges = [
      {
        name: 'First Detection',
        icon: 'camera_first',
        description: 'Completed your first camera translation query!',
        xp_reward: 100,
        trigger_requirement: 'first_camera_translation',
      },
      {
        name: 'Consistent Learner',
        icon: 'calendar_7',
        description: 'Logged active sessions for 7 consecutive days.',
        xp_reward: 200,
        trigger_requirement: '7_daily_logins',
      },
      {
        name: 'Perfect Lesson Runner',
        icon: 'star_5_perfect',
        description: 'Finished 5 different lessons with a perfect 100% quiz score.',
        xp_reward: 300,
        trigger_requirement: '5_perfect_lessons',
      },
      {
        name: 'Voice Explores',
        icon: 'mic_first',
        description: 'Performed your first voice translation request!',
        xp_reward: 100,
        trigger_requirement: 'first_voice_translation',
      },
      {
        name: 'Quiz Master',
        icon: 'quiz_completed_10',
        description: 'Successfully completed 10 lessons quizzes.',
        xp_reward: 250,
        trigger_requirement: '10_quizzes_completed',
      },
    ];

    for (const badge of badges) {
      const exists = await db('badges').where({ trigger_requirement: badge.trigger_requirement }).first();
      if (!exists) {
        console.log(`Seeding badge achievement: [${badge.name}]...`);
        await db('badges').insert({
          name: badge.name,
          icon: badge.icon,
          description: badge.description,
          xp_reward: badge.xp_reward,
          trigger_requirement: badge.trigger_requirement,
        });
      }
    }

    // 3. Seed default Settings
    const settings = [
      { key: 'confidence_cutoff_ratio', value: '0.75' },
      { key: 'voice_output_accent', value: 'en-US' },
      { key: 'media_upload_cdn', value: 's3://signlens-learning-assets-prod' },
    ];

    for (const setting of settings) {
      const exists = await db('settings').where({ key: setting.key }).first();
      if (!exists) {
        console.log(`Seeding config setting: ${setting.key}...`);
        await db('settings').insert({
          key: setting.key,
          value: setting.value,
        });
      }
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error executing seeds:', err);
    throw err;
  }
};

// Check if run directly from command line
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
  runSeeds()
    .then(() => {
      console.log('Seeding process completed.');
      db.destroy();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      db.destroy();
      process.exit(1);
    });
}
export default runSeeds;
