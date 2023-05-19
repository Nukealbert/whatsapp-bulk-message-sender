import express from 'express';
import xlsx from 'xlsx';
import twilio from 'twilio';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Set the destination folder where the file will be saved
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original filename
    }
  });
  
  // Create the multer middleware with the storage configuration
  const upload = multer({ storage });

const app = express();
const client = twilio('YOUR_TWILIO_SID', 'YOUR_TWILIO_AUTH_TOKEN');

app.use(express.json());

app.post('/send',upload.single('file'), (req, res) => {
    const file = req.file;

  // Access additional fields from FormData using req.body
  const message = req.body.message;


  const workbook = xlsx.readFile(file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  const messages = [];

  for (let i = 1; i < data.length; i++) {
    const phoneNumber = data[i][0].toString();
    console.log(phoneNumber)
    messages.push({ body: message, from: '<YOUR_TWILIO_PHONE_NUMBER>', to: phoneNumber });
  }

  Promise.all(
    messages.map((msg) => client.messages.create(msg))
  )
    .then(() => {
      res.status(200).json({ message: 'Messages sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending messages:', error);
      res.status(500).json({ error: 'An error occurred while sending messages' });
    });
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
