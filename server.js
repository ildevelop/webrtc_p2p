fs = require('fs')
options = {
    key: fs.readFileSync('./key'),
    cert: fs.readFileSync('./cert')
}

var express = require('express.io');
var app = express();
// app.http().io();
app.https(options).io()
var PORT = 5000;


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/',(req, res) => {
    res.render('index');
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
app.listen(PORT, () => console.log('server started on port:' , PORT));
