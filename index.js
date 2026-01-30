async function Load() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        let data = await res.json();
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        let activePosts = data.filter(post => !post.isDeleted);
        for (const post of activePosts) {
            body.innerHTML += `
            <tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input value="Delete" type="submit" onclick="Delete(${post.id})" /></td>
            </tr>`
        }
    } catch (error) {

    }
}
async function LoadIsDeleted() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        let data = await res.json();
        let body = document.getElementById("table-body-deleted");
        body.innerHTML = "";
        let deletedPosts = data.filter(post => post.isDeleted);
        for (const post of deletedPosts) {
            body.innerHTML += `
            <tr style="text-decoration: line-through; opacity: 0.6;">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input value="Deleted" type="submit" disabled /></td>
            </tr>`
        }
    } catch (error) {

    }
}
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;
    let res;
    
    if (id && id.trim() !== "") {
        let getID = await fetch('http://localhost:3000/posts/' + id);
        if (getID.ok) {
            res = await fetch('http://localhost:3000/posts/'+id, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        title: title,
                        views: views
                    }
                )
            })
        }
    } else {
        let allPosts = await fetch('http://localhost:3000/posts');
        let postsData = await allPosts.json();
        let maxId = 0;
        postsData.forEach(post => {
            let postId = parseInt(post.id);
            if (postId > maxId) maxId = postId;
        });
        let newId = String(maxId + 1);
        
        res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: newId,
                    title: title,
                    views: views,
                    isDeleted: false
                }
            )
        })
    }
    if (res.ok) {
        console.log("them thanh cong");
        document.getElementById("id_txt").value = "";
        document.getElementById("title_txt").value = "";
        document.getElementById("views_txt").value = "";
        Load();
    }
}
async function Delete(id) {
    let res = await fetch('http://localhost:3000/posts/' + id,
        {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        }
    );
    if (res.ok) {
        console.log("xoa mem thanh cong");
        Load(); 
    }
}
async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let data = await res.json();
        let body = document.getElementById("comment-table-body");
        body.innerHTML = "";
        let activeComments = data.filter(comment => !comment.isDeleted);
        for (const comment of activeComments) {
            body.innerHTML += `
            <tr>
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>
                    <input value="Edit" type="button" onclick="EditComment('${comment.id}', '${comment.text}', '${comment.postId}')" />
                    <input value="Delete" type="button" onclick="DeleteComment(${comment.id})" />
                </td>
            </tr>`
        }
    } catch (error) {
        console.error("Lỗi khi load comments:", error);
    }
}

async function LoadDeletedComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let data = await res.json();
        let body = document.getElementById("comment-table-body-deleted");
        body.innerHTML = "";
        let deletedComments = data.filter(comment => comment.isDeleted);
        for (const comment of deletedComments) {
            body.innerHTML += `
            <tr style="text-decoration: line-through; opacity: 0.6;">
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId || 'N/A'}</td>
                <td><input value="Deleted" type="button" disabled /></td>
            </tr>`
        }
    } catch (error) {
        console.error("Lỗi khi load deleted comments:", error);
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;
    let res;

    if (id && id.trim() !== "") {
        let getID = await fetch('http://localhost:3000/comments/' + id);
        if (getID.ok) {
            res = await fetch('http://localhost:3000/comments/' + id, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        text: text,
                        postId: postId || null
                    }
                )
            })
        }
    } else {
        let allComments = await fetch('http://localhost:3000/comments');
        let commentsData = await allComments.json();
        let maxId = 0;
        commentsData.forEach(comment => {
            let commentId = parseInt(comment.id);
            if (commentId > maxId) maxId = commentId;
        });
        let newId = String(maxId + 1);
        
        res = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: newId,
                    text: text,
                    postId: postId || null,
                    isDeleted: false
                }
            )
        })
    }
    if (res.ok) {
        console.log("Lưu comment thành công");
        document.getElementById("comment_id_txt").value = "";
        document.getElementById("comment_text_txt").value = "";
        document.getElementById("comment_postId_txt").value = "";
        LoadComments();
        LoadDeletedComments();
    }
}

async function DeleteComment(id) {
    let res = await fetch('http://localhost:3000/comments/' + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });
    if (res.ok) {
        console.log("Xóa mềm comment thành công");
        LoadComments();
        LoadDeletedComments();
    }
}

function EditComment(id, text, postId) {
    document.getElementById("comment_id_txt").value = id;
    document.getElementById("comment_text_txt").value = text;
    document.getElementById("comment_postId_txt").value = postId === 'null' ? '' : postId;
}

LoadIsDeleted();
Load();
LoadComments();
LoadDeletedComments();