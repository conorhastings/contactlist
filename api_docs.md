##API Docs


###Categories

- <span style="color:darkblue">GET /categories</span>

  Response:
  ```[{id: 2, name: "enemies"}, {id: 4, name: "friends"}]```

- <span style="color:darkblue">POST /categories</span>

  Request body:
  ```{name: "enemies"}```

- <span style="color:darkblue">GET /categories/:id</span>

  Response: ```{id: 2, name: "enemies", contacts: [contact, contact, contact]}```

- <span style="color:darkblue">PUT /categories/:id</span>

  Request body: ```{name: "frenemies"}```

- <span style="color:darkblue">DELETE /categories/:id</span>


####Contacts

- <span style="color:darkblue">GET /contacts</span>

  Response: ```[{id: 2, category_id: 3, name: "sean", age: 28, address: "123 Main St.", phone_number: "555-555-1212", picture: "http://google.com/images/1.jpg", category_id: 5 }, {id: 3, category_id: 4, name: "neel", age: 45, address: "455 Cedar St.", phone_number: "555-555-1212", picture: "http://google.com/images/2.jpg" }]```

- <span style="color:darkblue">POST /contacts</span>

  Request body: ```{category_id: 3, name: "sean", age: 28, address: "123 Main St.", phone_number: "555-555-1212", picture: "http://google.com/images/1.jpg" }```

- <span style="color:darkblue">GET /contacts/:id</span>

  Response: ```{id: 3, category_id: 4, name: "neel", age: 45, address: "455 Cedar St.", phone_number: "555-555-1212", picture: "http://google.com/images/2.jpg" }```

- <span style="color:darkblue">PUT /contacts/:id</span>

  Request body: ```{category_id: 3, name: "sean", age: 28, address: "123 Main St.", phone_number: "555-555-1212", picture: "http://google.com/images/1.jpg"}```

- <span style="color:darkblue">DELETE /categories/:id</span>
