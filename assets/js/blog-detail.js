const urlParams = new URLSearchParams(window.location.search);
let idParam = parseInt(urlParams.get('id'));
if(!idParam) {
  window.location.href = "404.html";
}

let blog;

const blogTagContainer = document.getElementById("blog-tag-container");
const blogImg = document.getElementById("blog-img");
const blogTitle = document.getElementById("blog-title");
const blogAuthor = document.getElementById("blog-author");
const blogDate = document.getElementById("blog-date");
const blogContent = document.getElementById("blog-content");
const blogNComments = document.getElementById("blog-ncomments");

window.addEventListener("load", (e) => {
  makeRequest()
})

function makeRequest() {
  const httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    alert("Giving up :( Cannot create an XMLHTTP instance");
    return false;
  }

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      switch (httpRequest.status) {
        case 200: case 304:
          try {
            blog = JSON.parse(httpRequest.responseText);
            console.log(blog);
            displayBlog(blog);
          } catch (e) {
            console.error(e);
            alert("invalid response from server");
          }
          break
        case 404:
          window.location.href = "404.html";
          break
        default:
          alert("There was a problem with the request.");
      }
    }
  };
  httpRequest.open("GET", `http://localhost:3000/blogs/${idParam}`);
  httpRequest.send();
}

function displayBlog(blog) {
  for(let i=0; i<blog.tags.length; i++) {
    blogTagContainer.innerHTML += `<a href="#" class="btn ${i===0 ? "btn-success" :"btn-outline-dark"}">${blog.tags[i]}</a>`
  }
  blogImg.innerHTML = `<img src="${blog.image}" alt="" class="w-full"  style="height: auto;">`
  blogTitle.innerHTML = blog.title;
  blogContent.innerHTML = blog.content;
  blogAuthor.innerHTML = blog.author;
  blogDate.innerHTML = blog.date;
  blogNComments.innerHTML = blog.ncomments;
}
