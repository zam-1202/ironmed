--- Inventory POS ---

**** Configuration **** 
   * Update database credentials in config/database.php
      - You can change also the default password, Used for ressetting user password.
   * Update your folder name in system_name.js

pos_fresh.sql
   * Fresh database dump of the system
   * Remain 1 user for login purpose. 
       - username : owner
       - password : owner
   * If you want to create another owner role. 
      Just register it in the system then, directly
      change the role in database




**** Boolean notes of column in each table ****

Users table
 * role
    1 = owner
    2 = admin
    3 = user
 * status
    1 = active
    2 = inactive

Invoices table
 * discount
    1 = Yes
    0 = No

Product_details table
 * expired_status
    1 = Yes
    0 = No

Products table
 * status
    1 = Active
    0 = Inactive
 * Type
    1 = Branded
    0 = Generic
    null = <No Type>

Sales table
  * void
    1 = Void
    0 = Not Void




