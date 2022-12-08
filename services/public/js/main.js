const name = window.location.toString().split("/")[2].split(":")[0];

function update() {
    fetch(`http://${name}:8080/topBlacklist/10`)
    .then(async res => {
        const tops = await res.json();
        if (tops.status === "success" ) {
            updateUL(+tops.total, tops.value);
        }
    });
}

function objToDiv(obj, total) {
    const div = document.createElement("div");
    div.setAttribute("class", "card");
    const name = document.createElement("p");
    const count = document.createElement("p");
    name.setAttribute("class", "name");
    count.setAttribute("class", "count");
    name.textContent = obj.value;
    const perc = (100 * obj.score / total).toPrecision(4);
    count.textContent = `Count: ${obj.score}, Perc: ${perc}%`;
    div.appendChild(name);
    div.appendChild(count);
    return div;
}

function updateUL(total, tops) {
    const list = document.getElementById("rankList");
    list.innerHTML = "";
    const tot = document.getElementById("tot");
    tot.textContent = `Total blocked: ${total}`;
    tops.map(e => objToDiv(e, total)).forEach(e => list.appendChild(e));
}

update();
setInterval(update, 5000)();
