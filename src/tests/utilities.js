import fetch from "node-fetch";

export default async function read_file(filename){
    await fetch(filename)
    .then(response => response.text())
    .then(text => {
        return text
    })
}
