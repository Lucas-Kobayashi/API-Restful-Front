const API_URL = 'http://localhost:8080/api/products'

const productsList = document.querySelector('#products-list')
const form = document.querySelector('#product-form')

// Obterm todos os produtos
function obterLista () {
    fetch(API_URL).then(response =>{
        response.json().then(data => {
            const productsHtml = data.map(products =>`
                <li>
                    ${products.name} - ${products.brand} - ${products.price}
                </li>
            `).join('')
            productsList.innerHTML = productsHtml
        })
    })
}
obterLista()

// Cadastrar produtos
form.onsubmit = function(e) {
    e.preventDefault()

    const name = document.forms['product-form'].product.value
    const brand = document.forms['product-form'].brand.value
    const price = document.forms['product-form'].price.value

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            name,
            brand,
            price
        })
    }).then(response => {
        response.json().then(data =>{
            if(data.message === 'Produto cadastrado') {
                form.reset()
                obterLista()
                alert('Cadastro realizado com sucesso')
            } else{
                alert('Erro ao cadastrar o produto')
            }
        })
    })
}