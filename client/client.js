var Lists = new Meteor.Collection(null)

Lists.insert( {
	name: "Item 1",
	children: [{name: "Item 2", children: [{name: "Item 2b"}, {name: "Item 2c"}]}
	          ,{name: "Item 3"}
	          ,{name: "Item 4"}
	          ]
} )

function find(namedList, name) {
	if(namedList.name == name) { return namedList }

	return _.chain(namedList.children || [])
	        .map(  function(e){ return find(e,name) })
	        .find( function(e){return e})
	        .value()
}

function remove(namedList, name) {
	if(namedList.name == name) { throw("Could not perform this odd operation.") }
	var removed = _.reject(namedList.children || [], function(e){ return e.name == name })
	var pruned  = _.map(removed, remove)
	return {name: namedList.name, children: pruned}
}

function insert(namedList, item, name, index) {
	if(name ==  namedList.name)
	{
		namedList.children = namedList.children || []
		namedList.children.splice(index, 0, item);
	}
	else
		_.each(namedList.children || [], function(e) {insert(e,item,name,index)})
}

Template.main.children = function () {
	return this.name ? (this.children || []) : Lists.find();
}

Template.main.rendered = function () {

	$(function() {
		$( "ul" ).sortable({
			connectWith: "ul",
			update: function(e,o){
				var name    = $(o.item[0]).find('h2').text()
				var parent  = $(o.item[0]).parent().closest('li').children('h2').text()
				var list    = Lists.findOne({name: "Item 1"})
				var removed = find(list, name)
				var pruned  = remove(list, name)
				insert(pruned, removed, parent, 0)
				Lists.update({name: "Item 1"}, pruned)
			}
		}).disableSelection();
	});

}
