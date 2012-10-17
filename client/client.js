var initial = [{
	name: "Item 1",
	children: [{name: "Item 2", children: [{name: "Item 2b"}, {name: "Item 2c"}]}
	          ,{name: "Item 3"}
	          ,{name: "Item 4"}
	          ]
}];

Template.main.children = function () {
	return this.name ? (this.children || []) : initial;
};
