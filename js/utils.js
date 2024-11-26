function find(id) {
    return document.querySelector('#' + id)
}


function bind(id, eventName, callback) {
    find(id).addEventListener(eventName, function (e) {
        callback(e)
    })
}


function log(v) {
    find('log').innerHTML += v + '<br>'
}


export {
    find,
    bind,
    log,
}
