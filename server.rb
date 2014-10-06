 require 'sinatra'
require_relative './db/connection'
require_relative './lib/category'
require_relative './lib/contact'
require 'active_support'
require 'httparty'
require 'hipchat'

after do
  ActiveRecord::Base.connection.close
end

before do
  content_type :json
end

get("/categories") do
  Category.all.to_json
end

get("/categories/:id") do
  Category.find(params[:id]).to_json(:include => :contacts)
end

post("/categories") do
  category = Category.create(category_params(params))

  category.to_json
end

put("/categories/:id") do
  category = Category.find_by(id: params[:id])
  category.update(category_params(params))

  category.to_json
end

delete("/categories/:id") do
  category = Category.find(params[:id])
  category.destroy
  
  category.to_json
end

get("/contacts") do
  Contact.all.to_json
end

get("/contacts/:id") do
  Contact.find_by(id: params[:id]).to_json
end

post("/contacts") do
  contact = Contact.create(contact_params(params))
  contact.to_json
end

put("/contacts/:id") do
  contact = Contact.find(params[:id])
  contact.update(contact_params(params))

  contact.to_json
end

delete("/contacts/:id") do
  contact = Contact.find(params[:id])
  contact.destroy

  contact.to_json
end

post('/sendhipchat') do
  hipchat_id=params["id"].to_i
  message = params["message"]
  puts params
  client = HipChat::Client.new('Yp8VKsihUBBKz55v2DvP7nP00fPiMC1uarHnxVlp', :api_version => 'v2')
  client.user(hipchat_id).send(message)


  {response: "message sent"}.to_json

end


def category_params(params)
  params.slice(*Category.column_names)
end

def contact_params(params)
  params.slice(*Contact.column_names)
end
