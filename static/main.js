function deletePreviousResults() {
  const search = document.querySelector(".results");
  if (search) {
    search.querySelectorAll("li").forEach((li) => li.remove());
  }
}

function showMatching(matching) {
  const search = document.querySelector(".results");

  // Clear existing list items
  while (search.firstChild) {
    if (!search.firstChild.classList.contains("container")) {
      search.removeChild(search.firstChild);
    } else {
      break;
    }
  }

  // Create and append new list items
  matching.forEach((match) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    // Set the text content
    a.textContent = match.title;

    if (match.class === "artist" || match.class === "album") {
      const title = encodeURIComponent(match.title);
      console.log(match.class, decodeURIComponent(title)); // Log the readable version
      a.href = `/${match.class}/${decodeURIComponent(title)}`;
      console.log("href= ", a.href); // Ensure it logs the encoded version
    } else if (match.class === "song") {
      const album = encodeURIComponent(match.fromAlbum);
      const artist = encodeURIComponent(match.fromArtist);
      console.log(
        "song",
        decodeURIComponent(match.title),
        "from album",
        decodeURIComponent(album),
        "by artist",
        decodeURIComponent(artist)
      ); // Log the readable version
      a.href = `/album/${album}#${encodeURIComponent(match.title)}`;
    }

    console.log("adding ...");
    // Append the anchor to the list item
    li.appendChild(a);
    li.classList.add("dropdownmenu-item");
    // Append the list item to the results container
    search.appendChild(li);
  });
}

function addSearchListener(search) {
  const searchbar = document.getElementById("searchbar");
  searchbar.addEventListener("click", (e) => {
    deletePreviousResults();
  });
  search.addEventListener("input", async (e) => {
    deletePreviousResults();
    const searchValue = e.target.value;
    if (searchValue.length > 2) {
      try {
        const response = await fetch(`/search?q=${searchValue}`);
        const data = await response.json();
        showMatching(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      deletePreviousResults();
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
