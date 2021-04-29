const id = document.querySelector(".id").innerText
document.querySelector("#delete").addEventListener("click",deleteTopic)
console.log(id);


function deleteTopic() {
    fetch("delTopic", {
        method: "delete",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({topicId:id})
    }).then(()=>{window.location.href="/discussions"})
}
