# Project Two

**<span style="color:darkblue">Build a client based CRUD application that will consume a given API.</span>**

1. This application is **client-based** in that it will operate solely on the client-side.

-  It is a **CRUD** application in that the necessary features will thus be centered around offering users the ability to create, read, update, or destroy resources.

-  It will **consume a given API** because although you will building strictly a client-side application, you will be given an API for that application to interact with.

## Outline

The period dedicated to projects in-class begins the afternoon of Thursday, October 2. **On the morning of Tuesday, October 7, we will present to our classmates the progress we have made**.

As with the previous project, we will meet at 9:30 on Friday and Monday morning.

The dedicated project period is known as a ***sprint***. During this sprint, we will have daily ***stand-ups***, or short meetings with our classmates and instructors, every morning. The purpose of the stand-up is to set goals for the day and support one-another in our development tasks. The purpose of the sprint is to fulfill a set of required features known as an ***MVP***, or *minimum viable product*.

**The end of the sprint is not the end of the project**. The resulting application will be your first possible portfolio piece, and as such it would behoove us to continue to work on it in the months to come.

**Each student will be responsible for their own project**. This means the student has written every single piece of code that is not a part of a library, either by themselves or during a pair programming session. More importantly: **the student must be able to explain what every piece of code does**. Do not include code you do not understand!

## Guidelines

Your job is to build the entire front end that will interact with and use this back-end service. This is known as "consuming a service". You have all been given the necessary code for the back-end service.

The docs for this back-end service or API can be found [here][api]

All of the code you write will be written only for the client-side. You will **NOT** need to update **ANY** of the server code to complete the MVP.

**Until the MVP is complete** please do not attempt to make adjustments to the back-end.


## Feature Set

###[Contact List][contact]

<span style="color:gray">A contact list is an application that allows users to store and organize their contacts.</span>

<!-- Links -->

[contact]: contact_list.md
[api]: api_docs.md

##Setting up the API on your local computer
- If you have not used Bundler before, install it using `gem install bundler`
- Run `bundle install`
- Update the `db/connection` to include your postgres username
- Create the database `contact_list` using psql
- Use the `db/schema.sql` file to create your tables
- To start the server, in the directory run `rackup config.ru`. This will replace the `ruby server.rb` command we have been using thus far.
- Use `console.rb` to ensure that your database is connected to the server
