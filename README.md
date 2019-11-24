# NASAscraper
### About
NASAscraper is a web scraping tool designed to scrape data from NASA's NeoWs (Near Earth Object Web Service) API, of which [creative derivative works are protected](https://www.usa.gov/government-works "U.S. Government Works").

It is built with Node.js and mysqli, which lets you connect to a MySQL database through php. The scraper.js node script recursively scrapes data from the NeoWs API and passes this data as URL parameters to the postAsteroid.php file. Once postAsteroid.php receives the data, it then uses mysqli to insert this data into two tables: NearEarthObjects and CloseApproaches. These tables represent unique asteroids and instances where these asteroids come in close contact with the earth, respectively.

Due to data usage limits, it should take just under 2 days of running the script to scrape all asteroid data between January 1, 1900 and January 1, 2020.
### Usage
To use this scraper, you are going to need a remotely hosted MySQL server as well as a remote file directory to host postAsteroid.php. You will also need a computer that can run the scraper.js node script in its command prompt or terminal.
##### postAsteroid.php
The first thing we have to do is download the project. Once the project is downloaded, unzip it.
To make scraper.js actually post the NASA NeoWs data to your own backend, we need to make use of our remotely hosted php file. Simply put the postAsteroid.php file in your `public_html` directory of your remote file server. You must then place the credentials for your database connection, i.e. the host, priveleged username, this username's password, and the database name, respectively. It will look something like this: `$con=mysqli_connect("localhost","my_username","my_password","my_database");`. Make sure that in MySQL, `my_database` has tables named `NearEarthObjects` and `CloseApproaches`. These can be made by running the following script in your MySQL server:

```sql
CREATE TABLE CloseApproaches(
    approachDate BIGINT(14),
    approachSpeed FLOAT,
    missDistance FLOAT,
    asteroidId INT(11)
    PRIMARY KEY (approachDate, asteroidId) 
); 
CREATE TABLE NearEarthObjects(
    id INT(11) PRIMARY KEY,
    name VARCAHR(255),
    estimatedDiameterMin FLOAT,
    estimatedDiameterMax FLOAT
); 
```
##### scraper.js
Now, we are going to set up scraper.js. First, [make sure you have Node.js downloaded and installed](https://nodejs.org/en/download/ "Download Node.js"). Navigate to the directory of the unzipped folder in your command prompt or terminal and run `npm install`. Now, simply open the file in your favorite text editor. From here, you need to replace the `apiKey` constant with a NASA API key, [which can be found here](https://api.nasa.gov/ "NASA API key generator"). You can also adjust the `month`, `day`, and `year` variables to begin scraping at a different date. Now, if you run `node scraper.js` in your command prompt or terminal, the app should start scraping asteroid data and posting it to your backend.