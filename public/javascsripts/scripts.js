
var ContactView = Backbone.View.extend({
	tagName:"li",
	events: {

		'click': 'viewContact'

		
	},

	viewContact:function(){
		var modalView = new ModalView({model: this.model})
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


var ModalView = Backbone.View.extend({
	tagName:"div",
	events: {
		'click i.trash': 'delete',
		'click button.editContact': 'editContact',
		'click button.saveChanges': 'saveChanges',
		'event binding' : 'function',
		'click button.sendTheHipchat': 'sendHipchat',
		'click button.sendTheText': 'sendText'
	},

	delete:function(){
		$('#basicModal').modal('hide')

		this.model.destroy()

	},

	editContact: function(){

		var thisContact = this.model
		var editPhone = thisContact.attributes.phone_number
		var editName = $('.modalName').text()
		var editAddress = $('.modalAddress').text()
		var editAge = $('.modalAge').text()
		$('.modalPhone').html('<input type="text" class="form-control" value="'+editPhone+'"">')
		$('.modalName').html('<input type="text" class="form-control" value="'+editName+'"">')
		$('.modalAge').html('<input type="text" class="form-control" value="'+editAge+'"">')
		$('.modalAddress').html('<input type="text" class="form-control" value="'+editAddress+'"">')

	},

	saveChanges: function(){
		thisContact = this.model

		var newPhone = $('.modalPhone').children()[0].value
		var newAddress = $('.modalAddress').children()[0].value
		var newName = $('.modalName').children()[0].value
		var newAge = $('.modalAge').children()[0].value

		thisContact.set('phone_number', newPhone)
		thisContact.set('address', newAddress)
		thisContact.set('name', newName)
		thisContact.set('age', newAge)
		thisContact.save()



	},

	sendHipchat: function(){
		$.post('/sendhipchat',{id:this.model.attributes.hipchat, message:$('#sendHipchat').val()}).done(function(){
			$('.hipchatSuccess').html('<h4>Hipchat successfully sent</h4>')
			$('#sendHipchat').val('Send contact a hipchat message')
			
			setTimeout(function(){
				
				$('.hipchatSuccess').html('')
			}, 2000)
		})


	},
	sendText: function(){
		$.post('/sendtext',{number:this.model.attributes.phone_number, message:$('#sendText').val()}).done(function(){
			$('.textSuccess').html('<h4>Text successfully sent</h4>')
			$('#sendText').val('Send contact a text message')
			
			setTimeout(function(){
				
				$('.textSuccess').html('')
			}, 2000)
		})


	},

	initialize: function(){
		this.template = _.template($('#modalTemplate').html())
		this.listenTo(this.model, 'change', this.render)
		this.listenTo(this.model, 'destroy', this.remove)
		this.render()

		
	},

	render:function(){

		var myTemplate = this.template({contact: this.model.toJSON()})
		this.$el.html(myTemplate);
		$('.modal-content').empty()
		$('.modal-content').append(this.$el)
		var contactAddress = this.model.attributes.address
		var geocoder = new google.maps.Geocoder()
		geocoder.geocode( {'address': this.model.attributes.address}, function(results, status){
			var lattitude = results[0].geometry.location.k
			var longitude = results[0].geometry.location.B
			var myLatlng = new google.maps.LatLng(lattitude,longitude);
			var infowindow = new google.maps.InfoWindow();
			var mapOptions = {
				zoom:14,
				center:myLatlng
			}
			var map = new google.maps.Map(document.getElementById("map-canvas2"), mapOptions);

			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				title: contactAddress
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(this.title);
				infowindow.open(map, this);

			})


			$("#basicModal").on("shown.bs.modal", function () {

				google.maps.event.trigger(map, "resize");
				map.setCenter(myLatlng);
			});

		})
		this.delegateEvents()
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
		}if(this.filter == "search"){

			var view = new ContactView({model: item})
			view.render()
			this.$el.append(view.el)

		}
	}

})

