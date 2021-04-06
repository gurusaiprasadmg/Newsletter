// ======= IMPORTS ========//
const express = require('express');
const bodyparser = require('body-parser');
const request = require('superagent')


app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))
// to send the static css files and the images- which i do not hav
app.use(express.static('public'))

// Sendnig the signup file on html
app.get('/' ,(req,res)=>{
  res.sendFile(__dirname + '/signup.html')
})


app.post('/',function(req,res){
  // form data
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  // api, listid, url
  const api = '8123c44a34ca87ef2fc0d84b8053ad33-us1';
  const listid = '9b6af33422';
  const dc = 'us1'  //us1
  const url =  'https://'+dc+'.api.mailchimp.com/3.0/lists/'+listid+'/members/';
  const contact = { email_address: email,
                    status: "subscribed",
                    merge_fields: { FNAME: fname,
                                    LNAME: lname,},
                  };

    request
      .post(url)
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + api ).toString('base64'))
      .send(contact)
      .end(function(err, response) {
                    if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                      res.sendFile(__dirname+'/success.html')
                    } else {
                      res.sendFile(__dirname+'/failure.html')
                    }
                });


})


app.post('/failure',(req,res)=>{
  res.redirect('/')
})


app.listen(process.env.PORT || 3000,()=>{
  console.log('now listening on port 3000')
})
