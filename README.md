

## Instructions to setup and run project
npm install necessary libraries
run node init.js [admin loggin email] [admin password]
run node server.js on a different command
npm start to run the server
two test users with following emails and passwords will be generated:
testUser1: testuser1@gmail.com abc123
testUser2: testuser2@gmail.com abc123




+---------------------+             +---------------------+
|      Unregistered   |             |     Registered      |
|         User        |             |        User         |
+---------------------+             +---------------------+
           |                                  |
           |                                  |
           |                                  |
+---------------------+             +---------------------+
|    Create Account   |             |        Login        |
|---------------------|             |---------------------|
| +username           |             | +email             |
| +email              |             | +password          |
| +password           |             |---------------------|
|---------------------|             | +login()           |
| +createAccount()    |             |---------------------|
+---------------------+             | +logout()          |
           |                      +---------------------+
           |                                  |
           |                                  |
+---------------------+             +---------------------+
|  Logout of Account  |             |     Home Page      |
|---------------------|             |---------------------|
| +logout()           |             | +viewAllQuestions  |
|---------------------|             | +viewAllTags       |
| +logout()           |             | +searchQuestions   |
+---------------------+             | +viewQuestionsByTag|
                                  |---------------------|
                                  | +viewNewestQuestions|
                                  | +viewActiveQuestions|
                                  | +viewUnansweredQuestions|
                                  +---------------------+
					     |
                                             |

+---------------------+        +---------------------+        +---------------------+        
|       Answers        |        |      Questions       |        |         Tags         |                        
+---------------------+        +---------------------+        +---------------------+        
| - text: String       |        | - title: String      |        | - name: String      |         
| - ans_by: String     |        | - text: String       |   ---  |                     |        
| - ans_date_time: Date | ---   | - tags: ObjectId[]   |        +---------------------+        						
| - votes: Number      |        | - answers: ObjectId[]|                 
+---------------------+         | - asked_by: String   |               
  			                    | - ask_date_time: Date|          
			                    | - views: Number      |  
				                +---------------------+	      

