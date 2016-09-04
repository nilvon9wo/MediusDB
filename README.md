# MediusDB
MediusDB is a wrapper for JavaScript indexedDB.

by Brian Kessler, 2016 September 2

For use, see the samples.

## Introduction

JavaScript: The Definitive Guide, 6th Edition by David Flanagan 
( http://shop.oreilly.com/product/9780596805531.do ) 
offered sample code for indexedDB.  It doesn't work, but to be fair to 
Mr. Flanagan, he warns his readers that it probably wouldn't.
Being neurotic, I was determined to make his application work.

Because indexedDB is unstable, not especially well documented, and truly inspires foul language,
it took two weeks (admittedly, with interruptions) to create an unstable solution which 
 sometimes works on Firefox and never works on Chrome (other browsers are yet untested).
 
 I wouldn't have even accomplished this much without  Raymond Camden's excellent blog
 "Working With IndexedDb" ( http://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673 ).
 
 MediusDB is intended to simplify the use of indexedDB by creating a simple API for common use cases.
 
 I hope by sharing MediusDB, I'll save others from similar aggravation.
 
 Also, I hope to receive feedback towards MediusDB's improvement, both for the sake of improving it
 and for the sake of learning.

## Dependencies
 
 MediusDB presently depends upon:
  
  1. A zipcode.csv file:  Boutell.com offers a suitable file at https://boutell.com/zipcodes/
  1. Two additional scripts.
  ** MediusEvent.js
  ** MediusLog.js
  
  I've chosen to keep separate  as I want to keep MediusDB.js focused on indexedDB. 
  You'll find these scripts within the "US Postal Codes" sample project /scripts/lib folder.
  
  (After MediusDB is debugged, I may later rethink this so MediusDB can stand alone.)
  
 
## Samples
 
In the sample directory, you'll find three sample projects demonstrating how MediusDB can be used:
 
 1. "US Postal Codes"
 2. "People Database"
 3. "Note Database"
 
 (Others may be added later.)


## Anticipated Questions

1. Q:  Why did you name this "Medius".
** A:  I have an obtuse humour best understood by mute anatomy students.
  
## Troubleshooting

1. Console.log reports "MediusEvent" or "MediusLog" is undefined.
** MediusDB depends upon MediusEvent which depends upon MediusLog.  
I did not include these functions in one file because I wanted to separate concerns.

2. Console.log reports "MediusDateTime", "MediusElement", "MediusHttp" is undefined.
** MediusDB does not depend upon these, but they are used in the sample applications.  
You will find the code for these in the same sample project(s) from which you have been sponging code.

3. Console.log reports "isArray" or "toArray" is not a function.
** Call me naughty, but I've extended the Object prototype.  MediusDB does not depend this, 
but it is used in the sample applications.  In any sample, see the "/lib/ObjectExtensions.js".

4. My code does not work but no errors are displayed.
** If the config object you pass into "withStores" contains an "events" property, try changing this to "transactionEvents".

5. Console.log complains about the transaction.
** @!#?@! Transactions... @?*! ... They are the #1 reason I have created MediusDB.  
They are terrible and I would love to hide them from you.
*** Different browsers handle these differently and they can (will) die if they go out of scope.
*** If you have a transaction, try to avoid calling any methods without passing in the transaction 
-- even if you think you won't need it and your linter complains it is an unused variable.
*** Also, whenever possible, include "backup".  That is to say, within your MediusDB method config objects,
try never to rely on any particular transaction remaining alive.  
Instead include the database and store so MediusDB can create a new transaction if/as/when necessary.


## Contributions are welcome.
 
 Please feel free to file issues, create your own branches, and open pull requests.
 