const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var fileupload = require('express-fileupload');

const ObjectID = require('mongodb').ObjectID;
const fse = require('fs-extra');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('Images'));
app.use(fileupload());
const uri =
  'mongodb+srv://goodDeal:Password123@gooddeal.j289s.mongodb.net/goodDeal?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const HotDealCollection = client.db('goodDeal').collection('hotDeal');
  const HotProductCollection = client.db('goodDeal').collection('HotProduct');
  const ShopProductCollection = client.db('goodDeal').collection('ShopProduct');
  // Hot Deal insert
  app.post('/hotDeal', (req, res) => {
    const Image = req.files;
    const ImageName = req.files.files.name;
    const hotDeal = req.body;
    const filePath = `${__dirname}/Images/${ImageName}`;
    for (let pos in Image) {
      Image[pos].mv(filePath, (err) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
      });
    }

    const newImage = fse.readFileSync(filePath);
    const encode = newImage.toString('base64');
    var imageForDB = {
      img: Buffer(encode, 'base64'),
      contentType: req.files.files.mimetype,
      size: req.files.files.size,
    };
    HotDealCollection.insertOne({ hotDeal, imageForDB }).then((result) => {
      fse.remove(filePath);
      res.send(result);
    });
  });

  // update
  app.patch('/hotDealUpdate/:value', (req, res) => {
    const id = ObjectID(req.params.value);
    console.log(req.body);

    HotDealCollection.updateOne(
      { _id: id },
      {
        $set: {
          'hotDeal.ProductName': req.body.itemName,
          'hotDeal.Price': req.body.Price,
          'hotDeal.OldPrice': req.body.OldPrice,
          'hotDeal.Description': req.body.Description,
        },
      }
    ).then((result) => {
      res.send(result);
      console.log(result);
    });
  });
  // Delete Item
  app.delete('/DeleteHotDeal/:value', (req, res) => {
    const id = ObjectID(req.params.value);
    HotDealCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result);
    });
  });
  //Hot Deal Read all from Get Api.
  app.get('/hotDealProduct', (req, res) => {
    HotDealCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //Hot product Insert
  app.post('/HotProduct', (req, res) => {
    const Image = req.files;
    const ImageName = req.files.files.name;
    const HotProduct = req.body;
    const filePath2 = `${__dirname}/HotProduct/${ImageName}`;
    for (let pos in Image) {
      Image[pos].mv(filePath2, (err) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
      });
    }

    const newImage = fse.readFileSync(filePath2);
    const encode = newImage.toString('base64');
    var imageForDB = {
      img: Buffer(encode, 'base64'),
      contentType: req.files.files.mimetype,
      size: req.files.files.size,
    };
    HotProductCollection.insertOne({ HotProduct, imageForDB }).then(
      (result) => {
        fse.remove(filePath2);
        res.send(result);
      }
    );
  });
  // Hot Product real all products
  app.get('/hotProductData', (req, res) => {
    HotProductCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  //Hot Product Update
  app.patch('/HotProductUpdate/:value', (req, res) => {
    const id = ObjectID(req.params.value);
    console.log(req.body);

    HotProductCollection.updateOne(
      { _id: id },
      {
        $set: {
          'HotProduct.ProductName': req.body.itemName,
          'HotProduct.Price': req.body.Price,
          'HotProduct.OldPrice': req.body.OldPrice,
          'HotProduct.Description': req.body.Description,
        },
      }
    ).then((result) => {
      res.send(result);
      console.log(result);
    });
  });

  //hot Product Delete
  app.delete('/DeleteHotProduct/:value', (req, res) => {
    const id = ObjectID(req.params.value);
    HotProductCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result);
    });
  });
  //ShopProduct insert
  app.post('/ShopProduct', (req, res) => {
    const Image = req.files;
    const ImageName = req.files.files.name;
    const ShopProduct = req.body;
    const filePath3 = `${__dirname}/ShopProduct/${ImageName}`;
    for (let pos in Image) {
      Image[pos].mv(filePath3, (err) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
      });
    }

    const newImage = fse.readFileSync(filePath3);
    const encode = newImage.toString('base64');
    var imageForDB = {
      img: Buffer(encode, 'base64'),
      contentType: req.files.files.mimetype,
      size: req.files.files.size,
    };
    ShopProductCollection.insertOne({ ShopProduct, imageForDB }).then(
      (result) => {
        fse.remove(filePath3);
        res.send(result);
      }
    );
  });
  //all product from shop
  app.get('/ShopAllProducts', (req, res) => {
    ShopProductCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //Update ShopProduct
  app.patch('/UpdateShopProduct/:value', (req, res) => {
    const id = ObjectID(req.params.value);
    console.log(req.body);

    ShopProductCollection.updateOne(
      { _id: id },
      {
        $set: {
          'ShopProduct.ProductName': req.body.itemName,
          'ShopProduct.Price': req.body.Price,
          'ShopProduct.OldPrice': req.body.OldPrice,
          'ShopProduct.Description': req.body.Description,
        },
      }
    ).then((result) => {
      res.send(result);
      console.log(result);
    });
  });

  app.delete('/DeleteShopProduct/:value', (req, res) => {
    const id = ObjectID(req.params.value);
    ShopProductCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result);
    });
  });
});

//Welcome
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port);
