const express = require('express');
const Location = require('./models/location');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5003;
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors());

mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) =>
    app.listen(PORT, () => {
      console.log('listening port 5003');
    })
  )
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  const newLocation = new Location({
    country: 'Dubai',
    activity: 'Visit Dunes',
    imgUrl:
      'https://images.unsplash.com/photo-1528702748617-c64d49f918af?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    list: [],
  });
  newLocation
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.end();
});

app.get('/explore', (req, res) => {
  //{country:req.query.location, activity:req.query.activity}
  Location.find({ country: req.query.location, activity: req.query.activity })
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get('/list', (req, res) => {
  //{country:req.query.location, activity:req.query.activity}
  Location.find()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get('/findPush', (req, res) => {
  //{country:req.query.location, activity:req.query.activity}
  Location.findById(req.query.id).then((result) => {
    const newList = [...result.list, req.query.id];
    Location.findByIdAndUpdate(
      { _id: req.query.id },
      { list: newList },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          setTimeout(() => {
            Location.findByIdAndUpdate(
              { _id: req.query.id },
              {
                list: newList.filter((elt) => {
                  elt._id !== req.query.id;
                }),
              },
              function (err, result) {
                if (err) {
                  res.send(err);
                } else {
                }
              }
            );
          }, 60000);
          res.send(result);
        }
      }
    );
  });
});
