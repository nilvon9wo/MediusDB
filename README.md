# MediusDB
by Brian Kessler, 2016 September 2

## Introduction

MediusDB is a wrapper for JavaScript indexedDB.
MediusDB is intended to simplify the use of indexedDB by creating a simple API for common use cases.
 
I hope by sharing MediusDB, I'll save others from aggravation.
Furthermore, I'd like to receive feedback to improve both MediusDB and myself.

For use, see the samples.

## Acknowledgements and Raison D'être

JavaScript: The Definitive Guide, 6th Edition by David Flanagan 
( http://shop.oreilly.com/product/9780596805531.do ) 
offered sample code for indexedDB.  It doesn't work, but to be fair to 
Mr. Flanagan, he warns his readers that it probably wouldn't.
Being neurotic, I was determined to make his application work.

Because indexedDB is unstable, not especially well documented, and truly inspires foul language,
it took over two weeks (admittedly, with interruptions) to create a solution which works on reliably on
Mozilla *Firefox* Developer Edition 50.0a2 and on Google *Chrome* 49.0.2623.112 m (other browsers are yet untested).
You can find my solution as "USPostalCodes" sample.
 
I wouldn't have even accomplished this much without  Raymond Camden's excellent blog
"Working With IndexedDb" ( http://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673 ).
His tutorials inspired the "NotesDatabase" and "PeopleDatabase" samples.
 
## Dependencies
 
MediusDB presently depends upon two additional scripts.
** MediusEvent.js
** MediusLog.js
  
I've chosen to keep separate  as I want to keep MediusDB.js focused on indexedDB. 

(After MediusDB is debugged, I may later rethink this so MediusDB can stand alone.)
  
 
## Samples
 
In the sample directory, you'll find three sample projects demonstrating how MediusDB can be used:
 
1. US Postal Codes (inspired by David Flanagan's JavaScript: The Definitive Guide, 6th Edition)
2. People Database (inspired by Raymond Camden's "Working With IndexedDb")
3. Note Database (inspired by Raymond Camden's "Working With IndexedDb")
 
(Others may be added later.)

The "US Postal Codes" project requires a zipcode.csv file in the data director.  Boutell.com offers a suitable file at https://boutell.com/zipcodes/

In all three sample projects, I've heavily refactored the original code samples, but traces may remain as I wasn't deliberately trying to obliterate their code.  If these samples work, allow me to share the credit with those authors.  However, if it doesn't work, let blame your browser(s).

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
 
