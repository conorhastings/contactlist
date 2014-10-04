
var ContactView = Backbone.View.extend({
	tagName:"li",
	events: {

		'click': 'viewContact'

		
	},

	viewContact:function(){
		var thisContact = this.model
		var modalView = new ModalView({model: thisContact})
		$('.editContact').on('click', function(){
			console.log(thisContact.attributes.phone_number)
			
			var editPhone = $('.modalPhone').text()
			var editName = $('.modalName').text()
			var editAddress = $('.modalAddress').text()
			var editAge = $('.modalAge').text()
			$('.modalPhone').html('<input type="text" value="'+editPhone+'"">')
			$('.modalName').html('<input type="text" value="'+editName+'"">')
			$('.modalAge').html('<input type="text" value="'+editAge+'"">')
			$('.modalAddress').html('<input type="text" value="'+editAddress+'"">')

			$('.saveChanges').on('click', function(){
				console.log($('.modalPhone').text())
				thisContact.set('phone_number', $('.modalPhone').children()[0].value)
				thisContact.set('address', $('.modalAddress').children()[0].value)
				thisContact.set('name', $('.modalName').children()[0].value)
				thisContact.set('age', $('.modalAge').children()[0].value)

				thisContact.save()
				$('.modalPhone').html($('.modalPhone').children()[0].value)
				$('.modalName').html($('.modalName').children()[0].value)
				$('.modalAge').html($('.modalAge').children()[0].value)
				$('.modalAddress').html($('.modalAddress').children()[0].value)
						// $('.modalPhone').children()[0].value
					})





		})


},


initialize: function(){
	console.log()
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

var ModalView = Backbone.View.extend({
	tagName:"div",
	events: {
		'click i.trash': 'delete'
		

	},

	delete:function(){
		console.log(this.model)
		this.model.destroy()
	},
	
	initialize: function(){
		this.template = _.template($('#modalTemplate').html())
		this.listenTo(this.model, 'change', this.render)
		this.listenTo(this.model, 'destroy', this.remove)
		this.render()
		
	},

	render:function(){
		console.log(this.model)
		var myTemplate = this.template({contact: this.model.toJSON()})
		this.$el.html(myTemplate);
		$('.modal-content').empty()
		$('.modal-content').append(this.$el)

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


	var listView = new CategoryListView({collection: friendsCollection, el:'#3', filter:3})
	var listView2 = new CategoryListView({collection: friendsCollection, el: '#4', filter:4})	
	var listView3 = new CategoryListView({collection: friendsCollection, el: '#5', filter:5})	




	$('#addcontact').on('click', function(){
		$('#contactname').css('backgroundColor', '#fff')
		$('#age').css('backgroundColor', "#fff")
		$('#address').css('backgroundColor', "#fff")
		$('#picture').css('backgroundColor', "#fff")
		$('#phone').css('backgroundColor', "#fff")



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

$('.friends, .frenemies, .joes').sortable({connectWith:'.lists'}).disableSelection();
$('.friends, .frenemies, .joes').on('sortupdate',function(event, ui){

	var thisContactId = ui.item.children()[0].id
	var thisContact = friendsCollection.get(thisContactId)
	thisContact.set('category_id', parseInt(event.target.id))
	thisContact.save()




})

$('#toggleButton').click(function() {
	$( ".form" ).toggle("slide");
	$('.toggleForm').toggle()
});
$('#removeForm').click(function() {
	$( ".form" ).toggle("slide");
	setTimeout(function(){
		$('.toggleForm').toggle()
	},350)
});

var first = false;

$('.searchForm').on('keyup', function(){

	if(first==false){
		$('.contactLists').toggle("fade")
		first=true;
	}
	if($('.searchForm').val().length == 0){
		first = false
			$('.contactLists').toggle("fade")
	}



})

})














