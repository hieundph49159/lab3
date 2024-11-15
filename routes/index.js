var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

// Kết nối tới MongoDB
const mongoDB = 'mongodb+srv://hieundph49159:hieu2005@databasebuoi2.v4abg.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseBuoi2';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Kết nối thành công");
    })
    .catch(err => {
      console.log(err);
    });

// Định nghĩa schema cho ô tô
const databaseSchema = new mongoose.Schema({
  maXe: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  brand: { type: String, required: true }
});

// Tạo model từ schema
const DATABASE = mongoose.model('Database', databaseSchema);



// Route GET để lấy danh sách ô tô
router.get('/getDatabase', (req, res) => {
  DATABASE.find({}).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(500).json({ error: 'Không thể lấy dữ liệu.' });
  });
});

// Route GET trang chủ
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Route POST để thêm ô tô mới
router.post('/submit', function (req, res, next) {
  const { maxe, name, price, year, brand } = req.body;

  const errors = [];

  // Kiểm tra các điều kiện đầu vào
  if (!maxe || !name || !price || !year || !brand) {
    errors.push("Vui lòng điền tất cả các trường.");
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push("Tên phải là chữ cái.");
  }
  if (isNaN(price) || price <= 0) {
    errors.push("Giá phải là số dương.");
  }
  if (isNaN(year) || year < 1980 || year > 2024) {
    errors.push("Năm phải từ 1980 đến 2024.");
  }

  if (errors.length > 0) {
    // Trả về lỗi nếu có
    return res.status(400).json({ errors });
  }

  // Tạo đối tượng ô tô mới nếu không có lỗi
  const newCar = new DATABASE({
    maXe: maxe,
    name: name,
    price: price,
    year: year,
    brand: brand
  });

  // Lưu ô tô vào cơ sở dữ liệu
  newCar.save()
      .then(car => {
        res.json({ message: "Ô tô đã được thêm thành công!", car });
      })
      .catch(err => {
        res.status(500).json({ error: "Không thể thêm ô tô." });
      });
});

module.exports = router;
