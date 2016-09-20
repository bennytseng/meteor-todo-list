import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
// import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value. refer to Meteor methods in api tasks.js
    // Tasks.update(this._id, {
    //   $set: { checked: ! this.checked },
    // });
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  // deletes tasks. refer to Meteor methods in api tasks.js
  'click .delete'() {
    // Tasks.remove(this._id);
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});
