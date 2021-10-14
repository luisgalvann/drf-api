function addSubmit() {
  const form = document.getElementById("form-wrapper");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let url = `${siteUrl}/api/task-create/`;

    if (activeItem) {
      url = `${siteUrl}/api/task-update/${activeItem.id}/`;
      activeItem = null;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        title: document.getElementById("title").value,
      }),
    }).then((res) => {
      document.getElementById("form").reset();
      clearList();
      buildList();
    });
  });
}

function clearList() {
  document.getElementById("list-wrapper").remove();
  const list = document.createElement("div");
  list.id = "list-wrapper";
  const container = document.getElementById("task-container");
  container.appendChild(list);
}

function buildList() {
  fetch(`${siteUrl}/api/task-list/`)
    .then((res) => res.json())
    .then(function (tasks) {
      const list = document.getElementById("list-wrapper");

      for (let i in tasks) {
        let taskHtml = `<span class="task">${tasks[i].title}</span>`;

        if (tasks[i].completed) taskHtml = taskHtml.replace(/span/g, "strike");

        const editHtml = `<button class="edit btn btn-sm btn-outline-primary">Edit</button>`;
        const deleteHtml = `<button class="delete btn btn-sm btn-outline-secondary">Delete</button>`;

        const itemHtml = `
            <div class="task-wrapper flex-wrapper">
                <div style="flex:7">${taskHtml}</div>
                <div style="flex:1">${editHtml}</div>
                <div style="flex:1">${deleteHtml}</div>
            </div>`;

        list.innerHTML += itemHtml;
      }

      const taskElems = document.getElementsByClassName("task");
      const editElems = document.getElementsByClassName("edit");
      const deleteElems = document.getElementsByClassName("delete");

      for (let i in tasks) {
        taskElems[i].onclick = () => strikeItem(tasks[i]);
        editElems[i].onclick = () => editItem(tasks[i]);
        deleteElems[i].onclick = () => deleteItem(tasks[i]);
      }
    });
}

function getCookie(name) {
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`)
        return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
}

function editItem(item) {
  document.getElementById("title").value = item.title;
  activeItem = item;
}

function deleteItem(item) {
  fetch(`${siteUrl}/api/task-delete/${item.id}/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  }).then((res) => {
    clearList();
    buildList();
  });
}

function strikeItem(item) {
  fetch(`${siteUrl}/api/task-update/${item.id}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      title: item.title,
      completed: !item.completed,
    }),
  }).then((res) => {
    clearList();
    buildList();
  });
}

const siteUrl = document.getElementById("site-url").value;
const csrftoken = getCookie("csrftoken");
let activeItem = null;

addSubmit();
buildList();
