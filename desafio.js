const table = document.getElementById("t-body");
const input = document.getElementById("pesquisar");
const buttom = document.getElementById("btn");
const dropdonwBtn = document.querySelectorAll(".dropdown-item");
const openModal = document.getElementById("modal");
let loader = document.querySelector(".loader");
const adicionarPost = document.getElementById("exampleModalLabell");
 console.log(adicionarPost)
const renderQuery = () =>
  $(document).ready(() => {
    console.log(123)
    $("#datatable").DataTable();
  });

const init = () => {
  renderQuery();
  const posts = localStorageGet();

  if (posts) {
    console.log('')
    renderTable(posts);
    return;
  }
  getPosts();
};

const getPosts = () => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((json) => {
      localStorage.setItem("posts", JSON.stringify(json));
      renderTable(json);
    });
};

const localStorageGet = () => {
  return JSON.parse(localStorage.getItem("posts"));
};

buttom.addEventListener("click", () => {
  getPosts();
});

const deletePost = (value) => {
  document.getElementById("delete-post").addEventListener("click", () => {
    loader.style.visibility = "visible";
    $("#staticBackdrop").modal("hide");
    setTimeout(function () {
      const posts = localStorageGet();

      const deletID = posts.filter((dado) => {
        return dado.id !== value;
      });

      localStorage.setItem("posts", JSON.stringify(deletID));

      renderTable(localStorageGet());
      loader.style.visibility = "hidden";
    }, 800);
  });
};

const editarPost = (postId) => {
  const titulo = document.getElementById("titulo");
  const descricao = document.getElementById("descrição");
  const salvar = document.getElementById("salvar");
  let posts = localStorageGet();

  let edit = posts.find((dado) => {
    return dado.id === postId;
  });

  titulo.value = edit.title;
  descricao.value = edit.body;

  salvar.addEventListener("click", () => {
    if (!titulo.value) {
      alert("Campo vazio");
      return;
    }
    if (!descricao.value) {
      alert("Campo vazio");
      return;
    }

    loader.style.visibility = "visible";
    $("#exampleModal").modal("hide");

    setTimeout(function () {
      edit.title = titulo.value;
      edit.body = descricao.value;
      posts[postId - 1] = edit;
      localStorage.setItem("posts", JSON.stringify(posts));
      loader.style.visibility = "hidden";
      renderTable(posts);
    }, 800);
  });
};

const renderTable = (dados) => {
  let html = "";

  dados.forEach((dado) => {
    html += `
        <tr>
          <td>${dado.id}</td>
          <td>${dado.title}</td>
          <td class="text-end">
            <div class="dropdown">
              <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-expanded="false"> Ações</a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item"  data-toggle="modal" data-target="#exampleModal" onclick="editarPost(${dado.id})">Editar</a>
                <a class="dropdown-item"  data-toggle="modal" data-target="#staticBackdrop" onclick="deletePost(${dado.id})">Remover</a>
              </div>
            </div>
          </td>
        </tr>
    `;
  });
  table.innerHTML = html;
};

// const filterInput = () => {
//   const filterTitle = localStorageGet().filter((dado) => {
//     if (!input.value) {
//       return true;
//     }
//     if (
//       input.value &&
//       dado.title.includes(
//         input.value
//           .toLowerCase()
//           .normalize("NFD")
//           .replace(/[\u0300-\u036f]/g, "")
//       )
//     ) {
//       return true;
//     }
//     return false;
//   });

//   renderTable(filterTitle);
// };

init();
