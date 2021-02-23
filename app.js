const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
const CloudflareBypasser = require('cloudflare-bypasser');
const { response, text, request } = require('express');
const { contains } = require('cheerio');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
const port = process.env.PORT || 3000;

let cf = new CloudflareBypasser();
let titan = [];
let commonwealth = [];
let zalora = [];



// ========== Titan ========== \\
app.get('/', (req, res) =>{
    res.render('index', {posts: titan});
   
})

cf.request('https://www.titan22.com/new-arrivals.html')
.then(response =>{

    const $ = cheerio.load(response.body)
    $('li.product-item').each((i, item)=>{
        const $item = $(item);
        const name = $item.find('a.product-item-link').text().replace(/\s\s+/g, '');
        const link = $item.find('a.product-item-photo').attr('href');
        const imageLink = $item.find('img.product-image-photo').attr('src');
        const brand = $item.find('.product-text').children("a").text();
        const price = $item.find('span.price').text();
        const status = $item.find('span.outofstock-label').text()


        let titanProduct = {
            title: name,
            href: link,
            src: imageLink,
            brand: brand,
            price: price,
            status: status
        }
        titan.push(titanProduct)  
    })  

})

// ========== Titan ========== \\


// ========== Commonwealth ========== \\
app.get('/cw', (req, res)=>{
    res.render('cw', {commonwealth: commonwealth})
})

axios.get('https://commonwealth-ftgg.ph/products.json')
.then(response =>{
    const cwData = response.data;
    const data = cwData.products;
    for(var i = 0; i < data.length; i++){

        let productLoaded = {
            title: data[i].title,
            src: data[i].images[0].src,
            href: data[i].handle,
            size :  data[i].variants,
            sizeId: data[i].variants[0].id,
            price: data[i].variants[0].price.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        }

        commonwealth.push(productLoaded);
    }

    //console.log(commonwealth)

})
// ========== Commonwealth ========== \\



// ========== Zalora ========== \\
app.get('/zalora', (req, res)=>{
    res.render('zalora', {zalora: zalora})
})
axios.get('https://www.zalora.com.ph/_c/v1/desktop/list_catalog_full?url=%2Fmen&sort=popularity&dir=desc&offset=0&limit=48&brand=126&gender=men&segment=men&special_price=false&all_products=false&new_products=false&top_sellers=false&catalogtype=Main&lang=en&is_brunei=false&search_suggest=false&enable_visual_sort=true&enable_filter_ads=true&compact_catalog_desktop=false&name_search=false&solr7_support=false&pick_for_you=false&learn_to_sort_catalog=false&user_query=nike&is_multiple_source=true&enable_similar_term=true')
.then(response =>{
    const zaloraAPI = response.data.response.docs
    
    
    for(var i = 0; i < zaloraAPI.length; i++){
        const name = zaloraAPI[i].meta.name
        const price = zaloraAPI[i].meta.price
        const link = zaloraAPI[i].link
        const imageURL = zaloraAPI[i].image
        let sizes = zaloraAPI[i].available_sizes

        let zaloraData ={
            title : name,
            price: price,
            url : link,
            imageUrl : imageURL,
            size: sizes
        }

        zalora.push(zaloraData);

    }


})

app.listen(port, ()=>{console.log('Server is running')})
  // ========== Zalora ========== \\  