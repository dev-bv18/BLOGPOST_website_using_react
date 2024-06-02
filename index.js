import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let creatingPost = false; // Variable to track if the user is creating a post
let blogPosts = []; // Array to store blog posts

app.get("/", (req, res) => {
    res.render("index.ejs", { creatingPost: creatingPost, blogPosts: blogPosts }); // Pass creatingPost and blogPosts to the view
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});
app.get("/blog/:id", (req, res) => {
    const postId = req.params.id;
    const post = blogPosts[postId];

    if (post) {
        res.render("blog.ejs", { post: post });
    } else {
        res.status(404).send("Blog post not found");
    }
});
app.get("/delete/:id", (req, res) => {
    const postId = req.params.id;
    var searcid=-1;
    for(var i=0;i<blogPosts.length;i++)
    {
        if(postId===blogPosts[i].title)
        {
            searcid=i;
        }
    }
    const deletedPost = blogPosts.splice(searcid,1);

    if (deletedPost.length > 0) {
        console.log("Post deleted:", deletedPost[0]);
    } else {
        console.log("Post not found");
    }

    res.redirect("/");
});
app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    var searchId = -1; 
    for (let i = 0; i < blogPosts.length; i++) {
        if (postId === blogPosts[i].title) {
            searchId = i;
            break; 
        }
    }

    
    if (searchId !== -1) {
        console.log("Editing post:", blogPosts[searchId]);
        res.render("edit.ejs", { post: blogPosts[searchId] });
    } else {
        console.log("Post not found");
        res.redirect("/"); 
    }
});

app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    var searchId = -1; 
    for (let i = 0; i < blogPosts.length; i++) {
        if (postId === blogPosts[i].title) {
            searchId = i;
            break;
        }
    }

   
    if (searchId !== -1) {
        console.log("Editing post:", blogPosts[searchId]);
        res.render("index.ejs", { post: blogPosts[searchId] });
    } else {
        console.log("Post not found");
        res.redirect("/"); // Redirect back to the home page if post not found
    }
});

app.post("/edit/:id", (req, res) => {
    const postId = req.params.id;
   let searchId = -1;
    for (let i = 0; i < blogPosts.length; i++) {
        if (postId === blogPosts[i].title) {
            searchId = i;
            break;
        }
    }

  
    if (searchId !== -1) {
        const updatedPost = {
            title: req.body.title || "Untitled Blog",
            content: req.body.content || "No Content"
        };

        blogPosts[searchId] = updatedPost;
        console.log("Post updated:", updatedPost);
    } else {
        console.log("Post not found");
    }

    res.redirect("/"); 
});

app.get("/create", (req, res) => {
    creatingPost = true; 
    res.redirect("/");
    
});

app.post("/create", (req, res) => {
     const newPost = {
        title: (req.body.title=="")?"Untitled Blog":req.body.title,
        content: (req.body.content=="")?"No Content":req.body.content
    };
    blogPosts.push(newPost);
    creatingPost = false;
   res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