$(function(){

	setTimeout(function(){

		$('body').append('<h1><a href = "#" class="enter">CLICK TO ENTER SITE</a></h1>')
		$('.enter').on('click', function(){
			$('#splashvid').toggle('fade', 800)
			$('.container').toggle('fade', 800)
			$('.toggles').toggle('fade', 1000)
			


		})


	},8500)


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
		var hipchat = $('#hipchat').val()
		var contact = new ContactModel


		$.get('http://api.randomuser.me').done(function(response){
			if($('#randomPicture').is(':checked') == true){
				var image = response.results[0].user.picture.thumbnail
				contact.set('picture', image)
			}else{
				contact.set('picture', picture)
			}
			contact.set('name', name)
			contact.set('age', age)
			contact.set('address', address)
			contact.set('phone_number', phone)
			contact.set('category_id', category)
			contact.set('hipchat', hipchat)
			if(name =='' || age == '' || address == '' || phone == ''){
				var children = $('.addcontact').children()

				for(var i = 0;  i < children.length; i++){
					if(children[i].value=='')
					{
						if(children[i].id == "hipchat"){
									//do nothing
								}else if(children[i].id == "picture"){
									//do nothing
								}else{
									children[i].style.backgroundColor='#F4A7B9';
								}
							}		

						}
					}else{

						contact.save()
						friendsCollection.add(contact)
						$('#contactname').val('')
						$('#age').val('')
						$('#address').val('')
						$('#phone').val('')
						$('#picture').val('')
						$('#hipchat').val('')
					}

				})
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
	$('.toggleMap').toggle()
});
$('#removeForm').click(function() {
	$(".form").toggle("slide", 400);
	$(".form").width($('.form').width());
	setTimeout(function(){
		$(".toggleForm").width($('.toggleForm').width());
		$('.toggleForm').toggle()
		$('.toggleMap').toggle()
	},400)

});

var first = false;

$('.searchForm').on('keyup', function(e){
	if(e.keyCode != 16){
		if(first==false){
			$('.contactLists').toggle("fade")
			$('.searchList').toggle()
			first=true;
		}
		if($('.searchForm').val().length == 0){
			first = false
			$('.contactLists').toggle("fade")
			$('.searchList').toggle("")
		}
		$('.searchList').empty()
		var filteredContact = new ContactCollection;

		filteredContact.fetch().done(function(){
			filteredContact.forEach(function(contact){
				if(contact.attributes.name.toLowerCase().indexOf($('.searchForm').val().toLowerCase()) != -1){
					var view = new ContactView({model: contact})

					view.render()

					$('.searchList').append(view.el).delay(100)

				}
			})

		})
	}

})

var autocomplete = []

friendsCollection.fetch().done(function(){
	friendsCollection.forEach(function(contact){
		autocomplete.push(contact.attributes.name)
	})
	$('.searchForm').autocomplete({source: autocomplete})

})

function initializeMap()
{

	friendsCollection.fetch().done(function(){
		var map =  new google.maps.Map(document.getElementById('map-canvas'));
		var bounds = new google.maps.LatLngBounds();
		
		var geocoder = new google.maps.Geocoder()
		friendsCollection.forEach(function(friend){
			var lattitude;
			var longitude;
			if(friend.attributes.lattitude == null){
				geocoder.geocode( {'address': friend.attributes.address}, function(results, status){

					console.log('I said hello first')
					lattitude = results[0].geometry.location.k
					longitude = results[0].geometry.location.B
					friend.set('lattitude', lattitude)
					friend.set('longitude', longitude)
					friend.save()



				})
			}else{
				console.log('hello')
				lattitude = friend.attributes.lattitude
				longitude = friend.attributes.longitude

			}
			setTimeout(function(){
				var latlng = new google.maps.LatLng(lattitude, longitude);
				bounds.extend(latlng);

				var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					title:friend.attributes.name

				},200);

				google.maps.event.addListener(marker, 'click', function() {
					new ModalView({model: friend})
					$('#basicModal').modal('show')


				});

			})



		})
		setTimeout(function(){
			map.fitBounds(bounds);
		}, 300)


	})
}

var mapOut = false;
$('#mapToggle').on('click', function(){
	$('.theMap').toggle('slide')
	if(mapOut == false){
		$('.contactLists').toggle()
		$('#searchForm').toggle('fade')
		mapOut = true;
	}
	else if(mapOut == true){
		setTimeout(function(){
			$('.contactLists').toggle()
			$('#searchForm').toggle('fade')


			mapOut = false;


		},400)
	}

	initializeMap()
})

})


















