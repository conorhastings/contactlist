
var ContactView = Backbone.View.extend({
	tagName:"li",
	events: {
		
	},
	initialize: function(){

		this.listenTo(this.model, 'change', this.render)
		this.listenTo(this.model, 'destroy', this.remove)
		
		this.template = _.template($('#contact').html())
		this.render()
		
	},

	render:function(){
		
		var myTemplate = this.template({contact: this.model.toJSON()})
		this.$el.html(myTemplate);

	}
})

var ContactModel = Backbone.Model.extend({
	urlRoot: '/contacts'
});

var CategoryModel = Backbone.Model.extend({
	urlRoot: '/categories'
});

var ContactCollection = Backbone.Collection.extend({
	url: '/contacts',
	model: ContactModel
});

var CategoryCollection = Backbone.Collection.extend({
	url: '/categories',
	model: CategoryModel
});

var CategoryListView = Backbone.View.extend({
	// tagName:'ul',
	// id: 'friends',

	initialize: function(options){
		this.filter = options.filter
		this.listenTo(this.collection, "add", this.addOne)
		this.collection.fetch()

		
	},
	addOne: function(item){

		if(item.attributes.category_id == this.filter){
			
			var view = new ContactView({model: item})
			view.render()
			

			this.$el.append(view.el)


		// $('#friends').append(view.el)
	}
}

})







$(function(){
	var friendsCollection = new ContactCollection() 
	// var frenemiesCollection = new ContactCollection()
	// var joesCollection = new ContactCollection()

	var listView = new CategoryListView({collection: friendsCollection, el:'#friends', filter:3})
	var listView2 = new CategoryListView({collection: friendsCollection, el: '#frenemies', filter:4})	
	var listView3 = new CategoryListView({collection: friendsCollection, el: '#joes', filter:5})	


	// friendsCollection.add(contact)
	// friendsCollection.add(contact2)

	$('#addcontact').on('click', function(){
		var name = $('#contactname').val()
		var age = $('#age').val()
		var address = $('#address').val()
		var phone = $('#phone').val()
		var picture = $('#picture').val()
		var category = $('#category').val()
		var contact = new ContactModel
		contact.set('name', name)
		contact.set('age', age)
		contact.set('address', address)
		contact.set('phone_number', phone)
		contact.set('picture', picture)
		contact.set('category_id', category)
		
		if(name =='' || age == '' || address == '' || phone == ''){
			var children = $('.addcontact').children()

			for(var i = 0;  i < children.length; i++){
				if(children[i].value=='')
				{
					children[i].style.backgroundColor='#F4A7B9';
				}		

		}
	}else{
			
			contact.save()
			friendsCollection.add(contact)
		}


	})

	$('#friends, #frenemies, #joes').sortable({connectWith:'.lists'}).disableSelection();




})














