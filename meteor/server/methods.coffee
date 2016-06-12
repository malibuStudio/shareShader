Meteor.methods
  "getSnapshot":(docId)->
    Meteor.wrapAsync(ShareJS.model.getSnapshot)(docId)?.snapshot
