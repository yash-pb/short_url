var express = require('express');
var router = express.Router();
const URL = require('../Models/url');

const generateRandomeIds = () => {
  let random = Math.random().toString(36).slice(3)
  return random;
}

/* GET home page. */
router.get('/', (req, res, next) => {
  const shortLink = req.query.shortLink ?? '';

  res.render('index', {
    'shortLink': shortLink,
  });
});

router.post('/', async (req, res, next) => {
  try {
    const {url} = req.body;
    
    if(!url) {
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
    
    // res.render('index', {
    //   'shortLink': result.shortLink,
    //   'status': true
    // });
    res.redirect('/?shortLink=' + encodeURIComponent(result.shortLink));
  } catch (error) {    
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
