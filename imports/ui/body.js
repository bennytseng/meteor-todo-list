import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './task.js';
import './body.html';

//shows all the tasks in the Mongo collection sorted by newest first
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    //returns results of only documents that are checked off
    if (instance.state.get('hideCompleted')) {
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Tasks.find({},{ sort: {createdAt: -1} });
  },
  //counts the number of tasks not completed (not checked)
  incompleteCount() {
    return Tasks.find({checked: {$ne: true} }).count();
  },
});

//Creating a ReactiveDict to store temporary state of 'hide items checked' function
Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
})

//looks at .new-task to see when the user subits to create a new document in the collection
Template.body.events({
  'submit .new-task'(event) {
    //prevents default browser form submit and listens to user 'enter' when in input form field
    event.preventDefault();

    //get value from form element
    const target = event.target;
    const text = target.text.value;

    //insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(),
    });

    //clear form
    target.text.value="";
  },

//event handler that checks if checkbox is checked or not for hide completed tasks for the ReactiveDict
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});
