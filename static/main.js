function showMatching(matching) {
  const search = document.querySelector(".search");
  while (search.firstChild) {
    Array.from(search.childNodes).forEach((node) => {
      if (!node.classList.contains("container")) {
        search.removeChild(node);
      } else {
        console.log("node is container");
      }
    });
  }
  search.classList.add("show");
  matching.map((match) => {
    const li = document.createElement("li");
    li.textContent = match.title;
    search.appendChild(li);
  });
}

function addSearchListener(search) {
  search.addEventListener("input", async (e) => {
    const searchValue = e.target.value;
    if (searchValue.length > 2) {
      try {
        const response = await fetch(`/search?q=${searchValue}`);
        const data = await response.json();
        showMatching(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  });
}

window.onload = async () => {
  const search = document.getElementById("search");
  if (search) {
    console.log("search element found");
    addSearchListener(search);
  } else {
    console.log("search element not found");
  }
};
