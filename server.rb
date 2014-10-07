
 require 'bundler/setup'
 Bundler.require(:default)
  require 'sinatra'
 require_relative './config/enviroments'
 require_relative './lib/category'
 require_relative './lib/contact'


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
  client = HipChat::Client.new('Yp8VKsihUBBKz55v2DvP7nP00fPiMC1uarHnxVlp', :api_version => 'v2')
  client.user(hipchat_id).send(message)


  {response: "message sent"}.to_json

end

post('/sendtext') do
  account_sid = 'ACad9e9341b5926f0c3a1954df501f0018' 
  auth_token = 'b31d874d9f364a6c7a3d9b300b227cab' 

  client = Twilio::REST::Client.new account_sid, auth_token 

  client.account.messages.create({
    :from => '+15162104262', 
    :to => params["number"].to_i, 
    :body => params["message"],  
    })
  {response: "message sent"}.to_json
end







def category_params(params)
  params.slice(*Category.column_names)
end

def contact_params(params)
  params.slice(*Contact.column_names)
end
