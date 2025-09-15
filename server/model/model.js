const mongoose = require('mongoose');

// Middleware để validate dữ liệu trước khi lưu
const validateDrugData = (value) => {
    // Kiểm tra tên dài hơn 5 ký tự
    if (value.name && value.name.length <= 5) {
        throw new Error('Tên thuốc phải dài hơn 5 ký tự');
    }

    // Kiểm tra định dạng liều dùng: XX-buổi sáng, XX-buổi chiều, XX-buổi tối
    if (value.dosage && !/^\d+-\d+-\d+$/.test(value.dosage)) {
        throw new Error('Liều dùng phải theo định dạng: XX-buổi sáng, XX-buổi chiều, XX-buổi tối (X là số)');
    }

    // Kiểm tra số thẻ lớn hơn 1000
    if (value.cardsPerPack && value.cardsPerPack <= 1000) {
        throw new Error('Số thẻ trong vỉ phải lớn hơn 1000');
    }

    // Kiểm tra số gói lớn hơn 0
    if (value.packsPerBox && value.packsPerBox <= 0) {
        throw new Error('Số vỉ trong hộp phải lớn hơn 0');
    }

    // Kiểm tra số viên mỗi ngày từ 1 đến 90
    if (value.perDay && (value.perDay <= 0 || value.perDay > 90)) {
        throw new Error('Số viên mỗi ngày phải từ 1 đến 90');
    }

    return value;
};

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => v.length > 5,
            message: 'Tên thuốc phải dài hơn 5 ký tự'
        }
    },
    dosage: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^\d+-\d+-\d+$/.test(v),
            message: 'Liều dùng phải theo định dạng: XX-buổi sáng, XX-buổi chiều, XX-buổi tối (X là số)'
        }
    },
    cardsPerPack: {
        type: Number,
        required: true,
        min: 1001, // Đảm bảo lớn hơn 1000
        validate: {
            validator: (v) => v > 1000,
            message: 'Số thẻ trong vỉ phải lớn hơn 1000'
        }
    },
    packsPerBox: {
        type: Number,
        required: true,
        min: 1, // Đảm bảo lớn hơn 0
        validate: {
            validator: (v) => v > 0,
            message: 'Số vỉ trong hộp phải lớn hơn 0'
        }
    },
    perDay: {
        type: Number,
        required: true,
        min: 1,
        max: 90,
        validate: {
            validator: (v) => v >= 1 && v <= 90,
            message: 'Số viên mỗi ngày phải từ 1 đến 90'
        }
    }
});

// Pre-save middleware để validate toàn bộ dữ liệu
schema.pre('save', function(next) {
    try {
        validateDrugData(this);
        next();
    } catch (err) {
        next(err);
    }
});

const Drug = mongoose.model('Drug', schema); // Mongo sẽ tự tạo collection "drugs"

module.exports = Drug;