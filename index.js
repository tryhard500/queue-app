let express = require(`express`);
let app = express();
let port = 3004;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

app.use(express.static(`public`));
app.use(express.json());

let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/queue-app');

let ordersSchema = new mongoose.Schema({
    desk: Number,
    ticket: Number,
    status: Number,

}, {
    timestamps: true
});

let Order = mongoose.model('orders', ordersSchema);

let ticketCount = 0;

app.post('/order/create', async (req, res) => {
    let desk = req.body.desk;
    ticketCount++;
    let lastOrder = await Order.findOne().sort({createdAt: -1});
    if (lastOrder) {
        ticketCount = lastOrder.ticket
        ticketCount++;
    }
    let order = new Order({
        desk: desk,
        ticket: ticketCount,
        status: 2
    });
    await order.save();
    res.send(order);
});

app.get('/orders/render', async (req, res) => {
    let desk = req.query.desk;
    let status = req.query.status;
    let orders;
    if (desk == 0 && status == 0) {
        orders = await Order.find().sort({
            status: 1,
            desk: 1
        });
    } else if (desk == 0 && status != 0) {
        orders = await Order.find({
            status: status
        }).sort({
            status: 1,
            desk: 1
        });
    } else if (desk != 0 && status == 0) {
        orders = await Order.find({
            desk: desk
        }).sort({
            status: 1,
            desk: 1
        });
    } else {
        orders = await Order.find({
            desk: desk,
            status: status
        }).sort({
            status: 1,
            desk: 1
        });
    }
        res.send(orders);
});

app.post('/order/update', async (req, res) => {
    let id = req.body.id;
    let status = req.body.status;
    let order = await Order.findOne({
        _id: id
    });
    order.status = status;
    await order.save();
    res.send(order);
});

app.get('/orders/queue', async (req,res)=>{
    let orders = await Order.find({
        status: 1
    });
    res.send(orders);
});