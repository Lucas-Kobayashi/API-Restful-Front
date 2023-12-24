const API_URL = 'http://localhost:8080/api/products'

const productsList = document.querySelector('#products-list')
const form = document.querySelector('#productForm')
const edit = document.querySelector('#edit')
const formEdit = document.querySelector('#formEdit')

// Obterm todos os produtos
function obterLista () {
    fetch(API_URL).then(response =>{
        response.json().then(data => {
            const productsHtml = data.map(products =>`
                <li>
                    ${products.name} - ${products.brand} - ${products.price} - 
                    <a 
                        href="#" 
                        class="edit-button" 
                        data-id="${products._id}"
                        data-name="${products.name}"
                        data-brand="${products.brand}"
                        data-price="${products.price}"
                    >  [Editar] 
                    </a>
                    <a 
                        href="#" 
                        class="delete-button" 
                        data-id="${products._id}"
                    > [Excluir] 
                    </a>
                </li>
            `).join('')
            
            productsList.innerHTML = productsHtml

            clickDeleteButton()
            clickEditButton()

        })
    })
}

obterLista()

// Evento de click no editar
function clickEditButton() {
    
    const editButtons = document.querySelectorAll('.edit-button')
    editButtons.forEach(button => {
        button.onclick = function(e){
            e.preventDefault()

            edit.classList.remove('hidden')
            form.classList.add('hidden')

            const id = this.dataset.id
            const name = this.dataset.name
            const brand = this.dataset.brand
            const price = this.dataset.price
            
            document.forms['productFormEdit'].id.value = id
            document.forms['productFormEdit'].name.value = name
            document.forms['productFormEdit'].brand.value = brand
            document.forms['productFormEdit'].price.value = price
        }
    })
}

// Evento de click no excluir
function clickDeleteButton() {
    const deleteButtons = document.querySelectorAll('.delete-button')
    deleteButtons.forEach(button => {
        button.onclick = function(e) {
            e.preventDefault()
            const id = this.dataset.id
            fetch(`${API_URL}/${id}`,{
                method: 'DELETE'
            }).then(response => {
                response.json().then(data => {
                    if(data.message === 'success'){
                        obterLista()
                        alert('Produto excluido com sucesso')
                    }else{
                        alert('Erro ao excluir o produto')
                    }
                })
            })
        }
    })
}

// Cadastrar produtos
productForm.onsubmit = function(e) {
    e.preventDefault()

    const name = document.forms['productForm'].name.value
    const brand = document.forms['productForm'].brand.value
    const price = document.forms['productForm'].price.value

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

// Editar produtos
productFormEdit.onsubmit = function(e){
    e.preventDefault()

    const id = document.forms['productFormEdit'].id.value
    const name = document.forms['productFormEdit'].name.value
    const brand = document.forms['productFormEdit'].brand.value
    const price = document.forms['productFormEdit'].price.value

    fetch(`${API_URL}/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            name,
            brand,
            price,
        })
    }).then(response => {
        response.json().then(data => {
            if(data.message === 'success'){
                formEdit.reset()
                edit.classList.add('hidden')
                form.classList.remove('hidden')
                obterLista()
                alert('Produto editado')
            }
            else{
                alert('Erro ao alterar o produto.')
            }
        })
    })
}