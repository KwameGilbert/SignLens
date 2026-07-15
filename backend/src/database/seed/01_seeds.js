import { hashPassword } from '../../utils/helpers.js';

export const seed = async (knex) => {
  console.log('Seeding database records...');

  // 1. Seed default accounts
  const accounts = [
    { email: 'admin@signlens.com', firstName: 'Kwame', lastName: 'Gilbert', role: 'super_admin', pass: 'admin123' },
    { email: 'editor@signlens.com', firstName: 'Abigail', lastName: 'Mensah', role: 'content_editor', pass: 'editor123' },
    { email: 'moderator@signlens.com', firstName: 'Kofi', lastName: 'Owusu', role: 'moderator', pass: 'mod123' },
    { email: 'user@signlens.com', firstName: 'John', lastName: 'Doe', role: 'user', pass: 'user123' },
  ];

  for (const acc of accounts) {
    const exists = await knex('users').where({ email: acc.email }).first();
    if (!exists) {
      const passwordHash = await hashPassword(acc.pass);
      await knex('users').insert({
        email: acc.email,
        passwordHash: passwordHash,
        firstName: acc.firstName,
        lastName: acc.lastName,
        role: acc.role,
        status: 'active',
      });
    }
  }

  // 2. Seed default Badges
  const badges = [
    {
      name: 'First Detection',
      icon: 'camera_first',
      description: 'Completed your first camera translation query!',
      xpReward: 100,
      triggerRequirement: 'first_camera_translation',
    },
    {
      name: 'Consistent Learner',
      icon: 'calendar_7',
      description: 'Logged active sessions for 7 consecutive days.',
      xpReward: 200,
      triggerRequirement: '7_daily_logins',
    },
    {
      name: 'Perfect Lesson Runner',
      icon: 'star_5_perfect',
      description: 'Finished 5 different lessons with a perfect 100% quiz score.',
      xpReward: 300,
      triggerRequirement: '5_perfect_lessons',
    },
    {
      name: 'Voice Explores',
      icon: 'mic_first',
      description: 'Performed your first voice translation request!',
      xpReward: 100,
      triggerRequirement: 'first_voice_translation',
    },
    {
      name: 'Quiz Master',
      icon: 'quiz_completed_10',
      description: 'Successfully completed 10 lessons quizzes.',
      xpReward: 250,
      triggerRequirement: '10_quizzes_completed',
    },
  ];

  for (const badge of badges) {
    const exists = await knex('badges').where({ triggerRequirement: badge.triggerRequirement }).first();
    if (!exists) {
      await knex('badges').insert({
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        xpReward: badge.xpReward,
        triggerRequirement: badge.triggerRequirement,
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
    const exists = await knex('settings').where({ key: setting.key }).first();
    if (!exists) {
      await knex('settings').insert({
        key: setting.key,
        value: setting.value,
      });
    }
  }

  console.log('Database seeding successfully finished.');
};
