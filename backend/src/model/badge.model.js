import BaseModel from './base.model.js';

class BadgeModel extends BaseModel {
  constructor() {
    super('badges', [
      'id',
      'name',
      'icon',
      'description',
      'xpReward',
      'triggerRequirement',
      'createdAt',
      'updatedAt',
    ]);
  }

  async findByTriggerRequirement(triggerRequirement) {
    return this.findOne({ triggerRequirement });
  }
}

export default new BadgeModel();
