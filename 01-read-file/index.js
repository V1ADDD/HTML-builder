const fs = require('fs');

const stream = new fs.ReadStream('01-read-file/text.txt');

stream.on('readable', function() {
  const data = stream.read();
  if (data !== null)
    console.log(data.toString());
});