const fs = require('fs');
const readline = require('readline');

const writableStream = fs.createWriteStream('02-write-file/text.txt', { flags: 'a' });

console.log('Welcome! Please enter text to write to the file. Type "exit" anywhere in your input or press Ctrl+C to quit.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.on('SIGINT', farewellAndExit);
rl.on('SIGINT', farewellAndExit);

rl.on('line', (input) => {
  if (input.toLowerCase().includes('exit')) {
    writableStream.write(`${input}\n`);
    farewellAndExit();
  } else {
    writableStream.write(`${input}\n`);
    console.log('Text has been written to the file. You can enter more text:');
  }
});

function farewellAndExit() {
  console.log('Thank you for using the program. Goodbye!');
  writableStream.end();
  rl.close();
  process.exit();
}
