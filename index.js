const http = require("http");
const path = require("path");
const fs = require("fs/promises");

const PORT = 8000;

const app = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;
  const jsonPath = path.resolve("./data.json");
  const jsonFile = await fs.readFile(jsonPath, "utf8");

  const taskForm = {
    id: 0,
    title: "",
    description: "",
    status: false,
  };

  if (url === "/tasks") {
    if (method === "GET") {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.write(jsonFile);
    }
    if (method === "POST") {
      const arr = JSON.parse(jsonFile);
      res.statusCode = 201;
      req.on("data", (data) => {
        const newTask = {
          ...taskForm,
          id: arr[arr.length - 1]["id"] + 1,
          ...JSON.parse(data),
        };
        arr.push(newTask);
        fs.writeFile(path.resolve("./data.json"), JSON.stringify(arr));
      });
    }
    if (method === "PATCH") {
      const arr = JSON.parse(jsonFile);
      res.statusCode = 200;
      req.on("data", (data) => {
        const newTask1 = {
          ...taskForm,
          ...JSON.parse(data),
        };
        fs.writeFile(
          path.resolve("./data.json"),
          JSON.stringify(
            arr.map((e) => ({
              ...e,
              ...(e.id == newTask1.id && JSON.parse(data)),
            }))
          )
        );
        console.log(arr);
      });
    }
    if (method === "DELETE") {
      const arr = JSON.parse(jsonFile);
      res.statusCode = 204;
      req.on("data", (data) => {
        const newTask1 = {
          ...taskForm,
          ...JSON.parse(data),
        };
        fs.writeFile(
          path.resolve("./data.json"),
          JSON.stringify(arr.filter((e) => e.id != newTask1.id))
        );
      });
    }
  }
  res.end();
});

app.listen(PORT);

console.log(`Server started at port ${PORT}`);
