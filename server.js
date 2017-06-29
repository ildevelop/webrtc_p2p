var express = require('express.io');
fs = require('fs');
options = {
    key: fs.readFileSync('./key'),
    cert: fs.readFileSync('./cert')
};
var app = express();
app.https(options).io();
var PORT = 80;
console.log('server started on port:' , PORT);

app.use(express.static(__dirname + '/public'));

app.get('/',(req, res) => {
    res.render('index.ejs');
});

app.io.route('ready',(req) => {
    req.io.join(req.data.chat_room);
    req.io.join(req.data.signal_room);
    app.io.room(req.data).broadcast('announce',{
        message: 'New client in the ' + req.data + 'room.'
    })
})

app.io.route('send',(req) => {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
        author: req.data.author
    });
})

app.io.route('signal',(req) => {
    // Note the use of req for broadcasting so only the sender doest`t their own message
    req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
        message: req.data.message
    });
})
app.listen(PORT);
