Template.docList.helpers
  documents: -> Documents.find()

Template.docList.events =
  "click button": ->
    Documents.insert
      title: "untitled"
    , (err, id) ->
      return unless id
      Session.set("document", id)

Template.docItem.helpers
  current: -> Session.equals("document", @_id)

Template.docItem.events =
  "click a": (e) ->
    e.preventDefault()
    Session.set("document", @_id)

Session.setDefault("editorType", "cm")

Template.docTitle.helpers
  title: ->
    # Strange bug https://github.com/meteor/meteor/issues/1447
    Documents.findOne(@+"")?.title

  editorType: (type) -> Session.equals("editorType", type)

Template.editor.helpers
  docid: -> Session.get("document")

Template.editor.events =
  "keydown input[name=title]": (e) ->
    return unless e.keyCode == 13
    e.preventDefault()

    $(e.target).blur()
    id = Session.get("document")
    Documents.update id,
      title: e.target.value

  "click button#btndelete": (e) ->
    e.preventDefault()
    id = Session.get("document")
    Session.set("document", null)
    Meteor.call "deleteDocument", id
  "click button#btnrender": (e,t)->
    e.preventDefault()
    Meteor.call "getSnapshot", Session.get("document"), (error,result)->
      unless error
        console.log result
        buildShader t.find("#c"), result
  "change input[name=editor]": (e) ->
    Session.set("editorType", e.target.value)

Template.editor.helpers
  textarea: -> Session.equals("editorType", "textarea")
  cm: -> Session.equals("editorType", "cm")

  configCM: ->
    (cm) ->
      cm.setOption("theme", "default")
      cm.setOption("lineNumbers", true)
      cm.setOption("lineWrapping", true)
      cm.setOption("smartIndent", true)
      cm.setOption("indentWithTabs", true)
