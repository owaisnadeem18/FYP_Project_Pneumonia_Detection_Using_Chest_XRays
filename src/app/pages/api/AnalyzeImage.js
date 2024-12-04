// pages/api/uploadImage.js
import formidable from 'formidable';

// Disable default body parser for API routes
export const config = {
  api: {
    bodyParser: false, // Disable default body parser as we're handling the file manually
  },
};

const handler = (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error during image upload:', err); // Log the error
        return res.status(500).json({ error: 'An error occurred during the upload process.' });
      }

      console.log('Fields:', fields);  // Log form fields
      console.log('Uploaded Files:', files); // Log uploaded files

      // Check if the image file is uploaded correctly
      if (files.image && files.image[0]) {
        const file = files.image[0];

        // Validate that the uploaded file is a JPEG image by checking both the extension and MIME type
        const validExtensions = ['.jpg', '.jpeg'];
        const fileExtension = file.originalFilename ? file.originalFilename.split('.').pop().toLowerCase() : '';
        
        // Ensure the file is a JPEG based on extension and mime type
        if (!validExtensions.includes(`.${fileExtension}`) || (file.mimetype !== 'image/jpeg')) {
          return res.status(400).json({ error: 'Uploaded file is not a valid JPEG image.' });
        }

        // Randomly generate result (Pneumonia or Not Pneumonia)
        const randomResult = Math.random() > 0.5 ? 'Pneumonia' : 'Not Pneumonia'; // 50% chance for each

        console.log('Image uploaded successfully. Random result:', randomResult);

        // Send random result in the response
        return res.status(200).json({ result: randomResult });
      }

      return res.status(400).json({ error: 'No image file uploaded.' });
    });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
