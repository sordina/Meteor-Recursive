var Lists = new Meteor.Collection(null)

Lists.insert( {
	name: "Item 1",
	children: [{name: "Item 2", children: [{name: "Item 2b"}, {name: "Item 2c"}]}
	          ,{name: "Item 3"}
	          ,{name: "Item 4"}
	          ]
} )

Template.initial.lists = function () {
	return Lists.find()
}

Template.main.rendered = function () {
	$( "ul" ).sortable({
		connectWith: "ul",
		update: function(e,o){
			var updated = parse($('body'))
			Lists.update({name: "Item 1"}, {'$set' : updated})
		}
	}).disableSelection()
}

function parse(jitem) {
	return {
		name     : jitem.children('h2').text(),
		children : jitem.find(' > ul > li').map(function(i,e){return parse($(this))}).get()
	}
}
