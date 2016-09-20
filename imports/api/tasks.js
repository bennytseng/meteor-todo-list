import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

//code that runs when the server is running. publish method allows the Tasks collection in Mongo to be added to app and utilized to display tasks
if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      //if user set tasks to private only the owner can see private tasks, NO ONE ELSE can
      $or: [
        { private: {$ne: true}},
        { owner: this.userId},
      ],
    });
  });
}

//rewriting security methods after removing insecure plug in from meteor app
Meteor.methods({

  'tasks.insert' (text) {
    check(text, String);
    //ensure user is logged in before inserting task
    if (!this.userId) {
        throw new Meteor.Error('not-authorized');
    }
    Tasks.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
    });
  },

  'tasks.remove' (taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.remove(taskId);
  },

  'tasks.setChecked' (taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    const task = Tasks.findOne(taskId);
    if(task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, {
        $set: {
            checked: setChecked
        }
    });
  },

  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
