@Documents = new Mongo.Collection "documents"

Meteor.methods
  deleteDocument: (id)->
    Documents.remove id
    ShareJS.model.delete id unless @isSimulation
