const express = require('express');
const app = express();
app.use( express.json() ); 
app.use( express.urlencoded({extended: true}) ); 
const printer = require('node-thermal-printer');

app.get('/', (req, res) => {
  res.json({ msg: 'This is a NEW response from the server running in the phone!' });
});

app.post('/print-to-ip', function(req, res) {
  const ip = req.body.ip;
  const port = req.body.port;
  const orderLinesContent = req.body.orderLinesContent;
  // const text = 'Hello World, PiriPOS !!'
  printer.init({
    type: 'epson',
    interface: 'tcp://' + ip + ':' + port,
  });
  // printer.alignCenter();
  // printer.println(text);
  orderLinesContent.forEach(line => {
    printer.println(line);
  });
  printer.cut();
  printer.execute(function(err){
    if(err){
      res.json({ msg: {status: err, ip, port} });
    }else{
      res.json({ msg: {status: 'success', ip, port} });
    }
   });
});

app.post('/statusPrinter', (req, res) => {
  const ip = req.body.ip;
  const port = req.body.port;
  printer.init({
    type: 'epson',
    interface: 'tcp://' + ip + ':' + port,
  });
  printer.isPrinterConnected( function(isConnected){
    res.json({msg: isConnected})
   }); 
})

app.listen(5000);
