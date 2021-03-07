import { db } from './firebase';

var storedProducts;

// fetch all products
export const fetchAll = async () => {
    if (storedProducts)
        return storedProducts;
    
    var products = [];
    const all = await db.collection('products').get();

    all.forEach(doc => {
        if (doc.data().galleryBy !== 'standard') {
            for (let variant in doc.data().gallery) {
                if (variant !== 'standard') {
                    let curPrice = doc.data().price[0];
                    let index = -1;

                    if (doc.data().priceBy !== 'standard') {
                        // find index
                        doc.data()[doc.data().priceBy].forEach((content, i) => {
                            if (content.toLowerCase().split(' ')[0] === variant)
                                index = i;
                        });

                        // set price
                        if (index !== -1)
                            curPrice = doc.data().price[index];
                    }

                    products.push({ id: doc.id, item: doc.data(), variation: variant.toLowerCase().split(' ')[0], price: curPrice });
                }  
            }
        }
        else {
            products.push({ id: doc.id, item: doc.data(), variation: 'standard', price: doc.data().price[0] });
        }
    });

    storedProducts = products;

    console.log('all products: ', products);
    return products;
}

// fetch promotional product
export const fetchPromotional = async () => {
    var products = [];
    
    await fetchAll().then(content => 
        content.forEach(data => {
            if (data.item.sale !== 0 || data.item.trending || data.item.newArrival || data.item.limitedEdition)
                products.push(data);
        }) 
    );

    console.log('promotional products: ', products);
    return products;
}

// fetch related products
export const fetchRelated = async (id, category) => {
    var products = [];

    await fetchByCategory(category).then(content => 
        content.products.forEach(data => {
            if (data.id !== id) 
                products.push(data);
        })
    );

    console.log('related products: ', products);
    return products;
}

// fetch product by id
export const fetchById = async (id) => {
    const product = await db.collection('products').doc(id).get();

    console.log('product by id: ', product.data());
    return product.data();
}

// fetch product by category
export const fetchByCategory = async (category) => {
    var products = [];

    var condense = [];
    var colors = [];
    var materials = [];
    var prices = [10000, -1];

    await fetchAll().then(content => 
        content.forEach(data => {
            if (data.item.category === category) {
                if (condense.find(temp => temp.item.name === data.item.name) === undefined)
                    condense.push(data)

                products.push(data);
            }
        }) 
    );

    // for each product in condense array
    condense.forEach(content => {

        // look for color filters
        content.item.color.forEach(data => {
            if (!colors.find(content => content.text === data)) 
                colors.push({ text: data, quantity: 1, checked: false });
            else 
                colors.find(temp => temp.text === data).quantity += 1;
        });

        // look for material filters
        content.item.material.forEach(data => {
            if (!materials.find(content => content.text === data)) 
                materials.push({ text: data, quantity: 1, checked: false });
            else 
                materials.find(temp => temp.text === data).quantity += 1;
        });

        // look for price range filters
        const low = Math.min(...content.item.price);
        const high = Math.max(...content.item.price);

        prices[0] = (low < prices[0]) ? low : prices[0];
        prices[1] = (high > prices[1]) ? high : prices[1];
    });

    console.log('products by category: ', { colors: colors, materials: materials, prices: prices, products: products });
    return { colors: colors, materials: materials, prices: prices, products: products };
}

// for (let category in dataFile) {
//     dataFile[category].forEach(product => {
//         db.collection('products').doc().set(product);
//     });
// };