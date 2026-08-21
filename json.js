const fs = require("fs");

const TARGET_SIZE = 470 * 1024 * 1024; // 500 MiB
const stream = fs.createWriteStream("large.json");

let currentSize = 0;
let id = 0;

stream.write("[\n");
currentSize += 2;

function generate() {
  while (currentSize < TARGET_SIZE) {
    const user = {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      age: 20 + (id % 50),
      city: "Rajkot",
      description:
        "This is test data generated for a large JSON file."
    };

    const json = JSON.stringify(user);
    const chunk = (id === 0 ? "" : ",\n") + json;
    const chunkSize = Buffer.byteLength(chunk);

    stream.write(chunk);
    currentSize += chunkSize;
    id++;

    // Stop only when we actually reach the target.
    if (currentSize >= TARGET_SIZE) {
      stream.write("\n]");
      stream.end();

      console.log(
        `Generated: ${(currentSize / 1024 / 1024).toFixed(2)} MB`
      );
      console.log(`Records: ${id}`);

      return;
    }

    // Handle backpressure.
    if (!stream.write("")) {
      stream.once("drain", generate);
      return;
    }
  }
}

generate();

stream.on("finish", () => {
  console.log("File generation completed.");
});