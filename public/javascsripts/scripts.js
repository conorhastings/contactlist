
var ContactView = Backbone.View.extend({
	tagName:"li",
	events: {

		'click': 'viewContact'

		
	},

	viewContact:function(){
		var thisContact = this.model
		var modalView = new ModalView({model: thisContact})
		$('.editContact').on('click', function(){
			// console.log(thisContact.attributes.phone_number)
			
			var editPhone = thisContact.attributes.phone_number
			var editName = $('.modalName').text()
			var editAddress = $('.modalAddress').text()
			var editAge = $('.modalAge').text()
			$('.modalPhone').html('<input type="text" value="'+editPhone+'"">')
			$('.modalName').html('<input type="text" value="'+editName+'"">')
			$('.modalAge').html('<input type="text" value="'+editAge+'"">')
			$('.modalAddress').html('<input type="text" value="'+editAddress+'"">')

			$('.saveChanges').on('click', function(){
				var newPhone = $('.modalPhone').children()[0].value
				var newAddress = $('.modalAddress').children()[0].value
				var newName = $('.modalName').children()[0].value
				var newAge = $('.modalAge').children()[0].value

				thisContact.set('phone_number', newPhone)
				thisContact.set('address', newAddress)
				thisContact.set('name', newName)
				thisContact.set('age', newAge)
				thisContact.save()

				$('.modalPhone').html(editPhone)
				$('.modalName').html(editName)
				$('.modalAge').html(editAddress)
				$('.modalAddress').html(editAge)
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
		$('#basicModal').modal('hide')
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
		console.log(this.$el)
		this.listenTo(this.collection, "add", this.addOne)
		this.collection.fetch()

		
	},
	addOne: function(item){
		console.log(this.filter=="search")
		if(item.attributes.category_id == this.filter){
			
			var view = new ContactView({model: item})
			view.render()
			

			this.$el.append(view.el)
		}if(this.filter == "search"){

			var view = new ContactView({model: item})
			view.render()
			this.$el.append(view.el)

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

$('.searchForm').on('keyup', function(e){

	if(first==false){
		$('.contactLists').toggle("fade")
		$('.searchList').toggle()
		first=true;
	}
	if($('.searchForm').val().length == 0){
		first = false
		$('.contactLists').toggle("fade")
		$('.searchList').toggle()
	}
	$('.searchList').empty()
	var filteredContact = new ContactCollection;
	filteredContact.fetch().done(function(){
		filteredContact.forEach(function(contact){
			if(contact.attributes.name.indexOf($('.searchForm').val()) != -1){
				console.log(contact.attributes.name.indexOf($('.searchForm').val()))
				var view = new ContactView({model: contact})
				
				view.render()
				console.log(e.keyCode)
				if(e.keyCode != 16){
					$('.searchList').append(view.el)
				}
			}
		})

	})

	// $.get('/contacts').done(function(response){
	// 	response.forEach(function(contact){
	// 		console.log(contact.name)
	// 		if(contact.name.indexOf($('.searchForm').val()) != -1){
	// 			$('.searchList').append('<li>'+contact.name+'</li>')


	// 		}


	// 	})
	// })


})

})














