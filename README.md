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
  1. Four additional scripts.
  ** Object.js
  ** Event.js
  ** Log.js
  ** Status.js
  
  I've chosen to keep separate  as I want to keep MediusDB.js focused on indexedDB. 
  You'll find these scripts within the "US Postal Codes" sample project /scripts/lib folder.
  
  (After MediusDB is debugged, I may later rethink this so MediusDB can stand alone.)
  
 
## Samples
 
In the sample directory, you'll find:
 
 1. "US Postal Codes"
 
 (Others may be added later.)
 
  
## Contributions are welcome.
 
 Please feel free to file issues, create your own branches, and open pull requests.
 