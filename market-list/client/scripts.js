

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Botão atualizar 
  --------------------------------------------------------------------------------------
*/
const insertEditButton = (parent) => {
  const btn = document.createElement('button');
  btn.className = 'edit';
  btn.textContent = 'Atualizar';
  btn.title = 'Editar quantidade e valor';
  btn.style.marginRight = '8px';
  parent.appendChild(btn);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
   Atualizar item da lista
  --------------------------------------------------------------------------------------
*/
const putItem = (nome, novaQuantidade, novoValor) => {
  const formData = new FormData();
  formData.append('quantidade', novaQuantidade);
  formData.append('valor', novoValor);

  const url = 'http://127.0.0.1:5000/produto?nome=' + encodeURIComponent(nome);
  return fetch(url, {
    method: 'put',
    body: formData
  })
    .then((response) => response.json());
}

/*
  --------------------------------------------------------------------------------------
  Liga os handlers do botão de atualizar
  --------------------------------------------------------------------------------------
*/
const attachEditHandlers = () => {
  const edits = document.getElementsByClassName('edit');
  for (let i = 0; i < edits.length; i++) {
    edits[i].onclick = function () {
      const tr = this.parentElement.parentElement;
      const tds = tr.getElementsByTagName('td');

      const nome = tds[0].textContent;
      const quantidadeAtual = tds[1].textContent;
      const valorAtual = tds[2].textContent;

      const novaQuantidade = prompt('Nova quantidade:', quantidadeAtual);
      if (novaQuantidade === null) return; // nesse caso significa que foi cancelado

      const novoValor = prompt('Novo valor:', valorAtual);
      if (novoValor === null) return; // mesma coisa aqui 

      if (isNaN(novaQuantidade) || isNaN(novoValor)) {
        alert('Quantidade e valor precisam ser números!');
        return;
      }
      
      putItem(nome, novaQuantidade, novoValor)
        .then(() => {
          tds[1].textContent = novaQuantidade;
          tds[2].textContent = novoValor;
          alert('Atualizado!');
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Não foi possível atualizar no servidor.');
        });
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()

}
