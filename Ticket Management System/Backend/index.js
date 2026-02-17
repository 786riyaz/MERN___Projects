const express = require("express");
const cors = require('cors');
const Ticket = require("./model");
const { mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/tickets", async (req, res) => {
  console.log("Inside the Post Route");
  console.log(req.params);
  console.log(req.body);
  let title = req.body?.title;
  let priority = req.body?.priority;
  if (title && priority) {
    // 1. Create an instance of the Model (a document)
    const newDoc = new Ticket({
      title,
      priority,
    });

    // 2. Call save() and handle the promise
    newDoc
      .save()
      .then((savedDocument) => {
        console.log("Saved Ticket:", savedDocument);
        res.send(savedDocument);
      })
      .catch((err) => {
        console.error("Error:", err);
        res.send(`Error Occured :: ${err}`);
      });
  } else {
    res.send("Please send all the required data");
  }
});

app.get("/api/tickets", async (req, res) => {
  console.log(req.query);
  const status = req.query?.status;
  const priority = req.query?.priority;
  const q = req.query?.q;
  const page = req.query?.page;
  const limit = req.query?.limit;
  let searchObject = {};
  if (status) {
    searchObject.status = status;
  }
  if (priority) {
    searchObject.priority = priority;
  }
  if (q) {
    searchObject.title = { $regex: q, $options: "i" };
  }
  console.log("Obj", searchObject);
  const result = await Ticket.find(searchObject).skip(page*limit).limit(limit);
  console.log(result);
  res.send({
    data: [...result],
    meta: { page: 1, limit: 10, total: result.length },
  });
  res.send(result);
});

app.patch("/api/tickets/:id/status", async (req, res) => {
    try{

        console.log("Inside Patch Method");
        console.log("Inside the Post Route");
        console.log(req.body);
        console.log(req.params);
        const status = req.body?.status;
        const ticketID = req.params?.id.trim();
        
        //   const filter = { _id: new mongoose.Types.ObjectId(ticketID) };
        const filter = { _id: ticketID };
        const update = { status: status };
        let record = await Ticket.findByIdAndUpdate(new ObjectId(ticketID), update, {
            new: true,
            runValidators: true,
        });
        if (record) {
            const result = await Ticket.updateOne(filter, update);
            console.log(result);
            res.send(result);
        } else {
            res.status(404).send("Ticket not found");
        }
    } catch (e) {
        res.send()
    }

    }
);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.statusCode || 500).json({ // Set status code, default to 500
    status: err.status || 'error',
    message: err.message || 'Internal Server Error', // Provide a generic message in production
  });
});


app.listen(3000);
