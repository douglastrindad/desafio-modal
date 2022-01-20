const table = document.getElementById("t-body");
const input = document.getElementById("pesquisar");
const buttom = document.getElementById("btn");
const dropdonwBtn = document.querySelectorAll(".dropdown-item");
const openModal1 = document.getElementById("modal");

const init = () => {
  if (localStorageGet()) {
     renderTable(JSON.parse(localStorage.getItem("posts")));
     return
  }

  getPosts();
};


const getPosts = async() => {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json());
  
  localStorage.setItem("posts", JSON.stringify(posts));
  renderTable(posts);
};

const localStorageGet = () => {
  return JSON.parse(localStorage.getItem("posts"));
};

buttom.addEventListener("click", () => {
  input.value = '';
  getPosts();

});
// DELETE
const deletePost = (value) => {
  document.getElementById("delete").addEventListener("click", () => {
    const deletID = localStorageGet().filter((dado) => {
      return dado.id != value;
    });
    localStorage.setItem("posts", JSON.stringify(deletID));

    $("#staticBackdrop").modal("hide");
    renderTable(localStorageGet());

    input.value = '';
  });
};

const editarPost = postId =>{

  const titulo = document.getElementById("titulo");
  const descricao = document.getElementById("descrição");
  const salvar = document.getElementById("salvar");
  const edit = localStorageGet().find(dado => {
    return dado.id === postId

  });

  titulo.value = edit.title;
  descricao.value = edit.body;

  console.log(edit)

  salvar.addEventListener('click', () =>{
    console.log(salvar)
    const savePost = localStorageGet().map(dado =>{
if( dado.id === postId){
return ;

}


});

  $("#staticBackdrop").modal("hide");
  });

};


const renderTable = (localStorage) => {
  console.log(localStorage)
  let html = "";
  localStorage.forEach((response) => {
    html += `
        <tr>
          <td>${response.id}</td>
          <td>${response.title}</td>
          <td class="text-end">
            <div class="dropdown">
              <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-expanded="false"> Ações</a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item"  data-toggle="modal" data-target="#exampleModal" onclick="editarPost(${response.id})">Editar</a>
                <a class="dropdown-item"  data-toggle="modal" data-target="#staticBackdrop" onclick="deletePost(${response.id})">Remover</a>
              </div>
            </div>
          </td>
        </tr>
    `;
  });
  table.innerHTML = html;
};

const filterInput = () => {
  const filterTitle = localStorageGet().filter((dado) => {
    if (!input.value) {
      return true;
    }
    if (
      input.value &&
      dado.title.includes(
        input.value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      )
    ) {
      return true;
    }
    return false;
  });


  renderTable(filterTitle);
};

init();
