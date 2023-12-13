const express = require('express')
const app = express()
const db = require('./db')
// const { create } = require('./dbHelpers')
// const { create, readAll } = require('./dbHelpers')
// const { create, readAll, readOne } = require('./dbHelpers')
// const { create, readAll, readOne, update } = require('./dbHelpers')
const { create, readAll, readOne, update, deleteOne, deleteAll } = require('./dbHelpers')
// Initialize express


// parse json objects
app.use(express.json())

// parse url encoded objects - data sent through the URL
app.use(express.urlencoded({ extended: true })) // Fix: Change 'urlencoded' to 'express.urlencoded'

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; font-src https://fonts.gstatic.com");
    next();
});

// create a server
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


// const create = require('./models/bookModel'); // Giả sử đây là module chứa hàm tạo bản ghi mới

app.post('/create', async (req, res) => {
    // Kiểm tra xem req.body có rỗng không
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: 'Yêu cầu không được để trống'
        });
    }

    const { title, author, publisher, read } = req.body;

    try {
        const book = await create({ title, author, publisher, read }); // Tạo bản ghi mới trong cơ sở dữ liệu

        res.status(201).json({
            message: 'Bản ghi sách mới đã được tạo'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Đã xảy ra lỗi khi tạo bản ghi sách mới'
        });
    }
});

app.get('/read-all', async (req, res) => {
    const books = await readAll()
    if (books.error) {
        res.status(500).json({
            message: error.message,
            books: books.data
        })
    }
    res.status(200).json({
        message: 'success',
        books: books.data
    })
})


app.get('/read-one/:bookID', async (req, res) => {
    const book = await readOne(req.params.bookID)
    if (book.error) {
        res.status(500).json({
            message: book.error,
            books: book.data
        })
    }
    res.status(200).json({
        message: 'success',
        book: book.data
    })
})

app.put('/update/:bookID', async (req, res) => {
    if (!Object.keys(req.body).length) {
        res.status(400).json({
            message: 'Request body cannot be empty',
            book: null
        })
    }

    const book = await update(req.params.bookID, req.body)
    if (book.error) {
        res.status(500).json({
            message: book.error,
            book: book.data
        })
    }
    res.status(200).json({
        message: 'success',
        book: book.data
    })
})

app.delete('/delete-all', async (req, res) => {
    const isDeleted = await deleteAll(req)
    if (isDeleted.error) {
        res.status(500).json({
            message: isDeleted.error,
        })
    }
    res.status(200).json({
        message: 'Deleted Successfully'
    })
})