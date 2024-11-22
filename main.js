// 重要：es5 类写法要用 function，不能用箭头函数
function Content() {
    this.dom = find('content')
    this.char = '<br>'
}

Content.new = function(...args) {
    return new Content(...args)
}

Content.prototype.get = function () {
    if (this.dom.innerHTML === '') return []
    let v = this.dom.innerHTML.split(this.char)
    return v
}

Content.prototype.set = function (v) {
    this.dom.innerHTML = v.join(this.char)
}

Content.prototype.add = function (v) {
    this.dom.innerHTML += (v + this.char)
}


function __main() {
    const content = Content.new()

    bind('input', 'keydown', function (e) {
        if (e.keyCode !== 13) return
        let target = e.target
        let v = target.value
        if (!v) return

        content.add(v)
        target.value = ''
        target.focus()
    })

    bind('copy', 'click', function (e) {
        let value = content.get().join('\n')
        let oInput = document.createElement("textarea")
        oInput.value = value
        document.body.appendChild(oInput)
        // 选择对象
        oInput.select()
        //兼容ios
        if (navigator.userAgent.match(/(iPhone|iPod|iPad)?/i)) {
            if (!document.execCommand("Copy")) {
                oInput.setSelectionRange(0, oInput.value.length)
            }
        }
        // 执行浏览器复制命令
        document.execCommand("Copy")
        document.body.removeChild(oInput)
        return new Promise((resolve,reject)=>{
            if (document.execCommand("Copy")) {
                resolve(value)
            }else{
                reject(value)
            }
        })
    })
}

__main()
