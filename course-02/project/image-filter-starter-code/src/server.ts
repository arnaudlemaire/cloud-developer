import express from 'express';
import bodyParser from 'body-parser';
import validUrl from 'valid-url';
import fs from 'fs';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Set the temporary directory for filtered image
  const tmpFolder = './src/util/tmp/';

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Deletes any files on the server on finish of the response
  app.use(function ( req, res, next ) {
    req.on("end", function() { 
      const filesToDelete = fs.readdirSync(tmpFolder).map(file => `${tmpFolder}${file}`);
      deleteLocalFiles(filesToDelete);
    });
    next();
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async ( req, res ) => {
    const { image_url } = req.query;

    // Validation
    if ( !image_url ) { res.status(422).send('Require an image_url parameter.'); }
    if ( !validUrl.isUri(image_url) ) { res.status(422).send('Invalid url.'); }

    const filtered_image_url = await filterImageFromURL(image_url);
    res.sendFile(filtered_image_url);
  });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();