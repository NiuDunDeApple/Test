import {
    bind,
    log,
    find,
} from './js/utils.js'


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
    // todo 手机端复制完会放大一下
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
        oInput.setSelectionRange(0, oInput.value.length)
        // 执行浏览器复制命令
        document.execCommand("Copy")
        document.body.removeChild(oInput)
        alert('复制成功')
    })
}

__main()
