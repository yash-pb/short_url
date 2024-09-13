var express = require('express');
var router = express.Router();
const URL = require('../Models/url');

const generateRandomeIds = () => {
  let random = Math.random().toString(36).slice(3)
  return random;
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', async (req, res, next) => {
  try {
    const {url} = req.body;
    console.log('url => ', url);
    
    if(!url && url === '' && url === null && url === undefined) {
      return res.render('index', {
        'status': false,
        'error': "URL is required!"
      });
    }

    let uniqueId = generateRandomeIds();
    let host = process.env.HOST;
    let port = process.env.PORT;
    const result = await URL.create({
        shortId: uniqueId,
        shortLink: `http://${host}:${port}/${uniqueId}`,
        redirectUrl: url,
        visitHistory: []
    })
    
    res.render('index', {
      'shortLink': result.shortLink,
      'status': true
    });
  } catch (error) {
    console.log('error => ', error);
    
      res.render('index', {
        'status': false,
        'error': "Something went wrong"
      });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const shortId = req.params.id;
    const result = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })

    res.redirect(result.redirectUrl);
  } catch (error) {
    res.render('index', {
      'status': false,
      'error': "There is no url like this!, Make your new URL."
    });
  }
});

module.exports = router;
