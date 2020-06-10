const mongoose = require('mongoose');

function sleep(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
} 

let i = 0
async function doMagic() {
 if(i < 10) {
  try {
   await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
   console.log('Connected to MongoDB')
   mongoose.connection.close()
  }
  catch{
   i++;
   console.log(`Retrying MongoDB connection ${i} of 10`)
   await sleep(6000)
   await doMagic();
  }
 }
}

doMagic()
