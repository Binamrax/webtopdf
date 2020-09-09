const express = require('express');
const puppeteer=require('puppeteer');
const axios=require('axios');
var router = express.Router();
//insecure for https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pdf',async(req,res)=>{
  const url=req.query.url||'';
  const pt=await genpdf(url);
  if(pt){
    res.json({result:true,location:pt.replace("public","")});
  }else{
    res.json({result:false});
  }
})


/**
 * Check url valid or not
 */
router.get('/checkurl', (req, res) => {
  let obj = req.query.url;
  axios.head(obj).then(r => {
      res.send({ result: (r.status == 200 ? true : false) })
  }).catch(e => {
      console.log(e);
      res.send({ result: false })
  });
})

async function  genpdf(url){
  try{
    let ur = new URL(url);
    const path=`public/uploads/${ur.host.replace(/\./g,'_')}.pdf`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.pdf({path:path , format: 'A4'});
    await browser.close();
    return path;
  }catch(e){
    console.log(e);
    return '';
  }
  
}

module.exports = router;
