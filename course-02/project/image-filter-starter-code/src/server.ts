import fs from 'fs';
import validUrl from 'valid-url';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
  // Set the directory to store image temporarily
  const tmpFolder = process.env.APP_TMP_DIRECTORY || './www/util/tmp';

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
  app.get( "/", (req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async (req: Request, res: Response ) => {
    const imageUrl = req.query.image_url;

    // Validation
    if ( !imageUrl ) { res.status(422).send('Require an image_url parameter.'); }
    if ( !validUrl.isUri(imageUrl) ) { res.status(422).send('Invalid url.'); }

    const urlSplit = imageUrl.split('.');
    const imageFormat = urlSplit[urlSplit.length -1];
    const supportedFormat = ['jpg', 'jpeg', 'png'];
    if ( !supportedFormat.includes(imageFormat) ) { res.status(422).send('Support only JPEG and PNG image files.'); }

    // Filter image and send it in the response
    const filteredImageUrl = await filterImageFromURL(imageUrl);
    res.sendFile(filteredImageUrl);
  });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();